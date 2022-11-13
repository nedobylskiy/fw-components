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

import _UIComponent from "./_UIComponent.mjs";

class Caption extends _UIComponent {


    /**
     * Initialize
     * @returns {Promise<void>}
     */
    async init() {

        this._caption = this.domObject.html();

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;

        this._disabled = !!attributes.disabled;
        this._size = !attributes.size ? '' : attributes.size.value;

        //Construct button HTML
        this.domObject[0].outerHTML = (`
        <p id="${this.id}" class="  ${this._disabled ? 'disabled' : ''}  ${this.attrs.class ? this.attrs.class : ''}" style="${attributes.style ? attributes.style.value : ''}; font-size: ${this._size}"  >
            ${this._caption}
            </p> `)
        this.wrappedComponent = $('#' + this.id);
        this.wrappedComponent.on('click', async () => {

            //Run @click methods
            await this.runBindedEvent('click', [this]);

            this.emit('click', this);
        })

        return this.name;
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

    get style() {
        return this.wrappedComponent.attr('style');
    }

    set style(style) {
        this.wrappedComponent.attr('style', style);
    }

}

export default Caption;
