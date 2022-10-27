# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.current.cache)
```
## -Result
```dataviewjs
dv.el('p', typeof meta.current.cache)
```
## -Expected
object
# Exists and is an Object (JSX)
## -Code
*jsx:*
```jsx
<p>{typeof meta.Current.Cache}</p>
```
## -Result
```jsx:
<p>{typeof meta.Current.Cache}</p>
```
## -Expected
object
# Can Get and Set Value
## -Code
*dataviewjs*
```js
const {Cache} = meta.current;
Cache["b"] = 2;
```
*jsx*
```jsx
<p>{meta.current.cache["b"]}</p>
```
## -Result
```dataviewjs
const {Cache} = meta.current;
Cache["b"] = 2;
```

```jsx:
<p>{meta.current.cache["b"]}</p>
```
## -Expected
2