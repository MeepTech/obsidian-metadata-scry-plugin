# Object.prototype.getProp
**function, instance**
Get a deep property from an object, or return null.

**NOTE**: This is a wrapper for [GetDeepProperty](../Static%20Api%20Methods/GetDeepProperty.md).
**NOTE**: This function is unavailable if the [Configuration > Declare Object Property Helper Methods](../../../../Configuration.md) setting is disabled.
## *Params*
- **propertyPath** *(string|array(string))* Array of keys, or dot seperated propery key string.
- **defaultValue** *(any|function)* The default value to use if this value wasn't found. If a function is passed in it will be called to fetch the value.
# Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/function%20Object.prototype.getProp/test.md)*