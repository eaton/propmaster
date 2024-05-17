import { ObjectProxyOptions } from './options.js';
import {
  ActiveObject,
  Handle,
  OneOrMore,
  Predicate,
  PredicateLogic,
  Retriever,
} from './types.js';

export interface ObjectProxy {
  readonly object: ActiveObject;
  readonly options: ObjectProxyOptions;

  get(path: string): PropertyProxy;
  set(path: string, value: OneOrMore<Handle>): ObjectProxy;
  unset(path: string): unknown;

  if(
    predicate: OneOrMore<Predicate<ObjectProxy>>,
    whenTrue?: OneOrMore<Retriever<ObjectProxy>>,
    whenFalse?: OneOrMore<Retriever<ObjectProxy>>,
    logic?: PredicateLogic,
  ): unknown;
  ifAll(
    predicate: OneOrMore<Predicate<ObjectProxy>>,
    whenTrue?: OneOrMore<Retriever<ObjectProxy>>,
    whenFalse?: OneOrMore<Retriever<ObjectProxy>>,
  ): unknown;
  ifAny(
    predicate: OneOrMore<Predicate<ObjectProxy>>,
    whenTrue?: OneOrMore<Retriever<ObjectProxy>>,
    whenFalse?: OneOrMore<Retriever<ObjectProxy>>,
  ): unknown;
  ifNone(
    predicate: OneOrMore<Predicate<ObjectProxy>>,
    whenTrue?: OneOrMore<Retriever<ObjectProxy>>,
    whenFalse?: OneOrMore<Retriever<ObjectProxy>>,
  ): unknown;

  readonly value?: ActiveObject;
}

export interface PropertyProxy {
  readonly object: ObjectProxy;
  readonly path: string;
  readonly type: string;
  value: unknown;

  set(input: unknown): PropertyProxy;
}
