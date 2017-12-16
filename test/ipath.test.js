import { find, findWithParam, getIndex, getLensPath, getParams, replace, parsePath, update } from '../src/ipath';

test('replace', () => {
  expect(replace('aa/{p1}/c{p2}', { p1: 'bb', p2: 'c' })).toBe('aa/bb/cc');
  expect(() => replace('aa/{p1}/c{p2}')).toThrow('p1, p2 are not provided');
  expect(() => replace('aa/{p1}/c{p2}', { p1: 'bb' })).toThrow('p2 is not provided');
  expect(replace('{p1}', { p1: 'bb' })).toBe('bb');
  expect(replace('{p', { p1: 'bb' })).toBe('{p');
});

test('getParams', () => {
  expect(getParams('artists[id].{f3}[n].{f2}')).toEqual(['f3', 'f2']);
  expect(getParams('artists[id]')).toEqual([]);
});

test('parsePath - object path', () => {
  expect(parsePath('p1.p2')()).toEqual(['p1', 'p2']);
  expect(parsePath('p1.{p}.p3')({ p: 'p2' })).toEqual(['p1', 'p2', 'p3']);
});

const params = {
  f1: 'albums',
  f2: 'year',
  f3: 'name',
  f4: 'year',
  id: 5,
  name: 'a3',
  year: 1998,
  artistName: 'A2',
  albumName: 'a4',
};

const obj = {
  artists: [
    {
      id: 3,
      name: 'A1',
      albums: [
        { id: 1, name: 'a1', year: 1990 },
        { id: 2, name: 'a2', year: 1995 },
      ]
    },
    {
      id: 5,
      name: 'A2',
      albums: [
        { id: 3, name: 'a3', year: 1992 },
        { id: 4, name: 'a4', year: 1998 },
      ]
    }
  ]
};

const r = (a, b) => ['artists', a, 'albums', b, 'year'];
const rr = e => ['artists', 1, 'albums', new Error(`Item not found with 'name=${e}'`), 'year'];

test('parsePath - array path', () => {
  expect(parsePath('artists[id].{f1}[name].{f2}')(params, obj)).toEqual(r(1, 0));
  expect(parsePath('artists[id].{f1}[{f3}].{f2}')(params, obj)).toEqual(r(1, 0));
  expect(parsePath('artists[id].{f1}[{f4}].{f2}')(params, obj)).toEqual(r(1, 1));
  expect(parsePath('artists[id=3].albums[name=a2].year')(params, obj)).toEqual(r(0, 1));
  expect(parsePath('artists[id].albums[n].year')(params, obj)).toEqual(r(1, 2));
  expect(parsePath('artists[id=5].albums[{f4}={year}].year')(params, obj)).toEqual(r(1, 1));
  expect(parsePath('artists[id={id}].albums[name={name}].year')(params, obj)).toEqual(r(1, 0));
  expect(parsePath('artists[name={artistName}].albums[name={albumName}].year')(params, obj)).toEqual(r(1, 1));
  expect(parsePath('artists[id].albums[name=a5].year')(params, obj)).toEqual(rr('a5'));
  expect(parsePath('artists[id].albums[name={name}1].year')(params, obj)).toEqual(rr('a31'));
  expect(parsePath('artists[id].albums[name={name}{id}].year')(params, obj)).toEqual(rr('a35'));
});
  
test('parsePath - array path - error', () => {
  expect(() => parsePath('artists[id].{f5}[name].year')(params, obj)).toThrow('f5 is not provided');
  expect(() => parsePath('artists[id].{f3}[name].year')(params, obj)).toThrow('name is not an array');
  expect(() => parsePath('artists[id].albums[name=a5={id}].year')(params, obj)).toThrow("Invalid path 'name=a5={id}'");
});

test('update', () => {
  let newObj = update(obj, 'artists[id=5].albums[name=a4].year', 1987); // update with condition
  expect(newObj.artists[1].albums[1].year).toBe(1987);
  expect(obj.artists[1].albums[1].year).toBe(1998);
  
  newObj = update(obj, 'artists[1].albums[0].year', 1987); // update with array index
  expect(newObj.artists[1].albums[0].year).toBe(1987);
  expect(obj.artists[1].albums[0].year).toBe(1992);

  const newAlbum = { name: 'a5', year: 1991 };
  newObj = update(obj, 'artists[id=5].albums[]', newAlbum); // array add item
  expect(newObj.artists[1].albums[2]).toMatchObject(newAlbum);
  expect(obj.artists[1].albums.length).toBe(2);
  
  newObj = update(obj, 'artists[id=5].albums[name=a4]', null); // array delete item
  expect(newObj.artists[1].albums.findIndex(x => x.name === 'a4')).toEqual(-1);
  expect(obj.artists[1].albums.findIndex(x => x.name === 'a4')).toEqual(1);

  newObj = update(obj, 'artists[id=5].albums', null); // delete array
  expect(newObj.artists[1].albums).toBeNull();
  expect(obj.artists[1].albums).not.toBeNull();

  newObj = update(obj, 'artists', null);
  expect(newObj.artists).toBeNull();
  expect(obj.artists).not.toBeNull();
});

// const newArtist = { id: 7, name: 'Elton John' };
// const newArtists = append(newArtist, artists);

// const patchObj = { rate: 80, name: 'MJ' };
// const afterPatchObj = Object.assign({}, artists[1], patchObj);
