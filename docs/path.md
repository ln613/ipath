### Path

A string used to locate a node in the object tree, which consists of object property names or array indexes/conditions, starting from the root of the object to the node you are trying to find.

### Examples

Assuming we have the following object:

```js
const obj = {
  options: {
    albums: {
      showId: true,
      sortBy: 'name'
    }
  },
  artists: [
    {
      id: 3,
      name: 'A1',
      albums: [
        { id: 1, name: 'a1', year: 1990 },
        { id: 2, name: 'a2', year: 1995 },
      ]
    }
  ]
};
```

The you can use:

_'options.albums.sortBy'_: to find a nested object property.

_'options.albums'_: to find the whole 'albums' object.

_'artists[0]'_: to find an array element by specifying the index.

_'artists[id=3]'_: to find an array element by specifying a condition.

_'artists[id=3].name'_: to find an object property of an array element.

_'artists[id=3].albums[1]'_: to find a nested array element (a condition on artists, an index on albums).

_'artists[id=3].albums[name=a2].year'_: to find the 1st artist's 2nd album's year property.
