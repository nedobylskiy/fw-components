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
import uiUtils from "../uiUtils.js";
import Holder from "./Holder.mjs";

/**
 * This component cannot be shown. It is used to register other components and use its like standalone component
 */
class Reusable extends _UIComponent {


    /**
     * Initialize holder
     * @returns {Promise<void>}
     */
    async init() {
        await super.init();

        this.template = true;

        this._innerHTML = this.domObject.html();

        this.name = this.attributes.name ? this.attributes.name.value : this.id;


        this.domObject[0].outerHTML = '';
        //this.wrappedComponent = $('#' + this.id);

        // await this.initializeInternalComponents();

        let that = this;

        await this.app.registerComponent(this.name, class extends Holder {
            async init() {
                this._innerHTML = that._innerHTML;
                super.init(this._innerHTML);
            }
        });

        return this.name;
    }


}

export default Reusable;
