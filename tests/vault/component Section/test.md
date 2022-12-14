# Resolve Section As Md/default
## -Code
```jsx
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section data={initialSection}/>
</>
```

## -Result
```jsx:
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section data={initialSection}/>
</>
```

## -Expected
**bold** text

# Resolve Section As Txt
## -Code
```jsx
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section data={initialSection} mode="txt"/>
</>
```

## -Result

```jsx:
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section data={initialSection} mode="txt"/>
</>
```

## -Expected
bold text

# Resolve Section As Html
## -Code
```jsx
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section data={initialSection} mode="html"/>
</>
```

## -Result
```jsx:
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section data={initialSection} mode="html"/>
</>
```

## -Expected
**bold** text

# Resolve Section With Custom Renderer
## -Code
```jsx
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section 
    data={initialSection}
    mode={"txt"}
    renderer={(s, r) => 
      <i>{r}</i>} />
</>
```

## -Result
```jsx:
const dataFilePath = path("./test.data");
const {
  initialSection
} = meta.sections(dataFilePath);

<>
  <Scry.Section 
    data={initialSection}
    mode={"txt"}
    renderer={(s, r) => 
      <i>{r}</i>} />
</>
```


## -Expected
*bold text*