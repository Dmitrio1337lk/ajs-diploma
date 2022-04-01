import themes from './themes';
import Team from './Team';
import { characterFromObject } from './utils';

export default class GameState {
  constructor(totalScore) {
    this.turn = 'player';
    this.gameOver = false;
    this.level = 1;
    this.score = 0;
    this.totalScore = totalScore;
    this.playerTeam = new Team();
    this.botTeam = new Team();
    this.positions = [];
    this.theme = themes.prairie;
  }

  from(object) {
    this.turn = object.turn;
    this.gameOver = object.gameOver;
    this.level = object.level;
    this.score = object.score;
    this.totalScore = object.totalScore;
    this.theme = object.theme;
    for (let i = 0; i < object.positions.length; i += 1) {
      const char = characterFromObject(object.positions[i].character);
      if (char.teamName === 'player') {
        this.playerTeam.add(char);
      } else if (char.teamName === 'bot') {
        this.botTeam.add(char);
      }
    }
    return null;
  }
}