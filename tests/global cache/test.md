# Set in Dataview via Global; Get in JSX via Global Success
## -Code
*dataviewjs*
```js
cache["test"] = "test";
```
*jsx:*
```jsx
<p>{cache.test}</p>
```
## -Result
```dataviewjs
cache["test"] = "test";
```

```jsx:
<p>{cache.test}</p>
```

## -Expected
test
# Set In Dataview via Static; Get in JSX via Global Success
## -Code
*dataviewjs*
```js
const {
  current: {
    Cache
  }
} = meta;

Cache["second"] = "abc";
```
*jsx:*
```jsx
<p>{cache["second"]}</p>
```
## -Result
```dataviewjs
const {
  current: {
    Cache
  }
} = meta;

Cache["second"] = "abc";
```

```jsx:
<p>{cache["second"]}</p>
```

## -Expected
abc