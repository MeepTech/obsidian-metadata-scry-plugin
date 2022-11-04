---
defines-react-components: true
---
# Section

```jsx:component:Section
const {
  section,
  renderer = "txt"
} = props;
const [rendered, setRendered] = useState("");
useEffect(() => {
  setRendered(await section[renderer]);
}, [])

return <span class={`Section-${section.header.text.replace(" ", "-")} Section-Index-${section.header.index} Section-Level-${section.header.level}`}>
  {rendered}
</span>
```
