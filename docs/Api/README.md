# Api
The api is an object that can be used to retreive, edit, delete, and create frontmatter data, as well as other note metadata quickly and easily within any codeblock or custom javascript script files used in the [compatible plugins](../Compatibility.md).

**NOTE**: The api is built off of the js class `Metadata` in `main.ts`/`main.js`.
**NOTE**: Most of the properties of this class are accessable in caps or lower camel case so you can adapt to your desired style. This also can help with debugging.
## Global Access and Objects
There are two root global objects accessable in all contexts.
- The  [meta](Properties/Global/meta.md) Api object. (Defaults to `meta`)
- The Current Note's [Cache](Functions/MetaScryApi/Metadata%20Fetchers/cache.md) object. (Defaults to `cache`)
## Properties
**NOTE**: These properties of the [Metadata Global Object](Properties/Global/meta.md) are all read-only (get).
**NOTE**: The non-static properties are all accessable in caps or lower camel case so you can adapt to your desired style.
**Ex:**
```
meta.current === meta.Current; //these are aliases
```
**Also**:
- Instance methods will always be lower camel case
- Static properties and methods will always in caps camel case.
### Static
- [Api](Properties/MetaScryApi/Static/Api.md)
- [DefaultMetadataSources](Properties/MetaScryApi/Static/DefaultMetadataSources.md)
- [DataviewApi](Properties/MetaScryApi/Static/DataviewApi.md)
- [MetadataEditApi](Properties/MetaScryApi/Static/MetadataEditApi.md)
### Instance
- [Current](Properties/MetaScryApi/Current.md)
- [Data](Properties/MetaScryApi/Data.md)
## Methods
**NOTE**: Instance methods will always be lower camel case and Static properties and methods will always in caps camel case.
- [set](Functions/MetaScryApi/Metadata%20Updaters/set.md) 
- [patch](Functions/MetaScryApi/Metadata%20Updaters/patch.md)
- [clear](Functions/MetaScryApi/Metadata%20Updaters/clear.md)
- [get](Functions/MetaScryApi/Metadata%20Fetchers/get.md)
	- [frontmatter](Functions/MetaScryApi/Metadata%20Fetchers/frontmatter.md)
	- [cache](Functions/MetaScryApi/Metadata%20Fetchers/cache.md)
	- [prototypes](Functions/MetaScryApi/Metadata%20Fetchers/prototypes.md)
	- [values](Functions/MetaScryApi/Metadata%20Fetchers/values.md)
- [path](Functions/MetaScryApi/Utility/path.md)
### Object Property Helper Methods
This plugin api provides methods to help with accessing 'deep' properies in js objects. This is usefull for accessing metadata that you're not sure exists.

EX:
```
const {metadata} = meta.Current;

// this allows you to set a potential nickname and other metadata while defaulting to the name if that's all that was provided:
metadata.getProp("name.nickname", metadata.name);
```
#### Object Prototype Instance Methods
Instance methods added to Object.proptotype that allow quick utility for accessing and setting 'deep' properties on js objects.

**NOTE**: These are all wrappers for the Api Methods below.
**NOTE:** These instance methods are only available if the "Declare Object Property Helper Methods" option is enabled in the app's plugin settings.
- [hasProp](Functions/Object.prototype/hasProp.md)
- [getProp](Functions/Object.prototype/getProp.md)
- [setProp](Functions/Object.prototype/setProp.md)
#### Static Api Methods
These are methods on the API object that aid in checking and setting dee pproperties on objects.
- [ContainsDeepProperty](Functions/MetaScryApi/Static%20Object%20Property%20Helpers/ContainsDeepProperty.md)
- [GetDeepProperty](Functions/MetaScryApi/Static%20Object%20Property%20Helpers/GetDeepProperty.md)
- [TryToGetDeepProperty](Functions/MetaScryApi/Static%20Object%20Property%20Helpers/TryToGetDeepProperty.md)
- [SetDeepProperty](Functions/MetaScryApi/Static%20Object%20Property%20Helpers/SetDeepProperty.md)
## Examples
For many more examples please see the [Tests folder](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/tree/master/tests) in the root of the github repository.