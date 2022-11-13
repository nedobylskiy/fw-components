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

import uiUtils from "../uiUtils.js";
import Holder from "./Holder.mjs";

class Page extends Holder {


    /**
     * Initialize holder
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();

        this._innerHTML = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;


        let html = await this.buildHtml();

        this.domObject[0].innerHTML = html;
        this.wrappedComponent = $('#' + this.id);

        this.pageObject = {methods: {}};

        let pageScript = this.wrappedComponent.find('[type="fpage-script"]').attr('src');
        if(pageScript) {
            try {
                let pageObject = (await import(pageScript)).default;
                if(pageObject) {
                    this.pageObject = pageObject;
                    this.methods = this.pageObject.methods;
                }
            } catch (e) {
                console.log('FWC Error:', 'Cant load fpage-script', pageScript, 'cuz', e);
                console.error(e);
            }
        }

        //Initialize components first
        await this.initializeInternalComponents();

        //Initialize page if script method exists
        if(this.pageObject.methods.init) {
            await this.pageObject.methods.init(this, runParams);
        }

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
                    ${this._innerHTML}
            </div>`;
    }


    /**
     * Append components to box
     * @param componentsHTML
     * @returns {Promise<void>}
     */
    async appendComponents(componentsHTML) {
        this.wrappedComponent.append(componentsHTML);
        await this.page.initializeComponents();
    }

    /**
     * Clear holder content
     * @returns {Promise<void>}
     */
    async clearContent() {
        this.wrappedComponent.html('');
    }


}

export default Page;
