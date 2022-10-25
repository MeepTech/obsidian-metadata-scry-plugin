## Compatibility
Tested and working in the following codeblocks/scripts:
  - [dataviewjs](https://github.com/blacksmithgu/obsidian-dataview)
  - [jsx](https://github.com/elias-sundqvist/obsidian-react-components)
  - [customJS](https://github.com/saml-dev/obsidian-custom-js)'s class defenition files. (**NOTE**: the cache is not officially supported in these files.)
  - [templater](https://github.com/SilentVoid13/Templater)
  - [Inline Scripts](https://github.com/jon-heard/obsidian-inline-scripts)
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
# Full Name
'``jsx:
<p>{cache.fullName}</p>
'``
```