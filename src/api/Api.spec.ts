import Api from "./Api";

describe("Api", () => {
  describe("Alerts", () => {
    it("should add alert", async () => {
      global.fetch = jest.fn(async (url, opts) => {
        expect(url).toBe("/api/ajax_subs.php");
        expect(opts?.method).toBe("POST");
        expect(opts?.body).toBeInstanceOf(FormData);
        expect((opts?.body as FormData).get("storyid")?.valueOf()).toBe("1");
        expect((opts?.body as FormData).get("storyalert")?.valueOf()).toBe("1");

        return { json: async () => ({}) } as Response;
      });

      const api = new Api();
      await api.addStoryAlert(1);

      expect.assertions(5);
    });

    it("should remove alert", async () => {
      global.fetch = jest.fn(async (url, opts) => {
        expect(url).toBe("/alert/story.php");
        expect(opts?.method).toBe("POST");
        expect(opts?.body).toBeInstanceOf(FormData);
        expect((opts?.body as FormData).get("action")?.valueOf()).toBe("remove-multi");
        expect((opts?.body as FormData).get("rids[]")?.valueOf()).toBe("1");

        return { text: async () => ({}) } as Response;
      });

      const api = new Api();
      await api.removeStoryAlert(1);

      expect.assertions(5);
    });

    it("should retrieve multi-page alerts list", async () => {
      const page1 = `<!--suppress HtmlUnknownTarget, HtmlDeprecatedTag -->
    		<div id="content_wrapper_inner">
    			<form>
    				<table id="gui_table1i">
    					<tbody>
    						<tr>
    							<td><a href="/s/123/story-1">Story 1</a></td>
    							<td><a href="/u/123/author">Author</a></td>
    							<td>Category 1</td>
    							<td>date updated...</td>
    							<td>date added...</td>
    							<td>checkbox</td>
    						</tr>
    						<tr>
    							<td colspan="6"></td>
    						</tr>
    					</tbody>
    				</table>
    				<center>
    					Page <b>1</b> 2 <a href="https://www.fanfiction.net/alert/story.php?p=2">Next</a>
    				</center>
    			</form>
    		</div>`;
      const page2 = `<!--suppress HtmlUnknownTarget -->
    		<form>
    			<table id="gui_table1i">
    				<tbody>
    					<tr>
    						<td><a href="/s/125/story-2">Story 2</a></td>
    						<td><a href="/u/125/cool-guy">Cool Guy</a></td>
    						<td>Category 2</td>
    						<td>date updated...</td>
    						<td>date added...</td>
    						<td>checkbox</td>
    					</tr>
    					<tr>
    						<td colspan="6"></td>
    					</tr>
    				</tbody>
    			</table>
    		</form>`;

      global.fetch = jest
        .fn()
        .mockImplementationOnce((url) => {
          expect(url).toBe("/alert/story.php");
          return { text: async () => page1 };
        })
        .mockImplementationOnce((url) => {
          expect(url).toBe("/alert/story.php?p=2");
          return { text: async () => page2 };
        });

      const api = new Api();
      const list = await api.getStoryAlerts();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(list.length).toBe(2);

      const item1 = list[0];
      expect(item1.id).toBe(123);
      expect(item1.title).toBe("Story 1");
      expect(item1.author.id).toBe(123);
      expect(item1.author.name).toBe("Author");

      const item2 = list[1];
      expect(item2.id).toBe(125);
      expect(item2.title).toBe("Story 2");
      expect(item2.author.id).toBe(125);
      expect(item2.author.name).toBe("Cool Guy");
    });
  });

  describe("Favorites", () => {
    it("should add favorite", async () => {
      global.fetch = jest.fn(async (url, opts) => {
        expect(url).toBe("/api/ajax_subs.php");
        expect(opts?.method).toBe("POST");
        expect(opts?.body).toBeInstanceOf(FormData);
        expect((opts?.body as FormData).get("storyid")?.valueOf()).toBe("1");
        expect((opts?.body as FormData).get("favstory")?.valueOf()).toBe("1");

        return { json: async () => ({}) } as Response;
      });

      const api = new Api();
      await api.addStoryFavorite(1);

      expect.assertions(5);
    });

    it("should remove favorite", async () => {
      global.fetch = jest.fn(async (url, opts) => {
        expect(url).toBe("/favorites/story.php");
        expect(opts?.method).toBe("POST");
        expect(opts?.body).toBeInstanceOf(FormData);
        expect((opts?.body as FormData).get("action")?.valueOf()).toBe("remove-multi");
        expect((opts?.body as FormData).get("rids[]")?.valueOf()).toBe("1");

        return { text: async () => ({}) } as Response;
      });

      const api = new Api();
      await api.removeStoryFavorite(1);

      expect.assertions(5);
    });

    it("should retrieve multi-page favorites list", async () => {
      const page1 = `<!--suppress HtmlUnknownTarget, HtmlDeprecatedTag -->
    		<div id="content_wrapper_inner">
    			<form>
    				<table id="gui_table1i">
    					<tbody>
    						<tr>
    							<td><a href="/s/123/story-1">Story 1</a></td>
    							<td><a href="/u/123/author">Author</a></td>
    							<td>Category 1</td>
    							<td>date updated...</td>
    							<td>date added...</td>
    							<td>checkbox</td>
    						</tr>
    						<tr>
    							<td colspan="6"></td>
    						</tr>
    					</tbody>
    				</table>
    				<center>
    					Page <b>1</b> 2 <a href="https://www.fanfiction.net/favorites/story.php?p=2">Next</a>
    				</center>
    			</form>
    		</div>`;
      const page2 = `<!--suppress HtmlUnknownTarget -->
    		<form>
    			<table id="gui_table1i">
    				<tbody>
    					<tr>
    						<td><a href="/s/125/story-2">Story 2</a></td>
    						<td><a href="/u/125/cool-guy">Cool Guy</a></td>
    						<td>Category 2</td>
    						<td>date updated...</td>
    						<td>date added...</td>
    						<td>checkbox</td>
    					</tr>
    					<tr>
    						<td colspan="6"></td>
    					</tr>
    				</tbody>
    			</table>
    		</form>`;

      global.fetch = jest
        .fn()
        .mockImplementationOnce((url) => {
          expect(url).toBe("/favorites/story.php");
          return { text: async () => page1 };
        })
        .mockImplementationOnce((url) => {
          expect(url).toBe("/favorites/story.php?p=2");
          return { text: async () => page2 };
        });

      const api = new Api();
      const list = await api.getStoryFavorites();

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(list.length).toBe(2);

      const item1 = list[0];
      expect(item1.id).toBe(123);
      expect(item1.title).toBe("Story 1");
      expect(item1.author.id).toBe(123);
      expect(item1.author.name).toBe("Author");

      const item2 = list[1];
      expect(item2.id).toBe(125);
      expect(item2.title).toBe("Story 2");
      expect(item2.author.id).toBe(125);
      expect(item2.author.name).toBe("Cool Guy");
    });
  });

  describe("Stories", () => {
    it("should retrieve story data", async () => {
      const page = `<!--suppress HtmlUnknownTarget, HtmlRequiredAltAttribute -->
    		<div id="test-wrapper">
    			<div id="pre_story_links">
    				<span>
    					<a href="bla">uni</a>
    				</span>
    			</div>
    			<div id="profile_top">
    				<span><img src="/src/img.jpg" /></span>
    				<button><!-- follow+fav button --></button>
    				<b>title</b>
    				<span>by</span>
    				<a href="/u/678/author">author</a>
    				<span><!-- mail icon --></span>
    				<a><!-- message link --></a>
    				<div>description</div>
    				<span>
    					Rated: <a>M</a> - Elvish - Fantasy - [Romeo, Juliet] Steve - Chapters: 33 - Words: 1,234 - Reviews:
    					<a>123</a> - Favs: 345 - Follows: 567 - Updated: <span data-xutime="1517639271">Feb 3</span> - Published:
    					<span data-xutime="1426879324">Mar 20, 2015</span> - id: 123
    				</span>
    			</div>
    			<div id="storytext">Two words.</div>
    		</div>`;

      global.fetch = jest.fn(async (url) => {
        expect(url).toBe("/s/123");
        return { text: async () => page } as Response;
      });

      const api = new Api();
      const story = await api.getStoryData(123);

      expect(story?.id).toBe(123);
      expect(story?.title).toBe("title");
    });
  });
});
