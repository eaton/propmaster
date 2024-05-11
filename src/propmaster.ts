import * as dot from "./functions/dot.js";
import { Property } from "./property.js";
import { ActiveObject, Handle, ObjectProxy, OneOrMore, Predicate, PredicateLogicMode, ObjectProxyOptions, Retriever, propmasterDefaults } from "./types.js";
import { getValue } from "./functions/get-value.js";

export class Propmaster implements ObjectProxy {
  static clone(object: ActiveObject, options?: ObjectProxyOptions): Propmaster {
    return new Propmaster(object, { ...options, clone: true });
  }

  static alter(object: ActiveObject, options?: ObjectProxyOptions): Propmaster {
    return new Propmaster(object, { ...options, clone: false });
  }

  readonly object: ActiveObject;
  readonly options: ObjectProxyOptions;

  constructor(object: ActiveObject, options: ObjectProxyOptions = {}) {
    this.options = dot.merge([propmasterDefaults, options]);
    this.object = this.options.clone ? dot.clone(object) : object;
  }

  get value() {
    return this.object;
  }

  set(path: string, valueInput: OneOrMore<Handle>) {
    const value = getValue(this, valueInput);
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
}
