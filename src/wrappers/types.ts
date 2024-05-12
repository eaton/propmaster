export type ActiveObject = object;
export type Path = string;
export type Handle = Path | Retriever | Literal;
export type Literal<T = unknown> = { value: T };

export type SortablePrimitive = string | number | Date;

export type OneOrMore<T> = T | T[];
export type Predicate<T = unknown> = (object: T) => boolean;
export type Retriever<T = unknown> = (input: T) => unknown;
export type Mutator<T = unknown> = (input: T) => void;
export type CombinationLogic = 'all' | 'any' | 'none';
