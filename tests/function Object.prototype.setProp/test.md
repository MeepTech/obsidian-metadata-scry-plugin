# Set Existing Deep Propery Successful
## -Code
```js
const test = {
  deep: {
    deeper: {
      deepest: ["rocks", "fish"]
    }
  }
};

test.setProp("deep.deeper.deepest", ["sand"]);

dv.el("p", test.deep.deeper.deepest);
```
## -Result
```dataviewjs
const test = {
  deep: {
    deeper: {
      deepest: ["rocks", "fish"]
    }
  }
};

test.setProp("deep.deeper.deepest", ["sand"]);

dv.el("p", test.deep.deeper.deepest);
```
## -Expected
sand
# Set Non-Existing Deep Propery Successful
## -Code
```js
const test = {};

test.setProp("deep.deeper.deepest", ["sand"]);

dv.el("p", test.deep.deeper.deepest);
```
## -Result
```dataviewjs
const test = {};

test.setProp("deep.deeper.deepest", ["sand"]);

dv.el("p", test.deep.deeper.deepest);
```
## -Expected
sand