# Data Prototypes
This plugin provides a system for storing easily accessable data in specific files via YAML using Data Values. It also supports storing prototypes/metadata in a seperate repository for convenience. This functionality is pretty much dientical to the Data Values functionality above, but with a seperate filesystem and access function.

You can set the Data Prototypes Path in the Data Storage Settings in the Obsidian app plugin settings to point to a specific folder. This folder will be assumed to have `.md` files containing YAML data.

You can instantly access these YAML files as objects using the `prototypes` method of the API described above, and edit them using the `prototype` property of the Patch, Set, and Clear methods described above.