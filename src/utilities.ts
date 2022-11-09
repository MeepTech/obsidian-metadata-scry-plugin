import { TAbstractFile } from "obsidian";
import { FileData, FileSource } from "./api";

/**
 * Helper to check if something's a function.
 * 
 * @param symbol The symbol to test
 * 
 * @returns true if the item is a function
 */
export const IsFunction = (symbol: any) => typeof symbol === "function";
export const IsObject = (symbol: any) => typeof symbol === "object";
export const IsString = (symbol: any) => typeof symbol === "string";
export const IsArray = (symbol: any) => Array.isArray(symbol);

/**
 * Get a file path string based on a file path string or file object.
 *
 * @param {FileSource} file The file object (with a path property) or file name
 *
 * @returns The file path
 */
  export function ParseFilePathFromSource(file: FileSource): string | null {
  let fileName = file || null;
  if (IsObject(file) && file !== null) {
    fileName = (file as FileData | TAbstractFile).path!;
  }

  //@ts-expect-error: Accounted For.
  return fileName;
}

/**
 * Get the full path of a data file from it's data path.
 *
 * @param dataPath The path after the value set in settings for the path to data value files.
 *
 * @returns the full path from the root of the vault.
 */
 export function  BuildDataValueFileFullPath(dataPath: string) {
  // @ts-expect-error: app.plugin is not mapped.
  return app.plugins.plugins[MetadataScrierPluginKey].settings.dataFilesPath + dataPath;
}

/**
 * Get the full path of a prototype file from it's data path.
 *
 * @param prototypePath The path after the value set in settings for the path to data prototypes files.
 *
 * @returns the full path from the root of the vault.
 */
 export function  BuildPrototypeFileFullPath(prototypePath: string) {
  // @ts-expect-error: app.plugin is not mapped.
  return app.plugins.plugins[MetadataScrierPluginKey].settings.prototypesPath + prototypePath;
}