import { BSet, Marshalled, NSet, SSet, Unmarshalled } from './type';

const unmarshalerOfEach = (value: Marshalled): Unmarshalled => {
  // B
  if (value.B !== undefined) {
    return value.B;
  }

  // BOOL
  if (value.BOOL !== undefined) {
    return value.BOOL;
  }

  // BS
  if (value.BS !== undefined) {
    return new BSet(value.BS);
  }

  // L
  if (value.L !== undefined) {
    return value.L.map(unmarshalerOfEach);
  }

  // M
  if (value.M !== undefined) {
    return unmarshaler(value.M);
  }

  // N
  if (value.N !== undefined) {
    return parseInt(value.N, 10);
  }

  // NS
  if (value.NS !== undefined) {
    return new NSet(value.NS.map((v) => parseInt(v, 10)));
  }

  // NULL
  if (value.NULL !== undefined) {
    return null;
  }

  // S
  if (value.S !== undefined) {
    return value.S;
  }

  // SS
  return new SSet(value.SS);
};

const unmarshaler = (data: { [key: string]: Marshalled }): Unmarshalled => {
  return Object.entries(data).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: unmarshalerOfEach(value) }),
    {},
  );
};

export default unmarshaler;
