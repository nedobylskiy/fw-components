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

import {_UIComponent} from "../../../index.mjs";

/**
 * Visual UI component abstract
 * @abstract
 */
class _Renderable extends _UIComponent {


    /**
     * Initialize UI component
     * @returns {Promise<_UIComponent>}
     */
    async init() {
        await super.init();
        return this;
    }

    /**
     * After main initialization
     * @returns {Promise<void>}
     */
    async afterInit() {
        await super.afterInit();
        await this.render();
    }

    /**
     * Build HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, ['type']);
        return `
              <div id="${this.id}" ${attribStr}>
                    ${this._innerHTML}
            </div>`;
    }

    /**
     * Render component
     * @returns {Promise<void>}
     */
    async render() {
        if (this.wrappedComponent) {
            this.wrappedComponent[0].outerHTML = await this.buildHtml();
            this.wrappedComponent = $('#' + this.id);
        } else {
            this.domObject[0].outerHTML = await this.buildHtml();
            this.wrappedComponent = $('#' + this.id);
        }
    }

}

export default _Renderable;
