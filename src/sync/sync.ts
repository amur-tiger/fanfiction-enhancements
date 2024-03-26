import { createFile, getFileContents, getFiles, updateFile } from "./drive";
import { tryParse } from "../utils";

export async function getFile<T>(name: string, fallback?: T) {
  const { files } = await getFiles(name);
  const file = files?.find((file) => file.name === name);
  if (!file?.id) {
    return;
  }

  return tryParse<T>(await getFileContents(file.id), fallback!);
}

export async function writeFile(name: string, content: unknown) {
  const { files } = await getFiles(name);
  let file = files?.find((file) => file.name === name);
  if (!file?.id) {
    console.log("file with that name does not exist, creating new...");
    file = await createFile(name, content);
    if (!file) {
      throw new Error("Could not save file: Google did not provide metadata.");
    }

    return file;
  }

  return updateFile(file, content);
}
