/*
  ________          _______
 |  ____\ \        / / ____|
 | |__   \ \  /\  / / |
 |  __|   \ \/  \/ /| |
 | |       \  /\  / | |____
 |_|        \/  \/   \_____|

 */
import Button from "./Button.mjs";

/**
 * @name FW-Components
 * @author Andrei Nedobylskii
 */


class Href extends Button {

    constructor(pageId, domObject, id, page, pageScript = {methods: {}}) {
        super(pageId, domObject, id, page, pageScript);
        this._innerHTML = this.domObject.html();
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['disabled', 'href', 'type', 'class', 'style', 'visible']);

        return `
            <a id="${this.id}" style="${this._visible ? '' : 'display: none;'} ${this.attrs.style ? this.attrs.style : ''}" class="${this._disabled ? 'disabled' : ''}  ${this.attrs.class||''}"   ${this.attributes.href ? 'href="' + this.attributes.href.value + '"' : 'href="#"'} ${attribStr}>
                ${this._innerHTML}
            </a>`;
    }


}

export default Href;
