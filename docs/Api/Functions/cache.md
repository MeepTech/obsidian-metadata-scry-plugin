# Metadata.cache
**function, instance**
Fetch just the cache of the desired file without any other metadata.
## *Params*
- file(string|TFile|null): (Optional) The file to fetch the fache for. Defaults to the current file if one isn't provided.
## Examples
### Current File's Cache
*note.md*
```dataviewjs
const currentFileCache = meta.cache();
currentFileCache["count"] = 4;
```
*note.md*
```jsx:
<p>{meta.cache().count}</p>
```
- Output: 4
### A different File's Cache
*note.md*
```dataviewjs
const currentCache = meta.cache("junk/otherFile");
currentCache["count"] = 10;
```
*node.md*
```jsx:
<p>{meta.cache("/junk/otherFile").count}</p>
```
- Output: 10