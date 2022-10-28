# CurrentMetadata.clear
**function, instance**
Used to clear values from fromtmatter. Can clear the whole file's frontmatter or just the frontmatter value of a single property. This removes it from the frontmatter entirely and does not leave an empty key.
## *Params*
- **frontmatterProperties** *(string|array(string)|object|null)* The property to remove, an array of the properties to remove, an object with the key's to remove, or null to remove the full frontmatter.
## Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/function%20CurrentMetadata.clear/test.md)*