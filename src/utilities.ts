import { parsePath } from "@opd-libs/opd-metadata-lib/lib/Utils";
import { TAbstractFile, TFile, TFolder } from "obsidian";
import {
  DataviewInlineRegex,
  KebabCaseDashesRegex,
  MarkdownWikiLinkRegex,
  PropertyNameIllegalCharachtersRegex,
  SpacesRegex,
  Symbols
} from "./constants";
import { InternalStaticMetadataScrierPluginContainer } from "./static";
import { FileData, ThenDoCallback, ThenDoCallbacks, ThenDoOnTrueCallback } from "./types/datas";
import { NotesSource } from "./types/fetching/sources";
import { PropertyNamingConventions } from "./types/settings";

//#region Conditionals

/**
 * Helper to check if something's a function.
 * 
 * @param symbol The symbol to test
 * 
 * @returns true if the item is a function
 */
export const IsFunction = (symbol: any)
  : symbol is Function =>
    typeof symbol === "function";

/**
 * Helper to check if somethings an object.
 * 
 * @param symbol The symbol to check 
 * @param includeNulls (optional) If the value of 'null' returns true or not. (Defaults to false)
 * 
 * @returns true if it's an object 
 */
export const IsObject = (symbol: any)
  : symbol is Record<any, any> & object =>
    typeof symbol === "object" && symbol !== null;
    
/**
 * Helper to check if something is a string.
 */
export const IsString = (symbol: any)
  : symbol is string =>
    typeof symbol === "string";

/**
 * Helper to check if somethings specifically an array.
 * 
 * @param symbol The symbol to check 
 * 
 * @returns true if it's an array
 */
export const IsArray = (symbol: any)
  : symbol is Array<any> =>
    Array.isArray(symbol);

/**
 * Check if something is a TAbstractFile (test safe)
 */
export function IsTAbstractFile(source: NotesSource): source is TFile | TFolder | TAbstractFile {
  if (process.env.NODE_ENV !== "test") {
    return source instanceof TAbstractFile;
  }

  // in testing, instanceof doesn't work.
  return IsObject(source)
    && source.hasOwnProperty("vault")
    && source.hasOwnProperty("parent");;
}

/**
 * Check if something is a TFile (test safe)
 */
export function IsTFile(source: NotesSource): source is TFile {
  if (process.env.NODE_ENV !== "test") {
    return source instanceof TFile;
  }

  // in testing, instanceof doesn't work.
  const sourceAsObject = (source as TFile) as object;

  return IsTAbstractFile(source)
    && sourceAsObject.hasOwnProperty("basename");
}

/**
 * Check if something is a TFolder (test safe)
 */
export function IsTFolder(source: NotesSource): source is TFolder {
  if (process.env.NODE_ENV !== "test") {
    return source instanceof TFolder;
  }

  // in testing, instanceof doesn't work.
  const sourceAsObject = (source as TFolder) as object;

  return IsTAbstractFile(source)
    && sourceAsObject.hasOwnProperty("children");
}

//#endregion

//#region Object Deep Property Utilities

/**
 * Find a deep property in an object.
 *
 * @param path Array of keys, or dot seperated propery key."
 * @param onObject The object containing the desired key
 *
 * @returns true if the property exists, false if not.
 */
export function ContainsDeepProperty(path: string | Array<string>, onObject: any): boolean {
  const keys = (IsString(path))
    ? (path as string)
      .split('.')
    : path;

  let parent = onObject;
  for (const currentKey of keys) {
    if (!IsObject(parent)) {
      return false;
    }

    if (!parent.hasOwnProperty(currentKey)) {
      return false;
    }

    parent = parent[currentKey];
  }

  return true;
}

/**
 * Get a deep property in an object, null if not found.
 *
 * @param path Array of keys, or dot seperated propery key.
 * @param fromObject The object containing the desired key
 * @param thenDo A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
 *
 * @returns if the property exists.
 */
export function TryToGetDeepProperty(path: string | Array<string>, fromObject: any, thenDo?: ThenDoCallback): boolean {
  const keys = (IsString(path))
    ? parsePath(path as string)
    : path;

  let parent = fromObject;
  for (const currentKey of keys) {
    if (!IsObject(parent) || !parent.hasOwnProperty(currentKey)) {
      if (thenDo && (thenDo as ThenDoCallbacks).onFalse) {
        (thenDo as ThenDoCallbacks).onFalse!();
      }

      return false;
    }

    parent = parent[currentKey];
  }

  if (thenDo) {
    const then: ThenDoOnTrueCallback
      = ((thenDo as ThenDoCallbacks)?.onTrue ?? thenDo) as ThenDoOnTrueCallback;
    
    if (then) {
      return then(parent);
    }
  }

  return true;
}

/**
 * Get a deep property in an object, null if not found.
 *
 * @param path Array of keys, or dot seperated propery key.
 * @param fromObject The object containing the desired property
 *
 * @returns The found deep property, or null if not found.
 */
export function GetDeepProperty(path: string | Array<string>, fromObject: any): any | undefined {
  return (IsString(path)
    ? (path as string)
      .split('.')
    : (path as string[]))
    .reduce((t, p) => t?.[p], fromObject);
}

/**
  * Set a deep property in an object, even if it doesn't exist.
  *
  * @param path Array of keys, or dot seperated propery key.
  * @param value The value to set, or a function to update the current value and return it.
  * @param onObject The object to set the property on
  * @param valueFunctionIsNotTheValueAndIsUsedToFetchTheValue If this is true, and the value passed in is a function, this will execute that function with no parameters to try to get the value. (defautls to true)
  */
export function SetDeepProperty(path: string | Array<string>, value: any, onObject: any, valueFunctionIsNotTheValueAndIsUsedToFetchTheValue?: true | boolean): void {
  const keys = (IsString(path))
    ? (path as string)
      .split('.')
    : path;

  let parent = onObject;
  let currentKey;
  for (currentKey of keys) {
    if (!IsObject(parent)) {
      throw `Property: ${currentKey}, in Path: ${path}, is not an object. Child property values cannot be set!`;
    }

    // if this parent doesn't have the property we want, add it as an empty object for now.
    if (!parent.hasOwnProperty(currentKey)) {
      parent[currentKey] = {};
    }

    // if this isn't the last one, set it as parent.
    if (currentKey != keys[keys.length - 1]) {
      parent = parent[currentKey];
    }
  }

  if (!currentKey) {
    throw "No Final Key Provided!?";
  }

  // TODO: add ignore flag options variable for this
  if (valueFunctionIsNotTheValueAndIsUsedToFetchTheValue && IsFunction(value)) {
    parent[currentKey] = value(parent[currentKey]);
  } else {
    parent[currentKey] = value;
  }
}

//#endregion

//#region Filename Utilities

/**
 * Get a file path string based on a file path string or file object.
 *
 * @param source The file object (with a path property) or file name
 *
 * @returns The file path
 */
export function ParsePathFromNoteSource(source: NotesSource): string | null {
  let fileName = source || null;
  if (IsObject(source) && source !== null) {
    fileName = (source as FileData | TAbstractFile).path!;
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
export function BuildDataValueFileFullPath(dataPath: string) {
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
export function BuildPrototypeFileFullPath(prototypePath: string) {
  // @ts-expect-error: app.plugin is not mapped.
  return app.plugins.plugins[MetadataScrierPluginKey].settings.prototypesPath + prototypePath;
}

/**
 * Turn a relative path into a full path
 *
 * @param relativePath The relative path to map to. Will preform immediate search if it starts with ?.
 * @param extension The extension to add. Defaults to no extension (false/empty). If true is passed in .md will be added.
 * @param rootFolder (Optional) The root folder path the relative path is relative too. Defaults to the current note's folder
 *
 * @returns The full file path.
 */
export function Path(relativePath?: string, extension: string | boolean = "", rootFolder?: string): string {
  return _addExtension(_findPath(relativePath, extension, rootFolder), extension);
}

function _findPath(relativePath?: string, extension: string | boolean = "", rootFolder?: string): string {
  if (!relativePath) {
    return InternalStaticMetadataScrierPluginContainer.Api.current.path
  }

  let currentFolder: TFolder = rootFolder
    ? (app.vault.getAbstractFileByPath(rootFolder) as TFolder)
    : InternalStaticMetadataScrierPluginContainer.Api.Current.Note.parent;

  if (!currentFolder) {
    throw `Root Folder Not Found: ${currentFolder}.`;
  }

  if (relativePath.startsWith("?")) {
    const foundFile = app.metadataCache.getFirstLinkpathDest(_addExtension(relativePath.substring(1), extension), currentFolder.path);
    if (foundFile) {
      return foundFile.path.substring(0, foundFile.path.length - foundFile.extension.length - 1);
    }
  }

  const [fileName, ...folders] = relativePath.split(Symbols.FolderPathSeperatorCharacter).reverse();
  let absolutePath = fileName;

  if (folders && folders.length) {
    for (var folder of folders.reverse()) {
      if (folder === Symbols.ParentFolderPathSelector) {
        currentFolder = currentFolder.parent;
      } else if (folder === Symbols.CurrentFolderPathSelector) {
        continue;
      } else {
        absolutePath = folder + (absolutePath ? Symbols.FolderPathSeperatorCharacter + absolutePath : "");
      }
    }
  } else {
    const foundFile = app.metadataCache.getFirstLinkpathDest(_addExtension(relativePath, extension), currentFolder.path);
    if (foundFile) {
      return foundFile.path.substring(0, foundFile.path.length - foundFile.extension.length - 1);
    }
  }

  if (currentFolder.path !== Symbols.FolderPathSeperatorCharacter) {
    return currentFolder.path + (absolutePath ? Symbols.FolderPathSeperatorCharacter + absolutePath : "");
  } else {
    return absolutePath;
  }
}

function _addExtension(path: string, extension: string | boolean): string {
  if (extension) {
    if (!IsString(extension)) {
      return path + Symbols.ExtensionFilePathSeperatorCharacter + Symbols.DefaultMarkdownFileExtension;
    } else {
      return path + Symbols.ExtensionFilePathSeperatorCharacter + extension;
    }
  } else {
    return path;
  }
}

//#endregion

//#region String Utilities

/**
 * Used to splay a property key into it's multiple forms, including:
 * 
 * - un-cleaned (Original)
 * - cleanedOriginal
 * - kebab-case
 * - lowercase
 * - lowerCamelCase
 * - DefaultCamelCase
 */
export function Splay(
  key: string,
  conventions: PropertyNamingConventions = PropertyNamingConventions.All,
  originalConvention: typeof PropertyNamingConventions.Uncleaned | typeof PropertyNamingConventions.Cleaned = PropertyNamingConventions.Uncleaned
): string[] {
  // if you just want the unclean key... take it?
  if (conventions === PropertyNamingConventions.Uncleaned) {
    return [key];
  }

  // otherwise we need probably need to clean and split it up.
  const keys = conventions & originalConvention
    ? [key]
    : [];

  // clean the key of dataview values, wikilinks, seperators, and illegal charachters.
  let cleaned = key;
  let cleanedWithSeperatorCharsIntact: string | null = null;
  if (originalConvention !== PropertyNamingConventions.Cleaned) {
    /// wiki-links syntax
    if (key.contains(Symbols.MarkdownWikiLinkPrefix)) {
      cleanedWithSeperatorCharsIntact = key.replace(MarkdownWikiLinkRegex, "$2$3");
    } else {
      cleanedWithSeperatorCharsIntact = key;
    }
    
    // dv inline syntax
    if (cleanedWithSeperatorCharsIntact?.contains(Symbols.DataviewInlineSeperator)) {
      cleanedWithSeperatorCharsIntact = cleanedWithSeperatorCharsIntact.replace(DataviewInlineRegex, function (_a, b, c, _d, e, _f) {
        return b ? `${b} ${c}` : e;
      });
    }

    // remove special and illegal name characters including
    cleanedWithSeperatorCharsIntact = cleanedWithSeperatorCharsIntact.replace(PropertyNameIllegalCharachtersRegex, Symbols.NoCharachter);
    cleaned = cleanedWithSeperatorCharsIntact.replace(SpacesRegex, Symbols.NoCharachter);
    cleaned = cleanedWithSeperatorCharsIntact.replace(KebabCaseDashesRegex, Symbols.NoCharachter);
  }

  if (conventions & PropertyNamingConventions.Cleaned) {
    keys.push(cleaned);
  }

  if (conventions & PropertyNamingConventions.LowerCase) {
    const lower = cleaned.toLowerCase();

    keys.push(lower);
  }

  if (conventions & PropertyNamingConventions.LowerCamelCase) {
    const lowerCamel = cleaned[0].toLowerCase() + cleaned.substring(1);

    keys.push(lowerCamel);
  }

  /// can't make the others if it's already been cleaned.
  if (cleanedWithSeperatorCharsIntact === null) {
    return keys.unique();
  }

  let seperatedParts: Array<string> | null = null;
  if (conventions & PropertyNamingConventions.LowerCamelCase) {
    seperatedParts ??= cleanedWithSeperatorCharsIntact
      .split(Symbols.KebabCasePropertyNameWordSeperatorCharacter)
      .map(p => p.split(Symbols.EmptySpace))
      .flat();

    keys.push(seperatedParts
      .map((part, i) => (i !== 0 && part)
        ? part.charAt(0).toUpperCase() + part.substring(1)
        : part)
      .join(Symbols.NoCharachter));
  }

  if (conventions & PropertyNamingConventions.DefaultCamelCase) {
    seperatedParts ??= cleanedWithSeperatorCharsIntact
      .toLowerCase()
      .split(Symbols.KebabCasePropertyNameWordSeperatorCharacter)
      .map(p => p.split(Symbols.EmptySpace))
      .flat();

    keys.push(seperatedParts
      .map(part => part
        ? part.charAt(0).toUpperCase() + part.substring(1)
        : part)
      .join(Symbols.NoCharachter));
  }

  if (conventions & PropertyNamingConventions.KebabCase) {
    if (!seperatedParts) {
      seperatedParts ??= cleanedWithSeperatorCharsIntact
        .split(Symbols.KebabCasePropertyNameWordSeperatorCharacter)
        .map(p => p.split(Symbols.EmptySpace))
        .flat();

      keys.push(seperatedParts
        .map(part => part
          ? part
          : part)
        .join(Symbols.KebabCasePropertyNameWordSeperatorCharacter));
    } else {
      keys.push(seperatedParts
        .map(part => part
          ? part.toLowerCase()
          : part)
        .join(Symbols.KebabCasePropertyNameWordSeperatorCharacter));
    }
  }

  return keys.unique();
}
//#endregion
