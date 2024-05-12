import * as dot from 'ts-dot-prop';
import micromatch from 'micromatch';

/**
 * Generate a dictionary consisting of full property paths and values for
 * a given object.
 *
 * @param input - The object to examine
 * @param filter - One or more glob-style patterns. If these are provided, only
 * properties whose paths match the filter patterns will be returned.
 * 
 * @example Simple property inspection
 * 
 * Usage:
 * 
 * ```js
 * const myObject = {
 *   name: 'Bob Smith',
 *   identities: [
 *     { email: 'bob@example.com', handle: 'Mr. Smith' },
 *     { email: 'personal@example.com', handle: 'Bobbo' },
 *   ]
 * };
 * 
 * console.log(examine(myObject));
 * ```
 * 
 * Result:
 * 
 * ```js
 * {
 *   'name': 'Bob Smith',
 *   'identities.0.email': 'bob@example.com',
 *   'identities.0.handle': 'Mr. Smith',
 *   'identities.1.email': 'personal@example.com',
 *   'identities.1.handle': 'Bobbo',
 * }
 * ```
 * 
 * @example Filtered property inspection
 * 
 * Usage:
 * 
 * ```js
 * const myObject = {
 *   name: 'Bob Smith',
 *   identities: [
 *     { email: 'bob@example.com', handle: 'Mr. Smith' },
 *     { email: 'personal@example.com', handle: 'Bobbo' },
 *   ]
 * };
 * 
 * console.log(examine(myObject, '!*.email'));
 * ```
 * 
 * Result:
 * 
 * ```js
 * {
 *   'name': 'Bob Smith',
 *   'identities.0.handle': 'Mr. Smith',
 *   'identities.1.handle': 'Bobbo',
 * }
 * ```
 */
export function examine(input: object, filter?: string | string[]): Record<string, unknown> {
  const paths = dot.paths(input).filter(p => filter ? micromatch.isMatch(p, filter) : true);
  return Object.fromEntries(paths.map(p => [p, dot.get(input, p)]));
}
