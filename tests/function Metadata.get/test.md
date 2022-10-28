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
<p>{Object.keys(meta.get()).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get()).join(", ")}</p>

```

## -Expected
file, testValue, gettestfile, getTestFile, get-test-file, dataValue, testvalue, datavalue, cache

# Get from all sources from other file
## -Code
*jsx*
```jsx
<p>{Object.keys(meta.get(meta.path("test.data"))).join(", ")}</p> 
```

## -Result
```jsx:
<p>{Object.keys(meta.get(meta.path("test.data"))).join(", ")}</p> 

```


## -Expected
file, test-value, testValue, testvalue, secondstring, secondString, second-string, inline, cache

# Get Matter, Dv, and File filed but no Cache
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Metadata.DefaultSources, FileCache: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Metadata.DefaultSources, FileCache: false})).join(", ")}</p>
```

## -Expected
file, testValue, gettestfile, getTestFile, get-test-file, dataValue, testvalue, datavalue


# Get Dv, Cache, and File filed but no Matter
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Metadata.DefaultSources, Frontmatter: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Metadata.DefaultSources, Frontmatter: false})).join(", ")}</p>
```

## -Expected
file, dataValue, datavalue, cache


# Get Matter, Cahce, and File filed but no Dv
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Metadata.DefaultSources, DataviewInline: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Metadata.DefaultSources, DataviewInline: false})).join(", ")}</p>
```

## -Expected
file, testValue, gettestfile, getTestFile, get-test-file, testvalue, cache 


# Get Matter, Dv, and Cache but no File
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Metadata.DefaultSources, FileMetadata: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Metadata.DefaultSources, FileMetadata: false})).join(", ")}</p>
```

## -Expected
testValue, get-test-file, getTestFile, gettestfile, dataValue, testvalue, datavalue, cache
