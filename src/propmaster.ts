import * as dot from "./functions/dot.js";
import is from '@sindresorhus/is';

export interface PropmasterOptions {
  nullIsEmpty ?: boolean,
  emptyStringIsEmpty ?: boolean,
  emptyArrayIsEmpty ?: boolean,
  emptyObjectIsEmpty ?: boolean,
  whiteSpaceIsEmpty ?: boolean,
  isEmpty ?: (input: unknown) => boolean
}

const defaults: PropmasterOptions = {
};

type PropmasterObject = object;

export type PropLiteral<T = unknown> = { value: T };
export type PropFunction<T> = (object: Propmaster) => T;
export type PropValueSelector = (string | PropLiteral | PropFunction<unknown>) | (string | PropLiteral | PropFunction<unknown>)[];

export class Propmaster {
  static clone(original: PropmasterObject, options?: PropmasterOptions): Propmaster {
    return new Propmaster(dot.clone(original), original, options);
  }

  static alter(original: PropmasterObject, options?: PropmasterOptions): Propmaster {
    return new Propmaster(original, undefined, options);
  }

  constructor(
    protected object: PropmasterObject,
    protected original?: PropmasterObject,
    protected options: PropmasterOptions = defaults
  ) { }

  set(path: string, valueInput: PropValueSelector) {
    const value = this.get(valueInput);
    if (value !== undefined) {
      dot.set(this.object, path, value);
    }
    return this;
  }

  unset(path: string) {
    dot.unset(this.object, path);
    return this;
  }

  get(input?: PropValueSelector, fallback?: unknown) {
    if (input === undefined) return this.object;

    for (const source of is.array(input) ? input : [input]) {
      if (is.plainObject(source) && 'value' in source) {
        // Value literals are always used.
        return source.value;
      } else if (is.string(source)) {
        const tmp = dot.get(this.object, source, fallback);
        if (this.isEmpty (tmp)) return tmp;
      } else {
        const tmp = source(this);
        if (this.isEmpty (tmp)) return tmp;
      }
    }
    return undefined;
  }

  protected isEmpty (input: unknown) {
    if (is.undefined(input)) return true;

    if (this.options.isEmpty ) return this.options.isEmpty (input);

    if (is.null(input)) return !!this.options.nullIsEmpty;
    if (is.whitespaceString(input)) return !!this.options.whiteSpaceIsEmpty;
    if (is.emptyString(input)) return !!this.options.emptyStringIsEmpty;
    if (is.emptyObject(input)) return !!this.options.emptyObjectIsEmpty;
    if (is.emptyArray(input)) return !!this.options.emptyArrayIsEmpty;
    
    return false;
  }
}
