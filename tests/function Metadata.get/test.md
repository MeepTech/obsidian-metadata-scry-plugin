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
file, testValue, gettestfile, getTestFile, get-test-file, dataValue, testvalue, datavalue, File, cache

# Get from all sources from other file
## -Code
*jsx*
```jsx
<p>{Object.keys(meta.get(meta.path("./test.data"))).join(", ")}</p> 
```

## -Result
```jsx:
<p>{Object.keys(meta.get(meta.path("./test.data"))).join(", ")}</p> 

```


## -Expected
file, test-value, testValue, testvalue, secondstring, secondString, second-string, inline, File, cache

# Get Matter, Dv, Sections, and File filed but no Cache
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...scry.defaultSources, Cache: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...scry.defaultSources, Cache: false})).join(", ")}</p>
```

## -Expected
file, testValue, gettestfile, getTestFile, get-test-file, dataValue, testvalue, datavalue, File


# Get Dv, Cache, Sections, and File filed but no Matter
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Scry.DefaultSources, Frontmatter: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...scry.sources({Frontmatter: false})})).join(", ")}</p>
```

## -Expected
file, dataValue, datavalue, File, cache


# Get Matter, Cahce, Sections, and File filed but no Dv
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Scry.DefaultSources, DataviewInline: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Scry.DefaultSources, DataviewInline: false})).join(", ")}</p>
```

## -Expected
file, testValue, gettestfile, getTestFile, get-test-file, testvalue, File, cache 


# Get Matter, Dv, Sections, and Cache but no File
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Scry.DefaultSources, FileInfo: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Scry.DefaultSources, FileInfo: false})).join(", ")}</p>
```

## -Expected
testValue, get-test-file, getTestFile, gettestfile, dataValue, testvalue, datavalue, cache, file, File

# Get Matter, Dv, Sections, and Cache but no File (file only has sections)
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Scry.DefaultSources, FileInfo: false}).file).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Scry.DefaultSources, FileInfo: false}).file).join(", ")}</p>
```

## -Expected
Sections, sections


# Get Matter, Dv, and Cache but no File or Sections
## -Code

```jsx
<p>{Object.keys(meta.get(sources: {...Scry.DefaultSources, FileInfo: false, Sections: false})).join(", ")}</p>
```

## -Result
```jsx:
<p>{Object.keys(meta.get(null, {...Scry.DefaultSources, FileInfo: false, Sections: false})).join(", ")}</p>
```

## -Expected
testValue, get-test-file, getTestFile, gettestfile, dataValue, testvalue, datavalue, cache
