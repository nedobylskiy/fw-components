/*
  ______ _____
 |  ____|  __ \
 | |__  | |__) |_ _  __ _  ___
 |  __| |  ___/ _` |/ _` |/ _ \
 | |    | |  | (_| | (_| |  __/
 |_|    |_|   \__,_|\__, |\___|
                     __/ |
                    |___/
 */

/**
 * @name FPage framework
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 * @version 1.0
 */

import uiUtils from "../uiUtils.js";

/**
 * UI component abstract
 * @abstract
 */
class _UIComponent extends EventEmitter3 {
    constructor(pageId, domObject, id, page, pageScript = {methods: {}}) {
        super();
        this.pageId = pageId;
        this.domObject = domObject;
        this.pageScript = pageScript;
        this.page = page;
        this.id = id;
        this.attributes = this.domObject[0].attributes;
        this.attrs = uiUtils.attributesToObject(this.attributes);
        this._disabled = false;
        this._visible = true;
        this.wrappedComponent = null;
        this.components = {};
        // this.parent = null;
    }

    /**
     * Initialize UI component
     * @returns {Promise<_UIComponent>}
     */
    async init() {
        //await this.initializeInternalComponents();
        return this;
    }

    async initializeInternalComponents() {
        if(this.wrappedComponent) {
            let preparedComponents = await this.page.initializeComponents(this.wrappedComponent, this);
            this._childComponents = preparedComponents;

            for (let component of preparedComponents) {
                this.components[component.name] = component;
            }
        }
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
        try {
            this.domObject.remove();
        } catch (e) {
        }
        try {
            console.log('DESTROY', this.wrappedComponent);
            this.wrappedComponent.remove();
        } catch (e) {
        }
    }

    /**
     * Run binded event method
     * @param event
     * @param params
     * @param that
     * @returns {Promise<*>}
     */
    async runBindedEvent(event, params = [], that = this) {
        if(this.attributes['@' + event]) {
            let method = this.attributes['@' + event].value;

            //Inherit event passing
            if(method === '^'){
                this.emit(event, ...params);
                return true;
            }

            //Call methods if exists
            if(this.parent.methods[method]) {
                return await this.parent.methods[method](...params);
            } else {
                if(this.parent[method]) {
                    return await this.parent[method](...params);
                }
            }
        }
    }

    /**
     * Get state
     * @returns {*|boolean}
     */
    get disabled() {
        return this._disabled;
    }

    /**
     * Set state
     * @param boolVal
     */
    set disabled(boolVal) {
        this._disabled = boolVal;
        if(boolVal) {
            $(`#${this.id}`).addClass('disabled');
        } else {
            $(`#${this.id}`).removeClass('disabled');
        }
    }

    /**
     * Get state
     * @returns {*|boolean}
     */
    get visible() {
        return this._visible;
    }

    /**
     * Set state
     * @param boolVal
     */
    set visible(boolVal) {
        this._visible = boolVal;
        if(boolVal) {
            this.wrappedComponent.show();
        } else {
            this.wrappedComponent.hide();
        }
    }

    /**
     * Convert attributes object to attributes string
     * @param {object} attributesOBJ
     * @param {array} excludeList
     * @returns {string}
     */
    attributesObjectToStr(attributesOBJ, excludeList = []) {
        let attributes = ``;
        for (let attr in attributesOBJ) {
            if(excludeList.includes(attr)) {
                continue;
            }

            if(attr.includes('@')) {
                continue;
            }

            attributes += ` ${attr}=${JSON.stringify(attributesOBJ[attr])}`
        }

        return attributes;
    }

    /**
     * Setup getters-setters for attribute
     * @param {string} attribute
     */
    setupAttributeGettersSetters(attribute) {
        Object.defineProperty(this, attribute, {
            get: function () {
                return this.wrappedComponent.attr(attribute);
            },
            set: function (value) {
                this.wrappedComponent.attr(attribute, value);
            },
        });
    }

    setupValueGettersSetters() {
        Object.defineProperty(this, 'value', {
            get: function () {
                return this.wrappedComponent.val();
            },
            set: function (value) {
                this.wrappedComponent.val(value);
            },
        });
    }

}

export default _UIComponent;
