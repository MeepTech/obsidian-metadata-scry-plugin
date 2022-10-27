---
testValue: "current"
---
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

# Get other file's frontmatter via string
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

# Get other file's frontmatter via file object
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

# :
## -Code
```jsx
```

## -Result
```jsx:
```

## -Expected

# :
## -Code
```jsx
```

## -Result
```jsx:
```

## -Expected
