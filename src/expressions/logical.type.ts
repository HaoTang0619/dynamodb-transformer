import { NonEmptyArr, PlainData } from './type';

export type LogicalParams =
  | ['and' | 'or', NonEmptyArr<PlainData>]
  | ['not', PlainData];
