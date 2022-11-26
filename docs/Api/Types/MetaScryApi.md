# MetaScryApi
**Interface**
Interface for interacting with all of the main functionality of the meta-scry plugin.
Implemented by the class: [[MetadataScrier]].

## Properties
- [[Plugin]] ([MetaScryPluginApi](MetaScryPluginApi.md)): Access to the plugin instance.
- [[Dv]] (DataviewApi): Quick access to the global dv api.
- [[Edit]] ([[MetaEditApi]]): Access to the metadata editing api
- [[Bind]] ([[MetaBindApi]]): Access to the meta-bind plugin api. This property is a function, and object with other more specific sub-functions as properties.
- [Current](Properties/MetaScryApi/Current.md) ([[CurrentNoteMetaScryApi]]): Access to a version of this interface but scoped specifically to the current file for easy access.
- [Data](Properties/MetaScryApi/Data.md) ([[Metadata]]): Access to all of the metadata for the current file.
- [[DefaultSources]]: ([[MetadataSources]]): Access to the default set of [Metadata Sources](../../Metadata%20Sources.md) flags.

## Methods
**NOTE**: Instance methods will always be lower camel case and Static properties and methods will always in caps camel case.
- **Data Fetchers**:
	- [get](Functions/MetaScryApi/Metadata%20Fetchers/get.md): Used to fetch Metadata from different sources.
		- [[obsidianMetadataFileCache]]: Get just the obsidian metadata file cache for a given object. This is the one obsidian uses to track the frontmatter and other file data.
		- [[sections]]: used to fetch the [[NoteSections]] object for the desired file to access it's individual heading sections.
		- [frontmatter](Functions/MetaScryApi/Metadata%20Fetchers/frontmatter.md): access just the vanilla frontmatter properties of a document
		- [cache](Functions/MetaScryApi/Metadata%20Fetchers/cache.md): get the document's metadata cache *(Native to this plugin. see [Cache](../../Concepts/Data%20Storage/Cache.md))*
		- [prototypes](Functions/MetaScryApi/Metadata%20Fetchers/prototypes.md): Used to fetch the frontmatter from [Data Prototypes](../../Concepts/Data%20Storage/Data%20Prototypes.md).
		- [values](Functions/MetaScryApi/Metadata%20Fetchers/values.md): Used to fetch the frontmatter from [Data Values](../../Concepts/Data%20Storage/Data%20Values.md).
		- [[dataviewFrontmatter]]: access to the results of frontmatter normally fetched by the dataview plugin.
	- [[vault]]: Get a file or folder's obsidian internal data from the vault
		- [[file]]: Get a file from the vault
		- [[folder]]: Get a folder from the vault
	- **Note Content Fetchers**:
		- [[markdown]]: Get the markdown contents of a given file.
		- [[html]]: Get the rendered html element resulting from a file's post-processed md contents.
		- [[text]]: Get the innerText/plain text version of the rendered html of the file.
		- [[embed]]: Used the built in obsidian embed logic to render an HTMLElement for a whole file.
* **Metadata Modifiers:**
	- [set](Functions/MetaScryApi/Metadata%20Updaters/set.md): Set ALL of the frontmatter data for a given file
	- [patch](Functions/MetaScryApi/Metadata%20Updaters/patch.md): Set specific frontmatter properties in a specific file
	- [clear](Functions/MetaScryApi/Metadata%20Updaters/clear.md): Clear specific or ALL frontmatter properties from a specific file.
	- [[globals]]:  Get or Set a global values across all of obsidian. *(WARNING DONT USE THIS IF YOU DONT KNOW WHAT YOURE DOING!)*
- **Utilities**:
	- [[sources]]: Helper to get the default MetaScryApi.get sources with any desired overrides
	- [path](Functions/MetaScryApi/Utility/path.md): Helper for finding local paths to notes.