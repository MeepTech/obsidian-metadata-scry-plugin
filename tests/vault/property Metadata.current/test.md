# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.current)
```
## -Result
```dataviewjs
dv.el('p', typeof meta)
```
## -Expected
object
# Exists and is an Object (JSX)
## -Code
*jsx:*
```jsx
<p>{typeof meta.Current}</p>
```
## -Result
```jsx:
<p>{typeof meta.Current}</p>
```
## -Expected
object