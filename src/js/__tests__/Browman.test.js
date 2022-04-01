import Bowman from '../characters/Bowman';

test('class Bowerman should constructs object', () => {
  const expected = {
    type: 'bowman',
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    moveDistance: 2,
    attackDistance: 2,
    position: null,
    teamName: null,
  };
  const received = new Bowman(1);
  expect(received).toEqual(expected);
});

test('class Bowerman should automatically levelUp character', () => {
  const expected = {
    type: 'bowman',
    level: 2,
    attack: 33,
    defence: 33,
    health: 100,
    moveDistance: 2,
    attackDistance: 2,
    position: null,
    teamName: null,
  };
  const rec = new Bowman(2);
  expect(rec).toEqual(expected);
});