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
# Get Property Value Succesfully (dataviewjs)
## -Code
*dataviewjs*
```js
const leafContents = meta.data.getProp("tree.trunk.branch.branch.leaf");
dv.el('p', leafContents)
```
## -Result
```dataviewjs
const leafContents = meta.data.getProp("tree.trunk.branch.branch.leaf");
dv.el('p', leafContents)
```
## -Expected
bug
bird
# Get Property Value Successfully With Backup Provided
## -Code
*dataviewjs*
```js
const name = dv.current().getProp("name.nick", dv.current().name);
dv.span(name)
```
## -Result
```dataviewjs
const name = dv.current().getProp("name.nick", dv.current().name);
dv.span(name)
```
## -Expected
Doctor
# Get Property Value Unsuccessfuly With Backup Provided
## -Code
*dataviewjs*
```js
const leafContents = meta.data.getProp("tree.branch.leaf", dv.current().tree.trunk.branch.leaf);
dv.span(leafContents)
```
## -Result
```dataviewjs
const leafContents = meta.data.getProp("tree.branch.leaf", dv.current().tree.trunk.branch.leaf);
dv.span(leafContents)
```
## -Expected
bug
dew
# Get Property Value Unsuccessfully
## -Code
*dataviewjs*
```js
const leafContents = meta.data.getProp("tree.branch.leaf");
dv.span(leafContents)
```
## -Result
```dataviewjs
const leafContents = meta.data.getProp("tree.branch.leaf");
dv.span(leafContents)
```
## -Expected
\-
# Get Property Value Successfully (JSX)
## -Code
*jsx:*
```jsx
<p>{meta.data.getProp("tree.trunk.leaf")}</p>
```

## -Result
```jsx:
<p>{meta.data.getProp("tree.trunk.leaf")}</p>
```

## -Expected
bird