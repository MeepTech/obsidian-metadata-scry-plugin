```dataviewjs
const {data} = meta.sections("_run/DVJ.data");

const text = await data.html;
dv.el("div", text);
```
