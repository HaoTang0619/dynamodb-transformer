export class BSet extends Set<Uint8Array> {}
export class NSet extends Set<number> {}
export class SSet extends Set<string> {}

// For marshaler:
export type Unmarshalled =
  | Uint8Array // B
  | boolean // BOOL
  | BSet // BS
  | [Unmarshalled, ...Unmarshalled[]] // L
  | { [name: string]: Unmarshalled } // M
  | number // N
  | NSet // NS
  | null // NULL
  | string // S
  | SSet; // SS

type MapParamList<T> = T extends Unmarshalled
  ? MarshalerOfEachResult<T>
  : never;

type Mapped<
  Arr extends [...unknown[]],
  Result extends unknown[] = [],
> = Arr extends []
  ? []
  : Arr extends [infer H]
  ? [...Result, MapParamList<H>]
  : Arr extends [infer Head, ...infer Tail]
  ? Mapped<[...Tail], [...Result, MapParamList<Head>]>
  : Result;

export type MarshalerOfEachResult<T extends Unmarshalled> = T extends Uint8Array
  ? { B: Uint8Array }
  : T extends boolean
  ? { BOOL: boolean }
  : T extends BSet
  ? { BS: Uint8Array[] }
  : T extends [Unmarshalled, ...Unmarshalled[]]
  ? { L: Mapped<T> }
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

// TODO: For Unmarshaler:
type UnionKeys<T> = T extends T ? keyof T : never;
type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
  : never;
type StrictUnion<T> = StrictUnionHelper<T, T>;

export type Marshalled = StrictUnion<
  | { B: Uint8Array }
  | { BOOL: boolean }
  | { BS: Uint8Array[] }
  | { L: Marshalled[] }
  | { M: { [name: string]: Marshalled } }
  | { N: string }
  | { NS: string[] }
  | { NULL: true }
  | { S: string }
  | { SS: string[] }
>;
