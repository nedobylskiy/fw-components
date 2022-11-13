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

class Markdown extends _UIComponent {


    /**
     * Initialize holder
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();

        if(!window.showdown) {
            throw new Error('Showdown is not loaded');
            return;
        }

        this.converter = new showdown.Converter();


        this._innerHTML = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this.domObject[0].outerHTML = await this.buildHtml();
        this.wrappedComponent = $('#' + this.id);


        return this.name;
    }

    /**
     * Build HTML
     * @returns {Promise<string>}
     */
    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, ['type']);
        return `
              <div id="${this.id}" ${attribStr}>
                    ${this.converter.makeHtml(this._innerHTML.trim())}
            </div>`;
    }

    /**
     * Update markdown content
     * @param value
     * @returns {Promise<void>}
     */
    async updateContent(value) {
        this._innerHTML = value;
        let html = await this.buildHtml();
        this.domObject[0].outerHTML = html;
    }

    /**
     * Set content
     * @param value
     */
    set content(value) {
        this.updateContent(value);

    }

    /**
     * Get content
     * @returns {string}
     */
    get content(){
        return this._innerHTML.trim();
    }

    /**
     * Clear holder content
     * @returns {Promise<void>}
     */
    async clearContent() {
        this.wrappedComponent.html('');
    }


}

export default Markdown;
