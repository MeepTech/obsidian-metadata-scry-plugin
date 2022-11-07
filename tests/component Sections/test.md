# Loads All Sections By Default
## -Code
```jsx
const sections = meta
  .sections(path("./test.data"))
  .unique;

<Metadata.Sections data={sections} />
```

## -Result
```jsx:
const sections = meta
  .sections(path("./test.data"))
  .unique;

<Metadata.Sections data={sections} />
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
	<Metadata.Sections data={sections} renderer={(s, r) => 
	  <li>
	    <span>
	      <b>{s.header.text}</b> 
	      {console.log(r)}
	      {": "}
	      <Metadata.InlineMd src={r}/>
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
	<Metadata.Sections data={sections} renderer={(s, r) => 
	  <li>
	    <span>
	      <b>{s.header.text}</b> 
	      {console.log(r)}
	      {": "}
	      <Metadata.InlineMd src={r}/>
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
- see [[Metadata Api/component InlineMd/test#Renders Inline Dv Text]]