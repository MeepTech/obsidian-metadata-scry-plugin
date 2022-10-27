---
testValue: "current"
---
[dataValue::words]
```dataviewjs
cache["cacheValue"] = "not hidden!";
```

# Defaults to current file
## -Code
```jsx
<p>{meta.cache().cacheValue}</p>
```

## -Result
```jsx:
<p>{meta.cache().cacheValue}</p>
```

## -Expected
not hidden!

# Get other file's data via string
## -Code
```jsx
<p>{meta.cache(meta.path("test.data")).cacheValue}</p>
```

## -Result
```jsx:
<p>{meta.cache(meta.path("test.data")).cacheValue}</p>
```

## -Expected
maybe hidden?

## -Note
***Try opening the other file first.***

# Get other file's data via file object
## -Code
```js
const file = dv.page(meta.path("test.data"));
dv.el("p", meta.cache(file).cacheValue);
```

## -Result
```dataviewjs
const file = dv.page(meta.path("test.data")).file;
dv.el("p", meta.cache(file).cacheValue);
```

## -Expected
maybe hidden?

# No Other Metadata Properties
## -Code
```jsx
<>
	<p>{typeof meta.cache().current}</p>
	<p>{typeof meta.cache().dataValue}</p>
</>
```

## -Result
```jsx:
<>
	<p>{typeof meta.cache().current}</p>
	<p>{typeof meta.cache().dataValue}</p>
</>
```

## -Expected
undefined
undefined