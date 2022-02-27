import type { POJO } from '../types/general';

/**
 * repr :: gets the string representation of `arg`
 * @param {} arg :: unknown function argument
 * @returns {String} :: a string representation of `arg`
 */
export const repr = (arg: any) => {
	return Object.prototype.toString.call(arg);
};

/**
 * isArray
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` is an Array, false otherwise
 */
export const isArray = (arg: any) => {
	return Array.isArray ? Array.isArray(arg) : repr(arg) === '[object Array]';
};

/**
 * isObject :: checks if `arg` is an object.
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` is an object.
 */
export const isObject = (arg: any) => {
	return repr(arg) === '[object Object]';
};

/**
 * isTruthyish :: checks if `arg` is not null or undefined.
 *
 * for example, statements like `!""`, `!0`, `!null`, or `!undefined`
 *  evaluate to `true`. However, sometimes deep-cleaner is only interested
 *  if something is null or undefined, so `isTruthyish("")` and
 *  `isTruthyish(0)` evaluate to `true`, while `isTruthyish(null)` and
 *  `isTruthyish(undefined)` still evaluate to `false`.
 *
 * @param {} arg :: unknown function argument.
 * @returns {Boolean}
 */
export const isTruthyish = (arg: any) => {
	if (arg === false) {
		return false;
	}
	return !(isNull(arg) || isUndefined(arg));
};

/**
 * isString :: checks if `arg` is a string.
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` is a String, false otherwise
 */
export const isString = (arg: any) => {
	return repr(arg) === '[object String]';
};

/**
 * isNumber :: checks if `arg` is a number.
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` is a Number, false otherwise
 */
export const isNumber = (arg: any) => {
	return repr(arg) === '[object Number]';
};

/**
 * isNull :: checks if `arg` is null.
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` is of type Null, false otherwise
 */
export const isNull = (arg: any) => {
	return repr(arg) === '[object Null]';
};

/**
 * isPositiveNumber :: checks if `arg` is a positive number.
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` is a Positive Number, false otherwise
 */
export const isPositiveNumber = (arg: any) => {
	return parseInt(arg) >= 0;
};

/**
 * hasNumber :: checks if `arg` has number..
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: returns true if `arg` has number, false otherwise
 */
export const hasNumber = (arg: any) => {
	const pattern = /^\D+$/i;
	return pattern.test(arg);
};

/**
 * isUndefined :: checks if `arg` is undefined.
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: Returns true if `arg` is of type Undefined, false otherwise
 */
export const isUndefined = (arg: any) => {
	try {
		return typeof arg === 'undefined';
	} catch (e) {
		if (e instanceof ReferenceError) {
			return true;
		}

		throw e;
	}
};

/**
 * isEmpty :: Checks if `arg` is an empty string, array, or object.
 *
 * @param {} arg :: unknown function argument
 * @returns {Boolean} :: Returns true if `arg` is an empty string,
 *  array, or object. Also returns true is `arg` is null or
 *  undefined. Returns true otherwise.
 */
export const isEmpty = (arg: any) => {
	return (
		isUndefined(arg) ||
		isNull(arg) ||
		(isString(arg) && arg.length === 0) ||
		(isArray(arg) && arg.length === 0) ||
		(isObject(arg) && Object.keys(arg).length === 0)
	);
};

/**
 * Deep merge two objects.
 * @return merged object
 */
export function deepMerge(target: any, ...sources: any[]): any {
	if (sources.length === 0) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepMerge(target, ...sources);
}

function cleanCyclicObject(object: any, target = null) {
	const visitedObjects = new WeakMap(); // use a WeakMap to keep track of which objects have been visited

	function recursiveClean(obj: any) {
		// If `obj` is an actual object, check if it's been seen already.
		if (isObject(obj)) {
			// If we've seen this object already, return to stop infinite loops
			if (visitedObjects.has(obj)) {
				return;
			}

			// If we haven't seen this object yet, add it to the list of visited objects.
			// Since 'obj' itself is used as the key, the value of 'objects[obj]' is
			// irrelevent. I just went with using 'null'.
			visitedObjects.set(obj, null);

			for (var key in obj) {
				if (
					(target && key === target) || // Check if 'key' is the target to delete,
					(!target && isEmpty(obj[key])) // or if 'target' is unspecified but the object is "empty"
				) {
					delete obj[key];
				} else {
					recursiveClean(obj[key]);
				}
			}

			// If 'obj' is an array, check it's elements for objects to clean up.
		} else if (isArray(obj)) {
			for (var i in obj) {
				recursiveClean(obj[i]);
			}
		}
	}

	recursiveClean(object);
}

/**
 * removeKeyLoop :: does the same thing as `removeKey()` but with multiple keys.
 * @param {Object} obj :: the object being cleaned
 * @param {String|Array} keys :: an array containing keys to be cleaned from `obj`
 */
export const removeKeyLoop = (obj: any, keys: any) => {
	for (var key of keys) {
		cleanCyclicObject(obj, key);
	}
};

/**
 * deepClean
 *
 * @param {Object} obj :: the object being cleaned
 * @param {?String|?Array} target :: A string or array of strings of key(s) for key-value pair(s) to be cleaned from `obj`
 */
export const deepClean = (obj: any, target = null) => {
	if (isArray(target)) {
		removeKeyLoop(obj, target);
	} else {
		cleanCyclicObject(obj, target);
	}

	return obj;
};

export const duplicateObject = (propertyName: any, inputArray: any) => {
	var seenDuplicate = false,
		testObject: POJO = {};

	inputArray.map(function (item: any) {
		var itemPropertyName = item[propertyName];
		if (itemPropertyName in testObject) {
			testObject[itemPropertyName].duplicate = true;
			item.duplicate = true;
			seenDuplicate = true;
		} else {
			testObject[itemPropertyName] = item;
			delete item.duplicate;
		}
	});

	return seenDuplicate;
};

export const existsOnArray = (array: any, property: any, value: any) => {
	var arr = array;

	return arr.some(function (el: any) {
		return el[property] === value;
	});
};

export const decodeEntity = (html: string) => {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export const getLocalTime = (date: string) => {
	let formatString: string;
	if (date.indexOf(' ') >= 0) {
		formatString = date.replace(' ', 'T') + 'Z';
	} else {
		formatString = date + 'Z';
	}
	const localDate = new Date(formatString);
	return localDate;
};

export const hasKey = (object: POJO, key: string) => {
	if (!isObject(object)) {
		return false;
	}
	return Object.keys(object).includes(key);
};
