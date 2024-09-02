import Dialog from "../components/Dialog";
import Element from "../components/Element";
import Data from "../data/Data";
import * as Enum from "../enums/Enums";
export default class SideBarDialog extends Dialog {
    constructor(selector) {
        super(selector);
        this.onDocsDialogShow = (callback) => {
            this._onDocsDialogShow = callback;
            return this;
        };
        this.onFairDialogShow = (callback) => {
            this._onFairDialogShow = callback;
            return this;
        };
        const docsButton = new Dialog(`${selector} .guideButton`);
        docsButton.onClick(() => {
            if (this._onDocsDialogShow) {
                this._onDocsDialogShow();
            }
        });
        const fairButton = new Dialog(`${selector} #fairButton`);
        fairButton.onClick(() => {
            if (this._onFairDialogShow) {
                this._onFairDialogShow();
            }
        });
        window.addEventListener("click", (e) => {
            if (this._element.classList.contains("visible") &&
                e.target !== document.querySelector("#sidebarLogo")) {
                let array = [];
                let elems = this._element.getElementsByTagName("*");
                if (array.slice
                    .call(elems)
                    .find((item) => e.target === item || e.target === this._element) ===
                    undefined) {
                    this._element.classList.remove("visible");
                }
            }
        });
        const volumeButton = new Element("#volume");
        volumeButton.onClick(() => {
            let isMuted = !volumeButton.containsCustomClass(Enum.DefaultClass.active);
            Data.audio.setMute(!isMuted);
            if (isMuted) {
                volumeButton.addCustomClass(Enum.DefaultClass.active);
            }
            else {
                volumeButton.removeCustomClass(Enum.DefaultClass.active);
            }
        });
        if (!Data.audio.getMute()) {
            volumeButton.addCustomClass(Enum.DefaultClass.active);
        }
        else {
            volumeButton.removeCustomClass(Enum.DefaultClass.active);
        }
    }
}
//# sourceMappingURL=SideBarDialog.js.map