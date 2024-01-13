import _Renderable from "../modules/ui/components/_Renderable.mjs";

class CustomComponent extends _Renderable {

    async init() {
        await super.init();
    }
    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, ['type']);
        return `
              <div id="${this.id}" ${attribStr}>
                    <h2>I am a custom component</h2>
            </div>`;
    }
}

export default CustomComponent;
