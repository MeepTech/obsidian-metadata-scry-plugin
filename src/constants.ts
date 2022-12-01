import {
  FrontmatterUpdateSettings,
  MetaScryPluginSettings,
  SplayKebabCasePropertiesOptions
} from "./types/settings";

export namespace Paths {
  export const PrototypesFolderDefaultPath = "_/_assets/_data/_prototypes";
  export const ValuesFolderDefaultPath = "_/_assets/_data/_values";
}

export namespace Keys {
  export const FileInfoMetadataSourceKey = "FileInfo";
  export const FrontmatterMetadataSourceKey = "Frontmatter"
  export const DataviewInlineMetadataSourceKey = "DataviewInline"
  export const ScryNoteCacheMetadataSourceKey = "Cache"
  export const NoteSectionsMetadataSourceKey = "Sections"
  export const MetadataSourceKeys = [
    Keys.FileInfoMetadataSourceKey,
    Keys.FrontmatterMetadataSourceKey,
    Keys.DataviewInlineMetadataSourceKey,
    Keys.ScryNoteCacheMetadataSourceKey,
    Keys.NoteSectionsMetadataSourceKey
  ];

  export const MetadataScrierPluginKey = "meta-scry";
  export const DataviewPluginKey = "dataview";
  export const CopyToHtmlPluginKey = "copy-document-as-html";
  export const ReactComponentsPluginKey = "obsidian-react-components";
  export const MetaBindWithApiPluginKey = "obsidian-meta-bind-plugin";

  export const FileMetadataPropertyLowercaseKey = "file";
  export const FileMetadataPropertyUppercaseKey = "File";
  export const CacheMetadataPropertyLowercaseKey = "cache";
  export const CacheMetadataPropertyCapitalizedKey = "cache";
  export const SectionsMetadataPropertyLowercaseKey = "sections";
  export const SectionsMetadataPropertyCapitalizedKey = "Sections";

  export const ScryGlobalPropertyLowercaseKey = "scry";
  export const ScryGlobalPropertyCapitalizedKey = "Scry";
  export const MetaGlobalDefaultPropertyKey = 'meta';
  export const CacheGlobalDefaultPropertyKey = 'cache';
  export const PathGlobalDefaultPropertyKeys = ['path', 'GetPath', 'getPath'];
  export const CurrentNoteGlobalDefaultPropertyKeys = ['my', 'Note', 'ThisFile'];

  export const HasPropObjectHelperFunctionKey = "hasProp";
  export const GetPropObjectHelperFunctionKey = "getProp";
  export const SetPropObjectHelperFunctionKey = "setProp";

  export const AggregateByArrayHelperFunctionKey = "aggregateBy";
  export const IndexByArrayHelperFunctionKey = "indexBy";
}

export namespace Symbols {
  export const ExtensionFilePathSeperatorCharacter = ".";
  export const ParentFolderPathSelector = "..";
  export const CurrentFolderPathSelector = ".";
  export const DefaultMarkdownFileExtension = "md";
  export const FolderPathSeperatorCharacter = "/";

  export const HeadingLevelMarkerCharachter = '#';
  export const SectionLinkSeperatorCharachter = '#';
  export const FrontmatterMarkdownSurroundingTag = "---";
  export const MarkdownWikiLinkPrefix = "[[";
  export const DataviewInlineSeperator = "::";

  export const SectionIdPartDelimiter = ":|:";
  
  export const KebabCasePropertyNameWordSeperatorCharacter = "-";
  export const EmptySpace = " ";
  export const NoCharachter = '';
}

export const DefaultPluginSettings: MetaScryPluginSettings = {
  globalCacheNames: Keys.CacheGlobalDefaultPropertyKey,
  globalMetaScryExtraNames: Keys.MetaGlobalDefaultPropertyKey,
  globalPathFunctionNames: Keys.PathGlobalDefaultPropertyKeys.join(", "),
  globalCurrentFilePropertyNames: Keys.CurrentNoteGlobalDefaultPropertyKeys.join(", "),
  defineScryGlobalVariables: true,
  defineObjectPropertyHelperFunctions: true,
  defineArrayHelperFunctions: true,
  splayKebabCaseProperties: SplayKebabCasePropertiesOptions.LowerAndCamelCase,
  splayFrontmatterWithoutDataview: true,
  prototypesPath: Paths.PrototypesFolderDefaultPath,
  valuesPath: Paths.ValuesFolderDefaultPath
}

export const DefaultFrontmatterUpdateOptions: FrontmatterUpdateSettings = {
  toValuesFile: false,
  prototype: false,
  inline: false
}

/**
 * Plugins required to enable the meta-scry plugin
 * 
 * // TODO: Test if the npm api means we don't need this actually:
 */
export const MetascryPluginHardDepencencies = [
  Keys.DataviewPluginKey
];

/**
 * Plugins that aren't required for the entire api, but parts of it.
 * Methods or features that depend on these plugins may be disabled, or may fail without them.
 * The api will not be auto-disabled without these plugins however, and you can still try to use it.
 * // TODO: The methods these are responsible for will return undefined if their plugin isn't present and a warning will be posted to the console.
 */
export const MetascryPluginSoftDepencencies = [
  Keys.MetaBindWithApiPluginKey,
  Keys.ReactComponentsPluginKey,
  // TODO:remove when it's an npm lib
  Keys.CopyToHtmlPluginKey
];

/**
 * All dependencies for this plugin.
 */
export const MetascryPluginDepencencies =
  MetascryPluginHardDepencencies
    .concat(MetascryPluginSoftDepencencies);

/** @internal*/
export const SpacesRegex = / /g;
/** @internal*/
export const KebabCaseDashesRegex = /-/g;
/** @internal*/
export const MarkdownWikiLinkRegex = new RegExp("\\[\\[(?:(?:([^\\]]*)\\|([^\\]]*))|([^\\]]*))\\]\\]", "g");
/** @internal*/
export const DataviewInlineRegex = new RegExp("\\[(?:(?:([^\\[:\\|]*)::([^\\]]*)))\\]|\\((?:(?:([^\\[:\\|]*)::([^\\]]*)))\\)", "g");
/** @internal*/
export const PropertyNameIllegalCharachtersRegex = new RegExp("(?:(^[\\d ][^{a-zA-Z_\\-}]*)|([^{a-zA-Z0-9_\\-\\\$ }]))", "g");

