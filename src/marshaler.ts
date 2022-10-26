import {
  BSet,
  MarshalerOfEachResult,
  MarshalerParams,
  MarshalerResult,
  NSet,
  SSet,
  Unmarshalled,
} from './type';

const marshalerOfEach = <T extends Unmarshalled>(
  value: T,
): MarshalerOfEachResult<T> => {
  // B
  if (value instanceof Uint8Array) {
    return { B: value } as MarshalerOfEachResult<T>;
  }

  // BOOL
  if (typeof value === 'boolean') {
    return { BOOL: value } as MarshalerOfEachResult<T>;
  }

  // BS
  if (value instanceof BSet) {
    return { BS: [...value] } as MarshalerOfEachResult<T>;
  }

  // L
  if (Array.isArray(value)) {
    return {
      L: value.map((v) => marshalerOfEach(v)),
    } as MarshalerOfEachResult<T>;
  }

  // M is the last
  // N
  if (typeof value === 'number') {
    return { N: String(value) } as MarshalerOfEachResult<T>;
  }

  // NS
  if (value instanceof NSet) {
    return { NS: [...value].map(String) } as MarshalerOfEachResult<T>;
  }

  // NULL
  if (value === null) {
    return { NULL: true } as MarshalerOfEachResult<T>;
  }

  // S
  if (typeof value === 'string') {
    return { S: value } as MarshalerOfEachResult<T>;
  }

  // SS
  if (value instanceof SSet) {
    return { SS: [...value] } as MarshalerOfEachResult<T>;
  }

  // M
  return { M: marshaler(value) } as MarshalerOfEachResult<T>;
};

const marshaler = <T extends MarshalerParams>(data: T): MarshalerResult<T> => {
  return Object.entries(data).reduce(
    (acc, [name, value]) => ({ ...acc, [name]: marshalerOfEach(value) }),
    {},
  ) as MarshalerResult<T>;
};

export default marshaler;
