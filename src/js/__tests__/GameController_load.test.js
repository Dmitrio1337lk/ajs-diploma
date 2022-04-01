import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameState from '../GameState';

jest.mock('../GamePlay');
jest.mock('../GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

test('load success', () => {
  const gamePlay = new GamePlay();
  const gameStateService = new GameStateService();
  const gameCtrl = new GameController(gamePlay, gameStateService);
  gameCtrl.stateService.load = jest.fn(() => new GameState());
  gameCtrl.gamePlay.drawUi = jest.fn();
  gameCtrl.gamePlay.redrawPositions = jest.fn();
  gameCtrl.loadGame();
  expect(gameCtrl.gamePlay.drawUi.mock.calls.length).toBe(1);
  expect(gameCtrl.gamePlay.redrawPositions.mock.calls.length).toBe(1);
});

test('load error', () => {
  const gameCtrl = new GameController(GamePlay, GameStateService);
  GameStateService.load = jest.fn(() => {
    throw new Error('Invalid state');
  });
  GamePlay.showError = jest.fn();
  gameCtrl.loadGame();
  expect(GamePlay.showError.mock.calls.length).toBe(1);
});