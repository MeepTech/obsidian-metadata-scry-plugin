---
testValue: "tess"
---
# Renders without newlines
## -Code
```jsx
<p>{"- "}<Metadata.InlineMd src={"**bold**"}/></p>
```

## -Result
```jsx:
<p>{"- "}<Metadata.InlineMd src={"**bold**"}/></p>
```

## -Expected
- **bold**

# Renders Inline Dv Text
## -Code
```jsx
<p>{"- "}<Metadata.InlineMd src={"[dataValue::test]"}/></p>
```

## -Result
```jsx:
<p>{"- "}<Metadata.InlineMd src={"[dataValue::test]"}/></p>
```

## -Expected
- [dataValue::test]


## -Errors
- Inline DV items don't render their value correctly using InlineMd