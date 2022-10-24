# Obsidian Sample Plugin

This is a plugin for [Obsidian](https://obsidian.md) that adds tools to help easily read and update frontmatter and other metadata.

## Installation

## Dependencies
This plugin requires the following Obsidian plugins to be installed as dependencies prior to being activated:
  - [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
  - [MetaEdit](https://github.com/chhoumann/MetaEdit)

## Plugin Installation
After the above dependencies have been installed, you can install this plugin via the Obsidian Community Plugins menu, or manually.

### Manual Installation
To manually install this plugin, copy the `manifest.json` and `main.js` from the release you want and add them to a new plugin folder named `metadata-api` within your `.obsidian` folder of your Vault.

## Api

### Global Access

#### Metadata
You can access the full api via the global variable: `meta`, via the standards js app api path, or via one of the `.Instance` properties on either the `Metadata` or `MetadataApiPlugin` classes:
```
const {
  Current: metadata,
  CurrentMatter: frontmatter,
  CurrentCache: cache
} = meta;

// or

const {
  Current: metadata,
  CurrentMatter: frontmatter,
  CurrentCache: cache
} = app.plugins.plugins["metadata-api"].api;

// or

const {
  Current: metadata,
  CurrentMatter: frontmatter,
  CurrentCache: cache
} = Metadata.Instance;

// or 

const {
  Current: metadata,
  CurrentMatter: frontmatter,
  CurrentCache: cache
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
  CurrentCache: {
    name
  }
} = meta;
```
**NOTE**: The names of these two global variables can be changed in the settings.

### Properties

#### Instance
***Static**: The singleton instance of the Metadata api object.

#### DefaultMetadataSources
The default Metadata Sources used in the Get Method.

#### DataviewApi
The dataview api.

#### MetaeditApi
The metaedit api.

#### Current
Fetches the current note's default metadata.

#### CurrentNote
Fetches the current note's TFile.

#### CurrentPath
Fetches the current note's file path in the vault.

#### CurrentMatter
Fetches the current note's frontmatter without other metadata.

#### CurrentCache
Fetches the current note's file cache without other metadata.

### Methods

#### Get

#### Set

#### Patch

#### Clear

#### Frontmatter
Fetch just the frontmatter of the desired file without any other metadata.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.

#### Cache
Fetch just the cache of the desired file without any other metadata.

*Params*:
- file(string|TFile|null): Defaults to the current file if one isn't provided.

#### Prototypes
Fetch prototypes from a Prototype Data Storage File

*Params*:
- prototypePath(string)

#### Data
Fetch data from a Data Storage File

*Params*:
- prototypePath(string)

#### Object Property Helper Methods

##### Object Instance Methods

###### hasProp

###### getProp

###### setProp

##### Api Methods

###### ContainsDeepProperty

###### GetDeepProperty

###### TryToGetDeepProperty

###### SetDeepProperty

### Data Storage

#### Cache
The cache is designed to work between different types of codeblocks in the same file. This allows you to store custom js values easily between codeblocks in the same note without needing to modify global state yourself!

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

#### Data Prototypes

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