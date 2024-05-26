import { createFile, getFileContents, getFiles, updateFile } from "./drive";
import { tryParse } from "../utils";
import { isSyncAuthorized } from "./auth";
import { type ChapterReadMetadata, getChapterReadMetadata, type IsRead } from "../api/chapter-read";
import { createSignal, type ReadonlySignal } from "../signal/signal";

async function getFile<T>(name: string): Promise<T | undefined>;
async function getFile<T>(name: string, fallback: T): Promise<T>;
async function getFile<T>(name: string, fallback: T | undefined): Promise<T | undefined>;

async function getFile<T>(name: string, fallback?: T) {
  const { files } = await getFiles(name);
  const file = files?.find((file) => file.name === name);
  if (!file?.id) {
    return fallback;
  }

  return tryParse<T>(await getFileContents(file.id), fallback);
}

async function writeFile(name: string, content: unknown) {
  const { files } = await getFiles(name);
  let file = files?.find((file) => file.name === name);
  if (!file?.id) {
    file = await createFile(name, content);
    if (!file) {
      throw new Error("Could not save file: Google did not provide metadata.");
    }

    return file;
  }

  return updateFile(file, content);
}

const readFileName = "ffe-chapter-read.json";
let token: ReturnType<typeof setTimeout> | null = null;
const isSynchronizingSignal = createSignal(false);

export function getIsSynchronizingSignal(): ReadonlySignal<boolean> {
  return isSynchronizingSignal;
}

/**
 * Deferred upload via setTimeout may not trigger when value was
 * set via scroll effect, maybe because of some browser protections.
 * This can be called to upload metadata explicitly.
 * Caution: This does not sync, remote will get overwritten.
 */
export async function uploadMetadata() {
  if (!(await isSyncAuthorized())) {
    return;
  }

  if (token != null) {
    clearTimeout(token);
    token = null;
  }

  const metadata = getChapterReadMetadata();
  await metadata.isInitialized();

  console.debug("[SYNC] Uploading changes to Drive");
  try {
    isSynchronizingSignal.set(true);
    await writeFile(readFileName, metadata.peek());
  } finally {
    isSynchronizingSignal.set(false);
  }
}

/**
 * Starts automatic synchronization. Only call once.
 */
export async function syncChapterReadStatus() {
  if (!(await isSyncAuthorized())) {
    return;
  }

  const localMetadataSignal = getChapterReadMetadata();
  await localMetadataSignal.isInitialized();

  localMetadataSignal.addEventListener("change", async (event) => {
    if (event.isInternal) {
      return;
    }

    if (token != null) {
      clearTimeout(token);
    }
    token = setTimeout(uploadMetadata, 1500);
  });

  const localMetadata = localMetadataSignal.peek();
  let remoteMetadata: ChapterReadMetadata;
  try {
    isSynchronizingSignal.set(true);
    remoteMetadata = await getFile<ChapterReadMetadata>(readFileName, { version: 1, stories: {} });
  } finally {
    isSynchronizingSignal.set(false);
  }

  const result = mergeStories(localMetadata.stories, remoteMetadata.stories);
  const mergedMetadata: ChapterReadMetadata = { version: 1, stories: result.merged! };

  if (result.hasLocalChanges) {
    console.debug("[SYNC] Integrating remote data");
    localMetadataSignal.set(mergedMetadata);
  }
  if (result.hasRemoteChanges) {
    console.debug("[SYNC] Uploading changes to Drive");
    try {
      isSynchronizingSignal.set(true);
      await writeFile(readFileName, mergedMetadata);
    } finally {
      isSynchronizingSignal.set(false);
    }
  }
}

interface MergeResult<T> {
  merged: T;
  hasLocalChanges: boolean;
  hasRemoteChanges: boolean;
}

function mergeStories(
  local: ChapterReadMetadata["stories"] | undefined,
  remote: ChapterReadMetadata["stories"] | undefined,
): MergeResult<ChapterReadMetadata["stories"] | undefined> {
  return mergeRecord(local, remote, (localChapter, remoteChapter) => {
    return mergeRecord<Record<number, IsRead | undefined>>(localChapter, remoteChapter, (localIsRead, remoteIsRead) => {
      return mergeIsRead(localIsRead, remoteIsRead);
    });
  });
}

function mergeRecord<T extends {}>(
  local: T | undefined,
  remote: T | undefined,
  mergeItem: <K extends keyof T>(local: T[K], remote: T[K]) => MergeResult<T[K]>,
): MergeResult<T | undefined> {
  let result = removeNull(local, remote);
  if (result) {
    return result;
  }

  result = {
    merged: {} as T,
    hasLocalChanges: false,
    hasRemoteChanges: false,
  };

  const keys = new Set([...Object.keys(local!), ...Object.keys(remote!)]);
  for (const key of keys) {
    const localItem = local![key as keyof T];
    const remoteItem = remote![key as keyof T];
    const itemResult = removeNull(localItem, remoteItem) ?? mergeItem(localItem, remoteItem);
    result.merged![key as keyof T] = itemResult.merged!;
    result.hasLocalChanges ||= itemResult.hasLocalChanges;
    result.hasRemoteChanges ||= itemResult.hasRemoteChanges;
  }

  return result;
}

function mergeIsRead(local: IsRead | undefined, remote: IsRead | undefined): MergeResult<IsRead | undefined> {
  const result = removeNull(local, remote);
  if (result) {
    return result;
  }

  if (local!.timestamp !== remote!.timestamp || local!.read !== remote!.read) {
    if (local!.timestamp > remote!.timestamp) {
      return { merged: local, hasLocalChanges: false, hasRemoteChanges: true };
    } else {
      return { merged: remote, hasLocalChanges: true, hasRemoteChanges: false };
    }
  }

  return { merged: local, hasLocalChanges: false, hasRemoteChanges: false };
}

function removeNull<T>(local: T | undefined, remote: T | undefined): MergeResult<T | undefined> | undefined {
  if (local == null) {
    if (remote == null) {
      return { merged: undefined, hasLocalChanges: false, hasRemoteChanges: false };
    } else {
      return { merged: remote, hasLocalChanges: true, hasRemoteChanges: false };
    }
  } else if (remote == null) {
    return { merged: local, hasLocalChanges: false, hasRemoteChanges: true };
  }
}
