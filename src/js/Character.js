export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error("it's not allowed to create class Character directly. Use extended classes: Bowman, Swordsman...");
    } else {
      this.level = 1;
      this.health = 50;
      this.type = type;
      this.attack = null;
      this.defence = null;
      this.moveDistance = null;
      this.attackDistance = null;
      this.teamName = null;
      this.position = null;
    }
  }

  levelUp() {
    if (this.health !== 0) {
      this.level += 1;
      this.attack = Math.max(this.attack, Math.round(this.attack * (0.8 + this.health / 100)));
      this.defence = Math.max(this.defence, Math.round(this.defence * (0.8 + this.health / 100)));
      this.health = this.health + 80 > 100 ? 100 : this.health + 80;
    } else {
      throw new Error('Нельзя повысить левел умершего');
    }
  }

  from(object) {
    this.level = object.level;
    this.health = object.health;
    this.attack = object.attack;
    this.defence = object.defence;
    this.moveDistance = object.moveDistance;
    this.attackDistance = object.attackDistance;
    this.teamName = object.teamName;
    this.position = object.position;
  }
}