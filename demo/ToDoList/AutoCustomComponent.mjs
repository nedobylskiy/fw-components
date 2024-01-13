import {UIComponents, _Renderable} from "../../index.mjs";

class AutoCustomComponent extends _Renderable {

    async init() {
        await super.init();
    }

    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, ['type']);
        return `
              <div id="${this.id}" ${attribStr}>
                    <h2>I am a custom component that automatically registered!</h2>
            </div>`;
    }
}

//Register component
await UIComponents.registerUIComponent(AutoCustomComponent);

export default AutoCustomComponent;
