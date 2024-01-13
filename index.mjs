/*
  ______ _____
 |  ____|  __ \
 | |__  | |__) |_ _  __ _  ___
 |  __| |  ___/ _` |/ _` |/ _ \
 | |    | |  | (_| | (_| |  __/
 |_|    |_|   \__,_|\__, |\___|
                     __/ |
                    |___/
 */

/**
 * @name FPage framework
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import AppPage from "./modules/ui/AppPage.mjs";
import uiUtils from "./modules/ui/uiUtils.js";
import PageStack from "./modules/ui/PageStack.mjs";
import UIComponents from "./modules/ui/components/UIComponents.mjs";
import _UIComponent from "./modules/ui/components/_UIComponent.mjs";
import _Renderable from "./modules/ui/components/_Renderable.mjs";
import {Processors, StringProcessor} from "./modules/ui/helpers/Processors.mjs";

export default AppPage;
export {AppPage, uiUtils, PageStack, UIComponents, _UIComponent, _Renderable, Processors, StringProcessor};

if (window) {
    if (!window.FWC) {
        window.FWC = {
            AppPage,
            uiUtils,
            PageStack,
            UIComponents,
            _UIComponent,
            _Renderable,
            Processors,
            StringProcessor
        }
    }
}
