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
                    ${this.converter.makeHtml(this.normalizeIntents(this._innerHTML))}
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
        this.wrappedComponent.html(html);
    }

    /**
     * Normalize input intents
     * @param content
     * @returns {string|*}
     */
    normalizeIntents(content) {
        let splitted = content.split('\n');

        if(splitted.length < 2) {
            return content;
        }


        let intentCheckLine = splitted[0];
        if(splitted[0].trim() === '' && splitted[1].trim() !== '') {
            intentCheckLine = splitted[1];
        }

        let matches = intentCheckLine.match(/^\s+/);
        let intent = matches ? matches[0].length : 0;

        let final = '';
        for (let line of splitted) {
            if(line.trim() === '') {
                final += '\n';
            } else {
                let rx = new RegExp('^\\\s{' + intent + '}', 'gm')
                final += line.replace(rx, '') + '\n';
            }
        }

        return final;
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
    get content() {
        return this.normalizeIntents(this._innerHTML);
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
