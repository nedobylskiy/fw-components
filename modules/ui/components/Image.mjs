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

class Image extends _UIComponent {


    /**
     * Initialize
     * @returns {Promise<void>}
     */
    async init() {

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;

        this._disabled = !!attributes.disabled;

        let attribStr = this.attributesObjectToStr(this.attrs, ['type']);

        //Construct button HTML
        this.domObject[0].outerHTML = (`<img id="${this.id}"  src="${attributes.src.value}" alt="${attributes.alt.value}" style=" ${this.attrs.style ? this.attrs.style : ''}" ${attribStr}>`)
        this.wrappedComponent = $('#' + this.id);
        this.wrappedComponent.on('click', async () => {
            await this.runBindedEvent('click', [this]);
            this.emit('click', this);
        })

        return this.name;
    }

    get src() {
        return this.wrappedComponent.attr('src');
    }

    set src(src) {
        this.wrappedComponent.attr('src', src);
    }

}

export default Image;
