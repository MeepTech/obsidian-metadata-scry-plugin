# global.meta
**property, global**
You can access the full api via the global variable: `meta` or via the standards js app api path for plugins.
```
const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = meta;

// or

const {
  data: metadata,
  curren: {
    Matter: frontmatter,
    Cache
  }
} = app.plugins.plugins["metadata-api"].api;
```

# Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/global%20meta/test.md)*