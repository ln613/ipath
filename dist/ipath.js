"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObjNotArray = exports.update = exports.parsePath = exports.getLensPath = exports.replace = exports.getParams = exports.getIndex = exports.findWithParam = exports.find = void 0;

var _ramda = require("ramda");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// find item index in array
// array, prop, value, coercion
var find = function find(a, p, v, c) {
  var idx = a.findIndex(function (x) {
    return (0, _ramda.is)(Object, x) ? c ? x[p] == v : x[p] === v : c ? x == v : x === v;
  });
  if (idx === -1) return new Error("Item not found with '".concat(p, "=").concat(v, "'"));
  return idx;
}; // find item index in array with value in params
// array, prop, propInParams, params


exports.find = find;

var findWithParam = function findWithParam(a, p1, p2, params) {
  var v = params && params[p2];
  if ((0, _ramda.isNil)(v)) return a.length;
  return find(a, p1, v);
}; // find item index in array with condition in params
// array, condition, params


exports.findWithParam = findWithParam;

var getIndex = function getIndex(arr, cond, params) {
  var ps = cond.split('=').map(function (x) {
    return x.trim();
  });
  var prop = replace(ps[0], params);
  if (ps.length > 2) // [id=5=a]
    throw new Error("Invalid path '".concat(cond, "'"));else if (ps.length > 1) {
    // contains '='
    var pl = getParams(ps[1]); // param list on the right of '='

    if (pl.length === 0) // [id=5], [{name}=a]
      return find(arr, prop, ps[1], true);else if (pl.length === 1 && ps[1] === "{".concat(pl[0], "}")) // [id={ID}]
      return findWithParam(arr, prop, pl[0], params);else // [id={id}1], [id={id1}{id2}]
      return find(arr, prop, replace(ps[1], params), true);
  } else // [id]
    return findWithParam(arr, prop, prop, params);
};

exports.getIndex = getIndex;

var getParams = function getParams(s) {
  return (s.match(/{(.*?)}/g) || []).map(function (x) {
    return x.match(/{(.*)}/)[1];
  });
};

exports.getParams = getParams;

var replace = function replace(s, params) {
  if (params && (0, _ramda.is)(Object, params)) {
    s = (0, _ramda.reduce)(function (p, c) {
      return p.replace(new RegExp('\\{' + c + '\\}', 'g'), params[c]);
    }, s, Object.keys(params));
  }

  var pl = getParams(s);
  if (pl.length > 0) throw new Error("".concat(pl.join(', '), " ").concat(pl.length > 1 ? 'are' : 'is', " not provided"));
  return s;
};

exports.replace = replace;

var getLensPath = function getLensPath(path) {
  return path.split('.').map(function (x) {
    if ((0, _ramda.last)(x) !== ']') return x; // not an array node

    var m = x.match(/(.+)\[(.*)\]/);
    if (!m) return x;

    var _m = _slicedToArray(m, 3),
        _ = _m[0],
        arrName = _m[1],
        prop = _m[2];

    if (!arrName) throw new Error("invalid path \"".concat(path, "\""));
    return [arrName, prop];
  });
};

exports.getLensPath = getLensPath;

var parsePath = function parsePath(path) {
  var lens = getLensPath(path);
  return function (params, obj) {
    return (0, _ramda.reduce)(function (p, c) {
      if (!(0, _ramda.is)(Array, c)) return _toConsumableArray(p).concat([replace(c, params)]);
      var arrName = replace(c[0], params);
      var prop = c[1];
      var arr = (0, _ramda.view)((0, _ramda.lensPath)(_toConsumableArray(p).concat([arrName])), obj);
      var idx = null;
      if (!arr && prop === '') idx = 0;else if (!(0, _ramda.is)(Array, arr)) throw new Error("".concat(arrName, " is not an array"));else if (prop === '') idx = arr.length;else if (!Number.isNaN(+prop)) idx = +prop;else idx = getIndex(arr, prop, params);
      if (idx === -1) idx = new Error("Item not found with '".concat(prop, "'"));
      return _toConsumableArray(p).concat([arrName, idx]);
    }, [], lens);
  };
};

exports.parsePath = parsePath;

var update = function update(obj, path, value, params, isMerge) {
  if ((0, _ramda.is)(String, path)) path = parsePath(path);
  if ((0, _ramda.is)(Function, path)) path = path(params, obj);
  if (!(0, _ramda.is)(Array, path)) return obj;
  var idx = (0, _ramda.last)(path);

  if ((0, _ramda.is)(Number, idx)) {
    // array index
    var _lp = (0, _ramda.lensPath)((0, _ramda.init)(path));

    if ((0, _ramda.isNil)(value)) // delete
      return (0, _ramda.over)(_lp, (0, _ramda.remove)(idx, 1), obj);
    if (idx === 0 && (0, _ramda.isNil)((0, _ramda.view)(_lp, obj))) // add first
      return (0, _ramda.set)(_lp, [value], obj);
  }

  var lp = (0, _ramda.lensPath)(path);
  var cv = (0, _ramda.view)(lp, obj);
  if ((0, _ramda.is)(Function, value)) value = value(cv);
  if (isMerge && isObjNotArray(cv) && isObjNotArray(value)) // merge objects
    return (0, _ramda.over)(lp, function (x) {
      return Object.assign({}, x, value);
    }, obj);
  return (0, _ramda.set)(lp, value, obj);
};

exports.update = update;

var isObjNotArray = function isObjNotArray(o) {
  return (0, _ramda.is)(Object, o) && !(0, _ramda.is)(Array, o);
};

exports.isObjNotArray = isObjNotArray;