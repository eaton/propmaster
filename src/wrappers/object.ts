import * as dot from "../dot/index.js";
import { ActiveObject, Handle, OneOrMore, Predicate, PredicateLogic, Retriever } from "./types.js";
import { ObjectProxyOptions, propmasterDefaults } from './options.js';
import { ObjectProxy } from './interfaces.js';
import { getValue } from "./get-value.js";
import { Property } from "./property.js";

type OPredicate = Predicate<ObjectProxy>;
type ORetriever = Retriever<ObjectProxy>;

export class Propmaster implements ObjectProxy {
  readonly object: ActiveObject;
  readonly options: ObjectProxyOptions;

  constructor(object: ActiveObject, options: ObjectProxyOptions = {}) {
    this.options = dot.merge(propmasterDefaults, options);
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

  if(predicate: OPredicate, whenTrue?: ORetriever, whenFalse?: ORetriever, logic: PredicateLogic = 'all') {
    if (predicate(this) && whenTrue) {
      whenTrue(this);
    } else if (whenFalse) {
      whenFalse(this);
    }
    return this;
  }

  ifAll(predicate: OPredicate, whenTrue?: OneOrMore<ORetriever>, whenFalse?: OneOrMore<ORetriever>) {
  }

  ifAny(predicate: OPredicate, whenTrue?: OneOrMore<ORetriever>, whenFalse?: OneOrMore<ORetriever>) {
  }

  ifNone(predicate: OPredicate, whenTrue?: OneOrMore<ORetriever>, whenFalse?: OneOrMore<ORetriever>) {
  }
}
