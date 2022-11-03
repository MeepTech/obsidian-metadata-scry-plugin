# Get Sections with the Same Name
## -Code

```jsx
const [outerTestSection, innerTestSection] = meta.sections(meta.path("test.data")).named("testSection");

<p>
  {outerTestSection.level !== innerTestSection.level ? "true" : "false"}
  {", "}
  {outerTestSection.level}
  {", "}
  {innerTestSection.level}
</p>
```

## -Result
```jsx:
const [outerTestSection, innerTestSection] = meta.sections(meta.path("test.data")).named("testSection");

<p>
  {outerTestSection.level !== innerTestSection.level ? "true" : "false"}
  {", "}
  {outerTestSection.level}
  {", "}
  {innerTestSection.level}
</p>
```

## -Expected
true, 1, 3