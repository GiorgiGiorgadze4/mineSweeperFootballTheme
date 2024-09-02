import Dialog from "../components/Dialog";
import Data from "../data/Data";
import Element from "../components/Element";
export default class DocsDialog extends Dialog {
    constructor(id) {
        super(id);
        const minBet = new Element(`#minBet`);
        minBet.setText(`${Data.minBet + Data.currency}`);
        const maxBet = new Element(`#maxBet`);
        maxBet.setText(`${Data.maxBet + Data.currency}`);
    }
}
//# sourceMappingURL=DocsDialog.js.map