import * as dot from 'ts-dot-prop';
import deepEqual from "deep-equal";
import deepmerge from "deepmerge";
import reallyFastDeepClone from 'rfdc';
import testDiff from 'js-testdiff';

/**
 * Normalizes object access, comparison, cloning, and merging functions for use by
 * the Propmaster class. We're putting ourselves in as an intermediary so we can
 * swap out other implementations in the future.
 */

export const has = dot.has;
export const get = dot.get;
export const set = dot.set;
export const unset = dot.remove;
export const paths = dot.paths;

export const merge = deepmerge.all;
export const equals = deepEqual;
export const clone = reallyFastDeepClone({ circles: false, proto: true });

/**
 * Copies a property value from a source object to a target object.
 * 
 * @remarks
 * Note that this function mutates the target object rather than returning a copy of it.
 *
 * @param source - The object whose property should be copied
 * @param sourcePath - The dot-notation path of the property to copy
 * @param target - The object the property should be copied to
 * @param [targetPath] - An alternative target path, if it differs from the source path.
 */
export const copy = (source: object, sourcePath: string, target: object, targetPath?: string) => {
  set(target, targetPath ?? sourcePath, get(source, sourcePath));
}

/**
 * Copy a property from one object to another, and remove it from the original object.
 * 
 * @remarks
 * Note that this function mutates the target object rather than returning a copy of it.
 *
 * @param source - The object whose property should be copied
 * @param sourcePath - The dot-notation path of the property to copy
 * @param target - The object the property should be copied to
 * @param [targetPath] - An alternative target path, if it differs from the source path.
 */
export const move = (source: object, sourcePath: string, target: object, targetPath?: string) => {
  set(target, targetPath ?? sourcePath, get(source, sourcePath));
  unset(source, sourcePath);
}