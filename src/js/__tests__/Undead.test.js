import Undead from '../characters/Undead';

test('class Undead should constructs object', () => {
  const expected = {
    type: 'undead',
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    moveDistance: 4,
    attackDistance: 1,
    position: null,
    teamName: null,
  };
  const received = new Undead(1);
  expect(received).toEqual(expected);
});