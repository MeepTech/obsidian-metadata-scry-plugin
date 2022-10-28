# [Metadata](../../Classes/Metadata.md).path
**function, instance**
Utility used to make an absolute file path from a relative one.

## Params
- **relativePath** *(string|null)* the path to the file you want from the current folder, or the rootFolder if one is provided. Defaults to the current file's path if none is provided.
- **rootFolder** *(string|null)* (optional) the root folder to work from for the relative path. This must be a folder, not a file.
## Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/function%20Metadata.path/test.md)*