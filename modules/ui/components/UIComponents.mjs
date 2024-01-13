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

import Button from "./bootstrap/Button.mjs";
import TextInput from "./bootstrap/TextInput.mjs";
import FoldableBox from "./bootstrap/FoldableBox.mjs";
import Image from "./Image.mjs";
import Caption from "./Caption.mjs";
import BadgesList from "./bootstrap/BadgesList.mjs";
import StateView from "./StateView.mjs";
import Popup from "./bootstrap/Popup.mjs";
import PrimaryButton from "./bootstrap/PrimaryButton.mjs";
import Slider from "./Slider.mjs";
import Holder from "./Holder.mjs";
import NumberSelector from "./NumberSelector.mjs";
import TemplateLoader from "./TemplateLoader.mjs";
import Checkbox from "./bootstrap/Checkbox.mjs";
import FormGroup from "./bootstrap/FormGroup.mjs";
import CopyableTextInput from "./bootstrap/CopyableTextInput.mjs";
import ProgressBar from "./bootstrap/ProgressBar.mjs";
import FaqSlide from "./bootstrap/FaqSlide.mjs";
import CaptionedBox from "./bootstrap/CaptionedBox.mjs";
import ScrollListener from "./ScrollListener.mjs";

import Table from "./Table.mjs";

import Page from "./Page.mjs";
import Markdown from "./thirdparty/Markdown.mjs";
import Reusable from "./Reusable.mjs";

let UIComponents = {
    page: Page,
    image: Image,
    caption: Caption,
    stateview: StateView,
    slider: Slider,
    numberselector: NumberSelector,
    holder: Holder,
    templateloader: TemplateLoader,
    scrolllistener: ScrollListener,
    table: Table,
    reusable: Reusable,


    //Bootstrap
    'bs_button': Button,
    'bs_primarybutton': PrimaryButton,
    'bs_textinput': TextInput,
    'bs_foldablebox': FoldableBox,
    'bs_captionedbox': CaptionedBox,
    'bs_checkbox': Checkbox,
    'bs_formgroup': FormGroup,
    'bs_copyabletextinput': CopyableTextInput,
    'bs_progressbar': ProgressBar,
    'bs_faqslide': FaqSlide,
    'bs_badgeslist': BadgesList,
    'bs_popup': Popup,

    //Thirdparty (require additional modules)
    'markdown': Markdown


}

//Register new component
UIComponents.registerUIComponent = async (name, component) => {
    UIComponents[name.toLowerCase()] = component;
}

/**
 * Construct page component code
 * @param {string} type
 * @param {object} options
 * @param {string} innerHtml
 * @returns {string}
 */
UIComponents.constructComponent = (type, options = {disabled: false}, innerHtml = '') => {
    let componentCode = `<fw-component type="${type}"`
    for (let attribute in options) {
        if(typeof options[attribute] === 'object') {
            componentCode += ` ${attribute}='${JSON.stringify(options[attribute])}' `;
        } else {
            componentCode += ` ${attribute}=${JSON.stringify(options[attribute])} `;
        }
    }
    componentCode += `>${innerHtml}</fw-component>`;
    return componentCode
}

export default UIComponents;
