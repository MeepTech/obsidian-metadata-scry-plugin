# Api
The api is built off of the class `Metadata` in `main.ts`/`main.js`.
**NOTE**: Most of the properties of this class are accessable in caps or lower camel case so you can adapt to your desired style.
## Global Access
- *See: [Metadata](Globals/Metadata.md)*
- *See: [cache](Functions/cache.md)*
## Properties
**NOTE**: The non-static properties are accessable in caps or lower camel case so you can adapt to your desired style.
 
Ex:
```
meta.current === meta.Current;
```
- Instance methods will always be lower camel case
- Static properties and methods will always in caps camel case.
### Static
- [Instance](Properties/Instance.md)
- [DefaultMetadataSources](Properties/DefaultMetadataSources.md)
- [DataviewApi](Properties/DataviewApi.md)
- [MetaeditApi](Properties/MetaeditApi.md)
### Instance
- [Current](Properties/Current.md)
- [Data](Properties/Data.md)
## Methods
**NOTE**: Instance methods will always be lower camel case and Static properties and methods will always in caps camel case.
- [set](Functions/set.md) 
- [patch](Functions/patch.md)
- [clear](Functions/clear.md)
- [get](Functions/get.md)
	- [frontmatter](Functions/frontmatter.md)
	- [cache](Functions/cache.md)
	- [prototypes](Functions/prototypes.md)
	- [values](Functions/values.md)
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
- [hasProp](Object%20Prototype%20Instance%20Methods/hasProp.md)
- [getProp](Object%20Prototype%20Instance%20Methods/getProp.md)
- [setProp](Object%20Prototype%20Instance%20Methods/setProp.md)
#### Static Api Methods
These are methods on the API object that aid in checking and setting dee pproperties on objects.
- [ContainsDeepProperty](Static%20Api%20Methods/ContainsDeepProperty.md)
- [GetDeepProperty](Static%20Api%20Methods/GetDeepProperty.md)
- [TryToGetDeepProperty](Static%20Api%20Methods/TryToGetDeepProperty.md)
- [SetDeepProperty](Static%20Api%20Methods/SetDeepProperty.md)