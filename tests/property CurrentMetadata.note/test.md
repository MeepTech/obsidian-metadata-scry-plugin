# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.current.note)
```
## -Result
```dataviewjs
dv.el('p', typeof meta.current.note)
```
## -Expected
object
# Exists and is an Object (JSX)
## -Code
*jsx:*
```jsx
<p>{typeof meta.Current.Note}</p>
```
## -Result
```jsx:
<p>{typeof meta.Current.Note}</p>
```
## -Expected
object

# Contains Correct Value
## -Code
*jsx:*
```jsx
<p>{meta.current.Note.path}</p>
```
## -Result
```jsx:
<p>{meta.current.Note.path}</p>
```
## -Expected
Metadata Api/property CurrentMetadata.note/test.md