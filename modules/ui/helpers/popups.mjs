import utils from "../../utils.mjs";

class Popups {
    /**
     *
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Create popup HTML
     * @param caption
     * @param options
     * @param contentHTML
     * @param footerHTML
     * @returns {Promise<{name: number, html: string}>}
     */
    async buildPopupHTML(caption = '', options = {}, contentHTML = '', footerHTML = '') {
        let innerHTML = `<content>${contentHTML}</content>`;
        innerHTML += `<footer>${footerHTML}</footer>`;

        let name = utils.randomId();

        return {name, html: this.page.constructComponent('popup', {...options, caption, name}, innerHTML)};
    }

    /**
     * Start popup component on page
     * @param popupObj
     * @returns {Promise<*>}
     */
    async startPopup(popupObj) {
        await this.page.appendComponents(popupObj.html);
        return this.page.components[popupObj.name];
    }

    /**
     * Create and start popup
     * @param caption
     * @param options
     * @param contentHTML
     * @param footerHTML
     * @returns {Promise<*>}
     */
    async popup(caption = '', options = {}, contentHTML = '', footerHTML = '') {
        let popupObj = await this.buildPopupHTML(caption, options, contentHTML, footerHTML);
        return await this.startPopup(popupObj);
    }

    /**
     * Show modal alert
     * @param caption
     * @param message
     * @param buttonText
     * @returns {Promise<void>}
     */
    async alert(caption = 'Message', message = '', buttonText = 'OK') {
        await new Promise(async resolve => {
            let popup = await this.popup(caption, {}, message, `
                <fw-component  type="Button" data-dismiss="modal">${buttonText}</fw-component>
            `);
            popup.on('close', async () => {
                await popup.destroy();
                resolve();
            });
            await popup.show();
        })
    }

    async confirm(caption = 'Message', message = '', firstButtonText = 'OK', secondButtonText = 'Cancel') {
        let uniqid = utils.randomId();

        return await new Promise(async resolve => {
            let popup = await this.popup(caption, {}, message, `
                <fw-component  type="Button" @click="${'confirm' + uniqid}">${firstButtonText}</fw-component>
                <fw-component  type="Button" data-dismiss="modal">${secondButtonText}</fw-component>
            `);
            popup.on('close', async () => {
                await popup.destroy();
                resolve(false);
                delete this.page.methods[`confirm${uniqid}`];
            });

            this.page.methods[`confirm${uniqid}`] = async (button) => {
                console.log(button);
                resolve(true);
                await popup.hide();
                delete this.page.methods[`confirm${uniqid}`];
            };


            await popup.show();
        })
    }

    /**
     * Show erro message
     * @param caption
     * @param message
     * @returns {Promise<void>}
     */
    async error(caption = 'Error', message = 'Something happens') {
        return await this.alert('⚠️' + caption, message, 'Close');
    }

    async promptValue(caption = 'Message', message = '', buttonText = 'OK', minValue = 0, maxValue = 100, step = 1) {
        let that = this;
        let uniqid = utils.randomId();
        this.page.methods[`promptValue${uniqid}`] = async (component, value) => {
            this.page.components[`countSelector${uniqid}`].value = value;
            this.page.components[`countSlider${uniqid}`].value = value;
        };


        return await new Promise(async (resolve, reject) => {
            let popup = await this.popup(caption, {}, message + `
                                <div class="col-md-12">
                                    <div>
                                        <div class="row">
                                            <div class="col-md-4">
                                                <fw-component @change="promptValue${uniqid}" style=" text-align: right;"
                                                              type="NumberSelector" min="0" max="${maxValue}" value="${minValue}" step="${step}"
                                                              name="countSelector${uniqid}"></fw-component>
                                            </div>
                                            <div class="col-md-8">
                                                <fw-component @slide="promptValue${uniqid}" type="slider" min="${minValue}" max="${maxValue}" step="${step}"
                                                              value="${minValue}" name="countSlider${uniqid}"></fw-component>
                                            </div>
                                        </div>
                           
                                    </div>

                                </div>
            `, `
                <fw-component  type="Button" name="${uniqid}">${buttonText}</fw-component>
                <fw-component  type="Button" data-dismiss="modal">Cancel</fw-component>
            `);

            async function destroy() {
                delete that.page.methods[`promptValue${uniqid}`];
                delete that.page.components[`countSelector${uniqid}`];
                delete that.page.components[`countSlider${uniqid}`];
                await popup.destroy();
            }

            popup.on('close', async () => {
                await destroy();
                delete this.page.methods[`promptValue${uniqid}`]
                reject('Canceled');
            });

            this.page.components[uniqid].on('click', async () => {
                let value = this.page.components[`countSelector${uniqid}`].value;
                if(value < minValue || value > maxValue) {
                    await this.error('Error', 'Value must be between ' + minValue + ' and ' + maxValue);
                    return;
                }
                await popup.hide();
                resolve(value);
            });
            await popup.show();
        })
    }


}

export default Popups;