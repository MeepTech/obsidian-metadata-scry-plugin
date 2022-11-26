# Get Sections with the Same Name
## -Code

```jsx
const [outerTestSection, innerTestSection] = meta.sections(meta.path("./test.data")).named("testSection");

<p>
  {outerTestSection.header.level !== innerTestSection.header.level ? "true" : "false"}
  {", "}
  {outerTestSection.header.level}
  {", "}
  {innerTestSection.header.level}
</p>
```

## -Result
```jsx:
const [outerTestSection, innerTestSection] = meta.sections(meta.path("./test.data")).named("testSection");

<p>
  {outerTestSection.header.level !== innerTestSection.header.level ? "true" : "false"}
  {", "}
  {outerTestSection.header.level}
  {", "}
  {innerTestSection.header.level}
</p>
```

## -Expected
true, 1, 3