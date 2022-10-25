# Metadata.get
**function, instance**
Get the metadata for a given file from the requested sources (fromtmatter, dataview, cache, etc).
## *Params*
- **file** *(string|TFile|null)* Defaults to the current file if one isn't provided.
- **sources** *(Optional) (MetadataSources|boolean)* Defaults to DefaultMetadataSources. If a boolean is provided, all options in MetadataSources are treated as that boolean.