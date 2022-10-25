---
tree:
  trunk:
    branch:
      branch:
        leaf:
          - bug
          - bird
      leaf:
        - bug
        - dew
    leaf:
      - bird
name:
  first: Tom
  last: Baker
  nick: Doctor
---
# Object Has Property Success (dataviewjs)
## -Code
*dataviewjs*
```js
const hasPerfectLeaf = meta.data.hasProp("tree.trunk.branch.branch.leaf");
dv.el('p', hasPerfectLeaf)
```
## -Result
```dataviewjs
const hasPerfectLeaf = meta.data.hasProp("tree.trunk.branch.branch.leaf");
dv.el('p', hasPerfectLeaf)
```
## -Expected
true
# If Object Has Property Success
## -Code
*dataviewjs*
```js
if (dv.current().hasProp("name.nick")) {
  dv.span(meta.data.name.nick);
} else {
  dv.span(meta.data.name);
}
```
## -Result
```dataviewjs
if (dv.current().hasProp("name.nick")) {
  dv.span(meta.data.name.nick);
} else {
  dv.span(meta.data.name);
}
```
## -Expected
Doctor
# Object Has Property Success With Both Callbacks 
## -Code
*dataviewjs*
```js
dv.current().hasProp("name.nick", { 
  onTrue: () => dv.span(meta.data.name.nick),
  onFalse: () => dv.span(meta.data.name)
});
```
## -Result
```dataviewjs
dv.current().hasProp("name.nick", { 
  onTrue: () => dv.span(meta.data.name.nick),
  onFalse: () => dv.span(meta.data.name)
});
```
## -Expected
Doctor
# Object Has Property Success With OnTrue Callback Only 
## -Code
*dataviewjs*
```js
dv.current().hasProp("name.nick", { 
  onTrue: () => dv.span(meta.data.name.nick)
});
```
## -Result
```dataviewjs
dv.current().hasProp("name.nick", { 
  onTrue: () => dv.span(meta.data.name.nick)
});
```
## -Expected
Doctor
# Object Has Property Success With Single Callback Function 
## -Code
*dataviewjs*
```js
dv.current().hasProp("name.nick", () => dv.span(meta.data.name.nick));
```
## -Result
```dataviewjs
dv.current().hasProp("name.nick", () => dv.span(meta.data.name.nick));
```
## -Expected
Doctor
# Object Has Property Failure With Both Callbacks 
## -Code
*dataviewjs*
```js
dv.current().hasProp("name.second", {
  onTrue: () => dv.span(meta.data.name.second),
  onFalse: () => dv.span("missing")
});
```
## -Result
```dataviewjs
dv.current().hasProp("name.second", {
  onTrue: () => dv.span(meta.data.name.second),
  onFalse: () => dv.span("missing")
});
```
## -Expected
missing
# Object Has Property Failure
## -Code
*dataviewjs*
```js
const hasLoneLeaf = meta.data.hasProp("tree.leaf");
dv.span(hasLoneLeaf)
```
## -Result
```dataviewjs
const hasLoneLeaf = meta.data.hasProp("tree.leaf");
dv.span(hasLoneLeaf)
```
## -Expected
false
# Object Has Property Success (JSX)
## -Code
*jsx:*
```jsx
<p>{meta.data.hasProp("tree.trunk.leaf") ? "true" : "false"}</p>
```
## -Result
```jsx:
<p>{meta.data.hasProp("tree.trunk.leaf") ? "true" : "false"}</p>
```

## -Expected
true