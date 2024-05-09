export const date = new Date(1977, 8, 16);

export const map = new Map<string, number>([['first', 1], ['second', 2],['third', 3]]);

export const set = new Set<number>([1, 2, 3]);

export const buffer = Buffer.from('sometext');

export const func = () => 'return value';

export const instance = new (class TestClass {
  protected value = 'protected';
  get accessor() {
    return 'accessor value';
  }
  func() {
    return 'function value'
  }
})();

export const url = new URL('https://example.com');

export const empty = {
  null: null,
  undefined: undefined,
  emptyArray: [],
  emptyString: '',
  whitespace: ' \t\n ',
  emptyObject: {},
};

export const primitives = {
  string: 'string',
  number: 1,
  bool: true,
  true: true,
  false: false,
  unknown: 'value' as unknown,
};

export const arrays = {
  strings: ['first', 'second', 'third', 'fourth'],
  numbers: [1,2,3,4],
  bools: [true, false],
  dates: [new Date(2024, 1, 1), new Date(2024, 1, 2)],
};

export const nested = {
  l1: {
    value: [1, 2, 3],
    l2: {
      value: [1, 2, 3],
      l3: {
        array: [{ value: 1 }, { value: 2 }]
      }
    },
  },
  value: [1, 2, 3]
}

export const complex = { date, map, set, buffer, func };

export const unsupported = { url, instance };

export const all = { primitives, arrays, nested, complex };
