This plugin can site note metadata from several sources:

# FileMetadata
*The 'file' field containing metadata about the file itself*
**source**: Dataview Api
**included in**: [get](Api/Functions/Metadata/Metadata%20Fetchers/get.md)(default), [dv](Api/Functions/Metadata/Metadata%20Fetchers/dv.md), [Data](Api/Properties/Metadata/Data.md)

# Frontmatter
*The Frontmatter (YAML at the top of a note)*
**source**: Obsidian Api or Dataview Api
**included in**: [get](Api/Functions/Metadata/Metadata%20Fetchers/get.md)(default), [frontmatter](Api/Functions/Metadata/Metadata%20Fetchers/frontmatter.md), [dv](Api/Functions/Metadata/Metadata%20Fetchers/dv.md), [Data](Api/Properties/Metadata/Data.md)

# DataviewInline
*Inline Dataview data fields*
**source**: Dataview Api
**included in**: [get](Api/Functions/Metadata/Metadata%20Fetchers/get.md)(default), [dv](Api/Functions/Metadata/Metadata%20Fetchers/dv.md), [Data](Api/Properties/Metadata/Data.md)

# FileCache
*Cached values from the Metadata.Cache. These are accessable via a 'cache' property in the returned data object.*
**source**: Metadata Api
**included in**: [get](Api/Functions/Metadata/Metadata%20Fetchers/get.md)(default), [Cache](Api/Globals/Cache.md), [cache](Api/Functions/Metadata/Metadata%20Fetchers/cache.md), [Data](Api/Properties/Metadata/Data.md)