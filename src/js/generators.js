/**
 * Generates random characters
 *
 * @param {array} allowedTypes iterable of classes
 * @param {number} maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const randomIndex = Math.floor(Math.random() * allowedTypes.length);
  const randomLevel = Math.floor(Math.random() * (maxLevel)) + 1;
  yield new allowedTypes[randomIndex](randomLevel);
}
/**
 * Generates random team
 *
 * @param  {array} allowedTypes iterable of classes
 * @param  {number} maxLevel max character level
 * @param  {number} characterCount player character count
 */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const char = characterGenerator(allowedTypes, maxLevel);
    team.push(char);
  }
  return team;
}
