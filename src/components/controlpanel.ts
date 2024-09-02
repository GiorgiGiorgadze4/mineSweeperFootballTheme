import data from "../data.js";
import * as Enum from "../enums.js";

export default class ControlPanel {
  private boardSizes?: Array<HTMLElement>;
  private onSizePicked: (size: Enum.BoardSize) => void = () => {};
  private onbetButtonPressed: () => void = () => {};
  private betButton: any;
  private onCashoutPressed: () => void = () => {};
  private rnBoardSize: number;
  private bet: number;
  private betInput: any;
  private betSmallChange: number;
  private betBigChange: number;
  private lastBetBigChange: any;
  private bettingControls: any;
  private auto: any;
  private bettingOnWin: any;
  private bettingOnLoss: any;
  private onWinBase: any;
  private onLossBase: any;
  private onWinIncrease: any;
  private onWinDecrease: any;
  private onLossIncrease: any;
  private onLossDecrease: any;
  private onAutoPressed: (isAuto: boolean) => void = () => {};
  private onWinIncreaseContainer: any;
  private onWinDecreaseContainer: any;
  private onLossIncreaseContainer: any;
  private onLossDecreaseContainer: any;
  private onStopButtonPressed: () => void = () => {};
  private bigContainer: any;
  constructor() {
    this.createElements();
    this.rnBoardSize = 1;
    this.bet = 2;
    this.betInput.value = this.bet.toFixed(2);
    this.betSmallChange = 0.1;
    this.betBigChange = 0;
    this.updateBalanceDisplay(true);
    this.lastBetBigChange = 0;
    this.setupBetBigChangeOptions();
    data.defaultUserBet = this.bet;
    this.onWinIncrease.value = 100;
    this.onWinDecrease.value = 50;
    this.onLossIncrease.value = 100;
    this.onLossDecrease.value = 50;
    this.onWinBase.value = 1;
    this.onLossBase.value = 1;
  }
  private createElements(): void {
    this.onWinIncreaseContainer = document.querySelector(
      ".onWinIncreaseContainer"
    );
    this.onWinDecreaseContainer = document.querySelector(
      ".onWinDecreaseContainer"
    );
    this.onLossIncreaseContainer = document.querySelector(
      ".onLossIncreaseContainer"
    );
    this.onLossDecreaseContainer = document.querySelector(
      ".onLossDecreaseContainer"
    );
    this.bigContainer = document.querySelectorAll(".betting-controls > div");
    // this.selectRandom = document.querySelector(".randomSelectButton");
    this.onWinBase = document.querySelector(".onWinBase");
    this.onWinIncrease = document.querySelector(".onWinIncrease");
    this.onWinDecrease = document.querySelector(".onWinDecrease");
    this.onLossBase = document.querySelector(".onLossBase");
    this.onLossIncrease = document.querySelector(".onLossIncrease");
    this.onLossDecrease = document.querySelector(".onLossDecrease");
    this.bettingOnWin = document.querySelectorAll(".onWin>button");
    this.bettingOnLoss = document.querySelectorAll(".onLoss>button");
    this.setupBetFeature(this.bettingOnWin, true);
    this.setupBetFeature(this.bettingOnLoss, false);
    this.bettingControls = document.querySelector("#bet-button");
    this.auto = document.querySelectorAll(".gameSwitch");
    this.betInput = document.querySelector("#bet-input-text");
    const minusButton = document.querySelector(
      "#input-container > div:first-child"
    );
    const plusButton = document.querySelector(
      "#input-container > div:last-child"
    );

    minusButton?.addEventListener("click", () =>
      this.handleBetAdjustment(-0.1)
    );
    plusButton?.addEventListener("click", () => this.handleBetAdjustment(0.1));

    this.betInput.addEventListener("input", () => {
      const inputValue = this.betInput.value;

      if (!isNaN(parseFloat(inputValue)) && isFinite(inputValue)) {
        this.bet = parseFloat(inputValue);
      } else if (inputValue === "" || inputValue === null) {
        this.bet = 0;
      } else {
        this.betInput.value = this.bet;
      }
    });

    this.betInput.addEventListener("focusout", (event: any) => {
      if (this.bet > 100) {
        this.bet = 100;
      }
      if (this.bet < 0.1) {
        this.bet = 0.1;
      }
      this.betInput.value = this.bet.toFixed(2);
    });
    this.betButton = document.getElementById("bet-button");

    this.auto[1].addEventListener("click", () => {
      if (data.isPlayingAuto) {
        return;
      }
      if (!data.isAutoplay) {
        document.querySelector(".auto")?.classList.remove("vision");
        this.auto[1].classList.add("activeAuto");
        this.auto[0].classList.remove("activeAuto");
        this.betButton.innerHTML = "START";
        data.isAutoplay = true;
        this.onAutoPressed(true);
        this.disableStart(true);
      }
    });
    this.auto[0].addEventListener("click", () => {
      if (data.isPlayingAuto) {
        return;
      }
      if (data.isAutoplay) {
        this.auto[0].classList.add("activeAuto");
        this.auto[1].classList.remove("activeAuto");
        document.querySelector(".auto")?.classList.add("vision");
        data.isAutoplay = false;
        this.onAutoPressed(false);
        this.disableStart(false);
      }
    });
    this.betButton.addEventListener("click", () => {
      // if (data.isFinished && !this.betButton.classList.contains("cashout")) {
      //   this.placeBet();
      // }
      if (data.isFinished && !this.betButton.classList.contains("cashout")) {
        this.placeBet();
      } else {
        this.onbetButtonPressed();
      }
    });

    this.boardSizes = Array.from(
      document.querySelectorAll("#sizes > div")
    ) as HTMLElement[];
    let pickedBoardSize: Enum.BoardSize;

    this.boardSizes.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (data.isPlayingAuto) {
          return;
        }
        data.userSelections = [];

        this.boardSizes?.forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        switch (index) {
          case Enum.BoardSize.small:
            pickedBoardSize = Enum.BoardSize.small;
            break;
          case Enum.BoardSize.medium:
            pickedBoardSize = Enum.BoardSize.medium;
            break;
          case Enum.BoardSize.big:
            pickedBoardSize = Enum.BoardSize.big;
            break;
        }
        this.rnBoardSize = index;
        // data.currentBoardSize = pickedBoardSize;
        this.onSizePicked(pickedBoardSize);
      });
    });
  }
  private handleBetAdjustment(temp: number): void {
    if (temp > 0) {
      if (this.bet < 100) {
        this.betInput.value = (this.bet + this.betSmallChange).toFixed(2);
        this.bet = this.bet + this.betSmallChange;
      }
    } else {
      if (0.2 < this.bet) {
        this.betInput.value = (this.bet - this.betSmallChange).toFixed(2);
        this.bet = this.bet - this.betSmallChange;
      } else {
        this.betInput.value = (0.1).toFixed(2);
        this.bet = 0.1;
      }
    }
  }
  private setupBetBigChangeOptions(): void {
    const betBigChangeOptions = document.querySelectorAll("#bet-options> div");

    betBigChangeOptions.forEach((option, index) => {
      option.addEventListener("click", () => {
        if (data.isPlayingAuto) {
          return;
        }
        switch (index) {
          case 0:
            this.betBigChange = 1;
            break;
          case 1:
            this.betBigChange = 3;
            break;
          case 2:
            this.betBigChange = 5;
            break;
          case 3:
            this.betBigChange = 10;
            break;

          default:
            break;
        }
        if (this.lastBetBigChange !== this.betBigChange) {
          this.betInput.value = this.betBigChange.toFixed(2);
          this.bet = this.betBigChange;
        } else {
          if (this.betBigChange + this.bet > 100) {
          } else {
            this.betInput.value = (this.bet + this.betBigChange).toFixed(2);
            this.bet = this.bet + this.betBigChange;
          }
        }

        this.lastBetBigChange = this.betBigChange;
      });
    });
  }

  public placeBet(): void {
    if (data.balance < this.bet) {
      alert("not enough money to bet");
      return;
    }
    if (data.isSoundEnabled) {
      var betPressSound = new Audio(
        "https://goal-game.netlify.app/assets/audio/bet.mp3"
      );
      betPressSound.play();
    }

    data.balance -= this.bet;
    this.updateBalanceDisplay(true);
    this.onbetButtonPressed();

    this.bettingControls?.classList.add("enabled");
  }

  public updateBalanceDisplay(isBet?: boolean): void {
    const balanceSpan = document.querySelector(".balance-display > span");
    const balanceContainer = document.querySelector(".balance-display");
    if (balanceSpan) {
      balanceSpan.textContent = data.balance.toFixed(2);
    }
    if (!isBet) {
      let balancePop = document.createElement("div");
      balancePop.classList.add("balancePop");
      balanceContainer?.appendChild(balancePop);
      balancePop.textContent = `${(this.bet * data.multiplier).toFixed(2)}`;

      setTimeout(() => {
        balanceContainer?.removeChild(balancePop);
      }, 1000);
    }
  }
  public updateCashout(tileIndex: number): void {
    this.betButton.classList.add("cashout");

    this.uptadeBetSpan();
  }
  public disableStart(disabled: boolean): void {
    if (disabled) {
      this.betButton.classList.add("disabled");
      this.betButton.classList.remove("enabled");
    } else {
      this.betButton.classList.remove("disabled");
      this.betButton.classList.add("enabled");
    }
  }
  public removeCashout(): void {
    this.betButton.classList.remove("cashout");
    this.betButton.innerHTML = "BET";
  }
  public onSizePickedCallback(callback: (size: Enum.BoardSize) => void): void {
    this.onSizePicked = callback;
  }
  private handleCashoutPressed(): void {
    if (this.betButton.classList.contains("cashout")) {
      const cashoutAmount = this.bet * data.multiplier;

      data.balance += cashoutAmount;
      this.updateBalanceDisplay();
    }
    this.onCashoutPressed();
  }
  private uptadeBetSpan(): void {
    if (this.betButton.classList.contains("cashout")) {
      const cashoutAmount = this.bet * data.multiplier;
      const balanceSpan = document.querySelector("#cashout");
      this.betButton.textContent = `CASHOUT (${cashoutAmount.toFixed(2)}$)`;

      // console.log(balanceSpan, "grago");
      // if (balanceSpan) {
      //   balanceSpan.innerHTML = String(cashoutAmount);
      // }
    }
  }
  private setupBetFeature(
    buttons: NodeListOf<HTMLButtonElement>,
    isWin: boolean
  ): void {
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  public startAutoPlay(start: boolean): void {
    if (start) {
      this.betButton.classList.add("stop");
      this.betButton.innerHTML = "STOP";
      this.betButton.classList.add("tempDisabled");
      this.bigContainer.forEach((element: Element) => {
        element.classList.add("tempDisabled");
      });

      // setTimeout(() => {
      //   this.betButton.classList.remove("tempDisabled");
      // }, 1000);
    } else {
      this.bigContainer.forEach((element: Element) => {
        element.classList.remove("tempDisabled");
      });
      this.betButton.classList.remove("stop");
      this.betButton.innerHTML = "START";
      // data.userStoppedGame = true;
      // setTimeout(() => {});
    }
  }
  public updateBalance(): void {
    const cashoutAmount = this.bet * data.multiplier;
    data.balance += cashoutAmount;
    this.updateBalanceDisplay();
  }
  // public selectRandomFlag(): void {
  //   this.selectRandom.addEventListener("click", () => {
  //     //randomis generaciis funqcia
  //   });
  // }
  public changeBetAuto(): void {
    if (data.isAutoplay) {
      if (data.hasWonLast) {
        if (this.onWinIncreaseContainer.classList.contains("active")) {
          this.bet =
            this.bet + (this.bet * parseFloat(this.onWinIncrease.value)) / 100;
        } else if (this.onWinDecreaseContainer.classList.contains("active")) {
          this.bet =
            this.bet - (this.bet * parseFloat(this.onWinDecrease.value)) / 100;
        } else if (this.onWinBase.classList.contains("active")) {
          this.bet = data.defaultUserBet;
        }
      } else {
        if (this.onLossIncreaseContainer.classList.contains("active")) {
          this.bet =
            this.bet + (this.bet * parseFloat(this.onLossIncrease.value)) / 100;
        } else if (this.onLossDecreaseContainer.classList.contains("active")) {
          this.bet =
            this.bet - (this.bet * parseFloat(this.onLossDecrease.value)) / 100;
        } else if (this.onLossBase.classList.contains("active")) {
          this.bet = data.defaultUserBet;
        }
      }
      if (this.bet > 100) {
        this.bet = 100;
      }
      if (this.bet < 0.1) {
        this.bet = 0.1;
      }
      this.betInput.value = this.bet.toFixed(2);
    }
  }
  public deductBet(): void {
    if (data.balance >= this.bet) {
      data.balance -= this.bet;
    } else {
      console.log("Not enough balance to bet");
    }
    this.updateBalanceDisplay(true);
  }
  public onCashoutPressedCallback(callback: () => void): void {
    this.onCashoutPressed = callback;

    this.betButton.addEventListener(
      "click",
      this.handleCashoutPressed.bind(this),
      this.uptadeBetSpan()
    );
  }
  public finish(): void {
    if (data.isPlayingAuto) {
      return;
    }
    this.betButton.classList.remove("cashout");
    this.betButton.innerHTML = "BET";
  }
  public onStopButtonPressedCallback(callback: () => void): void {
    this.onStopButtonPressed = callback;
  }
  private handleStopButtonPressed(): void {
    this.onStopButtonPressed();
  }
  public onBetpressedCallback(callback: () => void): void {
    this.onbetButtonPressed = callback;
  }
  public onAutoPlayCallback(callback: (isAuto: boolean) => void): void {
    this.onAutoPressed = callback;
  }
}
