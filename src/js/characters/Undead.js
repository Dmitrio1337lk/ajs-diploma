import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this.attack = 40;
    this.defence = 10;
    this.moveDistance = 4;
    this.attackDistance = 1;
    if (level > 1) {
      for (let i = 1; i < level; i += 1) {
        this.levelUp();
      }
    }
  }
}