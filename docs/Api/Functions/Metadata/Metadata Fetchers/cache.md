# [Metadata](../../Classes/Metadata.md).cache
**function, instance**
Fetch just the cache of the desired file without any other metadata.
## *Params*
- **file** *(Optional) (string|TFile|null)* The file to fetch the fache for. Defaults to the current file if one isn't provided.
## Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/function%20Metadata.cache/test.md)*
### Current File's Cache
*note.md (dataviewjs)* 
```dataviewjs
const currentFileCache = meta.cache();
currentFileCache["count"] = 4;
```
*note.md (jsx:)*
```jsx:
<p>{meta.cache().count}</p>
```
- Output: 4
### A different File's Cache
*note.md (dataviewjs)*
```dataviewjs
const currentCache = meta.cache("junk/otherFile");
currentCache["count"] = 10;
```
*node.md (jsx:)*
```jsx:
<p>{meta.cache("/junk/otherFile").count}</p>
```
- Output: 10