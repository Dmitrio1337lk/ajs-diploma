import { randomMinMax } from './utils';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    yield new allowedTypes[randomMinMax(0, (allowedTypes.length - 1))](randomMinMax(1, maxLevel));
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  const characters = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    team.push(characters.next().value);
  }
  return team;
}