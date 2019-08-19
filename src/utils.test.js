import { isEqual } from './utils';

describe('isEqual', () => {

  test('just arrays', () => {
    expect(
      isEqual(
        ['one','two'],
        ['two','one'])
    ).toEqual(true);
    expect(
      isEqual(
        ['one','two'],
        ['one','two','three'])
    ).toEqual(false);
    expect(
      isEqual(
        [['one'],['two']],
        [['two'],['one']])
    ).toEqual(true);
  });

  test('just strings', () => {
    expect(isEqual('one', 'one')).toEqual(true);
    expect(isEqual('one', 'three')).toEqual(false);
  });

  test('just objects', () => {
    expect(isEqual(
      { one: 'one', two: 'two' },
      { two: 'two', one: 'one' }
    )).toEqual(true);
    expect(isEqual(
      { one: 'one', two: 'two' },
      { one: 'one', two: 'two', three: 'three' }
    )).toEqual(false);
    expect(isEqual(
      { one: { two: 'two', three: 'three' }, four: 'four' },
      { four: 'four', one: { three: 'three', two: 'two' } }
    )).toEqual(true);
  });

  test('numbers', () => {
    expect(isEqual(1, 1)).toEqual(true);
    expect(isEqual(1, 2)).toEqual(false);
  });

  test('deeply nested objects and arrays', () => {
    expect(isEqual(
      [{ one: { two: 'two' }, three: { four: { five: ['six', { seven: 'seven'}] } } }],
      [{ one: { two: 'two' }, three: { four: { five: ['six', { seven: 'seven'}] } } }]
    )).toEqual(true);
    expect(isEqual(
      [{ three: { four: { five: ['six', { seven: 'seven'}] } }, one: { two: 'two' }}],
      [{ one: { two: 'two' }, three: { four: { five: [{ seven: 'seven'}, 'six'] } } }]
    )).toEqual(true);
    expect(isEqual(
      { one: [{ four: 'four' }, { five: 'five'}, 'six'], two: ['seven', 8, 9], three: 'three' },
      { three: 'three', two: [9, 8, 'seven'], one: ['six', { five: 'five'}, { four: 'four' }] })
    ).toEqual(true)
  });



});