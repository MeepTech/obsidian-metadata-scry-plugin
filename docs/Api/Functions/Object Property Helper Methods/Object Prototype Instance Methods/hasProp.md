# Object.prototype.hasProp
**function, instance**
Check if an object has a deep property. Returns true if it does. Optional callback available as well for on true and on false.

**NOTE**: This is a wrapper for [TryToGetDeepProperty](../Static%20Api%20Methods/TryToGetDeepProperty.md) and [ContainsDeepProperty](../Static%20Api%20Methods/ContainsDeepProperty.md).
## *Params*
- **propertyPath** *(string|array(string))* Array of keys, or dot seperated propery key string.
- **thenDo** *(Optional) ({onTrue:function(object), onFalse:function()}|function(object)|\[function(object), function()])* A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.