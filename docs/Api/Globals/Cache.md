#### Cache
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