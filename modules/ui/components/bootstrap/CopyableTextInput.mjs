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

import TextInput from "./TextInput.mjs";
import uiUtils from "../../uiUtils.js";
import toasts from "../../helpers/toasts.mjs";

class CopyableTextInput extends TextInput {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {

        let initResult = await super.init();

        const copyMethod = async () => {
            this.wrappedComponent.find('input').select();
            await uiUtils.copyToClipboard(this.value);
            toasts.toast('Copied');
        }
        this.wrappedComponent.find('.copyableTextInputCopyButton').on('click', copyMethod)
        this.wrappedComponent.find('input').on('click', copyMethod)

        return initResult;
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'class']);

        return `
                <div class="input-group margin" id="${this.id}" ${attribStr}>
                                   <span class="input-group-btn">
                      <button type="button" class="btn btn-primary copyableTextInputCopyButton" style="border-radius: 0" id="${this.id}_copybutton"><i class="mdi mdi-content-cut"></i></button>
                    </span>
                   <input style="border-radius: 0"   type="text" class="form-control" placeholder="${this._placeholder}" ${attribStr} >

                </div>
                `;
    }

    /**
     * Get value
     * @returns {*}
     */
    get value() {
        return this.wrappedComponent.find('input').val();
    }

    /**
     * Set value
     * @param value
     */
    set value(value) {
        this.wrappedComponent.find('input').val(value)
    }

}

export default CopyableTextInput;
