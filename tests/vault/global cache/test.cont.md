# Set In Dataview; Get in JSX Success
## -Code
*dataviewjs*
```js
cache["test"] = "test.cont";
```
*jsx*
```jsx
<p>{cache.test}</p>
```
## -Result
```dataviewjs
cache["test"] = "test.cont";
```

```jsx:
<p>{cache.test}</p>
```

## -Expected
test.cont