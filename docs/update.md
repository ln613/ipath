## Update function

update(obj, path, value, params, isMerge)

### Parameters

__obj__: The object to be updated. Required.

__path__: A string used to locate the target node to be updated in the object tree. Required.

__value__: The new value (or a function) used to replace the target node. Required.

__params__: If the path contains parameters, then the actual values should be provided in the _params_ object. Optional.

__isMerge__: When _isMerge_ is true and the target node is an object, the properties of the new object will be merged into the old one. Otherwise the old value will be replaced by the new value. Optional. Default value is false.
