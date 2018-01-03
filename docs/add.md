### Add element to an array

Use "[]" after the name of the array to indicate you want to add a new element to the end of the array:

```js
let newAlbum = { id: 3, name: 'a3', year: 2000 }
newObj = update(obj, 'artists[0].albums[]', newAlbum);
// newObj = {
//   artists: [
//     {
//       ...,
//       albums: [
//         { id: 1, ... },
//         { id: 2, ... },
//         { id: 3, name: 'a3', year: 2000 }
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
