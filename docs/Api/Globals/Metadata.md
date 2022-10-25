### Metadata
You can access the full api via the global variable: `meta`, via the standards js app api path, or via one of the `.Instance` properties on either the `Metadata` or `MetadataApiPlugin` classes:
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
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = app.plugins.plugins["metadata-api"].api;

// or

const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = Metadata.Api;

// or 

const {
  Data: metadata,
  Current: {
    Matter: frontmatter,
    Cache: cache
  }
} = MetadataPluginApi.Instance;
```