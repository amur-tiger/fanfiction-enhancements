import NextEvent from "./NextEvent";
import gmFetch from "../gm-fetch";

export default class DownloadManager extends EventTarget {
  public maxParallel = 4;

  private running = 0;

  private waitUntil = 0;

  private requestCounter = 1;

  private canBegin(): boolean {
    return Date.now() >= this.waitUntil && this.running < this.maxParallel;
  }

  private async doFetch(request: Request): Promise<Response> {
    const response = await gmFetch(request);

    console.debug(
      "%c%s %c%s %c%d",
      "color: blue",
      request.method,
      "color: inherit",
      request.url,
      "color: blue",
      response.status,
    );

    return response;
  }

  public async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const requestId = this.requestCounter;
    this.requestCounter += 1;

    return new Promise((resolve, reject) => {
      const handler = async () => {
        if (!this.canBegin()) {
          return;
        }

        this.running += 1;
        this.removeEventListener(NextEvent.type, handler);
        try {
          const response = await this.doFetch(new Request(input, init));

          if (response.status === 429) {
            const retryAfter = response.headers.get("Retry-After");
            const waitSeconds = ((retryAfter && !Number.isNaN(+retryAfter) && +retryAfter) || 30) + 1;

            console.warn("Rate limited! Waiting %ss.", waitSeconds);
            this.waitUntil = Date.now() + waitSeconds;
            this.addEventListener(NextEvent.type, handler);
            setTimeout(() => {
              this.dispatchEvent(new NextEvent(0));
            }, waitSeconds * 1000);
          } else {
            resolve(response);
          }
        } catch (err) {
          reject(err);
        } finally {
          this.running -= 1;
          this.dispatchEvent(new NextEvent(requestId));
        }
      };

      this.addEventListener(NextEvent.type, handler);
      handler();
    });
  }
}
