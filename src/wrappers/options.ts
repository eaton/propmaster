export const propmasterDefaults: ObjectProxyOptions = { 
  clone: true,
  nullIsEmpty: true,
  emptyStringIsEmpty: true,
};

export interface ObjectProxyOptions {
  /**
   * Throw errors when property mutations fail.
   * 
   * By default, impossible value mutations (`p.join()` when `p`'s value is a
   * number, for example) are ignored. If `strict` is set to true, thees mutations
   * will throw TypeErrors.
   * 
   * @defaultValue `false`
   */
  strict?: boolean;

  /**
   * When mutating property values, batch chained operations until a `set()` call
   * is made.
   * 
   * @defaultValue `false`
   * 
   * @experimental
   */
  batchMutations?: boolean;
  
  /**
   * Perform all operations on a cloned copy of the active object; the original will not be modified.
   * 
   * @defaultValue `true`
   */
  clone?: boolean,

  /**
   * Treat `null` as empty when processing and filtering values.
   * 
   * @defaultValue `true`
   */
  nullIsEmpty?: boolean,

  /**
   * Treat zero-length strings as empty when processing and filtering values.
   * 
   * @defaultValue `true`
   */
  emptyStringIsEmpty?: boolean,

  /**
   * Treat zero-length arrays as empty when processing and filtering values.
   * 
   * @defaultValue `false`
   */
  emptyArrayIsEmpty?: boolean,

  /**
   * Treat objects with no properties, and zero-length Records, as empty when processing
   * and filtering values.
   * 
   * @defaultValue `false`
   */
  emptyObjectIsEmpty?: boolean,

  /**
   * Treat strings containing only whitespace as empty when processing and filtering values.
   * 
   * @defaultValue `false`
   */
  whiteSpaceIsEmpty?: boolean,

  /**
   * Treat boolean `false` as empty when processing and filtering values.
   * 
   * @defaultValue `false`
   */
  falseIsEmpty?: boolean,

  /**
   * Treat any "falsy" values as empty when processing and filtering values. This includes
   * `0`, empty strings, the word 'false', etc.
   * 
   * @defaultValue `false`
   */
  falsyIsEmpty?: boolean,

  /**
   * A custom function to override normal 'empty value' checking.
   */
  isEmpty?: (input: unknown, options?: ObjectProxyOptions) => boolean
}
