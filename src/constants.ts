// TODO: Export this file to the npm importable api when that's made.
import {
  FrontmatterUpdateOptions,
  MetaScryPluginSettings,
  SplayKebabCasePropertiesOption
} from "./api"

export const FileInfoMetadataSourceName = "FileInfo";
export const FrontmatterMetadataSourceName = "Frontmatter"
export const DataviewInlineMetadataSourceName = "DataviewInline"
export const ScryNoteCacheMetadataSourceName = "Cache"
export const NoteSectionsMetadataSourceName = "Sections"

export const MetadataSourceNames = [
  FileInfoMetadataSourceName,
  FrontmatterMetadataSourceName,
  DataviewInlineMetadataSourceName,
  ScryNoteCacheMetadataSourceName,
  NoteSectionsMetadataSourceName
];

export const DefaultPluginSettings: MetaScryPluginSettings = {
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

export const DefaultFrontmatterUpdateOptions : FrontmatterUpdateOptions = {
  toValuesFile: false,
  prototype: false,
  inline: false
}

export const MetadataScrierPluginKey = "meta-scry";
export const DataviewPluginKey = "dataview";
export const CopyToHtmlPluginKey = "copy-document-as-html";
export const ReactComponentsPluginKey = "obsidian-react-components";

export const MetascryPluginDepencencies = [
  CopyToHtmlPluginKey,
  DataviewPluginKey
];

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
