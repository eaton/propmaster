import reallyFastDeepClone from 'rfdc';

/**
 * Deep clone an Object, Array or Primitive value.
 * 
 * @remarks
 * 
 * All JSON types (Object, Array, Number, String, and null) are supported, as
 * well as a few other more complex structures (Date, Buffer, TypedArray, Map, 
 * Set, and undefined).
 * 
 * References to Function properties are copied to the clone objects, but
 * the Function itself is not cloned. 
 * 
 * All other types have output values that match the output of
 * JSON.parse(JSON.stringify(o)).
 * 
 * @see {@link https://github.com/davidmarkclements/rfdc}
 */
export const clone = reallyFastDeepClone({ circles: false, proto: true });


