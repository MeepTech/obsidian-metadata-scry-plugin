# CurrentMetadata.patch
**function, instance**
Patch/update individual frontmatter properties of the current file.
## *Params*
- **frontmatterData** *(object|any)* The properties and values to patch. This can be used to patch properties multiple keys deep as well (ex: "name.first"). If a value is also provided to the propertyName parameter: then this entire object/value is set to that single property key instead.
- **propertyName** *(Optional)(string|null)* If you want to set the entire frontmatterData parameter value to a single property, specify the name of that property here. Otherwise, leave this unset/null so the property keys in frontmatterData are used instead.