# Metadata.TryToGetDeepProperty
Try to find a deep property in an object. Returning true if it's found and executing the appropriate callback.
## *Params*
- **propertyPath** *(string|array(string))* Array of keys, or dot seperated propery key string.
- **thenDo** *({onTrue:function(object), onFalse:function()}|function(object)|\[function(object), function()])* A(set of) callback(s) that takes the found value as a parameter. Defaults to just the onTrue method if a single function is passed in on it's own.
- **fromObject** *(object)* The object containing the desired key