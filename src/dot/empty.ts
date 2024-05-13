import is from "@sindresorhus/is";
import { merge } from "./merge.js";

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
export function emptyToUndefined<T>(input: T, options: IsEmptyOptions = {}): T | undefined {
  return isEmpty(input, options) ? undefined : input;
}
