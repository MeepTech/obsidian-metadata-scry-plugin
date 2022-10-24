# Metadata Api for Obsidian
This is a plugin for [Obsidian](https://obsidian.md) that adds tools to help easily read and update frontmatter and other metadata.

## Installation
### Dependencies
This plugin requires the following Obsidian plugins to be installed as dependencies prior to being activated:
  - [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
  - [MetaEdit](https://github.com/chhoumann/MetaEdit)

### Plugin Installation
After the above dependencies have been installed, you can install this plugin via the Obsidian Community Plugins menu, or manually.

#### Manual Installation
To manually install this plugin, copy the `manifest.json` and `main.js` from the release you want and add them to a new plugin folder named `metadata-api` within your `.obsidian` folder of your Vault.

## Api
The api is built off of the class `Metadata` in `main.ts`/`main.js`.
**NOTE**: Most of the properties of this class are accessable in caps or lower camel case so you can adapt to your desired style.

### Global Access
#### Metadata
You can access the full api via the global variable: `meta`, via the standards js app api path, or via one of the `.Instance` properties on either the `Metadata` or `MetadataApiPlugin` classes:
```
const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = meta;

// or

const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = app.plugins.plugins["metadata-api"].api;

// or

const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = Metadata.Api;

// or 

const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = MetadataPluginApi.Instance;
```

#### Cache
You can also access the current file's cache via the global variable `cache`:
```
// set:
cache["name"] = "tim";
cache["color"] = "blue";

// get:
const {
  name
} = cache;

//   or:
const {
  Current: {
    Cache: {
      name
    }
  }
} = meta;
```
**NOTE**: The names of these two global variables can be changed in the settings.

### Properties
**NOTE**: The non-static properties are accessable in caps or lower camel case so you can adapt to your desired style.
 
Ex:
```
meta.current === meta.Current;
```
- Instance methods will always be lower camel case
- Static properties and methods will always in caps camel case.

#### Instance
***Static**: The singleton instance of the Metadata api object.

#### DefaultMetadataSources
***Static**: The default Metadata Sources used in the Get Method.

#### DataviewApi
***Static**: The dataview api.

#### MetaeditApi
***Static**: The metaedit api.

#### Current
Sub-class used to fetch info about the current note's metadata.

##### Current.Data
Fetches the current note's default metadata from the default sources. Same as `meta.data`.

##### Current.Note
Fetches the current note's TFile.

##### Current.Path
Fetches the current note's file path in the vault.

##### Current.Matter
Fetches the current note's frontmatter without other metadata.

##### Current.Cache
Fetches the current note's file cache without other metadata.

#### Data
Fetches the current note's default metadata from the default sources.

### Methods
**NOTE**: Instance methods will always be lower camel case and Static properties and methods will always in caps camel case.

#### get
Get the metadata for a given file from the requested sources (fromtmatter, dataview, cache, etc).

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.
- sources(Optional)(MetadataSources|boolean) Defaults to DefaultMetadataSources. If a boolean is provided, all options in MetadataSources are treated as that boolean.

#### set
Replace the existing frontmatter of a file entirely with the provided object's properties and values.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.
- frontmatterData(object) The properties and values to set. 

#### patch
Patch/update individual frontmatter properties of a file.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.
- frontmatterData(object|any) The properties and values to patch. This can be used to patch properties multiple keys deep as well (ex: "name.first"). If a value is also provided to the propertyName parameter: then this entire object/value is set to that single property key instead.
- propertyName(Optional)(string|null) If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here. Otherwise, leave this unset/null so the property keys in frontmatterData are used instead.

#### clear
Used to clear values from fromtmatter. Can clear the whole file's frontmatter or just the frontmatter value of a single property. This removes it from the frontmatter entirely and does not leave an empty key.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.
- frontmatterProperties(string|array(string)|object|null) The property to remove, an array of the properties to remove, an object with the key's to remove, or null to remove the full frontmatter.

#### frontmatter
Fetch just the frontmatter of the desired file without any other metadata.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.

#### cache
Fetch just the cache of the desired file without any other metadata.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.

#### prototypes
Fetch prototypes from a Prototype Data Storage File

*Params*:
- prototypePath(string)

#### values
Fetch data from a Data Values Storage File

*Params*:
- prototypePath(string)

#### Object Property Helper Methods
This plugin api provides methods to help with accessing 'deep' properies in js objects. This is usefull for accessing metadata that you're not sure exists.
EX:
```
const {metadata} = meta.Current;

// this allows you to set a potential nickname and other metadata while defaulting to the name if that's all that was provided:
metadata.getProp("name.nickname", metadata.name);
```

##### Object Instance Methods
Instance methods added to Object.proptotype that allow quick utility for accessing and setting 'deep' properties on js objects.

**NOTE**: These are all wrappers for the Api Methods below.
**NOTE:** These instance methods are only available if the "Declare Object Property Helper Methods" option is enabled in the app's plugin settings.

###### hasProp
Check if an object has a deep property. Returns true if it does. Optional callback available as well for on true and on false.

**NOTE**: This is a wrapper for TryToGetDeepProperty and ContainsDeepProperty.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- thenDo (Optional)({onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]) A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.

###### getProp
Get a deep property from an object, or return null.

**NOTE**: This is a wrapper for GetDeepProperty.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- defaultValue (any|function) The default value to use if this value wasn't found. If a function is passed in it will be called to fetch the value.

###### setProp
Set a deep property in an object, even if it doesn't exist.

**NOTE**: This is a wrapper for GetDeepProperty.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- value (any) The value to set.

##### Api Methods
These are methods on the API object that aid in checking and setting dee pproperties on objects.

###### ContainsDeepProperty
Find a deep property in an object. Returning true if it's found.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- onObject (object) The object containing the desired key

###### GetDeepProperty
Get a deep property in an object, null if not found.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- fromObject (object) The object containing the desired key

###### TryToGetDeepProperty
Try to find a deep property in an object. Returning true if it's found and executing the appropriate callback.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- thenDo ({onTrue:function(object), onFalse:function()}|function(object)|[function(object), function()]) A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
- fromObject (object) The object containing the desired key

###### SetDeepProperty
Set a deep property in an object, even if it doesn't exist.

*Params*:
- propertyPath (string|array(string)) Array of keys, or dot seperated propery key string.
- value (any) The value to set
- onObject (object) The object containing the desired key

### Data Storage
This plugin comes with several super simple data storage and retreival solutions to aid in creating things like enumerations, prototypes, data tables, and archetypes.

#### Cache
Each file has it's own cache object.
This cache is designed to work between different types of codeblocks within the same note. This allows you to store custom js values easily between codeblocks in the same note without needing to modify global state yourself!

**NOTE**: This cache is not a consistent data storage system and only exists in-memory. This means it may be cleared or re-set when you close the note or close or refeesh the Obsidian app.

EX: 
```
---
name:
  first: John
  last: Madden
---
'``dataview
const {
  name {
    first: firstName,
    last: lastName
  }
} = meta.Current;

cache["fullName"] = `${firstName} ${lastName}`;
'``
# Full Name
'``jsx:
<p>{cache.fullName}</p>
'``
```

#### Data Values
This plugin provides a system for storing easily accessable data in specific files via YAML.

You can set the Data Values Path in the Data Storage Settings in the Obsidian app plugin settings to point to a specific folder. This folder will be assumed to have `.md` files containing YAML data.

You can instantly access these YAML files as objects using the `values` method of the API described above, and edit them using the `toDataFile` property of the Patch, Set, and Clear methods described above.

#### Data Prototypes
This plugin provides a system for storing easily accessable data in specific files via YAML using Data Values. It also supports storing prototypes/metadata in a seperate repository for convenience. This functionality is pretty much dientical to the Data Values functionality above, but with a seperate filesystem and access function.

You can set the Data Prototypes Path in the Data Storage Settings in the Obsidian app plugin settings to point to a specific folder. This folder will be assumed to have `.md` files containing YAML data.

You can instantly access these YAML files as objects using the `prototypes` method of the API described above, and edit them using the `prototype` property of the Patch, Set, and Clear methods described above.

## Configuration

### Global Names

### Declare Object Property Helper Methods?

### Data Storage Settings

## Compatibility
Tested and working in the following codeblocks:
  - [dataviewjs](https://github.com/blacksmithgu/obsidian-dataview)
  - [jsx](https://github.com/elias-sundqvist/obsidian-react-components)

**NOTE**: The cache is designed to work between different types of codeblocks in the same file.
EX: 
```
'``dataview
const {
  name {
    first: firstName,
    last: lastName
  }
} = meta.Current;

cache["fullName"] = `${firstName} ${lastName}`;
'``

'``jsx:
<p>{cache.fullName}</p>
'``
```