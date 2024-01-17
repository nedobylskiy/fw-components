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

import StateView from "./StateView.mjs";

/**
 * StateView that detects AppState change for 'subscribe' attribute
 */
class AppStateView extends StateView {


    /**
     * Initialize
     * @returns {Promise<void>}
     */
    async init() {

        let name = super.init();

        this.subscribe = this.attrs.subscribe ? this.attrs.subscribe : false;

        if (this.subscribe) {
            this.page.on('stateChange', async (key, value, fullState) => {
                if (key !== this.subscribe) {
                    return;
                }
                await this.setState(String(value));
            });
        }

        return name;
    }


}

export default AppStateView;
