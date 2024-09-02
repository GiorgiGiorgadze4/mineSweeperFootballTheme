export default {
  isFinished: true,
  balance: 9999,
  boardSize: [
    [4, 3],
    [7, 4],
    [10, 5],
  ],
  multiplier: 1,
  isAutoplay: false,
  userSelections: [],
  isPlayingAuto: false,
  hasWonLast: false,
  defaultUserBet: 2,

  isSoundEnabled: true,
} as {
  isFinished: boolean;
  balance: number;
  boardSize: number[][];
  multiplier: number;
  isAutoplay: boolean;
  userSelections: number[][];
  isPlayingAuto: boolean;
  hasWonLast: boolean;
  defaultUserBet: number;

  isSoundEnabled: boolean;
};
