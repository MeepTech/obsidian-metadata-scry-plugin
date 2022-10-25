# clear
Used to clear values from fromtmatter. Can clear the whole file's frontmatter or just the frontmatter value of a single property. This removes it from the frontmatter entirely and does not leave an empty key.
## *Params*
- file(string|TFile|null): Defaults to the current file if one isn't provided.
- frontmatterProperties(string|array(string)|object|null) The property to remove, an array of the properties to remove, an object with the key's to remove, or null to remove the full frontmatter.