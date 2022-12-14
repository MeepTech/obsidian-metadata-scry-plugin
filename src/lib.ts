/**
 * Defines the npm library version of the plugin api.
 */
import { DefaultPluginSettings } from "./constants";
import { InternalStaticMetadataScrierPluginContainer } from "./static";
import { MetaScryPluginSettings } from "./types/settings";
import { MetaScry } from "./types/static";
import { IsObject } from "./utilities";

// Types
// ===============
//// Metadatas
export type {
  Metadata,
  Frontmatter,
  FileData,
  Cache,
  DataviewMatter,
  CachedFileMetadata,
  ScryResults,
  ScryResult,
  ScryResultsMap as ScryResultMap,
  PromisedScryResults,
  ScryResultPromiseMap,
  PromisedScryResult
} from "./types/datas";
export type {
  Section
} from "./types/sections/section";
export type {
  Sections
} from "./types/sections/sections";
export type {
  Heading
} from "./types/sections/heading";

//// APIs
export type {
  MetaScryPluginApi as MetaScryPlugin
} from "./types/plugin";
export type {
  MetaScry
} from "./types/static";
export type {
  MetaScryApi
} from "./types/fetching/scrier";
export type {
  CurrentNoteMetaScryApi
} from "./types/fetching/current";
export type {
  MetaBindApi,
  MetaBindIndividualInputTypeFunction,
  CurrentMetaBindApi,
  CurrentMetaBindIndividualInputTypeFunction,
  BindingResult,
  BoundInputField
} from "./types/editing/bind";
export type {
  MetaEditApi,
  CurrentNoteMetaEditApi
} from "./types/editing/editor";

//// Settings and Options
export type {
  MetadataSources,
  NotesSource,
  SingleFileSource
} from "./types/fetching/sources";
export type {
  FrontmatterUpdateSettings,
  BindSettings,
  SplayKebabCasePropertiesOptions,
  MetaScryPluginSettings,
  PropertyNamingConventions,
  DataFetcherSettings,
  PromisedDataFetcherSettings,
  MetadataEditorSettings
} from "./types/settings";
export {
  Keys,
  Symbols,
  Paths,
  DefaultPluginSettings,
  DefaultFrontmatterUpdateOptions
} from "./constants"

// Functions
// ===============
//// React Components
export {
  ReactMarkdownComponents
} from "./components/markdown"
export {
  ReactSectionComponents
} from "./components/sections"

//// Utility
export {
  IsFunction,
  IsObject,
  IsArray,
  IsString,
  IsTAbstractFile,
  IsTFile,
  IsTFolder,
  ContainsDeepProperty,
  TryToGetDeepProperty,
  GetDeepProperty,
  SetDeepProperty,
  Path,
  Splay,
  ParsePathFromNoteSource,
  BuildDataValueFileFullPath,
  BuildPrototypeFileFullPath
} from "./utilities";

//// Get Instance
/**
 * Used to get an instance of MetaScry. 
 * Gets the current one, or makes one if there isn't one.
 *
 * @param defaultSettings Default settings to use if there is no active instance.
 *
 * @returns The current MetaScry interface object instance.
 */
export function GetInstance(
  defaultSettings: MetaScryPluginSettings = DefaultPluginSettings,
): MetaScry {
  if (IsObject(InternalStaticMetadataScrierPluginContainer.Static)) {
    return InternalStaticMetadataScrierPluginContainer.Static;
  } else {
    return InternalStaticMetadataScrierPluginContainer.InitalizeStaticApi({
      defaultSettings
    });
  }
}
