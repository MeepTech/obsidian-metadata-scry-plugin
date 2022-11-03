---
success: true
---
# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.current.data)
```
## -Result
```dataviewjs
dv.el('p', typeof meta.current.data)
```
## -Expected
object
# Exists and is an Object (JSX)
## -Code
*jsx:*
```jsx
<p>{typeof meta.Current.Data}</p>
```
## -Result
```jsx:
<p>{typeof meta.Current.Data}</p>
```
## -Expected
object

# Contains Correct Value
## -Code
*jsx:*
```jsx
<p>{typeof meta.current.Data.success}</p>
```
## -Result
```jsx:
<p>{typeof meta.current.Data.success}</p>
```
## -Expected
boolean
# Contains File Info Metadata
## -Code
*jsx:*
```jsx
<p>{typeof meta.current.Data.file.name}</p>
```
## -Result
```jsx:
<p>{typeof meta.current.Data.file.name}</p>
```

## -Expected
string