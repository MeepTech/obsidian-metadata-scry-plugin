# Exists and is a String (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.current.path)
```
## -Result
```dataviewjs
dv.el('p', typeof meta.current.path)
```
## -Expected
string
# Exists and is a String (JSX)
## -Code
*jsx:*
```jsx
<p>{typeof meta.Current.Path}</p>
```
## -Result
```jsx:
<p>{typeof meta.Current.Path}</p>
```
## -Expected
string

# Contains Correct Value
## -Code
*jsx:*
```jsx
<p>{meta.current.path}</p>
```
## -Result
```jsx:
<p>{meta.current.path}</p>
```
## -Expected
Metadata Api/property CurrentMetadata.path/test