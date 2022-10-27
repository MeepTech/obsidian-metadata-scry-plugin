---
success: true
---
# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.data)
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
<p>{typeof meta.Data}</p>
```
## -Result
```jsx:
<p>{typeof meta.Data}</p>
```
## -Expected
object

# Contains Correct Value
## -Code
*jsx:*
```jsx
<p>{typeof meta.Data.success}</p>
```
## -Result
```jsx:
<p>{typeof meta.Data.success}</p>
```
## -Expected
boolean