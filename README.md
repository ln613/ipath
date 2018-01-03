# ipath

[![Build Status](https://travis-ci.org/ln613/ipath.svg?branch=master)](https://travis-ci.org/ln613/ipath)

Ensure immutability by updating javascript objects using a path similar to CSS/jQuery selector, great for react/redux applications where immutability is required, especially when working with deeply nested objects.

[documetation](https://ln613.gitbooks.io/ipath/)

## Install

`npm i -S ipath`

## Usage

```js
import { update } from 'ipath';

const obj = {
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

let newObj = update(obj, 'artists[id=3].albums[name=a2].year', 1992);
// obj doesn't change, newObj.artists[0].albums[1].year = 1992

let newAlbum = { id: 3, name: 'a3', year: 2000 }
newObj = update(obj, 'artists[0].albums[]', newAlbum);
// add newAlbum to the albums list

newObj = update(obj, 'artists[id=3].albums[name=a2]', null);
// delete an item from array
```
