import { BSet, Marshalled, NSet, SSet, Unmarshalled } from './type';

const marshalerOfEach = (value: Unmarshalled): Marshalled => {
  // B
  if (value instanceof Uint8Array) {
    return { B: value };
  }

  // BOOL
  if (typeof value === 'boolean') {
    return { BOOL: value };
  }

  // BS
  if (value instanceof BSet) {
    return { BS: [...value] };
  }

  // L
  if (Array.isArray(value)) {
    return { L: value.map((v) => marshalerOfEach(v)) };
  }

  // M is the last
  // N
  if (typeof value === 'number') {
    return { N: String(value) };
  }

  // NS
  if (value instanceof NSet) {
    return { NS: [...value].map(String) };
  }

  // NULL
  if (value === null) {
    return { NULL: true };
  }

  // S
  if (typeof value === 'string') {
    return { S: value };
  }

  // SS
  if (value instanceof SSet) {
    return { SS: [...value] };
  }

  // M
  return { M: marshaler(value) };
};

const marshaler = (data: {
  [key: string]: Unmarshalled;
}): { [key: string]: Marshalled } => {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: marshalerOfEach(value) }),
    {},
  );
};

export default marshaler;
