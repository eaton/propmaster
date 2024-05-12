import { ActiveObject, CombinationLogic, Handle, OneOrMore, Predicate, Retriever } from "./types.js";
import { ObjectProxyOptions } from "./options.js";

export interface ObjectProxy {
  readonly object: ActiveObject;
  readonly options: ObjectProxyOptions;

  get(path: string): PropertyProxy;
  set(path: string, value: OneOrMore<Handle>): ObjectProxy;
  unset(path: string): unknown;
  
  if(predicate: OneOrMore<Predicate<ObjectProxy>>, whenTrue?: OneOrMore<Retriever<ObjectProxy>>, whenFalse?: OneOrMore<Retriever<ObjectProxy>>, logic?: CombinationLogic): unknown;
  ifAll(predicate: OneOrMore<Predicate<ObjectProxy>>, whenTrue?: OneOrMore<Retriever<ObjectProxy>>, whenFalse?: OneOrMore<Retriever<ObjectProxy>>): unknown;
  ifAny(predicate: OneOrMore<Predicate<ObjectProxy>>, whenTrue?: OneOrMore<Retriever<ObjectProxy>>, whenFalse?: OneOrMore<Retriever<ObjectProxy>>): unknown;
  ifNone(predicate: OneOrMore<Predicate<ObjectProxy>>, whenTrue?: OneOrMore<Retriever<ObjectProxy>>, whenFalse?: OneOrMore<Retriever<ObjectProxy>>): unknown;

  readonly value?: ActiveObject;
}

export interface PropertyProxy {
  readonly object: ObjectProxy;
  readonly path: string;
  readonly type: string;
  value: unknown;
  
  set(input: unknown): PropertyProxy;
}

