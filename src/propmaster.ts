import * as dot from "./functions/dot.js";
import is from '@sindresorhus/is';
import { Property } from "./property.js";
import { PropmasterOptions, propmasterDefaults } from "./options.js";
import { isEmpty } from "./functions/is-empty.js";

export type ActiveObject = object;
export type Path = string;
export type Handle = Path | Retriever | Literal;
export type Literal<T = unknown> = { value: T };

export type Predicate = (object: ObjectProxy) => boolean;
export type Retriever = (object: ObjectProxy) => unknown;
export type Mutator = (object: ObjectProxy) => void;
export type PredicateLogicMode = 'all' | 'any' | 'none';

export type OneOrMore<T> = T | T[];

export interface ObjectProxy {
  get(path: string): unknown;
  set(path: string, value: OneOrMore<Handle>): unknown;
  unset(path: string): unknown;
  if(predicate: OneOrMore<Predicate>, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>, logic?: PredicateLogicMode): unknown;
  ifAll(predicate: OneOrMore<Predicate>, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>): unknown;
  ifAny(predicate: OneOrMore<Predicate>, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>): unknown;
  ifNone(predicate: OneOrMore<Predicate>, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>): unknown;
  value?: ActiveObject;
}
export interface PropertyProxy {

}

export class Propmaster implements ObjectProxy {
  static clone(object: ActiveObject, options?: PropmasterOptions): Propmaster {
    return new Propmaster(object, { ...options, clone: true });
  }

  static alter(object: ActiveObject, options?: PropmasterOptions): Propmaster {
    return new Propmaster(object, { ...options, clone: false });
  }

  protected options: PropmasterOptions;

  constructor(protected object: ActiveObject, options: PropmasterOptions = {}) {
    this.options = dot.merge([propmasterDefaults, options]);
    if (this.options.clone) {
      this.object = dot.clone(object)
    };
  }

  getValue(input?: OneOrMore<Handle>, fallback?: unknown) {
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

  set(path: string, valueInput: OneOrMore<Handle>) {
    const value = this.getValue(valueInput);
    if (value !== undefined) {
      dot.set(this.object, path, value);
    }
    return this;
  }

  get(path: string): Property {
    return new Property(this, path);
  }

  unset(path: string) {
    dot.unset(this.object, path);
    return this;
  }

  if(predicate: Predicate, whenTrue?: Retriever, whenFalse?: Retriever, logic: PredicateLogicMode = 'all') {
    if (predicate(this) && whenTrue) {
      whenTrue(this);
    } else if (whenFalse) {
      whenFalse(this);
    }
    return this;
  }

  ifAll(predicate: Predicate, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>) {
  }

  ifAny(predicate: Predicate, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>) {
  }

  ifNone(predicate: Predicate, whenTrue?: OneOrMore<Retriever>, whenFalse?: OneOrMore<Retriever>) {
  }

  protected isEmpty(input: unknown) {
    if (this.options.isEmpty) return this.options.isEmpty(input, this.options);
    else return isEmpty(input, this.options);
  }
}
