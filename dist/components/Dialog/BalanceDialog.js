import Dialog from "../components/Dialog";
import Data from "../data/Data";
import * as Enum from "../enums/Enums";
import Element from "../components/Element";
export default class BalanceDialog extends Dialog {
    constructor(selector, wonAmount) {
        super(selector);
    }
    show(wonAmount) {
        if (wonAmount) {
            this._dialog = new Element(".win", true);
            this._dialog.setText(`${wonAmount.toFixed(2) + Data.currency}`);
        }
        else {
            this._dialog = new Element(".error", true);
            this._dialog.setText(`Something Went Wrong`);
        }
        this.appendChild(this._dialog);
        this._dialog.addCustomClass(Enum.DefaultClass.visible);
    }
}
//# sourceMappingURL=BalanceDialog.js.map