# Data Values
This plugin provides a system for storing easily accessable data in specific files via YAML.

You can set the Data Values Path in the Data Storage Settings in the Obsidian app plugin settings to point to a specific folder. This folder will be assumed to have `.md` files containing YAML data.

You can instantly access these YAML files as objects using the `values` method of the API described above, and edit them using the `toDataFile` property of the Patch, Set, and Clear methods described above.