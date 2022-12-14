# Loads All Sections By Default
## -Code
```jsx
const sections = meta
  .sections(path("./test.data"))
  .unique;

<Scry.Sections data={sections} />
```

## -Result
```jsx:
const sections = meta
  .sections(path("./test.data"))
  .unique;

<Scry.Sections data={sections} />
```

## -Expected
**bold** text

bold text

test test test [dataValue::test]

# Custom Render All Sections
## -Code
```jsx
const sections = meta
  .sections(path("./test.data"))
  .unique;

<ul>
	<Scry.Sections data={sections} renderer={(s, r) => 
	  <li>
	    <span>
	      <b>{s.header.text}</b> 
	      {": "}
	      <Scry.InlineMd src={r}/>
	    </span>
		</li>} />
</ul>

```

## -Result
```jsx:
const sections = meta
  .sections(path("./test.data"))
  .unique;

<ul>
	<Scry.Sections data={sections} renderer={(s, r) => 
	  <li>
	    <span>
	      <b>{s.header.text}</b> 
	      {": "}
	      <Scry.InlineMd src={r}/>
	    </span>
		</li>} />
</ul>

```

## -Expected
-   **Initial Section**: **bold** text
-   **Stripped Section**: bold text
-   **Empty Section**:
-   **Last Section**: test test test [dataValue::test]

## -Errors
- see [[Meta Scry/component InlineMd/test#Renders Inline Dv Text]]