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
import UIComponents from "../UIComponents.mjs";

class Button extends _UIComponent {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        this._caption = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this._disabled = !!this.attributes.disabled;

        this._visible = !(this.attrs.visible === 'false');


        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();

        //Save constructed element DOM
        this.wrappedComponent = $('#' + this.id);

        //Setup actions
        this.wrappedComponent.on('click', async (event) => {
            //Run @click methods
            await this.runBindedEvent('click', [this, event], this);
            this.emit('click', this, event);
        })

        return this.name;
    }

    /**
     * Build element HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['disabled', 'href', 'type', 'class', 'style', 'visible']);

        return `
            <button id="${this.id}" style="${this._visible?'':'display: none;'} ${this.attrs.style??this.attrs.style}" class="btn  ${this.attributes.flat ? 'btn-flat' : 'btn-default'} ${this.attrs?.color} ${this.attributes.right ? 'float-right' : ''} ${this.attributes.large ? 'btn-lg' : ''} ${this._disabled ? 'disabled' : ''} ${this.attributes.block ? 'btn-block' : ''}  ${this.attrs.class}"   ${this.attributes.href ? 'href="' + this.attributes.href.value + '"' : ''} ${attribStr}>
                ${this._caption}
            </button>`;
    }

    /**
     * Get btn caption
     * @returns {*}
     */
    get caption() {
        return this._caption;
    }

    /**
     * Set BTN caption
     * @param html
     */
    set caption(html) {
        this._caption = html;
        $(`#${this.id}`).html(html);
    }

    /**
     * Get state
     * @returns {*|boolean}
     */
    get disabled() {
        return this._disabled;
    }

    /**
     * Set state
     * @param boolVal
     */
    set disabled(boolVal) {
        this._disabled = boolVal;
        if(boolVal) {
            $(`#${this.id}`).addClass('disabled');
        } else {
            $(`#${this.id}`).removeClass('disabled');
        }
    }


}

export default Button;
