import { IsEmptyOptions } from '../dot/empty.js';

export const propmasterDefaults: ObjectProxyOptions = { 
  clone: true,
};

export interface ObjectProxyOptions extends IsEmptyOptions {
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
}
