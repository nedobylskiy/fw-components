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

/**
 * State view component
 */
class StateView extends _UIComponent {


    /**
     * Initialize
     * @returns {Promise<void>}
     */
    async init() {

        this._innerHTML = this.domObject.html();

        let attributes = this.domObject[0].attributes;

        this.name = attributes.name ? attributes.name.value : this.id;
        this._disabled = !!attributes.disabled;
        this._state = attributes.state.value;


        //Construct button HTML
        this.domObject[0].outerHTML = (`
        <div id="${this.id}" class="  ${this._disabled ? 'disabled' : ''}  "  style="padding: 0; margin: 0" >
            ${this._innerHTML}
            </div> `)
        this.wrappedComponent = $('#' + this.id);


        await this.setState(this._state);

        return this.name;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this.setState(state);
    }

    /**
     * Change state
     * @param state
     */
    setState(state) {
        let states = this.wrappedComponent.find('state');
        // let elements = this.wrappedComponent.find('[showStates]');

        for (let elState of states) {
            elState = $(elState);
            let activeStates = $(elState).attr('activeStates').split(',');
            if(activeStates.includes(state) || activeStates.includes('*')) {
                elState.show();
            } else {
                elState.hide();
            }
        }

    }

}

export default StateView;
