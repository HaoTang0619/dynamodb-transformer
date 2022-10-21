export class BSet extends Set<Uint8Array> {}
export class NSet extends Set<number> {}
export class SSet extends Set<string> {}

type Explode<T> = keyof T extends infer K
  ? K extends unknown
    ? { [I in keyof T]: I extends K ? T[I] : never }
    : never
  : never;

type AtMostOne<T> = Explode<Partial<T>>;

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type ExactlyOne<T> = AtMostOne<T> & AtLeastOne<T>;

export type Unmarshalled =
  | Uint8Array // B
  | boolean // BOOL
  | BSet // BS
  | Unmarshalled[] // L
  | { [key: string]: Unmarshalled } // M
  | number // N
  | NSet // NS
  | null // NULL
  | string // S
  | SSet; // SS

export type Marshalled = ExactlyOne<{
  B: Uint8Array;
  BOOL: boolean;
  BS: Uint8Array[];
  L: Marshalled[];
  M: { [key: string]: Marshalled };
  N: string;
  NS: string[];
  NULL: true;
  S: string;
  SS: string[];
}>;
