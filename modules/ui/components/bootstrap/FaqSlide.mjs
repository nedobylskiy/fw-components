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
import Holder from "../Holder.mjs";

class FaqSlide extends Holder {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {


        let internalObjects = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;


        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml(internalObjects);
        this.wrappedComponent = $('#' + this.id);

        //Disabled state check
        if(this.attributes.disabled) {
            this.disabled = true;
        }

        return this.name;
    }

    /**
     * Build HTML
     * @param internalObjects
     * @returns {Promise<string>}
     */
    async buildHtml(internalObjects) {
        //Setup non-custom attributes
        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'class']);

        return `

                    <div class="panel" id="${this.id}" ${attribStr}>
                        <div class="panel-heading" id="question-${this.id}" role="tab">
                            <a class="panel-title collapsed" aria-controls="answer-${this.id}" aria-expanded="false" data-toggle="collapse" href="#answer-${this.id}" data-parent="${this.attributes.parent ? this.attributes.parent.value : ''}">
                                ${this.attributes.caption ? this.attributes.caption.value : ''}
                            </a>
                        </div>
                        <div class="panel-collapse collapse" id="answer-${this.id}" aria-labelledby="question-${this.id}" role="tabpanel">
                            <div class="panel-body">
                                ${internalObjects}
                            </div>
                        </div>
                    </div>

`;
    }


    /**
     * Append components to box
     * @param componentsHTML
     * @returns {Promise<void>}
     */
    async appendComponents(componentsHTML) {
        this.wrappedComponent.find('.panel-body').append(componentsHTML);
        await this.page.initializeComponents();
    }

    /**
     * Clear box content
     * @returns {Promise<void>}
     */
    async clearContent() {
        this.wrappedComponent.find('.panel-body').html('');
    }

}

export default FaqSlide;
