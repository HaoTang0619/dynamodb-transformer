import { NSet, Unmarshalled } from '../type';
import unmarshaler from '../unmarshaler';

test('unmarshler', () => {
  expect(
    unmarshaler({
      nameBool: { BOOL: true },
      nameList: { L: [{ N: '789' }, { S: 'abc' }] },
      nameNumSet: { NS: ['1', '2', '3'] },
      nameNum: { N: '456' },
      nameStr: { S: '123' },
    }),
  ).toStrictEqual<Unmarshalled>({
    nameBool: true,
    nameList: [789, 'abc'],
    nameNumSet: new NSet([1, 2, 3]),
    nameNum: 456,
    nameStr: '123',
  });
});
