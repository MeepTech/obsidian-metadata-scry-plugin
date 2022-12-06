---
test: "A"
---
# Exists and is an Object (dataviewjs)
## -Code
*dataviewjs*
```js
dv.el('p', typeof meta.current.matter)
```
## -Result
```dataviewjs
dv.el('p', typeof meta.current.matter)
```
## -Expected
object

# Exists and is an Object (JSX)
## -Code
*jsx:*
```jsx
<p>{typeof meta.Current.Matter}</p>
```

## -Result
```jsx:
<p>{typeof meta.Current.Matter}</p>
```

## -Expected
object

# Contains Correct Value
## -Code
*jsx:*
```jsx
<p>{typeof meta.current.Matter.test}</p>
```

## -Result
```jsx:
<p>{typeof meta.current.Matter.test}</p>
```

## -Expected
string
# Lacks File Info Metadata
## -Code
*jsx:*
```jsx
<p>{typeof meta.current.Matter.file}</p>
```

## -Result
```jsx:
<p>{typeof meta.current.Matter.file}</p>
```

## -Expected
undefined