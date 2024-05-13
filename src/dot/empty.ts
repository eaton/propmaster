import is from "@sindresorhus/is";
import { merge } from "./merge.js";
import { get, set, unset } from "./crud.js";

export interface IsEmptyOptions {
  /**
   * Treat `null` as empty.
   * 
   * @defaultValue `true`
   */
  nullIsEmpty?: boolean,

  /**
   * Treat zero-length strings as empty.
   * 
   * @defaultValue `true`
   */
  emptyStringIsEmpty?: boolean,

  /**
   * Treat zero-length arrays as empty.
   * 
   * @defaultValue `false`
   */
  emptyArrayIsEmpty?: boolean,

  /**
   * Treat zero-length buffers as empty.
   * 
   * @defaultValue `false`
   */
  emptyBufferIsEmpty?: boolean,

  /**
   * Treat objects with no properties, and zero-length Records, as empty when processing
   * and filtering values.
   * 
   * @defaultValue `false`
   */
  emptyObjectIsEmpty?: boolean,

  /**
   * Treat strings containing only whitespace as empty.
   * 
   * @defaultValue `false`
   */
  whiteSpaceIsEmpty?: boolean,

  /**
   * Treat boolean `false` as empty.
   * 
   * @defaultValue `false`
   */
  falseIsEmpty?: boolean,

  /**
   * Treat any "falsy" values as empty, including `0`, empty strings, the word 'false', etc.
   * 
   * @defaultValue `false`
   */
  falsyIsEmpty?: boolean,

  /**
   * A custom function to override normal emptiness checking.
   */
  isEmpty?: (input: unknown, options?: IsEmptyOptions) => boolean
}

export const isEmptyDefaults: IsEmptyOptions = {
  nullIsEmpty: true,
  emptyStringIsEmpty: true,
}

export const isEmptyOptsAll: IsEmptyOptions = {
  nullIsEmpty: true,
  emptyStringIsEmpty: true,
  emptyArrayIsEmpty: true,
  emptyObjectIsEmpty: true,
  emptyBufferIsEmpty: true,
  whiteSpaceIsEmpty: true,
  falseIsEmpty: true,
  falsyIsEmpty: true
}

export const onlyUndefinedIsEmpty: IsEmptyOptions = {
  nullIsEmpty: false,
  emptyStringIsEmpty: false,
}



/**
 * Test whether found values should be treated as undefined.
 * 
 * The behavior of this helper function is controlled by the options used
 * to create the Propmaster instance.
 */
export const isEmpty = (input: unknown, options: IsEmptyOptions = {}) => {
  const opt = merge(isEmptyDefaults, options);

  if (is.undefined(input)) return true;

  if (options.isEmpty) return options.isEmpty(input, opt);

  if (is.null(input)) return !!opt.nullIsEmpty;
  if (is.whitespaceString(input)) return !!opt.whiteSpaceIsEmpty;
  if (is.emptyString(input)) return !!opt.emptyStringIsEmpty;
  if (is.emptyObject(input)) return !!opt.emptyObjectIsEmpty;
  if (is.emptyArray(input)) return !!opt.emptyArrayIsEmpty;
  if (is.falsy(input)) return !!opt.falsyIsEmpty;
  if (input === false) return !!opt.falseIsEmpty;
  if (is.buffer(input) && input.byteLength === 0) return !!opt.emptyObjectIsEmpty;
  
  return false;
}

/**
 * Returns `undefined` if the input matches the supplied emptinees criteria,
 * or an unmodified copy of the input if it does not.
 */
export function undefinedIfEmpty<T>(input: T, options: IsEmptyOptions = {}): T | undefined {
  return isEmpty(input, options) ? undefined : input;
}

/**
 * Recursively walks an object's properties or an array's elements, removing any
 * that fit the supplied emptiness criteria.
 * 
 */
export function unsetEmptyProperties(input: unknown, options: IsEmptyOptions = {}) {
  if (isEmpty(input, options)) return undefined;

  if (is.array(input)) {
    return undefinedIfEmpty(input.filter(i => undefinedIfEmpty(i, options)));
  }
  
  if (is.object(input)) {
    for (const k in input) {
      const value = unsetEmptyProperties(get(input, k), options);

      if (isEmpty(value, options)) {
        unset(input, k);
      } else {
        set(input, k, value);
      }
    }
  }

  return undefinedIfEmpty(input, options);
}