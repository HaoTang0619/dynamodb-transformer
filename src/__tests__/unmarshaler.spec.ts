import { NSet, Unmarshalled } from '../type';
import unmarshaler from '../unmarshaler';

test('unmarshler', () => {
  expect(
    unmarshaler({
      keyBool: { BOOL: true },
      keyList: { L: [{ N: '789' }, { S: 'abc' }] },
      keyNumSet: { NS: ['1', '2', '3'] },
      keyNum: { N: '456' },
      keyStr: { S: '123' },
    }),
  ).toStrictEqual<Unmarshalled>({
    keyBool: true,
    keyList: [789, 'abc'],
    keyNumSet: new NSet([1, 2, 3]),
    keyNum: 456,
    keyStr: '123',
  });
});
