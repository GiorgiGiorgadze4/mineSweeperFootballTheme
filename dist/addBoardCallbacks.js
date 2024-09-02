import { board, controlPanel } from "./script.js";
export function addBoardCallbacks() {
    board.onMoveCallback((tileIndex) => {
        //   // if (!data.isAutoplay) {
        //   //   controlPanel?.updateStart(tileIndex);
        //   // } else {
        //   controlPanel?.updateCashout(tileIndex);
        // } //zogadi funqciis transfer callback
    }
    //   // if (!data.isAutoplay) {
    //   //   controlPanel?.updateStart(tileIndex);
    //   // } else {
    //   controlPanel?.updateCashout(tileIndex);
    // } //zogadi funqciis transfer callback
    );
    board.onGameFinishedCallback(() => {
        controlPanel === null || controlPanel === void 0 ? void 0 : controlPanel.finish();
    });
    board.onUpdateCashoutCallback(() => {
        controlPanel.updateCashout(0);
    });
}
//# sourceMappingURL=addBoardCallbacks.js.map