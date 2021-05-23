import JSZip from "jszip";
import { Chapter, createChapterLink, RequestManager, Story } from "../api";

function escapeFile(text: string): string {
  return text.replace(/[<>:"/\\|?*]/g, "-");
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default class Epub {
  public constructor(private readonly requestManager: RequestManager, private readonly story: Story) {}

  private async getContainerXml(): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml" />
  </rootfiles>
</container>
`;
  }

  private async getContentXml(): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0">
  <metadata
    xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(this.story.title)}</dc:title>
    <dc:language>${escapeXml(this.story.language)}</dc:language>
    <dc:identifier id="book-id">https://www.fanfiction.net/s/${this.story.id}</dc:identifier>
    <dc:description>${escapeXml(this.story.description)}</dc:description>
    <dc:creator>${escapeXml(this.story.author.name)}</dc:creator>
    <dc:contributor>FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)</dc:contributor>
    <dc:publisher>FanFiction.net</dc:publisher>
    <dc:date>${this.story.published.toISOString()}</dc:date>
    <meta property="dcterms:modified">${new Date().toISOString().substr(0, 19)}Z</meta>
  </metadata>

  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav" />
    ${
      this.hasCover()
        ? `<item id="cover" href="cover.jpg" media-type="image/jpeg" />
    <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml" properties="svg" />`
        : ""
    }
    ${this.story.chapters
      .map(
        (chapter) =>
          `<item id="chapter-${chapter.id}" href="chapter-${chapter.id}.xhtml" media-type="application/xhtml+xml" />`
      )
      .join("\n    ")}
  </manifest>

  <spine toc="ncx">
    ${this.hasCover() ? `<itemref idref="cover-page" />` : ""}
    <itemref idref="toc" />
    ${this.story.chapters.map((chapter) => `<itemref idref="chapter-${chapter.id}" />`).join("\n    ")}
  </spine>

  <guide>
    ${this.hasCover() ? '<reference type="cover" href="cover.xhtml" title="Cover" />' : ""}
    <reference type="toc" href="toc.xhtml" title="Table of Contents" />
  </guide>
</package>`;
  }

  private async getNcxXml(): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="https://www.fanfiction.net/s/${this.story.id}" />
    <meta name="dtb:generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)" />
    <meta name="dtb:depth" content="1" />
    <meta name="dtb:totalPageCount" content="0" />
    <meta name="dtb:maxPageNumber" content="0" />
  </head>

  <docTitle>
    <text>${escapeXml(this.story.title)}</text>
  </docTitle>

  <navMap>
    ${this.story.chapters
      .map(
        (chapter) => `<navPoint id="navPoint-${chapter.id}" playOrder="${chapter.id}">
      <navLabel>
        <text>${escapeXml(chapter.title)}</text>
      </navLabel>
      <content src="chapter-${chapter.id}.xhtml" />
    </navPoint>`
      )
      .join("\n      ")}
  </navMap>
</ncx>
`;
  }

  private async getTocHtml(): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:ops="http://www.idpf.org/2007/ops"
      lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)" />
    <meta name="author" content="${escapeXml(this.story.author.name)}" />
    <meta name="date" content="${this.story.published.toISOString()}" />
    <title>Table of Contents</title>
  </head>
  <body>
    <nav ops:type="toc">
      <h1>Table of Contents</h1>
      <ol>
        ${this.story.chapters
          .map((chapter) => `<li><a href="chapter-${chapter.id}.xhtml">${escapeXml(chapter.title)}</a></li>`)
          .join("\n        ")}
      </ol>
    </nav>
  </body>
</html>`;
  }

  public async getCoverHtml(): Promise<string> {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)"/>
    <meta name="author" content="${escapeXml(this.story.author.name)}"/>
    <meta name="date" content="${this.story.published.toISOString()}"/>
    <title>Cover</title>
  </head>
  <body>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" viewBox="0 0 1030 1231" preserveAspectRatio="none">
        <image width="1030" height="1231" xlink:href="cover.jpg"/>
      </svg>
    </div>
  </body>
</html>`;
  }

  public async getChapterHtml(chapter: Chapter): Promise<string> {
    const link = createChapterLink(this.story, chapter);
    const response = await this.requestManager.fetch(link);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const serializer = new XMLSerializer();
    const template = document.createElement("template");
    template.innerHTML = await response.text();
    const storyText = template.content.getElementById("storytext");
    const content = serializer.serializeToString(storyText!);

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${escapeXml(this.story.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="generator" content="FanFiction Enhancements (https://github.com/amur-tiger/fanfiction-enhancements)"/>
    <meta name="author" content="${escapeXml(this.story.author.name)}"/>
    <meta name="date" content="${this.story.published.toISOString()}"/>
    <title>${escapeXml(chapter.title)}</title>
</head>
<body>
${content}
</body>
</html>`;
  }

  public hasCover(): boolean {
    return !!(this.story.imageOriginalUrl ?? this.story.imageUrl);
  }

  public getFilename(): string {
    return escapeFile(`${this.story.title} - ${this.story.author.name}.epub`);
  }

  public async create(): Promise<Blob> {
    const zip = new JSZip();
    zip.file("mimetype", "application/epub+zip");

    const meta = zip.folder("META-INF")!;
    meta.file("container.xml", await this.getContainerXml());

    zip.file("content.opf", await this.getContentXml());
    zip.file("toc.ncx", await this.getNcxXml());
    zip.file("toc.xhtml", await this.getTocHtml());

    const coverUrl = this.story.imageOriginalUrl ?? this.story.imageUrl;
    if (coverUrl) {
      zip.file("cover.xhtml", await this.getCoverHtml());
      const cover = await this.requestManager.fetch(`//www.fanfiction.net${coverUrl}`);
      if (!cover.ok) {
        throw new Error(cover.statusText);
      }
      zip.file("cover.jpg", await cover.blob());
    }

    await Promise.all(
      this.story.chapters.map(async (chapter) => {
        zip.file(`chapter-${chapter.id}.xhtml`, await this.getChapterHtml(chapter));
      })
    );

    return zip.generateAsync({ type: "blob" });
  }
}
