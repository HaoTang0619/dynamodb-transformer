export class BSet extends Set<Uint8Array> {}
export class NSet extends Set<number> {}
export class SSet extends Set<string> {}

export type Unmarshalled =
  | Uint8Array // B
  | boolean // BOOL
  | BSet // BS
  | Unmarshalled[] // L
  | { [name: string]: Unmarshalled } // M
  | number // N
  | NSet // NS
  | null // NULL
  | string // S
  | SSet; // SS

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
