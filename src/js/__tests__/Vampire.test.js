import Vampire from '../characters/Vampire';

test('class Vampire should constructs object', () => {
  const expected = {
    type: 'vampire',
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    moveDistance: 2,
    attackDistance: 2,
    position: null,
    teamName: null,
  };
  const received = new Vampire(1);
  expect(received).toEqual(expected);
});