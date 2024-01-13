import {UIComponents, _Renderable} from "../../index.mjs";

class ToDoElement extends _Renderable {


    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'class']);
        return `
              <div class="col-12 row ${this.attrs.class}" id="${this.id}" ${attribStr}>
                    <div class="col-10">${this.caption}</div>
                    <div class="col-2"><fw-component component="bs_button" class="btn btn-danger" #click="console.log(this.parent.destroy())">Remove</fw-component></div>
            </div>`;
    }

    get caption() {
        return this.attrs.caption || '';
    }

    set caption(value) {
        this.attrs.caption = value;
        this.render();
    }
}

//Register component
await UIComponents.registerUIComponent(ToDoElement);

export default ToDoElement;
