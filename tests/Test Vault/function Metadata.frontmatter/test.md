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
<p>{meta.frontmatter().testValue}</p>
```

## -Result
```jsx:
<p>{meta.frontmatter().testValue}</p>
```

## -Expected
current

# Get other file's data via string
## -Code
```jsx
<p>{meta.frontmatter("Metadata Api/function Metadata.frontmatter/test.data").testValue}</p>
```

## -Result
```jsx:
<p>{meta.frontmatter("Metadata Api/function Metadata.frontmatter/test.data").testValue}</p>
```

## -Expected
other

# Get other file's data via file object
## -Code
```js
const file = dv.page("Metadata Api/function Metadata.frontmatter/test.data");
dv.el("p", meta.frontmatter(file).testValue);
```

## -Result
```dataviewjs
const file = dv.page("Metadata Api/function Metadata.frontmatter/test.data").file;
dv.el("p", meta.frontmatter(file).testValue);
```

## -Expected
other

# No Inline Dataview Values
## -Code
```jsx
<p>{typeof meta.frontmatter().dataValue}</p>
```

## -Result
```jsx:
<p>{typeof meta.frontmatter().dataValue}</p>
```

## -Expected
undefined

# No 'file' Property
## -Code
```jsx
<p>{typeof meta.frontmatter().file}</p>
```

## -Result
```jsx:
<p>{typeof meta.frontmatter().file}</p>
```

## -Expected
undefined

# No 'cache' Property
## -Code
```jsx
<p>{typeof meta.frontmatter().cache}</p>
```

## -Result
```jsx:
<p>{typeof meta.frontmatter().cache}</p>
```

## -Expected
undefined