# Same Folder using Default
## -Code
```js
dv.el("p", meta.path("tests.extra"));
```

## -Result
```dataviewjs
dv.el("p", meta.path("tests.extra"));
```

## -Expected
Metadata Api/function Metadata.path/tests.extra

# Same Folder With ./
## -Code
```jsx
<p>{meta.path("./tests.extra")}</p>;
```

## -Result
```jsx:
<p>{meta.path("./tests.extra")}</p>;
```

## -Expected
Metadata Api/function Metadata.path/tests.extra

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
