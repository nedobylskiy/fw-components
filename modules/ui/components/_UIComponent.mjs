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
import EventEmitter3 from "../../thirdparty/EventEmitter3Resolve.mjs";
import UIComponents from "./UIComponents.mjs";

/**
 * UI component abstract
 * @abstract
 */
class _UIComponent extends EventEmitter3 {
    /**
     *
     * @param {string} pageId
     * @param {object} domObject
     * @param {string} id
     * @param {AppPage} page
     * @param {object} pageScript
     */
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
        /** @type {AppPage} */
        this.app = null;
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

    /**
     * After main initialization
     * @returns {Promise<void>}
     */
    async afterInit() {
        //Setup attributes
        for (let attribute in this.attrs) {
            if (this[attribute]) {
                this[attribute] = this.attrs[attribute];
            }
        }

    }

    async initializeInternalComponents() {
        if (this.wrappedComponent) {
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

        //Run binded event
        if (this.attributes['@' + event]) {
            let method = this.attributes['@' + event].value;

            //Inherit event passing
            if (method === '^') {
                this.emit(event, ...params);
                return true;
            }

            //Call methods if exists
            if (this.parent.methods[method]) {
                return await this.parent.methods[method](...params);
            } else {
                if (this.parent[method]) {
                    return await this.parent[method](...params);
                }
            }
        }

        //Run inline code
        if (this.attrs['#' + event]) {
            let code = this.attrs['#' + event];
            let method = new Function('return ' + code);
            return await method.apply(this, params);
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
        if (['true', 'false'].includes(boolVal.toLowerCase())) {
            boolVal = boolVal.toLowerCase() === 'true';
        }
        this._disabled = boolVal;
        if (boolVal) {
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
        if (['true', 'false'].includes(boolVal.toLowerCase())) {
            boolVal = boolVal.toLowerCase() === 'true';
        }
        this._visible = boolVal;
        if (boolVal) {
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
            if (excludeList.includes(attr)) {
                continue;
            }

            if (attr.includes('@')) {
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

    /**
     * Construct component code
     * @param {object|undefined} attributes Component attributes
     * @param {string|undefined} innerHtml Inner HTML (may contain other components)
     * @returns {string}
     */
    static construct(attributes = undefined, innerHtml = '') {
        let type = this.name.toLowerCase();

        return UIComponents.constructComponent(type, attributes, innerHtml);

    }

    /**
     * Register component
     * @returns {Promise<void>}
     */
    static async register() {
        return await UIComponents.registerUIComponent(this.name.toLowerCase(), this);
    }

}

export default _UIComponent;
