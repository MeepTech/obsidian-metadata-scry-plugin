# global.cache
**property, global**
Gives you global access to the [Cache](../../../Data%20Storage/Cache.md) of the current note between code-blocks.

**NOTE**: The names of this  global variable can be changed in the settings.
# Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/global%20cache/test.md)*
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
