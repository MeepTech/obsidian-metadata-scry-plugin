import { FrontmatterUpdateSettings } from "./types/editor";
import {
  MetaScryPluginSettings,
  SplayKebabCasePropertiesOption
} from "./types/plugin";

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
  export const KebabCaseWordSeperatorCharacter = "-";
  export const SectionLinkSeperatorCharachter = '#';
  export const FrontmatterMarkdownSurroundingTag = "---";
  export const SectionIdPartDelimiter = ":|:";
}

export const DefaultFrontmatterUpdateOptions: FrontmatterUpdateSettings = {
  toValuesFile: false,
  prototype: false,
  inline: false
}

/**
 * Required to enable the plugin
 */
// TODO:remove when they're npm libs
export const MetascryPluginHardDepencencies = [
  Keys.DataviewPluginKey,
];

/**
 * Plugins that aren't required for the entire api, but parts of it.
 * The methods these are responsible for will return undefined if their plugin isn't present and a warning will be posted to the console.
 */
// TODO:remove when they're npm libs
export const MetascryPluginSoftDepencencies = [
  Keys.CopyToHtmlPluginKey,
  Keys.MetaBindWithApiPluginKey
];

/**
 * Not required, doesn't limit the api, but features are added for compatibility with this plugin:
 */
// TODO:remove when they're npm libs
export const MetascryPluginCompatibleNonDepencencies = [
  Keys.ReactComponentsPluginKey
];

/**
 * All dependencies for this plugin.
 */
// TODO:remove when they're npm libs
export const MetascryPluginDepencencies =
  MetascryPluginHardDepencencies
    .concat(MetascryPluginSoftDepencencies);

export const SpacesRegex = / /g;
export const KebabCaseDashesRegex = /-/g;
export const MarkdownWikiLinkRegex = new RegExp("\\[\\[(?:(?:([^\\]]*)\\|([^\\]]*))|([^\\]]*))\\]\\]", "g");
export const DataviewInlineRegex = new RegExp("\\[(?:(?:([^\\[:\\|]*)::([^\\]]*)))\\]|\\((?:(?:([^\\[:\\|]*)::([^\\]]*)))\\)", "g");
export const PropertyNameIllegalCharachtersRegex = new RegExp("(?:(^[\\d ][^{a-zA-Z_\\-}]*)|([^{a-zA-Z0-9_\\-\\\$ }]))", "g");

export const DefaultPluginSettings: MetaScryPluginSettings = {
  globalCacheNames: Keys.CacheGlobalDefaultPropertyKey,
  globalMetaScryExtraNames: Keys.MetaGlobalDefaultPropertyKey,
  globalPathFunctionNames: Keys.PathGlobalDefaultPropertyKeys.join(", "),
  globalCurrentFilePropertyNames: Keys.CurrentNoteGlobalDefaultPropertyKeys.join(", "),
  defineScryGlobalVariables: true,
  defineObjectPropertyHelperFunctions: true,
  defineArrayHelperFunctions: true,
  splayKebabCaseProperties: SplayKebabCasePropertiesOption.LowerAndCamelCase,
  splayFrontmatterWithoutDataview: true,
  prototypesPath: Paths.PrototypesFolderDefaultPath,
  valuesPath: Paths.ValuesFolderDefaultPath
}
