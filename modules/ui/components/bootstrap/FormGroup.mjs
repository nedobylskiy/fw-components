/*
  ________          _______
 |  ____\ \        / / ____|
 | |__   \ \  /\  / / |
 |  __|   \ \/  \/ /| |
 | |       \  /\  / | |____
 |_|        \/  \/   \_____|

 */
/**
 * @name FW-Components
 * @author Andrei Nedobylskii
 */

import _UIComponent from "../_UIComponent.mjs";
import uiUtils from "../../uiUtils.js";
import Holder from "../Holder.mjs";

class FormGroup extends Holder {


    /**
     * Build HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, [ 'type']);
        return `
              <div class="form-group" id="${this.id}" ${attribStr}>
                    ${this._innerHTML}
            </div>`;
    }



}

export default FormGroup;
