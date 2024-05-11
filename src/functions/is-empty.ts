import is from "@sindresorhus/is";
import { ObjectProxyOptions } from "../types.js";

/**
 * Used to test whether found values should be treated as undefined.
 * 
 * The behavior of this helper function is controlled by the options used
 * to create the Propmaster instance.
 */
export function isEmpty (input: unknown, options: ObjectProxyOptions = {}) {
  if (is.undefined(input)) return true;

  if (options.isEmpty) return options.isEmpty(input, options);

  if (is.null(input)) return !!options.nullIsEmpty;
  if (is.whitespaceString(input)) return !!options.whiteSpaceIsEmpty;
  if (is.emptyString(input)) return !!options.emptyStringIsEmpty;
  if (is.emptyObject(input)) return !!options.emptyObjectIsEmpty;
  if (is.emptyArray(input)) return !!options.emptyArrayIsEmpty;
  if (is.falsy(input)) return !!options.falsyIsEmpty;
  if (input === false) return !!options.falseIsEmpty;
  
  return false;
}
