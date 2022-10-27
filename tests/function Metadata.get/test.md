---
testValue: "get"
get-test-file: true
---
[dataValue::words]
```dataviewjs
cache["cacheValue"] = "hidden";
```

# Defaults to all sources for the current file
## -Code
```jsx
<p>{meta.get()}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get()).join(", ")}</p>

```

## -Expected
file, testValue, get-test-file, dataValue, testvalue, datavalue, cache
