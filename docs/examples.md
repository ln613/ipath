## Replace value

After you specify the [_path_](./update.md) to find the target node, you can use the _update_ function to replace the target node with a new value.

```js
const newObj = update(obj, 'artists[0].albums[id=2].year', 1998);
// newObj = {
//   ...,
//   artists: [
//     {
//       ...,
//       albums: [
//         { id: 1, ... },
//         { id: 2, name: 'a2', year: 1998 }
//       ]
//     }
//   ]
// }
```

The _newObj_ is a new object with the target node updated, _obj_ is untouched.

## Replace object

If the target node is an object, the new value will replace the whole object at the target node.

```js
newObj = update(obj, 'options.albums', { showId: false, sortBy: 'year' });
// newObj = {
//   options: {
//     albums: {
//       showId: false,
//       sortBy: 'year'
//     }
//   },
//   ...
// }
```

## Merge object

When _isMerge_ is true and the target node is an object, the properties of the new object will be merged into the old one.

```js
newObj = update(obj, 'artists[id=3].albums[name=a2]', { year: 2000, rate: 95 }, null, true);
// newObj = {
//   ...,
//   artists: [
//     {
//       ...,
//       albums: [
//         { id: 1, ... },
//         { id: 2, name: 'a2', year: 2000, rate: 95 }
//       ]
//     }
//   ]
// }
```

## Add element to an array

If the target is an array, and you put a "[]" after the name of the array in the path, it means you want to add a new element to the end of the array:

```js
let newAlbum = { id: 3, name: 'a3', year: 2000 }
newObj = update(obj, 'artists[0].albums[]', newAlbum);
// newObj = {
//   ...,
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

## Remove element from an array

If the target is an array element, and the new value is _null_, it means you want to remove that element from an array:

```js
newObj = update(obj, 'artists[0].albums[name=a2]', null);
// newObj = {
//   ...,
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

## Missing nodes

If an array or object doesn't exist along the path, it will be created.

```js
let newConcert = { id: 1, name: 'c1', date: new Date(2018, 1, 5) }
newObj = update(obj, 'artists[0].concerts[]', newConcert);
// newObj = {
//   ...,
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
