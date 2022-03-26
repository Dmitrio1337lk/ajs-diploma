import Character from "../Character";
import Bowman from "../CharacterTypes/Bowman";

test("new Character()", () => {
  expect(() => {
    new Character();
  }).toThrow();
});

test("new Bowman", () => {
  const char = new Bowman(2);
  const expected = {
    attack: 25,
    defence: 25,
    distance: 2,
    distanceAttack: 2,
    health: 50,
    level: 2,
    type: "bowman",
  };
  expect(char).toEqual(expected);
});
