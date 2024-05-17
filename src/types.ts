import is, { TypeName as IsTypeNames } from '@sindresorhus/is';

type Brand<K, T> = K & { __brand: T };
export type Html = Brand<string, 'Html'>;
export type Xml = Brand<string, 'Xml'>;

export type TypeName =
  | IsTypeNames
  | ('Cheerio' | 'CheerioRoot' | 'Html' | 'Xml');

export type ActiveObject = object;
export type Path = string;
export type Literal<T = unknown> = { literal: T };
export function isLiteral(input: unknown): input is Literal {
  return (
    is.plainObject(input) &&
    Object.keys(input).length === 1 &&
    'literal' in input
  );
}

export type Handle<T = unknown> = Path | Retriever<T> | Literal;

export type SortablePrimitive = string | number | Date;

export type OneOrMore<T> = T | T[];

export type Mutator<T = unknown> = (input: T) => void;
export type Retriever<T = unknown> = (input: T) => unknown;
export type Predicate<T = unknown> = (object: T) => boolean;
export type PredicateLogic = 'all' | 'any' | 'none';
