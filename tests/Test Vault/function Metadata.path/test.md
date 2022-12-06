# Defaults to current path
## -Code
```js
dv.el("p", meta.path(""));
dv.el("p", meta.path(null));
dv.el("p", meta.path());
```

## -Result
```dataviewjs
dv.el("p", meta.path(""));
dv.el("p", meta.path(null));
dv.el("p", meta.path());
```

## -Expected
Metadata Api/function Metadata.path/test
Metadata Api/function Metadata.path/test
Metadata Api/function Metadata.path/test

# Get Current Folder
## -Code
```js
dv.el("p", meta.path("./"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("./"));
```

## -Expected
Metadata Api/function Metadata.path

# First Result using Default
## -Code
```js
dv.el("p", meta.path("shared.data"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("shared.data"));
```

## -Expected
Metadata Api/shared.data

# Same Folder With ./
## -Code
```jsx
<p>{meta.path("./test.data")}</p>;
```

## -Result
```jsx:
<p>{meta.path("./test.data")}</p>;
```

## -Expected
Metadata Api/function Metadata.path/test.data

# Parent folder With ../
## -Code
```js
dv.el("p", meta.path("../shared.data"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("../shared.data"));
```

## -Expected
Metadata Api/shared.data

# ../../file
## -Code
```js
dv.el("p", meta.path("../../shared.data"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("../../shared.data"));
```

## -Expected
shared.data

# ../folder/file
## -Code
```js
dv.el("p", meta.path("../shared/data"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("../shared/data"));
```

## -Expected
Metadata Api/shared/data

# ./folder/file
## -Code
```js
dv.el("p", meta.path("./extra/data"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("./extra/data"));
```

## -Expected
Metadata Api/function Metadata.path/extra/data

# In Sub folder of current file using Default
## -Code
```js
dv.el("p", meta.path("extra/data"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("extra/data"));
```

## -Expected
Metadata Api/function Metadata.path/extra/data
