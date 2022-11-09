import { DataviewApi, getAPI } from "obsidian-dataview";
import {
  MetaScryPluginApi,
  MetaScryPluginSettings,
  SplayKebabCasePropertiesOption
} from "./api";

/**
 * Static container for the current meta-scry plugin instance. 
 * For Internal use. The name is long so you don't want to use it anyway.
 */
 export class StaticMetaScryPluginContainer {

  /**
   * The current instance of the Metadata Scry Api Plugin.
   */
  static Instance: MetaScryPluginApi;

  /**
   * Access to the Metaedit Api
   * (Write access)
   */
  static get MetaeditApi() : any {
    // TODO: can we set these to their specific types?
    return (app as any)
    .plugins
    .plugins
    .metaedit
    .api;
  }
  
  /**
   * Access to the Dataview Api
   * (Read access and Data display)
   */
   static get DataviewApi(): DataviewApi {
     return getAPI() as DataviewApi;
   }
}

export const DefaultSettings: MetaScryPluginSettings = {
  globalCacheNames: 'cache',
  globalMetaScryExtraNames: 'meta',
  globalPathFunctionNames: "path, GetPath",
  globalCurrentFilePropertyNames: "my, Note, ThisFile",
  defineScryGlobalVariables: true,
  defineObjectPropertyHelperFunctions: true,
  defineArrayHelperFunctions: true,
  splayKebabCaseProperties: SplayKebabCasePropertiesOption.LowerAndCamelCase,
  splayFrontmatterWithoutDataview: true,
  prototypesPath: "_/_assets/_data/_prototypes",
  valuesPath: "_/_assets/_data/_values"
}

export const MetadataScrierPluginKey = "meta-scry";
export const ReactComponentsPluginKey = "obsidian-react-components";

export const ExtensionFilePathSeperatorCharacter = ".";
export const ParentFolderPathSelector = "..";
export const CurrentFolderPathSelector = ".";
export const DefaultMarkdownFileExtension = "md";
export const FolderPathSeperatorCharacter = "/";

export const HeadingLevelMarkerCharachter = '#';
export const KebabCaseWordSeperatorCharacter = "-";
export const SectionLinkSeperatorCharachter = '#';
export const FrontmatterMarkdownSurroundingTag = "---";
export const SectionIdPartDelimiter = ":|:";

export const FileMetadataPropertyLowercaseKey = "file";
export const FileMetadataPropertyUppercaseKey = "File";
export const CacheMetadataPropertyLowercaseKey = "cache";
export const CacheMetadataPropertyCapitalizedKey = "cache";
export const SectionsMetadataPropertyLowercaseKey = "sections";
export const SectionsMetadataPropertyCapitalizedKey = "Sections";
export const ScryGlobalPropertyLowercaseKey = "scry";
export const ScryGlobalPropertyCapitalizedKey = "Scry";

export const HasPropObjectHelperFunctionKey = "hasProp";
export const GetPropObjectHelperFunctionKey = "getProp";
export const SetPropObjectHelperFunctionKey = "setProp";

export const AggregateByArrayHelperFunctionKey = "aggregateBy";
export const IndexByArrayHelperFunctionKey = "indexBy";

export const SpacesRegex = / /g;
export const KebabCaseDashesRegex = /-/g;
export const MarkdownWikiLinkRegex = new RegExp("\\[\\[(?:(?:([^\\]]*)\\|([^\\]]*))|([^\\]]*))\\]\\]", "g");
export const DataviewInlineRegex = new RegExp("\\[(?:(?:([^\\[:\\|]*)::([^\\]]*)))\\]|\\((?:(?:([^\\[:\\|]*)::([^\\]]*)))\\)", "g");
export const PropertyNameIllegalCharachtersRegex = new RegExp("(?:(^[\\d ][^{a-zA-Z_\\-}]*)|([^{a-zA-Z0-9_\\-\\\$ }]))", "g");

export const IsFunction = (symbol: any) => typeof symbol === "function";
export const IsObject = (symbol: any) => typeof symbol === "object";
export const IsString = (symbol: any) => typeof symbol === "string";
export const IsArray = (symbol: any) => Array.isArray(symbol);
