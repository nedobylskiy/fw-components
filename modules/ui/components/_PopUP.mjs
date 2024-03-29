

import _UIComponent from "./_UIComponent.mjs";

/**
 * Popup abstract
 * @abstract
 */
class _PopUP extends _UIComponent {
    constructor(pageId, domObject, id, page, pageScript = {methods: {}}) {
        super(pageId, domObject, id, page, pageScript);
    }

    /**
     * Initialize UI component
     * @returns {Promise<_UIComponent>}
     */
    async init() {
        return this;
    }

    /**
     * Emit event
     * @param args
     * @returns {*}
     */
    emit(...args) {
        return super.emit(...args);
    }

    /**
     * Destroy component
     * @returns {Promise<void>}
     */
    async destroy() {
        return await super.destroy();
    }


    /**
     * Run popup
     * @param {object} params
     * @returns {Promise<*>}
     */
    async run(params = {}) {
        return false;
    }

    /**
     * Show popup
     */
    async show(params = {}) {

    }

    /**
     * Hide popup
     */
    async hide(params = {}) {

    }

}

export default _PopUP;
