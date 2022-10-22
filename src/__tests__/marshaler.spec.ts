import marshaler from '../marshaler';
import { Marshalled, NSet } from '../type';

test('marshler', () => {
  expect(
    marshaler({
      nameBool: true,
      nameList: [789, 'abc'],
      nameNumSet: new NSet([1, 2, 3]),
      nameNum: 456,
      nameStr: '123',
    }),
  ).toStrictEqual<{ [name: string]: Marshalled }>({
    nameBool: { BOOL: true },
    nameList: { L: [{ N: '789' }, { S: 'abc' }] },
    nameNumSet: { NS: ['1', '2', '3'] },
    nameNum: { N: '456' },
    nameStr: { S: '123' },
  });
});
