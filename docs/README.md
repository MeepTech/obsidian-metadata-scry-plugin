# Metadata Api Plugin for Obsidian.md
- pre-alpha v0.0.0.1
**Turn your vault into a *frontend, backend, and database* all in one!**

This is a plugin for [Obsidian](https://obsidian.md) that adds JS coding tools right into your notes and codeblocks to help easily read sections, metadata, and caches of files, and also provides tools to update and edit frontmatter and other metadatas as well.

## Features
 - Create, Edit, Delete, Update, and Retreive the data of YAML/Frontmatter, Dataview, and other Metadata properties of files quickly and easily from any executable code-block, templater snippet, or custom js class file within your vault.
 - Crop, Serialize, and display individual sections from other notes.
 - Convert sections of notes or entire notes to html and plain text.
 - Store data temporatily between code-blocks in the same note using a cache or store it perminantly and between notes using special value data storage files right in your vault.
 - Utilities to easily access and set deeply nested YAML/JSON/jsObject properties.
 - Access to utilities to bind Metadata to input fields in notes.

## Warnings
- This plugin is currently in the state: ***UNRELEASED WIP***; it is not fully tested and may not yet work as described/may have unexpected bugs.
- This plugin allows you to execute arbitrary javascript and should only be used by those who know what they're doing!
- Do not paste or execute random js from the internet into your notes unless you know what it does!
- This plugin has the potential to modify and delete note metadata and frontmatter; you use this plugin at your own risk!
- You should backup your vault frequently whenever you're using plugins that can alter your notes!

## Contents
- [Dependencies and Installation](Installation.md)
- [Data Storage Solutions](Concepts/Data%20Storage/README.md)
- [Metadata Sources](Metadata%20Sources.md)
- [Metadata/Frontmatter Api](Api/README.md)
- [Configuration Options and Settings](Configuration.md)
- [Compatibility and Tested Plugins](Compatibility.md)

# Special Thanks
## Dependencies
This uses the following plugins as dependencies to work (via npm packages, you don't need them installed). 
  - [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
  - [ODP Metadata Edit Library](https://github.com/OPD-libs/OPD-libs/tree/main/libs/OPD-metadata-lib)
  - [Copy As Html](https://github.com/mvdkwast/obsidian-copy-as-html)
  - [Metadata-Bind](https://github.com/mProjectsCode/obsidian-meta-bind-plugin)

A very special thanks to them and their authors! <3