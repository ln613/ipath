## Value function

The _value_ parameter can be a function, taking the old value as input and produce a new value. It's useful when the new value is calculated based on the old value.

```js
newObj = update(obj, 'artists[0].albums[id=2].year', x => x + 1);
// newObj = {
//   ...,
//   artists: [
//     {
//       ...,
//       albums: [
//         { id: 1, ... },
//         { id: 2, name: 'a2', year: 1996 }
//       ]
//     }
//   ]
// }
```
