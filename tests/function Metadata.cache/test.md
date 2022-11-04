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
<p>{meta.cache(meta.path("./test.data")).cacheValue}</p>
```

## -Result
```jsx:
<p>{meta.cache(meta.path("./test.data")).cacheValue}</p>
```

## -Expected
maybe hidden?

## -Note
***Try opening the other files first.***

# Get other file's data via file object
## -Code
```js
const file = dv.page(meta.path("./test.data", true));
dv.el("p", meta.cache(file).cacheValue);
```

## -Result
```dataviewjs
const file = dv.page(meta.path("./test.data", true)).file;
dv.el("p", meta.cache(file).cacheValue);
```

## -Expected
maybe hidden?

## -Note
***Try opening the other files first.***

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

# Multiple if folder provided
## -Code
```jsx
const folder = meta.path("./");
const caches = meta.cache(folder);

<p>
  {JSON.stringify(caches)}
</p>
```

## -Result
```jsx:
const folder = meta.path("./");
const caches = meta.cache(folder);

<p>
  {JSON.stringify(caches)}
</p>
```

## -Expected
[{"dataValue":"super hidden :O"},{"extraValue":"extra hidden!"},{"cacheValue":"maybe hidden?"},{"cacheValue":"not hidden!"}]

## -Note
***Try opening the other files first.***
