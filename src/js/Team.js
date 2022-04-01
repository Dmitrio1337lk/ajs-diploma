/* eslint-disable no-param-reassign */

export default class Team {
  constructor() {
    this.members = [];
  }

  add(character) {
    this.members.push(character);
  }

  deleteDead() {
    if (this.members.findIndex((item) => item.health <= 0) > -1) {
      this.members.splice(this.members.findIndex((item) => item.health <= 0), 1);
    }
  }

  addAll(characters) {
    characters.forEach((item) => {
      this.add(item);
    });
  }

  addTeamNameToCharacter(name) {
    this.members.forEach((item) => {
      item.teamName = name;
    });
  }
}