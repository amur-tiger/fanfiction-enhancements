import type { drive_v3 } from "@googleapis/drive/build/v3";
import { getSyncToken, startSyncAuthorization } from "./auth";

async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = await getSyncToken();
  const response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    console.warn("Sync token invalid, re-authenticating");

    try {
      await startSyncAuthorization(true);
    } catch (ex) {
      console.warn("Silent re-authentication failed");
      await startSyncAuthorization();
    }

    const nextToken = await getSyncToken();
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${nextToken}`,
      },
    });
  }

  return response;
}

/**
 * @link https://developers.google.com/drive/api/reference/rest/v3/files/list
 * @param name
 */
export async function getFiles(name?: string): Promise<drive_v3.Schema$FileList> {
  let url = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder";
  if (name) {
    url += "&q=" + encodeURIComponent(`name='${name}'`);
  }

  const response = await authFetch(url);

  return response.json();
}

/**
 * @link https://developers.google.com/drive/api/reference/rest/v3/files/get
 * @param id
 */
export async function getFileContents(id: string) {
  const response = await authFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?alt=media`);
  return response.text();
}

/**
 * https://developers.google.com/drive/api/reference/rest/v3/files/create
 * @param name
 * @param content
 */
export async function createFile(name: string, content: unknown): Promise<drive_v3.Schema$File> {
  const data = new FormData();
  data.set(
    "metadata",
    new Blob(
      [
        JSON.stringify({
          name,
          mimeType: "application/json",
          parents: ["appDataFolder"],
        } satisfies drive_v3.Schema$File),
      ],
      {
        type: "application/json",
      },
    ),
  );
  data.set(
    "file",
    new Blob([JSON.stringify(content)], {
      type: "application/json",
    }),
  );

  const response = await authFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    body: data,
  });

  return response.json();
}

/**
 * @link https://developers.google.com/drive/api/reference/rest/v3/files/update
 * @param file
 * @param content
 */
export async function updateFile(file: drive_v3.Schema$File, content: unknown): Promise<drive_v3.Schema$File> {
  const response = await authFetch(`https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(file.id!)}`, {
    method: "PATCH",
    body: new Blob([JSON.stringify(content)], {
      type: "application/json",
    }),
  });

  return response.json();
}
