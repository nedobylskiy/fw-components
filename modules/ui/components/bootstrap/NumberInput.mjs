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

class NumberInput extends TextInput {


    async init() {
        let name = await super.init();

        await this.setupAttributeGettersSetters('min');
        await this.setupAttributeGettersSetters('max');
        await this.setupAttributeGettersSetters('step');

        return name;
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, [ 'type', 'class']);

        return `<input id="${this.id}" type="number" min="${this.attrs.min||''}" max="${this.attrs.max||''}" step="${this.attrs.step||''}"   class="form-control" placeholder="${this._placeholder}" ${attribStr}>`;
    }



}

export default NumberInput;
