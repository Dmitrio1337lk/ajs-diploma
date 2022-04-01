import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

export function calcTileType(index, boardSize) {
  const topCells = index < (boardSize - 1);
  const leftCells = Number.isInteger(index / boardSize);
  const rightCells = Number.isInteger((index + 1) / boardSize);
  const bottomCells = index >= (boardSize ** 2 - boardSize);
  if (index === 0) {
    return 'top-left';
  }
  if (index === (boardSize - 1)) {
    return 'top-right';
  }
  if (index === boardSize ** 2 - boardSize) {
    return 'bottom-left';
  }
  if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  }
  if (topCells) {
    return 'top';
  }
  if (leftCells) {
    return 'left';
  }
  if (rightCells) {
    return 'right';
  }
  if (bottomCells) {
    return 'bottom';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function randomMinMax(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export function showCharacterStats(character) {
  const message = `${String.fromCodePoint(0x1F396)}${character.level}  ${String.fromCodePoint(0x2694)}${character.attack}  ${String.fromCodePoint(0x1F6E1)}${character.defence}  ${String.fromCodePoint(0x2764)}${character.health}`;
  return message;
}


export function characterFromObject(object) {
  let char;
  if (object.type === 'bowman') {
    char = new Bowman(1);
  } else if (object.type === 'daemon') {
    char = new Daemon(1);
  } else if (object.type === 'magician') {
    char = new Magician(1);
  } else if (object.type === 'swordsman') {
    char = new Swordsman(1);
  } else if (object.type === 'undead') {
    char = new Undead(1);
  } else if (object.type === 'vampire') {
    char = new Vampire(1);
  }
  char.from(object);
  return char;
}