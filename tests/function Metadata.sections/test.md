# Exists and is an object
## -Code
```js
dv.el("p", typeof meta.sections(meta.path("./test.data")));
```
## -Result
```dataviewjs
dv.el("p", typeof meta.sections(meta.path("test.data")));
```

## -Expected
object

# Current File is Correct
## -Code
```js
dv.el("p", meta.sections(meta.path()).count);
```
## -Result
```dataviewjs
dv.el("p", meta.sections(meta.path()).count);
```

## -Expected
24

# Correct Number of Sections
## -Code
```js
dv.el("p", meta.sections(meta.path("./test.data")).count);
```
## -Result
```dataviewjs
dv.el("p", meta.sections(meta.path("./test.data")).count);
```

## -Expected
7

# Correct Section Keys as properties
#retest
## -Code
```js
dv.el("p", Object.keys(meta.sections(meta.path("./test.data"))).join(", "));
```
## -Result
```dataviewjs
dv.el("p", Object.keys(meta.sections(meta.path("./test.data"))).join(", "));
```

## -Expected
all, path, count, Test-Section, test-section, test-Section, testsection, testSection, TestSection, Test Section 2, testsection2, TestSection2, testSection2

# Get Sections with the Same Name Via Deconstruction (Exists)
## -Code

```jsx
const {
  testSection: outerTestSection,
  testSection2: {
    withdata9: {
	    testSection: innerTestSection
    }
  }
} = meta.sections(meta.path("./test.data"));

<p>{outerTestSection && innerTestSection ? "true" : "false"}</p>
```

## -Result
```jsx:
const {
  testSection: outerTestSection,
  testSection2: {
    withdata9: {
	    testSection: innerTestSection
    }
  }
} = meta.sections(meta.path("./test.data"));

<p>{outerTestSection && innerTestSection ? "true" : "false"}</p>
```

## -Expected
true

# Get Sections with the Same Name Via Deconstruction (Not Equal)
## -Code

```jsx
const {
  testSection: outerTestSection,
  testSection2: {
    withdata9: {
	    testSection: innerTestSection
    }
  }
} = meta.sections(meta.path("./test.data"));

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
const {
  testSection: outerTestSection,
  testSection2: {
    withdata9: {
	    testSection: innerTestSection
    }
  }
} = meta.sections(meta.path("./test.data"));

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