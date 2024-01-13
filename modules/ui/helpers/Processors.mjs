import uiUtils from "../uiUtils.js";

/**
 * Utils for processing strings, objects, arrays
 */
const Processors = {
    //Strings
    escape: uiUtils.escape,
    e: uiUtils.escape,
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    nl2br: (str) => {
        return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
    },
    //Arrays and strings
    first: (arr) => {
        if (typeof arr === 'string')
            return arr.charAt(0);
        return arr[0];
    },
    last: (arr) => {
        if (typeof arr === 'string')
            return arr.charAt(arr.length - 1);
        return arr[arr.length - 1];
    },
}

/**
 * String processor for chaining
 */
class StringProcessor {
    _CONTENT = '';

    constructor(content) {
        this._CONTENT = content;
    }

    escape(strategy = 'html') {
        this._CONTENT = Processors.escape(this._CONTENT, strategy);
        return this;
    }

    e(strategy = 'html') {
        return this.escape(strategy);
    }

    capitalize() {
        this._CONTENT = Processors.capitalize(this._CONTENT);
        return this;
    }

    c() {
        return this.capitalize();
    }

    nl2br() {
        this._CONTENT = Processors.nl2br(this._CONTENT);
        return this;
    }

    static create(content) {
        return new StringProcessor(content);
    }

    toString() {
        return this._CONTENT;
    }

    valueOf() {
        return this._CONTENT;
    }

    get() {
        return this._CONTENT;
    }
}

export default Processors;
export {Processors, StringProcessor};

export const escape = Processors.escape;
export const e = Processors.escape;

export const capitalize = Processors.capitalize;
export const c = Processors.capitalize;

export const nl2br = Processors.nl2br;

export const first = Processors.first;
export const last = Processors.last;

export const p = StringProcessor.create;
