import * as dot from 'ts-dot-prop';

/** {@inheritDoc ts-dot-#has} */
export const has = dot.has;

/** {@inheritDoc ts-dot-#get} */
export const get = dot.get;

/** {@inheritDoc ts-dot-#set} */
export const set = dot.set;

/** {@inheritDoc ts-dot-#remove} */
export const unset = dot.remove;

/** {@inheritDoc ts-dot-#paths} */
export const paths = dot.paths;

export * from './clone.js';
export * from './copy.js';
export * from './equals.js';
export * from './examine.js';
export * from './merge.js';
export * from './move.js';

// We'd like to support diffing, but ensuring the diff algorithm is in
// sync with the equality-check algorithm will be critical. Some libraries
// under consideration include:
//
// - https://github.com/flitbit/diff (text only)
// - https://github.com/jhchen/fast-diff
// - https://github.com/mattphillips/deep-object-diff (not much control over rules)
// - https://github.com/concordancejs/concordance (no typings available; used by ava)
