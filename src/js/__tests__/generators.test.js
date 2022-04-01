import { generateTeam } from '../generators';
import Swordsman from '../characters/Swordsman';

test('function generateTeam should constructs array of characters and characterGenerator should generate characters', () => {
  const expected = [new Swordsman(1), new Swordsman(1), new Swordsman(1)];
  const allowedTypes = [Swordsman, Swordsman, Swordsman];
  const received = generateTeam(allowedTypes, 1, 3);
  expect(received).toEqual(expected);
});