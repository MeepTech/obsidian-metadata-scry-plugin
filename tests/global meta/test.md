---
testing:
 - 1
 - 2
 - 3
---
# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta)
```
## -Result
```dataviewjs
dv.el('p', typeof meta)
```
## -Expected
object
# Contains Values (JSX)
## -Code
*jsx:*
```jsx
<p>{'"' + meta.current.path + '"'}</p>
```

## -Result
```jsx:
<p>{'"' + meta.current.path + '"'}</p>
```

## -Expected
"Metadata Api/global meta/test"
# Deconstructable
## -Code
*dataviewjs*
```js
const {
   current: {
     path
   }
} = meta;

dv.el('p', path);
```
## -Result
```dataviewjs
const {
   current: {
     path
   }
} = meta;

dv.el('p', path);
```
## -Expected
Metadata Api/global meta/test
# Accessable via Static Class Api Property
## -Code
*dataviewjs*
```js
const {
   current: {
     path
   }
} = Metadata.Api;

dv.el('p', path);
```
## -Result
```dataviewjs
const {
   current: {
     path
   }
} = Metadata.Api;

dv.el('p', path);
```
## -Expected
Metadata Api/global meta/test
# Accessable via Plugin Api
## -Code
*dataviewjs*
```js
const {
   current: {
     path
   }
} = app.plugins.plugins["metadata-api"].api;

dv.el('p', path);
```
## -Result
```dataviewjs
const {
   current: {
     path
   }
} = app.plugins.plugins["metadata-api"].api;

dv.el('p', path);
```
## -Expected
Metadata Api/global meta/test
# Contains Values (Templater)
## -Code
*<% templater.inline %>*
```js
<% meta.data.testing %>
```
## -Result
<%+ meta.data.testing %>
## -Expected
1,2,3