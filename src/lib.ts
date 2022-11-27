/**
 * Defines the npm library version of the plugin api.
 */
import { DefaultPluginSettings } from "./constants";
import { InternalStaticMetadataScrierPluginContainer } from "./static";
import { MetaScryPluginSettings } from "./types/plugin";
import { MetaScry as MetaScry } from "./types/scrier";
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
  CachedFileMetadata
} from "./types/data";
export type {
  Section
} from "./types/section";
export type {
  Sections,
  Heading
} from "./types/sections";

//// APIs
export type {
  MetaScryPluginApi
} from "./types/plugin";
export type {
  MetaScry,
  MetaScryApi
} from "./types/scrier";
export type {
  CurrentNoteMetaScryApi
} from "./types/current";
export type {
  MetaBindApi,
  MetaBindIndividualInputTypeFunction,
  CurrentMetaBindApi,
  CurrentMetaBindIndividualInputTypeFunction,
  MetaBindApiReturn,
  MetaBindApiSyncReturn,
  MetaBindApiAsyncReturn,
} from "./types/bind";
export type {
  MetaEditApi,
  CurrentNoteMetaEditApi
} from "./types/editor";

//// Settings and Options
export type {
  MetadataSources,
  NotesSource,
  SingleFileSource
} from "./types/sources";
export type {
  FrontmatterUpdateSettings
} from "./types/editor";
export type {
  BindSettings
} from "./types/bind";
export type {
  SplayKebabCasePropertiesOption,
  MetaScryPluginSettings
} from "./types/plugin";
export type {
  Keys,
  Symbols,
  Paths,
  DefaultPluginSettings,
  DefaultFrontmatterUpdateOptions
} from "./constants"

// Functions
// ===============
//// React Components
export type {
  ReactMarkdownComponents
} from "./components/markdown"
export type {
  ReactSectionComponents
} from "./components/sections"

//// Utility Functions
export type {
  IsFunction,
  IsObject,
  IsArray,
  IsString,
  ContainsDeepProperty,
  TryToGetDeepProperty,
  GetDeepProperty,
  SetDeepProperty,
  Path,
  ParseFilePathFromSource,
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
  defaultSettings: MetaScryPluginSettings = DefaultPluginSettings
): MetaScry {
  if (IsObject(InternalStaticMetadataScrierPluginContainer.Static)) {
    return InternalStaticMetadataScrierPluginContainer.Static;
  } else {
    return InternalStaticMetadataScrierPluginContainer.InitalizeStaticApi({
      defaultSettings
    });
  }
}
