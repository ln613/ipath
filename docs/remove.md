### Remove element from an array

Use 'null' as the value you are trying to set to indicate you want to remove an element from an array:

```js
newObj = update(obj, 'artists[0].albums[name=a2]', null);
// newObj = {
//   artists: [
//     {
//       ...,
//       albums: [
//         { id: 1, ... }
//       ]
//     }
//   ]
// }
```

The array will be created if it doesn't exist.

```js
let newConcert = { id: 1, name: 'c1', date: new Date(2018, 1, 5) }
newObj = update(obj, 'artists[0].concerts[]', newConcert);
// newObj = {
//   artists: [
//     {
//       ...,
//       albums: [ ... ],
//       concerts: [
//         { id: 1, name: 'c1', ... }
//       ]
//     }
//   ]
// }
```
