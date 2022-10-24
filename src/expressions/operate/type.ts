import { Expressions, PlainValues, PlainValuesArr } from '../type';

// [expressions, operator, name, value]
export type OperateFuncParams =
  | [
      Expressions,
      '=' | '<>' | '<' | '<=' | '>' | '>=',
      string,
      Uint8Array | number | string,
    ]
  | [Expressions, '=' | '<>', string, boolean | null]
  | [
      Expressions,
      'between',
      string,
      [Uint8Array, Uint8Array] | [number, number] | [string, string],
    ]
  | [Expressions, 'in', string, PlainValuesArr]
  | [Expressions, 'attribute_exists' | 'attribute_not_exists' | 'size', string]
  | [
      Expressions,
      'attribute_type',
      string,
      'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
    ]
  | [Expressions, 'begins_with', string, Uint8Array | string]
  | [Expressions, 'contains', string, PlainValues];

// [operator, value]
export type OperateParams =
  | ['=' | '<>' | '<' | '<=' | '>' | '>=', Uint8Array | number | string]
  | ['=' | '<>', boolean | null]
  | ['between', [Uint8Array, Uint8Array] | [number, number] | [string, string]]
  | ['in', PlainValuesArr]
  | ['attribute_exists' | 'attribute_not_exists' | 'size']
  | [
      'attribute_type',
      'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
    ]
  | ['begins_with', Uint8Array | string]
  | ['contains', PlainValues];

export type OperateResult = (expressions: Expressions, name: string) => string;
