import Swordsman from '../characters/Swordsman';
import Daemon from '../characters/Daemon';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameState from '../GameState';
import { generateTeam } from '../generators';

const gamePlay = new GamePlay();
const gameCtrl = new GameController(gamePlay);
gameCtrl.gameState = new GameState(0);
gameCtrl.gameState.playerTeam.addAll(generateTeam([Swordsman], 1, 2));
gameCtrl.gameState.playerTeam.addTeamNameToCharacter('player');
gameCtrl.gameState.botTeam.addAll(generateTeam([Daemon], 1, 2));
gameCtrl.gameState.botTeam.addTeamNameToCharacter('bot');
gameCtrl.gameState.playerTeam.members[0].position = 53;
gameCtrl.gameState.playerTeam.members[1].position = 57;
gameCtrl.gameState.botTeam.members[0].position = 62;
gameCtrl.gameState.botTeam.members[1].position = 63;
gameCtrl.positionCharacters();
// eslint-disable-next-line prefer-destructuring
gameCtrl.selectedCharacter = gameCtrl.gameState.positions[0];

test.each([
  [51, { cursors: 'pointer', color: 'green' }],
  [43, { cursors: 'not-allowed', color: null }],
  [57, { cursors: 'pointer', color: 'yellow' }],
  [62, { cursors: 'crosshair', color: 'red' }],
  [43, { cursors: 'not-allowed', color: null }],
])(
  ('should change mouse arrow view'),
  (index, expected) => {
    expect(gameCtrl.visualResponse(index)).toStrictEqual(expected);
  },
);