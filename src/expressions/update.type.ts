import { BSet, NSet, SSet, Unmarshalled } from '../type';
import { Expressions } from './type';

// [expressions, updater, name, value]
export type UpdateFuncParams =
  | [Expressions, 'set', string, Unmarshalled]
  | [Expressions, 'remove', string]
  | [Expressions, 'add', string, number | BSet | NSet | SSet]
  | [Expressions, 'delete', string, BSet | NSet | SSet];

// [updater, value]
export type UpdateParams =
  | ['set', Unmarshalled]
  | ['remove']
  | ['add', number | BSet | NSet | SSet]
  | ['delete', BSet | NSet | SSet];

export type UpdateResult = (expressions: Expressions, name: string) => void;
