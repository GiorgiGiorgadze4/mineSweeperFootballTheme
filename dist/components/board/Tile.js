import data from "../../data.js";
export default class Tile {
    constructor(element, x, y) {
        this.isBomb = false;
        this.clickable = false;
        this.onSelected = () => { };
        this.element = element;
        this.x = x;
        this.y = y;
    }
    setClickable(clickable) {
        this.clickable = clickable;
        if (clickable) {
            this.element.classList.remove("disabled");
            this.element.classList.add("start");
            this.element.addEventListener("click", this.handleClick.bind(this));
        }
        else {
            this.element.classList.add("disabled");
            this.element.removeEventListener("click", this.handleClick.bind(this));
        }
    }
    addshade() {
        this.element.classList.add("shaded");
    }
    setBomb() {
        let bombed = document.createElement("div");
        bombed.classList.add("bombed");
        this.element.appendChild(bombed);
    }
    explode() {
        let explode = document.createElement("div");
        explode.classList.add("explosion");
        this.element.appendChild(explode);
    }
    handleClick() {
        if (!this.clickable || data.isFinished)
            return;
        if (data.isAutoplay) {
            this.element.classList.add("flagged");
        }
        else {
            this.element.classList.add("selected");
        }
        if (data.isSoundEnabled) {
            var tilePressSound = new Audio("https://goal-game.netlify.app/assets/audio/win.mp3");
            tilePressSound.play();
        }
        this.onSelected(this.x, this.y);
    }
    removeFlag(remove) {
        if (remove) {
            this.element.classList.remove("flagged");
        }
        else {
            this.element.classList.add("flagged");
        }
    }
    onSelectedcallback(callback) {
        this.onSelected = callback;
    }
    selectProgrammatically() {
        if (data.isAutoplay) {
            this.element.classList.add("flagged");
        }
    }
    lost() {
        this.element.classList.add("lost");
    }
    withdrew() {
        this.element.classList.add("disabled");
        this.element.classList.remove("selected");
        this.element.classList.remove("shaded");
        this.element.classList.remove("start");
    }
    autoPlayReset() {
        this.element.classList.remove("lost");
        this.element.lastChild && this.element.removeChild(this.element.lastChild);
    }
    autoPlayHardReset() {
        this.element.classList.remove("lost");
        this.element.classList.remove("selected");
        this.element.classList.remove("shaded");
        this.element.classList.remove("flagged");
        this.element.lastChild && this.element.removeChild(this.element.lastChild);
    }
    reset() {
        this.element.classList.remove("lost");
        this.element.classList.remove("selected");
        this.element.classList.remove("shaded");
        this.element.classList.remove("flagged");
        this.element.lastChild && this.element.removeChild(this.element.lastChild);
    }
}
//# sourceMappingURL=Tile.js.map