export default async function gmFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const request = new Request(input, init);
  const data = await request.text();

  const response = await new Promise<GM.Response<unknown>>((resolve, reject) => {
    GM.xmlHttpRequest({
      method: request.method as GM.Request["method"],
      url: request.url,
      headers: headersToObject(request.headers),
      responseType: "blob",
      data,

      onabort() {
        reject(new DOMException("Aborted", "AbortError"));
      },

      onerror() {
        reject(new TypeError("Network request failed"));
      },

      onload(response) {
        resolve(response);
      },

      ontimeout() {
        reject(new TypeError("Network request timed out"));
      },
    });
  });

  return new Response(response.response, {
    status: response.status,
    statusText: response.statusText,
    headers: stringToHeaders(response.responseHeaders),
  });
}

function headersToObject(headers: Headers): Record<string, string> {
  return Object.fromEntries(
    Array.from(headers.entries()).map(([key, value]) =>
      // Note "referer" vs "referrer", intentional because of a typo in the original spec
      key.toLowerCase() === "referrer" ? ["Referer", value] : [key, value],
    ),
  );
}

function stringToHeaders(headers: string): HeadersInit {
  return headers
    .split("\n")
    .filter((line) => line)
    .map((line) => {
      const colon = line.indexOf(":");
      return [line.substring(0, colon), line.substring(colon + 1).trim()];
    }) as HeadersInit;
}
