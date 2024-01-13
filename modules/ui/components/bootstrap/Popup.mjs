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


import _PopUP from "../_PopUP.mjs";
import Button from "./Button.mjs";

class Popup extends _PopUP {


    /**
     * Initialize button
     * @returns {Promise<void>}
     */
    async init() {
        this._innerHTML = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        let content = this.domObject.find('content');
        if (content.length !== 0) {
            this._innerHTML = content.html();
        }

        this.footerHtml = '';
        let footer = this.domObject.find('footer');
        if (footer.length !== 0) {
            this.footerHtml = footer.html();
        }

        //Construct button HTML
        this.domObject[0].outerHTML = await this.buildHtml();
        this.wrappedComponent = $('#' + this.id);

        this.wrappedComponent.on('hidden.bs.modal', async () => {
            await this.runBindedEvent('close', [this]);
            this.emit('close', this);
        })


        this._caption = this.attrs.caption ? this.attrs.caption : '';

        await this.initializeInternalComponents();

        return this.name;
    }

    async buildHtml() {

        console.log(this.attrs);

        return (`
            <div class="modal fade" ${this.attrs.static ? 'data-backdrop="static" data-keyboard="false"' : ''}  id="${this.id}">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title modalCaption" >${this.caption}</h4>
                            ${this.attrs.unclosable ? '' : '<fw-component component="bs_button"  class="close" data-dismiss="modal" aria-label="Close" #click="this.parent.close()"><span aria-hidden="true">&times;</span></fw-component>'}
                        </div>
                        <div class="modal-body">
                            ${this._innerHTML}
                        </div>
                        <div class="modal-footer">
                           ${this.footerHtml ? this.footerHtml : ''} 
                           ${this.attrs.leftbutton ? Button.construct({'#click':'this.parent.clickLeftButton()', class:'btn-primary'}, this.attrs.leftbutton) : ''}
                           ${this.attrs.rightbutton ? Button.construct({'#click':'this.parent.clickRightButton()','class':'btn-secondary'}, this.attrs.rightbutton) : ''}
                        </div>
                    </div>
                </div>
            </div>
             `);
    }

    /**
     * Get popup caption
     */
    get caption() {
        return this._caption;
    }

    /**
     * Set popup caption
     * @param caption
     */
    set caption(caption) {
        this._caption = caption;
        this.wrappedComponent.find('.modalCaption').html(caption);
    }

    /**
     * Show popup
     * @returns {Promise<void>}
     */
    async show() {
        this.wrappedComponent.modal('show');
    }

    /**
     * Hide popup
     * @returns {Promise<void>}
     */
    async hide() {
        this.wrappedComponent.modal('hide');
    }


    async destroy() {
        await this.close();
        await super.destroy();
    }

    async close() {
        await this.hide();
    }

    async clickLeftButton() {
        await this.runBindedEvent('leftButtonClick', [this]);
        this.emit('leftButtonClick', this);
    }

    async clickRightButton() {
        await this.runBindedEvent('rightButtonClick', [this]);
        this.emit('rightButtonClick', this);
    }

}

export default Popup;
