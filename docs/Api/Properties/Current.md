# Metadata.Current
**property, instance, class**
Property containing an object of the `CurrentMetadata` class which is used to fetch info about the current note's metadata.
## Global Access
Accessable via: "[meta](../Globals/Metadata.md).[current](Current.md)"
## Properties
**NOTE**: The properties are accessable in caps or lower camel case so you can adapt to your desired style.
**NOTE**: The properties of this object are mostly just aliases for the `Metadata` api class's functions with default paramters.
### Data
**property, instance**
Fetches the current note's default metadata from the default sources. Same as `meta.data`.
**NOTE**: This is an alias for Metadata.[get](../Functions/get.md)();
### Note
**property, instance**
Fetches the current note's TFile.
### Path
**property, instance**
Fetches the current note's file path in the vault.
### Matter
**property, instance**
Fetches the current note's frontmatter without other metadata.
**NOTE**: This is an alias for Metadata.[frontmatter](../Functions/frontmatter.md)()
### Cache
**property, instance**
Fetches the current note's file cache without other metadata.
**NOTE**: This is an alias for Metadata.[cache](../Functions/cache.md)()