import { last, init, reduce, is, isNil, all, view, set, over, lensPath, unnest, merge, toLower, contains, remove } from 'ramda';

// find item index in array
// array, prop, value, coercion
export const find = (a, p, v, c) => {
  const idx = a.findIndex(x => is(Object, x)
    ? (c ? x[p] == v : x[p] === v)
    : (c ? x == v : x === v)
  );
  
  if (idx === -1)
    return new Error(`Item not found with '${p}=${v}'`);
  
  return idx;
}

// find item index in array with value in params
// array, prop, propInParams, params
export const findWithParam = (a, p1, p2, params) => {
  const v = params && params[p2];
  
  if (isNil(v))
    return a.length;
  
  return find(a, p1, v);
}

// find item index in array with condition in params
// array, condition, params
export const getIndex = (arr, cond, params) => {
  const ps = cond.split('=').map(x => x.trim());
  const prop = replace(ps[0], params);
  
  if (ps.length > 2) // [id=5=a]
    throw new Error(`Invalid path '${cond}'`);
  
  else if (ps.length > 1) { // contains '='
    const pl = getParams(ps[1]); // param list on the right of '='

    if (pl.length === 0) // [id=5], [{name}=a]
      return find(arr, prop, ps[1], true);

    else if (pl.length === 1 && ps[1] === `{${pl[0]}}`) // [id={ID}]
      return findWithParam(arr, prop, pl[0], params);

    else // [id={id}1], [id={id1}{id2}]
      return find(arr, prop, replace(ps[1], params), true);
  }

  else // [id]
    return findWithParam(arr, prop, prop, params);  
}

export const getParams = s =>
  (s.match(/{(.*?)}/g) || [])
    .map(x => x.match(/{(.*)}/)[1]);

export const replace = (s, params) => {
  if (params && is(Object, params)) {
    s = reduce(
      (p, c) => p.replace(new RegExp('\\{' + c + '\\}', 'g'), params[c]),
      s,
      Object.keys(params)
    );
  }

  const pl = getParams(s);

  if (pl.length > 0)
    throw new Error(`${pl.join(', ')} ${pl.length > 1 ? 'are' : 'is'} not provided`);

  return s;
}

export const getLensPath = path => path.split('.').map(x => {
  if (last(x) !== ']') return x; // not an array node

  const m = x.match(/(.+)\[(.*)\]/);
  if (!m) return x;

  const [_, arrName, prop] = m;
  
  if (!arrName)
    throw new Error(`invalid path "${path}"`);

  return [arrName, prop];
})

export const parsePath = path => {
  const lens = getLensPath(path);

  return (params, obj) => reduce((p, c) => {
    if (!is(Array, c)) return [...p, replace(c, params)];
    
    const arrName = replace(c[0], params);
    const prop = c[1];
    
    let arr = view(lensPath([...p, arrName]), obj);
    let idx = null;

    if (!arr && prop === '')
      idx = 0;
    else if (!is(Array, arr))
      throw new Error(`${arrName} is not an array`);
    else if (prop === '')
      idx = arr.length;
    else if (!Number.isNaN(+prop))
      idx = +prop;
    else
      idx = getIndex(arr, prop, params);
    
    if (idx === -1)
      idx = new Error(`Item not found with '${prop}'`);
    
    return [...p, arrName, idx];
  }, [], lens);
};  

export const update = (obj, path, value, params, isMerge) => {
  if (is(String, path))
    path = parsePath(path);

  if (is(Function, path))
    path = path(params, obj);

  if (!is(Array, path))
    return obj;

  const idx = last(path);
  
  if (is(Number, idx)) { // array index
    const lp = lensPath(init(path));

    if (isNil(value)) // delete
      return over(lp, remove(idx, 1), obj);

    if (idx === 0 && isNil(view(lp, obj))) // add first
      return set(lp, [value], obj);
  }
  
  const lp = lensPath(path);
  const cv = view(lp, obj);
  if (isMerge && isObjNotArray(cv) && isObjNotArray(value)) // merge objects
    return over(lp, x => Object.assign({}, x, value), obj);
  
  return set(lp, value, obj);
}

export const isObjNotArray = o => is(Object, o) && !is(Array, o);