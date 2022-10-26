export class BSet extends Set<Uint8Array> {}
export class NSet extends Set<number> {}
export class SSet extends Set<string> {}

// Utils
type MapToMarshlled<T> = T extends Unmarshalled
  ? MarshalerOfEachResult<T>
  : never;

type MapToUnmarshlled<T> = T extends Marshalled
  ? UnmarshalerOfEachResult<T>
  : never;

type MapParamList<F, T> = F extends 'to_marshalled'
  ? MapToMarshlled<T>
  : MapToUnmarshlled<T>;

type Mapped<
  Arr extends [...unknown[]],
  F extends 'to_marshalled' | 'to_unmarshalled',
  Result extends unknown[] = [],
> = Arr extends []
  ? []
  : Arr extends [infer H]
  ? [...Result, MapParamList<F, H>]
  : Arr extends [infer Head, ...infer Tail]
  ? Mapped<[...Tail], F, [...Result, MapParamList<F, Head>]>
  : Result;

// For marshaler:
export type Unmarshalled =
  | Uint8Array // B
  | boolean // BOOL
  | BSet // BS
  | [Unmarshalled, ...Unmarshalled[]] // L (tuple type)
  | { [name: string]: Unmarshalled } // M
  | number // N
  | NSet // NS
  | null // NULL
  | string // S
  | SSet; // SS

export type MarshalerOfEachResult<T extends Unmarshalled> = T extends Uint8Array
  ? { B: Uint8Array }
  : T extends boolean
  ? { BOOL: boolean }
  : T extends BSet
  ? { BS: Uint8Array[] }
  : T extends [Unmarshalled, ...Unmarshalled[]]
  ? { L: Mapped<T, 'to_marshalled'> }
  : T extends { [name: string]: Unmarshalled }
  ? { M: MarshalerResult<T> }
  : T extends number
  ? { N: string }
  : T extends NSet
  ? { NS: string[] }
  : T extends null
  ? { NULL: true }
  : T extends string
  ? { S: string }
  : T extends SSet
  ? { SS: string[] }
  : never;

export type MarshalerParams = {
  [name: string]: Unmarshalled;
};

export type MarshalerResult<T extends MarshalerParams> = {
  [P in keyof T]: MarshalerOfEachResult<T[P]>;
};

// For Unmarshaler:
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
  : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type Marshalled = StrictUnion<
  | { B: Uint8Array }
  | { BOOL: boolean }
  | { BS: Uint8Array[] }
  | { L: [Marshalled, ...Marshalled[]] } // (tuple type)
  | { M: { [name: string]: Marshalled } }
  | { N: string }
  | { NS: string[] }
  | { NULL: true }
  | { S: string }
  | { SS: string[] }
>;

export type UnmarshalerOfEachResult<T extends Marshalled> = keyof T extends 'B'
  ? Uint8Array
  : keyof T extends 'BOOL'
  ? boolean
  : keyof T extends 'BSet'
  ? BSet
  : keyof T extends 'L'
  ? T['L'] extends [Marshalled, ...Marshalled[]]
    ? Mapped<T['L'], 'to_unmarshalled'>
    : never
  : keyof T extends 'M'
  ? T['M'] extends { [name: string]: Marshalled }
    ? UnmarshalerResult<T['M']>
    : never
  : keyof T extends 'N'
  ? number
  : keyof T extends 'NS'
  ? NSet
  : keyof T extends 'NULL'
  ? null
  : keyof T extends 'S'
  ? string
  : keyof T extends 'SS'
  ? SSet
  : never;

export type UnmarshalerParams = {
  [name: string]: Marshalled;
};

export type UnmarshalerResult<T extends UnmarshalerParams> = {
  [P in keyof T]: UnmarshalerOfEachResult<T[P]>;
};
