---
testValue: "current"
---
[dataValue::words]
```dataviewjs
cache["cacheValue"] = "hidden";
```

# Defaults to current file
## -Code
```jsx
<p>{meta.dvMatter().dataValue}</p>
```

## -Result
```jsx:
<p>{meta.dvMatter().dataValue}</p>
```

## -Expected
words

# Get other file's data via string
## -Code
```jsx
<p>{meta.frontmatter(meta.path("./test.data")).testValue}</p>
```

## -Result
```jsx:
<p>{meta.frontmatter(meta.path("./test.data")).testValue}</p>
```

## -Expected
other

# Get other file's data via file object
## -Code
```js
const file = dv.page(meta.path("./test.data"));
dv.el("p", meta.frontmatter(file).testValue);
```

## -Result
```dataviewjs
const file = dv.page(meta.path("./test.data")).file;
dv.el("p", meta.frontmatter(file).testValue);
```

## -Expected
other

# File Property exists and is Object
## -Code
```jsx
<p>{typeof meta.dvMatter().file}</p>
```

## -Result
```jsx:
<p>{typeof meta.dvMatter().file}</p>
```

## -Expected
object

# No 'cache' Property
## -Code
```jsx
<p>{typeof meta.dvMatter().cache}</p>
```

## -Result
```jsx:
<p>{typeof meta.dvMatter().cache}</p>
```

## -Expected
undefined