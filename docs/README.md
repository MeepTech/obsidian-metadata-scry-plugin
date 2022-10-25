# Metadata Api Plugin for Obsidian.md
- v0.1(alpha)
This is a plugin for [Obsidian](https://obsidian.md) that adds tools to help easily read and update frontmatter and other metadata.
## Features
 - Create, Edit, Delete, Update, and Retreive the data of YAML/Frontmatter, Dataview, and other Metadata properties of files quickly and easily from any executable code-block, templater snippet, or custom js class file within your vault.
 - Store data temporatily between code-blocks in the same note using a cache or store it perminantly and between notes using special value data storage files right in your vault.
 - Utilities to easily access and set deeply nested YAML/JSON/jsObject properties.
## Warnings
- This plugin is currently in the state: ***UNRELEASED WIP***; it is not fully tested and may not yet work as described/may have unexpected bugs.
- This plugin allows you to execute arbitrary javascript and should only be used by those who know what they're doing!
- Do not paste or execute random js from the internet into your notes unless you know what it does!
- This plugin has the potential to modify and delete note metadata and frontmatter; you use this plugin at your own risk!
- You should backup your vault frequently whenever you're using plugins that can alter your notes!
## Contents
- [Dependencies and Installation](Installation.md)
- [Data Storage Solutions](Data%20Storage/README.md)
- [Metadata/Frontmatter Api](Api/README.md)
- [Configuration Options and Settings](Configuration.md)
- [Compatibility and Tested Plugins](Compatibility.md)