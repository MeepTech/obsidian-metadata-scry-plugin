# Object.prototype.hasProp
**function, instance**
Check if an object has a deep property. Returns true if it does. Optional callback available as well for on true and on false.

**NOTE**: This is a wrapper for [TryToGetDeepProperty](../Metadata/Static%20Object%20Property%20Helpers/TryToGetDeepProperty.md) and [ContainsDeepProperty](../Metadata/Static%20Object%20Property%20Helpers/ContainsDeepProperty.md).
**NOTE**: This function is unavailable if the [Configuration > Declare Object Property Helper Methods](../../../../Configuration.md) setting is disabled.
## *Params*
- **propertyPath** *(string|array(string))* Array of keys, or dot seperated propery key string.
- **thenDo** *(Optional) ({onTrue:function(object), onFalse:function()}|function(object)|\[function(object), function()])* A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
# Examples
- *see: [tests](https://github.com/Meep-Tech/obsidian-metadata-api-plugin/blob/master/tests/function%20Object.prototype.hasProp/test.md)*