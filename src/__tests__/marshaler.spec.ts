import marshaler from '../marshaler';
import { Marshalled, NSet } from '../type';

test('marshler', () => {
  expect(
    marshaler({
      keyBool: true,
      keyList: [789, 'abc'],
      keyNumSet: new NSet([1, 2, 3]),
      keyNum: 456,
      keyStr: '123',
    }),
  ).toStrictEqual<{ [key: string]: Marshalled }>({
    keyBool: { BOOL: true },
    keyList: { L: [{ N: '789' }, { S: 'abc' }] },
    keyNumSet: { NS: ['1', '2', '3'] },
    keyNum: { N: '456' },
    keyStr: { S: '123' },
  });
});
