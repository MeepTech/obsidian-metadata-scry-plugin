# Object.prototype.setProp
**function, instance**
Set a deep property in an object, even if it doesn't exist.

**NOTE**: This is a wrapper for [SetDeepProperty](../MetaScryApi/Static%20Object%20Property%20Helpers/SetDeepProperty.md).
**NOTE**: This function is unavailable if the [Configuration > Declare Object Property Helper Methods](../../../../Configuration.md) setting is disabled.
## *Params*
- **propertyPath** *(string|array(string))* Array of keys, or dot seperated propery key string.
- **value** *(any)* The value to set.
# Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/function%20Object.prototype.setProp/test.md)*