import data from "../../data.js";
export default class Tile {
  private element: any;
  private isBomb: boolean = false;
  private clickable: boolean = false;
  private onSelected: (x: number, y: number) => void = () => {};

  private x: number;
  private y: number;

  constructor(element: HTMLElement, x: number, y: number) {
    this.element = element;
    this.x = x;
    this.y = y;
  }

  public setClickable(clickable: boolean): void {
    this.clickable = clickable;
    if (clickable) {
      this.element.classList.remove("disabled");
      this.element.classList.add("start");
      this.element.addEventListener("click", this.handleClick.bind(this));
    } else {
      this.element.classList.add("disabled");
      this.element.removeEventListener("click", this.handleClick.bind(this));
    }
  }
  public addshade(): void {
    this.element.classList.add("shaded");
  }

  public setBomb(): void {
    let bombed = document.createElement("div");
    bombed.classList.add("bombed");
    this.element.appendChild(bombed);
  }

  public explode(): void {
    let explode = document.createElement("div");
    explode.classList.add("explosion");
    this.element.appendChild(explode);
  }

  private handleClick(): void {
    if (!this.clickable || data.isFinished) return;

    if (data.isAutoplay) {
      this.element.classList.add("flagged");
    } else {
      this.element.classList.add("selected");
    }
    if (data.isSoundEnabled) {
      var tilePressSound = new Audio(
        "https://goal-game.netlify.app/assets/audio/win.mp3"
      );
      tilePressSound.play();
    }
    this.onSelected(this.x, this.y);
  }
  public removeFlag(remove: boolean) {
    if (remove) {
      this.element.classList.remove("flagged");
    } else {
      this.element.classList.add("flagged");
    }
  }
  public onSelectedcallback(callback: (x: number, y: number) => void): void {
    this.onSelected = callback;
  }
  public selectProgrammatically(): void {
    if (data.isAutoplay) {
      this.element.classList.add("flagged");
    }
  }
  public lost(): void {
    this.element.classList.add("lost");
  }
  public withdrew(): void {
    this.element.classList.add("disabled");
    this.element.classList.remove("selected");
    this.element.classList.remove("shaded");
    this.element.classList.remove("start");
  }

  public autoPlayReset(): void {
    this.element.classList.remove("lost");

    this.element.lastChild && this.element.removeChild(this.element.lastChild);
  }
  public autoPlayHardReset(): void {
    this.element.classList.remove("lost");
    this.element.classList.remove("selected");
    this.element.classList.remove("shaded");
    this.element.classList.remove("flagged");

    this.element.lastChild && this.element.removeChild(this.element.lastChild);
  }
  public reset(): void {
    this.element.classList.remove("lost");
    this.element.classList.remove("selected");
    this.element.classList.remove("shaded");
    this.element.classList.remove("flagged");
    this.element.lastChild && this.element.removeChild(this.element.lastChild);
  }
}
