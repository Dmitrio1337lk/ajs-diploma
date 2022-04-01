import Magician from '../characters/Magician';

test('class Magician should constructs object', () => {
  const expected = {
    type: 'magician',
    level: 1,
    attack: 10,
    defence: 40,
    health: 50,
    moveDistance: 1,
    attackDistance: 4,
    position: null,
    teamName: null,
  };
  const received = new Magician(1);
  expect(received).toEqual(expected);
});