import Tile from "./Tile.js";
import data from "../../data.js";
import * as Enum from "../../enums.js";

export default class Board {
  private element: any;
  private tileColumns: number;
  private tilesPerColumn: number;
  private tiles: Tile[][];
  private activeColumn: number;
  private lastSelectedX: number | null = null;
  private lastSelectedY: number | null = null;
  private boardSize: number;
  private onMoveToNextTile: (tileIndex: number) => void = () => {};
  private cashout: () => void = () => {};
  private currentMultiplier: number;
  private gameZone: number = 0;
  private bettingControls: any;
  private bombs: { x: number; y: number }[] = [];
  private onGameFinished: () => void = () => {};
  private multipliers: number[][];
  private randomSelect: any;
  private onWin: () => void = () => {};
  private onGameIterationComplete: () => void = () => {};
  private onBetDeducted: () => void = () => {};
  private onAutoPlayFinish: () => void = () => {};
  private autoInterval: any;
  private selectRandom: () => void = () => {};

  constructor(
    boardElement: HTMLElement,
    tileColumns: number,
    tilesPerColumn: number,
    boardSize: number
  ) {
    this.element = boardElement;
    this.tileColumns = tileColumns;
    this.tilesPerColumn = tilesPerColumn;
    this.tiles = [];
    this.activeColumn = 0;
    this.boardSize = boardSize;
    this.currentMultiplier = 1;
    this.bettingControls = document.querySelector(".betting-controls");
    this.randomSelect = document.querySelector(".randomSelectButton");

    this.multipliers = [
      [1.45, 2.18, 3.27, 4.91],
      [1.29, 1.72, 2.29, 3.06, 4.08, 5.45, 7.26],
      [1.21, 1.51, 1.89, 2.36, 2.96, 3.7, 4.62, 5.78, 7.22, 9.03],
    ];
    this.randomSelect.addEventListener(
      "click",
      this.userRandomSelect.bind(this)
    );
    this.createTiles();
  }

  private createTiles(): void {
    for (let x = 0; x < this.tileColumns; x++) {
      const tileColumn = document.createElement("div");
      tileColumn.classList.add("tileColumn");
      this.element.appendChild(tileColumn);
      const column: Tile[] = [];

      for (let y = 0; y < this.tilesPerColumn; y++) {
        const element = document.createElement("div");
        element.classList.add("tile");
        element.classList.add("disabled");
        tileColumn.appendChild(element);
        const tile = new Tile(element, x, y);

        tile.onSelectedcallback(() => {
          this.lastSelectedX = y;
          this.lastSelectedY = x;
          data.multiplier =
            this.multipliers[this.boardSize][this.lastSelectedY];
          if (data.isAutoplay) {
            this.autoTileSelected(x, y);
            // if (!data.isPlayingAuto) {
            //   this.randomSelect.addEventListener("click", () => {
            //     this.userRandomSelect(this.activeColumn);
            //   });
            // }
          } else {
            this.manualTileSelected(x, y);
          }
        });

        column.push(tile);
      }

      this.tiles.push(column);

      const multiplierDisplay = document.createElement("div");
      multiplierDisplay.classList.add("multiplierDisplay");

      multiplierDisplay.textContent = `x${this.multipliers[this.boardSize][
        x
      ].toFixed(2)}`;
      tileColumn.appendChild(multiplierDisplay);
      this.element.appendChild(tileColumn);
    }
  }
  private autoTileSelected(x: number, y: number): void {
    this.onMoveToNextTile(this.activeColumn);
    this.activeColumn++;
    this.setActiveColumn(this.activeColumn);

    data.userSelections.push([x, y]);
  }
  private userRandomSelect(): void {
    if (
      this.activeColumn < this.tileColumns &&
      !data.isFinished &&
      !data.isPlayingAuto
    ) {
      const randomY = Math.floor(Math.random() * this.tilesPerColumn);
      const tile = this.tiles[this.activeColumn][randomY];
      if (tile) {
        tile.selectProgrammatically();

        this.lastSelectedX = this.activeColumn;
        this.lastSelectedY = randomY;
        data.multiplier = this.multipliers[this.boardSize][this.lastSelectedY];
        data.userSelections.push([this.activeColumn, randomY]);
        // console.log(data.userSelections, "mishvelet");

        this.onMoveToNextTile(this.activeColumn);
        this.activeColumn++;
        this.setActiveColumn(this.activeColumn);
      }
    }
  }
  private manualTileSelected(x: number, y: number): void {
    let bomblocation = this.placeBombInActiveColumn();

    if (bomblocation === this.lastSelectedX) {
      data.isFinished = true;
      console.log("avfetqi");
      this.tiles[this.activeColumn][bomblocation].explode();

      for (let i = this.activeColumn + 1; i < this.tileColumns; i++) {
        let bomblocationlose = this.placeBombInActiveColumn();
        this.tiles[i][bomblocationlose].setBomb();
      }

      this.endGame(Enum.Finish.lose);
      return;
    }
    this.cashout();

    this.onMoveToNextTile(this.activeColumn); //uptadeeeeeeeeeeeeeneeeexttileeeeeeeeeemultiplierspan
    this.tiles[this.activeColumn][bomblocation].setBomb();

    this.activeColumn++;
    this.setActiveColumn(this.activeColumn);
    if (this.activeColumn === this.tileColumns) {
      data.isFinished = true;
      this.endGame(Enum.Finish.win);
    }
  }
  public onMoveCallback(callback: (tileIndex: number) => void): void {
    this.onMoveToNextTile = callback;
  }

  public setActiveColumn(columnIndex: number): void {
    if (this.gameZone > 0 && data.isFinished === false) {
      this.activeColumn = columnIndex;
      this.gameZone = columnIndex + 1;
      //   this.placeBombInActiveColumn();
      columnIndex > 0 &&
        this.tiles[columnIndex - 1].forEach((tile) => {
          tile.addshade();
        });
      this.tiles.forEach((column, index) => {
        const isClickable = index === columnIndex;
        column.forEach((tile) => tile.setClickable(isClickable));
      });
    }
  }
  public isLastTileActive(): boolean {
    console.log(this.gameZone, "bolotilea", this.lastSelectedX, "boloa");
    return this.lastSelectedX === this.tileColumns - 1;
    // return this.activeColumn === this.tileColumns - 1 &&
    //        this.selectedCoordinates.some(coord => coord.y === this.tilesPerColumn - 1);
  }
  public onUpdateCashoutCallback(callback: () => void): void {
    this.cashout = callback;
  }

  private placeBombInActiveColumn() {
    const bomboclat = Math.floor(Math.random() * this.tilesPerColumn);

    return bomboclat;
  }
  public onGameIterationCompleteCallback(callback: () => void): void {
    this.onGameIterationComplete = callback;
  }
  public onBetDeductedCallback(callback: () => void): void {
    this.onBetDeducted = callback;
  }
  public stopAutoPlay() {
    data.userSelections = [];
    clearInterval(this.autoInterval);
    this.endGame(Enum.Finish.manual);
    this.startGame();
    this.tiles.flat().forEach((tile) => tile.reset());
    
  }
  public startAutoPlay() {
    this.autoInterval = setInterval(() => {
      if (data.isSoundEnabled) {
        var betPressSound = new Audio(
          "https://goal-game.netlify.app/assets/audio/bet.mp3"
        );
        betPressSound.play();
      }
      let bombdeteced = 0;
      this.onBetDeducted();
      for (let i = 0; i < data.userSelections.length; i++) {
        data.isFinished = false;
        let bomblocationlose = this.placeBombInActiveColumn();

        console.log(i, bomblocationlose);
        console.log(data.userSelections[i][0], data.userSelections[i][1]);
        if (
          data.userSelections[i][0] === i &&
          data.userSelections[i][1] === bomblocationlose
        ) {
          bombdeteced++;
          this.tiles[i][bomblocationlose].explode();
          this.tiles[i][bomblocationlose].removeFlag(true);
        } else {
          this.tiles[i][bomblocationlose].setBomb();
        }
      }
      if (bombdeteced > 0) {
        if (data.isSoundEnabled) {
          var loseSound = new Audio(
            "https://goal-game.netlify.app/assets/audio/lose.mp3"
          );
          loseSound.play();
        }

        data.hasWonLast = false;
        this.tiles.forEach((column, index) => {
          column.forEach((tile) => {
            if (index <= data.userSelections.length - 1) {
              tile.lost();
            }
          });
        });
      } else {
        if (data.isSoundEnabled) {
          var winSound = new Audio(
            "https://goal-game.netlify.app/assets/audio/cashout.mp3"
          );
          winSound.play();
        }

        data.hasWonLast = true;
        this.onGameIterationComplete();
      }
      this.endGame(Enum.Finish.autoPlay);
      data.isFinished = false;
      setTimeout(() => {
        this.tiles.flat().forEach((tile) => tile.autoPlayReset());
        for (let i = 0; i < data.userSelections.length; i++) {
          this.tiles[i][data.userSelections[i][1]].removeFlag(true);
          this.tiles[i][data.userSelections[i][1]].removeFlag(false);
        }
      }, 900);
    }, 1500);

    this.setActiveColumn(-1);
  }
  public startGame(): void {
    if (data.isFinished === true) {
      this.tiles.flat().forEach((tile) => tile.reset());
      this.gameZone = 1;
      data.isFinished = false;
      this.setActiveColumn(0); // Enable tile selection for the first column
    } else {
      console.log("Game cannot start yet. Current state:", data.isFinished);
    }
    if (!data.isAutoplay) {
      this.bettingControls?.classList.add("disabled");
    }
  }
  public onWinCallback(callback: () => void): void {
    this.onWin = callback;
  }
  public endGame(finishtype: Enum.Finish): void {
    switch (finishtype) {
      case Enum.Finish.lose:
        if (data.isSoundEnabled) {
          let loseSound = new Audio(
            "https://goal-game.netlify.app/assets/audio/lose.mp3"
          );
          loseSound.play();
        }
        this.tiles.forEach((column) => {
          column.forEach((tile) => {
            tile.lost();
          });
        });

        break;
      case Enum.Finish.win:
        if (data.isSoundEnabled) {
          let winSound = new Audio(
            "https://goal-game.netlify.app/assets/audio/cashout.mp3"
          );
          winSound.play();
        }
        this.onWin();

        break;
      case Enum.Finish.withdraw:
        if (data.isSoundEnabled) {
          let withdraw = new Audio(
            "https://goal-game.netlify.app/assets/audio/cashout.mp3"
          );
          withdraw.play();
        }
        this.tiles.forEach((column) => {
          column.forEach((tile) => {
            tile.withdrew();
          });
        });
        break;
      case Enum.Finish.manual:
        this.setActiveColumn(-1);
        this.tiles.flat().forEach((tile) => tile.reset());
        data.isFinished = true;

        break;
      case Enum.Finish.autoPlay:
        this.onAutoPlayFinish();
        break;
      // case Enum.Finish.autoStop:
      //   this.setActiveColumn(-1);
      //   data.isFinished = true;
      //   this.onAutoPlayFinish();
      //   break;
    }
    this.bettingControls?.classList.remove("disabled");
    this.gameZone = 0;
    this.setActiveColumn(0); // Disable all tiles
    this.activeColumn = 0;
    this.bombs = [];
    this.onGameFinished();
  }
  public handleCashout(): void {
    data.isFinished = true;
    this.endGame(Enum.Finish.withdraw);
  }
  public onAutoPlayFinishCallback(callback: () => void): void {
    this.onAutoPlayFinish = callback;
  }
  public onGameFinishedCallback(callback: () => void): void {
    this.onGameFinished = callback;
  }
  public onSelectRandomCallback(callback: () => void): void {
    this.selectRandom = callback;
  }
  public destroy(): void {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.lastChild);
    }
  }
}
