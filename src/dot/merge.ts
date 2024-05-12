/**
 * deepmerge-ts was selected because it's well-supported, handles lots of ugly type
 * inference automatically, supports Records/Maps/Sets, and its mechanisms for custom
 * merge logic are top notch.
 * 
 * @see {@link https://github.com/RebeccaStevens/deepmerge-ts}
 * 
 * Other projects considered included:
 * 
 * - https://www.npmjs.com/package/deepmerge (Wildly popular)
 * - https://github.com/fastify/deepmerge (Much faster, but CJS only)
 * - https://www.npmjs.com/package/ts-deepmerge (Honestly not sure what it offers))
 * - https://github.com/tada5hi/smob ()
 * - https://docs-lodash.com/v4/defaults-deep/ or https://docs-lodash.com/v4/merge/
 * 
 * For the Spidergram project in particular, we have a few situations where defaults
 * get applied and re-applied at different points. Right now, that can to ugly
 * doubling and tripling of array entries. Refactoring the config/prefs hierarchy there
 * will help, but a merge library with customizable merging rules might be useful
 * as well.
 */

/** {@inheritDoc deepmerge-ts#deepmerge} */
export { deepmerge as merge } from "deepmerge-ts";
