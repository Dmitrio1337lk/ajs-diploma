/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import GamePlay from './GamePlay';
import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import { generateTeam } from './generators';
import GameState from './GameState';
import cursors from './cursors';
import { randomMinMax } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.selectedCharacter = null;
  }

  init() {
    this.gamePlay.addCellEnterListener((index) => this.onCellEnter(index));
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    this.gamePlay.addNewGameListener(() => this.newGame());
    this.gamePlay.addSaveGameListener(() => this.saveGame());
    this.gamePlay.addLoadGameListener(() => this.loadGame());
    this.loadGame();
    if (!this.gameState) {
      this.newGame();
    }
  }

  newGame() {
    const totalScore = this.gameState && this.gameState.totalScore ? this.gameState.totalScore : 0;
    this.gameState = new GameState(totalScore);
    this.gamePlay.drawUi(this.gameState.theme);
    this.gameState.playerTeam.addAll(generateTeam([Swordsman, Bowman], 1, 2));
    this.gameState.playerTeam.addTeamNameToCharacter('player');
    this.gameState.botTeam.addAll(generateTeam([Daemon, Undead, Vampire], 1, 2));
    this.gameState.botTeam.addTeamNameToCharacter('bot');
    this.assignPositionsToTeams();
    this.positionCharacters();
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  loadGame() {
    try {
      const state = this.stateService.load();
      if (state) {
        this.gameState = new GameState(state.totalScore);
        this.gameState.from(state);
        this.gamePlay.drawUi(this.gameState.theme);
        this.positionCharacters();
        this.gamePlay.redrawPositions(this.gameState.positions);
      }
    } catch (error) {
      GamePlay.showError(error.message);
    }
  }

  saveGame() {
    this.stateService.save(this.gameState);
  }

  assignPositionsToTeams() {
    const playerPositions = this.playerPositionsAtLevelStart();
    const botPositions = this.botPositionsAtLevelStart();
    this.gameState.playerTeam.members.forEach((item) => {
      const index = randomMinMax(0, playerPositions.length - 1);
      item.position = playerPositions[index];
      playerPositions.splice(index, 1);
    });
    this.gameState.botTeam.members.forEach((item) => {
      const index = randomMinMax(0, botPositions.length - 1);
      item.position = botPositions[index];
      botPositions.splice(index, 1);
    });
  }

  positionCharacters() {
    this.gameState.playerTeam.members.forEach((item) => {
      this.gameState.positions.push(new PositionedCharacter(item, item.position));
    });
    this.gameState.botTeam.members.forEach((item) => {
      this.gameState.positions.push(new PositionedCharacter(item, item.position));
    });
  }

  playerPositionsAtLevelStart() {
    const arr = [];
    const { boardSize } = this.gamePlay;
    for (let i = 0; i < boardSize ** 2; i += 1) {
      if (Number.isInteger(i / boardSize) || Number.isInteger((i - 1) / boardSize)) {
        arr.push(i);
      }
    }
    return arr;
  }

  botPositionsAtLevelStart() {
    const arr = [];
    const { boardSize } = this.gamePlay;
    for (let i = 0; i < boardSize ** 2; i += 1) {
      if (Number.isInteger((i + 1) / boardSize) || Number.isInteger((i + 2) / boardSize)) {
        arr.push(i);
      }
    }
    return arr;
  }

  onCellEnter(index) {
    if (this.gameState.positions.find((item) => item.position === index)) {
      const position = this.gameState.positions.find((item) => item.position === index);
      this.gamePlay.showCellTooltip(GameController.showCharacterStats(position.character), index);
    }
    if (!this.selectedCharacter && this.characterByCellAndTeam(index, 'player')) {
      this.gamePlay.setCursor(cursors.pointer); // ?????????????????? ?????????? ??????????????????
    }
    if (this.selectedCharacter) {
      const visualResponse = this.visualResponse(index);
      this.gamePlay.setCursor(visualResponse.cursors);
      this.gamePlay.selectCell(index, visualResponse.color);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.deselectCell(index);
    if (this.selectedCharacter) {
      this.gamePlay.selectCell(this.selectedCharacter.position);
    }
  }

  onCellClick(index) {
    if (this.gameState.turn === 'player' && !this.gameState.gameOver) {
      const clickedCharacter = this.characterByCellAndTeam(index);
      if (clickedCharacter) { // ???????????????? ???????? ?????????????? ???? ??????????????????
        if (this.selectedCharacter === null) { // ???????????????? ?????????????????? ???????? ???????????????? ???? ????????????
          if (clickedCharacter.character.teamName === 'player') {
            this.selectCharacter(clickedCharacter);
          } else {
            GamePlay.showError('?????? ???????????????? ??????????????????');
          }
        } else if (index === this.selectedCharacter.position) { // ?????????????? ?????????????????? ???????? ?????????????? ???? ?????? ???????????????????? ??????????????????
          this.deselectCharacter(index);
        } else if (clickedCharacter.character.teamName === 'player') { // ?????????????????????????? ???? ???????????????? ???????? ?????????????? ???? ????????
          this.deselectCharacter(this.selectedCharacter.position);
          this.selectCharacter(clickedCharacter);
        } else if (clickedCharacter.character.teamName === 'bot') { // ?????????????? ?? ?????????????????? ?????????????????????? ?????????? ???????? ???????????????? ?????? ???????????? ?? ???????????????? ???? ??????????????????
          if (this.attackIsPossiable(this.selectedCharacter.character, this.selectedCharacter.position, index)) {
            this.attack(this.selectedCharacter, clickedCharacter).then(() => {
              this.gameLoop();
            });
          } else if (this.selectedCharacter.character.attackDistance === 1) {
            GamePlay.showMessage(`???????????????? ${this.selectedCharacter.character.type} ?????????? ?????????????????? ???? ?????????????? ???? ?????????? 1 ????????????`);
          } else {
            GamePlay.showMessage(`???????????????? ${this.selectedCharacter.character.type} ?????????? ?????????????????? ???? ?????????????? ???? ?????????? ${this.selectedCharacter.character.attackDistance} ????????????`);
          }
        }
      } else if (this.selectedCharacter) { // ?????????????? ?????????????????? ???????? ???????????????? ???????????? ?? ?????????????????? ???????????????? ???? ??????????????????????
        this.moveCharacter(this.selectedCharacter.character, index);
        this.gameLoop();
      }
    }
  }

  gameLoop() {
    this.levelUp();
    this.isGameOver();
    this.gamePlay.redrawPositions(this.gameState.positions);
    if (this.gameState.turn === 'player') {
      this.selectedCharacter = null;
      this.gameState.turn = 'bot';
      this.botActions(this.gameState);
    } else {
      this.selectedCharacter = null;
      this.gameState.turn = 'player';
    }
  }

  botActions() {
    const options = [];
    const scoring = {
      attack: 1,
      nextMoveAttck: 0.7,
      move: 0.5,
    };
    const botTeam = this.gameState.botTeam.members;
    const playerTeam = this.gameState.playerTeam.members;
    // ???????????? ?????????????????????? ??????????
    for (let i = 0; i < botTeam.length; i += 1) {
      for (let y = 0; y < playerTeam.length; y += 1) {
        if (this.attackIsPossiable(botTeam[i], botTeam[i].position, playerTeam[y].position)) {
          const option = {
            type: 'attack',
            attacker: botTeam[i],
            target: playerTeam[y],
            damage: GameController.damage(botTeam[i], playerTeam[y]),
          };
          options.push(option);
        }
      }
    }
    // ???????????? ?????????????????????? ?????????????????????? ?? ?????????????????????? ??????????
    for (let i = 0; i < botTeam.length; i += 1) {
      for (let y = 0; y < this.gamePlay.boardSize ** 2; y += 1) {
        if (this.moveIsPossiable(botTeam[i], y) && !this.characterByCellAndTeam(y)) {
          const option = {
            type: 'move',
            character: botTeam[i],
            moveIndex: y,
          };
          playerTeam.forEach((item) => {
            if (this.attackIsPossiable(botTeam[i], y, item.position)) {
              option.nextMoveAttack = true;
              option.targetNextMove = item;
              option.damage = GameController.damage(option.character, option.targetNextMove);
              options.push(option);
            }
          });
          if (!option.nextMoveAttack) {
            options.push(option);
          }
        }
      }
    }

    if (options.length >= 1) {
      options.forEach((item) => {
        if (item.type === 'attack') {
          item.score = item.damage * scoring.attack;
        } else if (item.type === 'move' && item.nextMoveAttack) {
          item.score = item.damage * scoring.nextMoveAttck;
        } else {
          item.score = scoring.move;
        }
      });
      let action = options[0];
      options.forEach((item) => {
        if (item.score > action.score) {
          action = item;
        }
      });
      if (action.type === 'attack') {
        const attacker = this.characterByCellAndTeam(action.attacker.position);
        this.selectCharacter(attacker);
        this.attack(attacker, this.characterByCellAndTeam(action.target.position)).then(() => {
          this.gameLoop();
        });
      } else if (action.type === 'move') {
        const character = this.characterByCellAndTeam(action.character.position);
        this.selectCharacter(character);
        this.moveCharacter(character.character, action.moveIndex);
        this.gameLoop();
      }
    } else {
      this.gameLoop();
    }
  }

  visualResponse(index) {
    const result = {
      cursors: 'auto',
      color: null,
    };
    if (this.characterByCellAndTeam(index, 'bot') && this.attackIsPossiable(this.selectedCharacter.character, this.selectedCharacter.position, index)) { // ?????????????????? ??????????
      result.cursors = cursors.crosshair;
      result.color = 'red';
    } else if (this.characterByCellAndTeam(index, 'player')) { // ?????????????????? ???????????????????????? ???? ?????????????? ???????????????? ??????????????????
      result.cursors = cursors.pointer;
      result.color = 'yellow';
    } else if (this.moveIsPossiable(this.selectedCharacter.character, index) && !this.characterByCellAndTeam(index, 'bot')) { // ?????????????????? ??????????????????????
      result.cursors = cursors.pointer;
      result.color = 'green';
    } else { // ?????????????????? ?????? ???? ????????????????
      result.cursors = cursors.notallowed;
      result.color = null;
    }
    return result;
  }

  // @param character instance of Character or its children
  static showCharacterStats(character) {
    const message = `${String.fromCodePoint(0x1F396)}${character.level}  ${String.fromCodePoint(0x2694)}${character.attack}  ${String.fromCodePoint(0x1F6E1)}${character.defence}  ${String.fromCodePoint(0x2764)}${character.health}`;
    return message;
  }

  // @param team is string or null
  // return object positionedCharacter
  characterByCellAndTeam(index, team) {
    if (team) {
      return this.gameState.positions.find((item) => item.position === index && item.character.teamName === team);
    }
    return this.gameState.positions.find((item) => item.position === index);
  }

  // @param character element from positioned Character / this.gameState.positions
  selectCharacter(character) {
    this.gamePlay.selectCell(character.position);
    this.selectedCharacter = character;
  }

  deselectCharacter(index) {
    this.gamePlay.deselectCell(index);
    this.selectedCharacter = null;
  }

  moveIsPossiable(character, index) {
    const allowedDistance = character.moveDistance;
    const distanceX = Math.abs((index % this.gamePlay.boardSize) - (character.position % this.gamePlay.boardSize));
    const distanceY = Math.abs(Math.trunc(index / this.gamePlay.boardSize) - Math.trunc(character.position / this.gamePlay.boardSize));
    if ((distanceX === 0 || distanceY === 0) && (distanceX <= allowedDistance && distanceY <= allowedDistance)) {
      return true;
    } if (distanceX <= allowedDistance && distanceY <= allowedDistance && Math.abs(distanceY - distanceX) === 0) {
      return true;
    }
    return false;
  }

  moveCharacter(character, index) {
    if (this.moveIsPossiable(character, index)) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.gamePlay.deselectCell(index);
      this.selectedCharacter.position = index;
      this.selectedCharacter.character.position = index;
      this.selectedCharacter = null;
    } else if (this.selectedCharacter.character.moveDistance === 1) {
      GamePlay.showMessage(`???????????????? ${this.selectedCharacter.character.type} ?????????? ?????????????????????????? ???? ??????????????????????, ?????????????????? ?? ?????????????????? ?? ???????????? ???? 1 ????????????`);
    } else {
      GamePlay.showMessage(`???????????????? ${this.selectedCharacter.character.type} ?????????? ?????????????????????????? ???? ??????????????????????, ?????????????????? ?? ?????????????????? ?? ???????????? ???? ${this.selectedCharacter.character.moveDistance} ????????????`);
    }
  }

  // @param attacker ???????????? ??????????????????
  attackIsPossiable(attacker, attackerPosition, targetPosition) {
    const allowedDistance = attacker.attackDistance;
    const distanceX = Math.abs((targetPosition % this.gamePlay.boardSize) - (attackerPosition % this.gamePlay.boardSize));
    const distanceY = Math.abs(Math.trunc(targetPosition / this.gamePlay.boardSize) - Math.trunc(attackerPosition / this.gamePlay.boardSize));
    return distanceX <= allowedDistance && distanceY <= allowedDistance;
  }

  static damage(attacker, target) {
    return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
  }

  // @params objects form this.positions
  attack(attacker, target) {
    const damage = GameController.damage(attacker.character, target.character);
    return this.gamePlay.showDamage(target.position, damage).then(() => {
      target.character.health -= damage;
      this.gamePlay.deselectCell(target.position);
      this.gamePlay.deselectCell(attacker.position);
      this.selectedCharacter = null;
      if (target.character.health <= 0) {
        this.gameState.positions.splice(this.gameState.positions.findIndex((item) => item === target), 1);
        if (target.character.health <= 0) {
          this.gameState.botTeam.deleteDead();
          this.gameState.playerTeam.deleteDead();
        }
      }
    });
  }

  // ?????????? ?????? ?????????????????? ???????????????????? ??????????????
  levelUp() {
    if (this.gameState.botTeam.members.length === 0) {
      this.gameState.level += 1;
      if (this.gameState.level > 4) {
        this.gameState.playerTeam.members.forEach((item) => {
          this.gameState.score += item.health;
          this.gameState.totalScore += this.gameState.score;
        });
        this.gameState.gameOver = true;
      } else {
        let numberOfCharactersAdd = 0;
        if (this.gameState.level === 2) {
          this.gameState.theme = themes.desert;
          numberOfCharactersAdd = 1;
        } else if (this.gameState.level === 3) {
          this.gameState.theme = themes.arctic;
          numberOfCharactersAdd = 2;
        } else if (this.gameState.level === 4) {
          this.gameState.theme = themes.mountain;
          numberOfCharactersAdd = 2;
        }
        this.gameState.playerTeam.members.forEach((item) => {
          this.gameState.score += item.health;
        });
        this.gameState.playerTeam.members.forEach((item) => item.levelUp());
        this.gameState.positions = [];
        this.gameState.turn = 'player';
        this.gameState.playerTeam.addAll(generateTeam([Swordsman, Bowman, Magician], this.gameState.level, numberOfCharactersAdd));
        this.gameState.playerTeam.addTeamNameToCharacter('player');
        this.gameState.botTeam.addAll(generateTeam([Daemon, Undead, Vampire], this.gameState.level, this.gameState.playerTeam.members.length));
        this.gameState.botTeam.addTeamNameToCharacter('bot');
        this.assignPositionsToTeams();
        this.positionCharacters();
        this.gamePlay.drawUi(this.gameState.theme);
        this.gamePlay.redrawPositions(this.gameState.positions);
      }
    }
  }

  isGameOver() {
    if (this.gameState.playerTeam.members.length > 0 && this.gameState.gameOver === true) {
      GamePlay.showMessage(`?????????????????????? ???? ????????????????!\n ?????? ????????: ${this.gameState.score} \n ?????? ???????????????????????? ????????: ${this.gameState.totalScore}`);
    } else if (this.gameState.playerTeam.members.length === 0) {
      this.gameState.gameOver = true;
      GamePlay.showMessage('???? ??????????????????\n ???????????????????? ?????? ??????');
    }
  }
}