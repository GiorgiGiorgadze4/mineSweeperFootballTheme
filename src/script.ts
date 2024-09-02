import Board from "./components/board/Board.js";
import ControlPanel from "./components/controlpanel.js";
import data from "./data.js";
import * as Enum from "./enums.js";

let board: Board;
let controlPanel: ControlPanel;

function addBoardCallbacks(): void {
  board.onMoveCallback((tileIndex: number) => {
    board.onWinCallback(() => {
      controlPanel.updateBalance();
    });

    if (data.isAutoplay) {
      controlPanel.disableStart(false);
    } else {
      controlPanel?.updateCashout(tileIndex);
    } //zogadi funqciis transfer callback
  });
  board.onGameFinishedCallback(() => {
    controlPanel?.finish();
  });
  board.onUpdateCashoutCallback(() => {
    controlPanel.updateCashout(0);
  });
  board.onAutoPlayFinishCallback(() => {
    controlPanel.changeBetAuto();
  });
  board.onGameIterationCompleteCallback(() => {
    controlPanel.updateBalance();
  });
  board.onBetDeductedCallback(() => {
    controlPanel.deductBet();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggleMenuButton")?.addEventListener("click", () => {
    const menuDiv = document.getElementById("menuDiv");

    if (menuDiv) {
      menuDiv.classList.toggle("show-menu");
    }
  });

  const boardElement = document.querySelector("[data-board]") as HTMLElement;
  board = new Board(boardElement, 7, 4, 1);
  addBoardCallbacks();
  const betButton = document.getElementById("bet-button");

  controlPanel = new ControlPanel();

  controlPanel.onSizePickedCallback((size: Enum.BoardSize) => {
    board.destroy();
    board = new Board(
      boardElement,
      data.boardSize[size][0],
      data.boardSize[size][1],
      size
    );

    addBoardCallbacks();

    if (data.isAutoplay) {
      board.endGame(Enum.Finish.manual);
      board.startGame();
    }
  });
  controlPanel.onAutoPlayCallback((isAuto) => {
    if (isAuto) {
      board.startGame();
    } else {
      board.endGame(Enum.Finish.manual);
    }
  });

  controlPanel.onBetpressedCallback(() => {
    if (data.isFinished) {
      // if (data.isAutoplay) {
      //   console.log("viwyebt autoplays");
      //   //viwyebt autoplays
      // } else {

      board.startGame();
    } else if (data.isAutoplay) {
      if (!data.isPlayingAuto) {
        data.isPlayingAuto = true;
        controlPanel.startAutoPlay(true);
        board.startAutoPlay();
      } else {
        controlPanel.startAutoPlay(false);
        board.stopAutoPlay();
        data.isPlayingAuto = false;
      }
    }
  });
  controlPanel.onCashoutPressedCallback(() => {
    if (betButton?.classList.contains("cashout")) {
      controlPanel.removeCashout();
      board.handleCashout();
      board.endGame(Enum.Finish.withdraw);
    }
  });
});
//modali da xmis temebi
document.addEventListener("DOMContentLoaded", () => {
  const provablyFairModal11 = document.querySelector(
    ".provablyFairModal"
  ) as HTMLDivElement;

  const provablyFairButton = document.querySelector(".tundra");
  const modalOverlay = document.querySelector(
    ".modal-overlay"
  ) as HTMLDivElement;
  const modal = document.querySelector(".modal") as HTMLDivElement;
  const closeModalButton = document.getElementById(
    "closeModalButton"
  ) as HTMLImageElement;
  const gotItButton = document.getElementById(
    "gotItButton"
  ) as HTMLButtonElement;

  // Function to show the modal
  const showModal = () => {
    modalOverlay.classList.add("visible");
    modal.classList.add("visible");
  };

  // Function to hide the modal
  const closeModal = () => {
    modalOverlay.classList.remove("visible");
    modal.classList.remove("visible");
  };

  provablyFairModal11?.addEventListener("click", showModal);
  provablyFairButton?.addEventListener("click", showModal);
  closeModalButton?.addEventListener("click", closeModal);
  gotItButton?.addEventListener("click", closeModal);

  // Optional: close modal if the overlay is clicked
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const howToPlayButton11 = document.getElementById(
    "howToPlayButton"
  ) as HTMLDivElement;
  const howToPlayButton = document.querySelector(".modal2");
  const howToPlayModalOverlay = document.getElementById(
    "howToPlayModalOverlay"
  );
  const howToPlayModal = document.getElementById("howToPlayModal");
  const closeHowToPlayButton = document.getElementById("closeHowToPlay");

  if (
    howToPlayButton &&
    howToPlayModalOverlay &&
    howToPlayModal &&
    closeHowToPlayButton
  ) {
    howToPlayButton.addEventListener("click", () => {
      howToPlayModalOverlay.style.display = "flex";
      howToPlayModal.style.display = "block";
    });
    howToPlayButton11.addEventListener("click", () => {
      howToPlayModalOverlay.style.display = "flex";
      howToPlayModal.style.display = "block";
    });
    closeHowToPlayButton.addEventListener("click", () => {
      howToPlayModalOverlay.style.display = "none";
      howToPlayModal.style.display = "none";
    });
  } else {
    console.error("One or more modal elements are not found");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const soundCheckbox = document.getElementById(
    "soundCheckbox"
  ) as HTMLInputElement;

  soundCheckbox?.addEventListener("change", function () {
    if (soundCheckbox.checked) {
      data.isSoundEnabled = true;
    } else {
      data.isSoundEnabled = false;
    }
  });
});
