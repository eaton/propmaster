import is from '@sindresorhus/is';
import { Propmaster } from './propmaster';

export class Property {
  constructor(protected object: Propmaster, protected path: string) { }

  any() {}
  all() {}
  none() {}

  get value(): unknown {
    return this.object.get(this.path);
  }
}