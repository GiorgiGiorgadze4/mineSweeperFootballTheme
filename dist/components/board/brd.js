import Tile from "./Tile.js";
export default class Board {
    constructor(boardElement, tileColumns, tilesPerColumn) {
        this.isSelectionEnabled = false;
        this.bombs = [];
        this.gameZone = 0;
        this.lastSelectedTile = null;
        this.element = boardElement;
        this.tileColumns = tileColumns;
        this.tilesPerColumn = tilesPerColumn;
        this.tiles = [];
        this.activeColumn = 0;
        this.selectedCoordinates = [];
        this.createTiles();
        data.isFinished = true;
    }
    createTiles() {
        for (let x = 0; x < this.tileColumns; x++) {
            const tileColumn = document.createElement("div");
            tileColumn.classList.add("tileColumn");
            this.element.appendChild(tileColumn);
            const column = [];
            for (let y = 0; y < this.tilesPerColumn; y++) {
                const element = document.createElement("div");
                element.classList.add("tile");
                tileColumn.appendChild(element);
                const tile = new Tile(element);
                tile.onSelectedcallback(() => {
                    this.activeColumn++;
                    this.setActiveColumn(this.activeColumn);
                });
                column.push(tile);
            }
            this.tiles.push(column);
        }
    }
    setActiveColumn(columnIndex) {
        if (this.gameZone > 0 && data.isFinished === false) {
            this.activeColumn = columnIndex;
            this.gameZone = columnIndex + 1;
            this.tiles.forEach((column, index) => {
                const isClickable = index === columnIndex;
                column.forEach(tile => tile.setClickable(isClickable));
            });
        }
    }
    startGame() {
        if (data.isFinished === true) {
            this.gameZone = 1;
            data.isFinished = false;
            this.setActiveColumn(0); // Enable tile selection for the first column
        }
        else {
            console.log("Game cannot start yet. Current state:", data.isFinished);
        }
    }
    endGame() {
        data.isFinished = 'finished'; // Adjust as per your game logic
        this.gameZone = 0;
        this.selectedCoordinates = [];
        this.tiles.flat().forEach(tile => tile.reset());
        this.setActiveColumn(-1); // Disable all tiles
    }
}
// import Tile from "./Tile.js";
// type isFinished = true | false | 'finished';
// export default class Board {
//   private element: HTMLElement;
//   private tileColumns: number;
//   private tilesPerColumn: number;
//   private tiles: Tile[][];
//   private activeColumn: number;
//   private selectedCoordinates: { x: number; y: number }[];
//   private isSelectionEnabled: boolean = false;
//   private gameZone: number = 0;
//   private isFinished: isFinished;
//   constructor(boardElement: HTMLElement, tileColumns: number, tilesPerColumn: number) {
//     this.element = boardElement;
//     this.tileColumns = tileColumns;
//     this.tilesPerColumn = tilesPerColumn;
//     this.tiles = [];
//     this.activeColumn = 0;
//     this.selectedCoordinates = [];
//     this.createTiles();
//     this.isSelectionEnabled;
//     data.isFinished=true
//   }
//   public enableTileSelection(enable: boolean): void {
//   this.isSelectionEnabled = enable;
//   this.setTilesClickable(enable);
// }
// public getisFinished(): void {
//   data.isFinished = true;
// }
// public setTilesClickable(clickable: boolean): void {
//   console.log(data.isFinished);
//   if (data.isFinished === false) {
//     if (this.activeColumn === 0) {
//      this.tiles[0].forEach(tile => tile.setClickable(clickable));
//     } else {
//       this.tiles.forEach(column => column.forEach(tile => tile.setClickable(true)));
//     }
//   } else {
//     console.log("Tiles cannot be made clickable in the current state.");
//   }
// }
// public setisFinished(newState: isFinished): void {
//   // You can add additional checks or logic here if needed
//   data.isFinished = newState;
// }
// public startGame(): void {
//   if (data.isFinished === true) {
//     this.gameZone = 1;
//     data.isFinished = false;
//     this.setActiveColumn(0);
//     this.setTilesClickable(true); // Enable tile selection
//     // Add any other game start logic here
//   } else {
//     console.log("Game cannot start yet. Current state:", data.isFinished);
//   }
// }
// private createTiles(): void {
//   for (let x = 0; x < this.tileColumns; x++) {
//     const tileColumn = document.createElement("div");
//     tileColumn.classList.add("tileColumn");
//     this.element.appendChild(tileColumn);
//     const column: Tile[] = [];
//     for (let y = 0; y < this.tilesPerColumn; y++) {
//       const element = document.createElement("div");
//       element.classList.add("tile");
//       tileColumn.appendChild(element);
//       const tile = new Tile(element);
//       tile.onSelectedcallback(()=>{
//         this.activeColumn++
//         this.setActiveColumn(this.activeColumn)
//       })
//       column.push(tile);
//     }
//     this.tiles.push(column);
//   }
//   this.setActiveColumn(0);
// }
// public setActiveColumn(columnIndex: number): void {
//   console.log("deb");
//   if (this.gameZone > 0 && data.isFinished === false) {
//     this.activeColumn = columnIndex;
//     this.gameZone = columnIndex + 1;
//     this.tiles.forEach((column, index) => {
//       // console.log("column",column,"index",index);//bevrjer iruneba yovel eventlisener dacheraze foreach shesacvlelia
//       const isClickable = index === columnIndex;
//       column.forEach(tile => tile.setClickable(isClickable));
//       if(isClickable){ console.log("column",column,"index",index)}
//     });
//   }
// }
// public endgame(): void {
//   data.isFinished = true; // or 'finished' based on your game logic
//   this.gameZone = 0;
//   this.selectedCoordinates = [];
//   this.tiles.flat().forEach(tile => tile.reset());
//   this.setActiveColumn(0);
// }
//   // Add more methods as needed...
// }
//# sourceMappingURL=brd.js.map