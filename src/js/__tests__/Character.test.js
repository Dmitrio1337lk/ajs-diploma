/* eslint-disable no-new */
import Character from '../Character';

test('class Character should throw error in case of direct request new Character', () => {
  expect(() => {
    new Character(1);
  }).toThrowError(new Error("it's not allowed to create class Character directly. Use extended classes: Bowman, Swordsman..."));
});