import uiUtils from "./uiUtils.js";
import utils from "../utils.mjs";
import UIComponents from "./components/UIComponents.mjs";
import Popups from "./helpers/popups.mjs";
import $ from "./jQueryResolver.mjs"

import EventEmitter3 from "../thirdparty/EventEmitter3Resolve.mjs";
import AppState from "../system/AppState.mjs";

class AppPage extends EventEmitter3 {

    methods = {
        /**
         * Logs all incoming params
         * @param debug
         */
        debugLog: (...debug) => {
            console.log('FDebug:', ...debug);
        }
    };

    /**
     *
     * @param {*} pageContainer
     * @param {string|number} id
     * @param {{}} options
     */
    constructor(pageContainer, id = "page_" + utils.randomId(), options = {}) {
        super();
        this.id = id;

        this.page = null;
        this.baseUrl = options.baseUrl;
        this.options = {
            ...options,
            pageContainer: $(pageContainer)
        };

        this.runParams = {};

        this.components = {};
        this.componentsById = {};

        this.state = new AppState();
        this.state.onChange((key, value, fullState) => {
            this.emit('stateChange', key, value, fullState);
        });
    }

    /**
     * Load page from backend controller
     * @param {string} action
     * @param {string} controller
     * @param {object} runParams Page start options
     * @param {boolean} hideOnLoad Hide page on load
     * @returns {Promise<Page>}
     */
    async init(hideOnLoad = false, runParams = {}) {

        this.page = $(this.options.pageContainer);

        if (hideOnLoad) {
            this.page.hide();
        }
        this.pageObject = {methods: this.methods};

        //If page script defined
        let pageScript = this.page.find('[type="fpage-script"]').attr('src');
        if (pageScript) {
            try {
                let pageObject = (await import(pageScript)).default;
                if (pageObject) {
                    this.pageObject = pageObject;
                    this.methods = this.pageObject.methods;
                }
            } catch (e) {
                console.log('FWC Error:', 'Cant load fpage-script', pageScript, 'cuz', e);
                console.error(e);
            }
        }


        await this.initializeComponents(this.page, this);

        //Initialize page if script method exists
        if (this.pageObject.methods.init) {
            await this.pageObject.methods.init(this, runParams);
        }

        return this;
    }

    /**
     * Initialize all fw-components
     * @param componentHolder
     * @param parentComponent
     * @returns {Promise<void>}
     */
    async initializeComponents(componentHolder = this.page, parentComponent = null) {
        return await this.prepareUIComponents(componentHolder, parentComponent);
    }

    /**
     * Find and initialize page UI components
     * @param pageContainer
     * @param parentComponent
     * @returns {[*]}
     */
    async prepareUIComponents(pageContainer, parentComponent = null) {
        let pageComponents = $(pageContainer).find('fw-component');


        let firstLevelComponents = [];
        for (let component of pageComponents) {
            component = $(component);

            //Check component is only one level

            let itsChild = false;
            for (let parentComponent of pageComponents) {
                //console.log($(parentComponent), component, $(parentComponent).find(component));
                if ($(parentComponent).find(component).length !== 0) {
                    itsChild = true;
                    break;
                }
            }

            if (itsChild) {
                continue;
            }

            firstLevelComponents.push(component);
        }

        if (this.options.verbose) {
            console.log(pageContainer, '>', firstLevelComponents);
        }

        let preparedComponents = [];

        for (let component of firstLevelComponents) {
            component = $(component);

            try {

                let componentType = '';
                try {
                    componentType = component.attr('component').toLowerCase();
                } catch (e) {
                    console.log('FWC Page: Parsing error: No "component" attribute found for ', component);
                    componentType = 'holder';
                }

                let componentClass = UIComponents[componentType];

                if (!componentClass) {
                    console.log('FWC Page: Parsing error: Component', componentType, 'not found');
                    componentClass = UIComponents['holder'];
                }

                if (componentClass) {
                    let newComponentId = componentType + '_' + utils.randomId();
                    /** @type _UIComponent */
                    let newComponent = new componentClass(this.id, component, newComponentId, this, this.pageObject);

                    newComponent.parent = parentComponent;
                    newComponent.app = this;

                    let componentName = await newComponent.init();
                    await newComponent.afterInit();

                    this.componentsById[newComponentId] = newComponent;
                    this.components[componentName] = newComponent;

                    preparedComponents.push(newComponent);
                }
            } catch (e) {
                console.log('FWC Page: Parsing error:', e);
            }
        }

        return preparedComponents;
    }

    /**
     * Hide page
     * @returns {Promise<void>}
     */
    async hide() {
        if (this.page) {
            this.page.hide();
        }
    }

    /**
     * Show page
     * @returns {Promise<void>}
     */
    async show() {
        if (this.page) {
            this.page.show();
        }
    }

    /**
     * Destroy page
     * @returns {Promise<void>}
     */
    async destroy() {
        if (this.page) {
            this.page.remove();
        }
    }

    /**
     * Construct page component code
     * @param {string} type
     * @param {object} options
     * @param {string} innerHtml
     * @returns {string}
     */
    constructComponent(type, options = {disabled: false}, innerHtml = '') {

        return UIComponents.constructComponent(type, options, innerHtml);

        /* let componentCode = `<fw-component type="${type}"`
         for (let attribute in options) {
             if(typeof options[attribute] === 'object') {
                 componentCode += ` ${attribute}='${JSON.stringify(options[attribute])}' `;
             } else {
                 componentCode += ` ${attribute}=${JSON.stringify(options[attribute])} `;
             }
         }
         componentCode += `>${innerHtml}</fw-component>`;
         return componentCode*/
    }

    /**
     * Append component to end of the page (usable for popups)
     * @param {string} componentsHTML
     * @param {object} holder
     * @returns {Promise<void>}
     */
    async appendComponents(componentsHTML, holder = this.page) {
        await holder.append(componentsHTML);
        await this.initializeComponents();
    }

    /**
     * Register new UI component runtime
     * @param name
     * @param component
     * @returns {Promise<void>}
     */
    async registerComponent(name, component) {
        return await UIComponents.registerUIComponent(name, component);
    }

    async removeComponentLinksByNameOrId(nameOrId) {

        if (this.components[nameOrId]) {
            let component = this.components[nameOrId];
            delete this.components[nameOrId];
            delete this.componentsById[component.id];
        }

        if (this.componentsById[nameOrId]) {
            let component = this.componentsById[nameOrId];
            delete this.componentsById[nameOrId];
            delete this.components[component.name];
        }
    }

    async removeComponentByNameOrId(nameOrId) {
        if (this.components[nameOrId]) {
            return await this.components[nameOrId].destroy();
        }

        if (this.componentsById[nameOrId]) {
            return await this.componentsById[nameOrId].destroy();
        }
    }

    /**
     * Remove component from page
     * @param {_UIComponent} component
     * @returns {Promise<void>}
     */
    async removeComponent(component) {
        return await component.destroy();
    }


}

export default AppPage;
