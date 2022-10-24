import { Expressions, NonEmptyArr } from './type';

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
  | [
      Expressions,
      'in',
      string,
      NonEmptyArr<Uint8Array | boolean | number | null | string>,
    ]
  | [Expressions, 'attribute_exists' | 'attribute_not_exists' | 'size', string]
  | [
      Expressions,
      'attribute_type',
      string,
      'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
    ]
  | [Expressions, 'begins_with', string, Uint8Array | string]
  | [
      Expressions,
      'contains',
      string,
      Uint8Array | boolean | number | null | string,
    ];

// [operator, value]
export type OperateParams =
  | ['=' | '<>' | '<' | '<=' | '>' | '>=', Uint8Array | number | string]
  | ['=' | '<>', boolean | null]
  | ['between', [Uint8Array, Uint8Array] | [number, number] | [string, string]]
  | ['in', NonEmptyArr<Uint8Array | boolean | number | null | string>]
  | ['attribute_exists' | 'attribute_not_exists' | 'size']
  | [
      'attribute_type',
      'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
    ]
  | ['begins_with', Uint8Array | string]
  | ['contains', Uint8Array | boolean | number | null | string];

export type OperateResult = (expressions: Expressions, name: string) => string;
