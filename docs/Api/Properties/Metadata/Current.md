# [MetaScryApi](../../Classes/MetaScryApi.md).Current
**property, instance, class-based**
Property containing an object of the [CurrentMetaScryApi](../../Classes/CurrentMetaScryApi.md) class which is used to fetch info about the current note's metadata.
## Global Access
Accessable via: "[meta](../../Globals/meta.md).[current](Current.md)"
## Properties
**NOTE**: The properties are accessable in caps or lower camel case so you can adapt to your desired style.
**NOTE**: The properties of this object are mostly just aliases for the `Metadata` api class's functions with default paramters.
### Data
**property, instance**
Fetches the current note's default metadata from the default sources. Same as `meta.data`.
**NOTE**: This is an alias for Metadata.[get](../../Functions/MetaScryApi/Metadata%20Fetchers/get.md)();
### Note
**property, instance**
Fetches the current note's TFile.
### Path
**property, instance**
Fetches the current note's file path in the vault.
### Matter
**property, instance**
Fetches the current note's frontmatter without other metadata.
**NOTE**: This is an alias for Metadata.[frontmatter](../../Functions/MetaScryApi/Metadata%20Fetchers/frontmatter.md)()
### Cache
**property, instance**
Fetches the current note's file cache without other metadata.
**NOTE**: This is an alias for Metadata.[cache](../../Functions/MetaScryApi/Metadata%20Fetchers/cache.md)()