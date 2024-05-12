import deepEqual from "deep-equal";

/**
 * Compare objects a and b, using the Node.js `assert.deepEqual()` algorithm.
 *
 * @param strict - Use strict equality (`===`) to compare leaf nodes. By default,
 * coercive equality checks (`==`) are used.
 * @defaultValue `false`
 */
export function equals(a: unknown, b: unknown, strict = false): boolean {
  return deepEqual(a, b, { strict });
}
