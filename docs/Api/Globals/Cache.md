# global.cache
**property, global**
You can also access the current file's cache via the global variable `cache`:
```
// set:
cache["name"] = "tim";
cache["color"] = "blue";

// get:
const {
  name
} = cache;

//   or:
const {
  Current: {
    Cache: {
      name
    }
  }
} = meta;
```

**NOTE**: The names of these two global variables can be changed in the settings.
# Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/global%20cache/test.md)*