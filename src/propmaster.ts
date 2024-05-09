import * as dot from "./functions/dot.js";
import is from '@sindresorhus/is';

export interface PropmasterOptions {
  clone?: boolean,
  nullIsEmpty?: boolean,
  emptyStringIsEmpty?: boolean,
  emptyArrayIsEmpty?: boolean,
  emptyObjectIsEmpty?: boolean,
  whiteSpaceIsEmpty?: boolean,
  falseIsEmpty?: boolean,
  falsyIsEmpty?: boolean,
  isEmpty?: (input: unknown) => boolean
}

type PropmasterObject = object;

export type PropLiteral<T = unknown> = { value: T };
export type PropValueSelector = string | PropLiteral | PropFunction;
export type PropValueSelectorList = PropValueSelector | PropValueSelector[];

export type PropFunction = (object: Propmaster) => unknown;
export type PropPredicate = (object: Propmaster) => boolean;

const defaults: PropmasterOptions = { 
  clone: true,
  nullIsEmpty: true,
  emptyStringIsEmpty: true,
};

export class Propmaster {
  static clone(object: PropmasterObject, options?: PropmasterOptions): Propmaster {
    return new Propmaster(object, { ...options, clone: true });
  }

  static alter(object: PropmasterObject, options?: PropmasterOptions): Propmaster {
    return new Propmaster(object, { ...options, clone: false });
  }

  protected options: PropmasterOptions;

  constructor(protected object: PropmasterObject, options: PropmasterOptions = {}) {
    this.options = dot.merge([defaults, options]);
    if (this.options.clone) {
      this.object = dot.clone(object)
    };
  }

  get(input?: PropValueSelectorList, fallback?: unknown) {
    if (input === undefined) return this.object;

    for (const source of is.array(input) ? input : [input]) {
      if (is.plainObject(source) && 'value' in source) {
        // Value literals are always used — no empty checking.
        return source.value;
      } else if (is.string(source)) {
        const tmp = dot.get(this.object, source, fallback);
        if (!this.isEmpty(tmp)) return tmp;
      } else {
        const tmp = source(this);
        if (!this.isEmpty(tmp)) return tmp;
      }
    }
    return undefined;
  }

  set(path: string, valueInput: PropValueSelectorList) {
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

  if(predicate: PropPredicate, ifTrue: PropFunction, ifFalse?: PropFunction) {
    if (predicate(this)) {
      ifTrue(this);
    } else {
      if (ifFalse) {
        ifFalse(this);
      }
    }
    return this;
  }

  /**
   * Used to test whether found values should be treated as undefined.
   * 
   * The behavior of this helper function is controlled by the options used
   * to create the Propmaster instance.
   */
  protected isEmpty (input: unknown) {
    if (is.undefined(input)) return true;

    if (this.options.isEmpty) return this.options.isEmpty(input);

    if (is.null(input)) return !!this.options.nullIsEmpty;
    if (is.whitespaceString(input)) return !!this.options.whiteSpaceIsEmpty;
    if (is.emptyString(input)) return !!this.options.emptyStringIsEmpty;
    if (is.emptyObject(input)) return !!this.options.emptyObjectIsEmpty;
    if (is.emptyArray(input)) return !!this.options.emptyArrayIsEmpty;
    if (is.falsy(input)) return !!this.options.falsyIsEmpty;
    if (input === false) return !!this.options.falseIsEmpty;
    
    return false;
  }
}
