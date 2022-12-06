# Defaults to current path
## -Code
```js
dv.el("p", path(""));
dv.el("p", path(null));
dv.el("p", path());
```

## -Result
```dataviewjs
dv.el("p", path(""));
dv.el("p", path(null));
dv.el("p", path());
```

## -Expected
Metadata Api/global path/test
Metadata Api/global path/test
Metadata Api/global path/test

# Get Current Folder
## -Code
```js
dv.el("p", path("./"));
```

## -Result
```dataviewjs
dv.el("p", path("./"));
```

## -Expected
Metadata Api/global path

# First Result using Default
## -Code
```js
dv.el("p", path("shared.data"));
```

## -Result
```dataviewjs
dv.el("p", path("shared.data"));
```

## -Expected
Metadata Api/shared.data

# Same Folder With ./
## -Code
```jsx
<p>{path("./test.data")}</p>;
```

## -Result
```jsx:
<p>{path("./test.data")}</p>;
```

## -Expected
Metadata Api/global path/test.data

# Parent folder With ../
## -Code
```js
dv.el("p", path("../shared.data"));
```

## -Result
```dataviewjs
dv.el("p", path("../shared.data"));
```

## -Expected
Metadata Api/shared.data

# ../../file
## -Code
```js
dv.el("p", path("../../shared.data"));
```

## -Result
```dataviewjs
dv.el("p", path("../../shared.data"));
```

## -Expected
shared.data

# ../folder/file
## -Code
```js
dv.el("p", path("../shared/data"));
```

## -Result
```dataviewjs
dv.el("p", path("../shared/data"));
```

## -Expected
Metadata Api/shared/data

# ./folder/file
## -Code
```js
dv.el("p", path("./extra/data"));
```

## -Result
```dataviewjs
dv.el("p", path("./extra/data"));
```

## -Expected
Metadata Api/global path/extra/data

# In Sub folder of current file using Default
## -Code
```js
dv.el("p", path("extra/data"));
```

## -Result
```dataviewjs
dv.el("p", path("extra/data"));
```

## -Expected
Metadata Api/global path/extra/data
