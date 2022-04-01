import Swordsman from '../characters/Swordsman';

test('class Swordsman should constructs object', () => {
  const expected = {
    type: 'swordsman',
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    moveDistance: 4,
    attackDistance: 1,
    position: null,
    teamName: null,
  };
  const received = new Swordsman(1);
  expect(received).toEqual(expected);
});