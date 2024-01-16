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
        this._childComponents = [];
        /**
         * Parent component
         * @type {null|_UIComponent}
         */
         this.parent = null;
    }

    /**
     * Initialize UI component
     * @returns {Promise<_UIComponent>}
     */
    async init() {


        this.name = this.attrs.name ? this.attrs.name : this.id;


        return this.name;

        //await this.initializeInternalComponents();
        //return this;
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
            this._childComponents = [...this._childComponents, ...preparedComponents];

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

        await this.page.removeComponentLinksByNameOrId(this.name);

        if (this.parent) {
            await this.parent.removeChildComponentLinksByNameOrId(this.name);
        }

        try {
            this.domObject.remove();
        } catch (e) {
        }
        try {
            // console.log('DESTROY', this.wrappedComponent);
            this.wrappedComponent.remove();
        } catch (e) {
        }


        await this.runBindedEvent('destroy', [this]);

        this.emit('destroy', this);
    }

    /**
     * Run binded event method
     * @param event
     * @param params
     * @param that
     * @returns {Promise<*>}
     */
    async runBindedEvent(event, params = [], that = this) {

        event = event.toLowerCase();

        //Run binded event
        if (this.attributes['@' + event]) {
            let method = this.attributes['@' + event].value;

            //Inherit event passing
            if (method === '^') {
                this.emit(event, ...params);
                return true;
            }

            //Emit event in parent
            /* if (method === '^^') {
                 //console.log('EMIT', event, this.parent)
                 if (this.parent.emit) {
                     this.parent.emit(event, ...params);
                 }
                 return true;
             }*/

            //Emit event in parent N levels up
            if (method.match(/^\^+$/)) {
                let count = method.length;
                let lastParent = this;
                for (let i = 1; i < count; i++) {
                    if (lastParent.parent) {
                        lastParent = lastParent.parent;
                    }
                }
                if (lastParent.emit) {
                    lastParent.emit(event, ...params);
                }

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
            let method = new Function('return (()=>{' + code + '})()');
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
     * Returns components as array
     * @returns {Promise<[_UIComponent]>}
     */
    async getComponents() {
        return this._childComponents;
    }

    /**
     * Find component by name
     * @param {_UIComponent|string} type
     * @returns {Promise<*[_UIComponent]>}
     */
    async findComponentsByType(type) {
        if (typeof type !== 'string') {
            type = type.name || type.constructor.name;
        }
        type = type.toLowerCase();
        let components = [];
        for (let component of this._childComponents) {
            if (component.constructor.name.toLowerCase() === type) {
                components.push(component);
            }
        }
        return components;
    }

    /**
     * Remove child links by name or id
     * @param {string} nameOrId
     * @returns {Promise<void>}
     */
    async removeChildComponentLinksByNameOrId(nameOrId) {
        if (this.components[nameOrId]) {
            delete this.components[nameOrId];
        }

        for (let i = 0; i < this._childComponents.length; i++) {
            if (this._childComponents[i].name === nameOrId || this._childComponents[i].id === nameOrId) {
                this._childComponents.splice(i, 1);
            }
        }
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

    /**
     * Check if component is same
     * @param {_UIComponent} component
     * @returns {boolean}
     */
    same(component) {
        return component.id === this.id;
    }

}

export default _UIComponent;
