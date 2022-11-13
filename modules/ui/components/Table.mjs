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

import _UIComponent from "./_UIComponent.mjs";
import uiUtils from "../uiUtils.js";

class Table extends _UIComponent {


    /**
     * Initialize holder
     * @returns {Promise<void>}
     */
     async init() {
        await super.init();

        this._innerHTML = this.domObject.html();

        this.headerHtml = "";
        this.headerList = [];

        this.rowObj = {};
        this.rowNames = [];

        this.orderObj = {
            "nameOrder":{},
            "orderName":{},
            "lastOrder": 0
        }

        this.name = this.attributes.name ? this.attributes.name.value : this.id;

        this.domObject[0].outerHTML = await this.buildHtml();
        this.wrappedComponent = $('#' + this.id);

        return this.name;
    }

    /**
     * Build HTML
     * @param internalObjects
     * @returns {Promise<string>}
     */
    async buildHtml(internalObjects) {
        //Setup non-custom attributes

        let attribStr = this.attributesObjectToStr(this.attrs, ['type', 'class']);

        return `
        <table id="${this.id}" style="width: 100%" class="table ${this.attributes.tablehover ? 'table-hover' : ''} " ${attribStr}>
        </table>`;
    }

    /**
     * Append sets table header
     * @param componentsHTML
     * @returns {Promise<void>}
     */
     async setHeader(headerList = [1,2,3,4,5]) {

        let newHeader = `<thead><tr>`;

        for (let header of headerList) {
            newHeader += `<th scope="col">${header}</th>`
        }

        newHeader += `</tr></thead>`

        this.headerHtml = newHeader;
        this.headerList = headerList;

        await this._rebuildTable();

        return this.headerHtml;
    }

    /**
     * Append row to table
     */
        async addRow(rowInnerTextList = ["qwe1","qwe2","qwe3","qwe4","qwe5"], rowName = "test") {

        let newRow = rowInnerTextList;

        this.rowObj[rowName] = newRow;

        this.rowNames = Object.keys(this.rowObj);

        if (!(rowName in this.orderObj.nameOrder)){

            let orderNameLength = this.orderObj.lastOrder;

            this.orderObj.orderName[orderNameLength] = rowName;

            this.orderObj.nameOrder[rowName] = orderNameLength;

            this.orderObj.lastOrder++;

        }

        await this._rebuildTable();
    }

    /**
     * Clear table content
     */
    async clearContent() {
        this.wrappedComponent.empty();

        this.headerHtml = "";
        this.headerList = [];

        this.rowObj = {};
        this.rowNames = [];

        this.orderObj = {
            "nameOrder":{},
            "orderName":{},
            "lastOrder": 0
        }

    }

    // 
    /**
     * Remove rov from table
     */
        async removeRow(rowName) {

            if ((rowName in this.orderObj.nameOrder)){
    
                let order = this.orderObj.nameOrder[rowName]

                delete this.orderObj.orderName[order];

                delete this.orderObj.nameOrder[rowName];

                delete this.rowObj[rowName]; 

                await this._rebuildTable();

            }
            
        }

    async _reformTableBody() {

        let tableBody = "<tbody>";

        for (let orderKey in this.orderObj.orderName){

            let rowkey = this.orderObj.orderName[orderKey];

            tableBody += "<tr>";

            let currentRow = this.rowObj[rowkey];

            for (let cell of currentRow){
                tableBody += `<th scope="row">${cell}</th>`;
            }

            tableBody += "</tr>";

        }

        tableBody += `</tbody>`;

        return tableBody;
    };

    async _rebuildTable(){
        await this.wrappedComponent.empty();

        await this.wrappedComponent.append(this.headerHtml);

        if (this.rowNames.length !== 0){
            this.wrappedComponent.append((await this._reformTableBody()));
        }

        await this.page.initializeComponents();


        this.wrappedComponent.trigger('updateAll')

       /* this.wrappedComponent.tablesorter({
            theme : "blue",
          })*/

    }
}
export default Table;


