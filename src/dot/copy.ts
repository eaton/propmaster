import { set, get } from "ts-dot-prop";

/**
 * Copy a property from a source object to a target object.
 * 
 * @remarks
 * Note that this function mutates the target object rather than returning a copy of it.
 *
 * @param source - The object whose property should be copied
 * @param sourcePath - The dot-notation path of the property to copy
 * @param target - The object the property should be copied to
 * @param [targetPath] - An alternative target path, if it differs from the source path.
 */
export function copy(source: object, sourcePath: string, target: object, targetPath?: string) {
  set(target, targetPath ?? sourcePath, get(source, sourcePath));
}
