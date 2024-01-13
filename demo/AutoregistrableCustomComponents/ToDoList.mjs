import {UIComponents, _Renderable} from "../../index.mjs";
import ToDoElement from "./ToDoElement.mjs";

class ToDoList extends _Renderable {


    async buildHtml() {
        let attribStr = this.attributesObjectToStr(this.attrs, ['type']);
        return `
              <div id="${this.id}" ${attribStr}>
                    ${this._innerHTML}
            </div>`;
    }

    async addItem(caption) {
        let item = ToDoElement.construct({caption: caption});
        console.log(item);
        await this.appendComponent(item);
    }

    async getItems() {
        return await this.findComponentsByType(ToDoElement);
    }

    async getCaptions(){
        let items = await this.getItems();
        return items.map(item => item.caption);
    }

}

//Register component
await UIComponents.registerUIComponent(ToDoList);

export default ToDoList;
