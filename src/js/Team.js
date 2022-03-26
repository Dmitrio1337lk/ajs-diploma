/**
 * The class responsible for the team (character set) of the player and the compute
 */
export default class Team {
  constructor() {
    this.team = [];
  }

  /**
   * Add new characters to the team
   * @param  {} character - one of the children of the class Character
   */
  strengthened(character) {
    this.team.push(character);
  }
}
