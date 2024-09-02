"use strict";
// // src/layout/Header.ts
// import Element from "../components/Element";
// export default class Header {
//   private _onDocsDialogShow: (() => void) | undefined;
//   private _onFairDialogShow: (() => void) | undefined;
//   private _onSideBarShow: (() => void) | undefined;
//   constructor() {
//     const docsButton = new Element("header .how");
//     docsButton.onClick(() => {
//       this._onDocsDialogShow?.();
//     });
//     const fairButton = new Element("header #fairButton");
//     fairButton.onClick(() => {
//       this._onFairDialogShow?.();
//     });
//     const sideBarButton = new Element("header #sidebarLogo");
//     sideBarButton.onClick(() => {
//       this._onSideBarShow?.();
//     });
//   }
//   onDocsDialogShow(callback: () => void): Header {
//     this._onDocsDialogShow = callback;
//     return this;
//   }
//   onFairDialogShow(callback: () => void): Header {
//     this._onFairDialogShow = callback;
//     return this;
//   }
//   onSideBarShow(callback: () => void): Header {
//     this._onSideBarShow = callback;
//     return this;
//   }
// }
//# sourceMappingURL=Header.js.map