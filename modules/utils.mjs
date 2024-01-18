const utils = {

    /**
     * Async JSONP
     * @async
     * @param url
     * @param callback
     * @returns {Promise<unknown>}
     */
    jsonp(url, callback = "jsonpCallback_" + String(Math.round(Math.random() * 100000))) {
        return new Promise((resolve, reject) => {
            try {
                let script = document.createElement("script");

                window[callback] = function (data) {
                    window[callback] = undefined;
                    resolve(data);
                };
                script.src = `${url}?callback=${callback}`;
                document.body.appendChild(script);
            } catch (e) {
                reject(e);
            }
        });
    },

    /**
     * Get JSON file
     * @param {string} url
     * @param {boolean} local
     * @returns {Promise<any>}
     */
    async fetchJSON(url, local = false) {
        if (url.includes('file:') || local) {
            if (!url.includes('file:') && window._isApp) {
                url = 'file:///android_asset/www' + url;
            }
            return await (await this.fetchLocal(url)).json();
        }
        return await ((await fetch(url))).json();
    },
    /**
     * Hex encoded string to string
     * @param {string} hexString
     * @returns {string}
     */
    hex2String(hexString) {
        return Buffer.from(hexString, 'hex').toString();
    },

    /**
     * String to hex string
     * @param {string} str
     * @returns {string}
     */
    string2Hex(str) {
        return Buffer.from(str, 'utf8').toString('hex');
    },


    /**
     * Returns random id
     * @returns {number}
     */
    randomId() {
        return Math.round(Math.random() * 1000000);
    },

    /**
     * Simple async wait
     * @param timeout
     * @async
     * @returns {Promise<unknown>}
     */
    wait: (timeout = 1000) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        })
    },


    nFormatter(num, digits) {
        if (num < 1) {
            return Number(num).toFixed(digits);
        }
        const lookup = [
            {value: 1, symbol: ""},
            {value: 1e3, symbol: "k"},
            {value: 1e6, symbol: "M"},
            {value: 1e9, symbol: "G"},
            {value: 1e12, symbol: "T"},
            {value: 1e15, symbol: "P"},
            {value: 1e18, symbol: "E"}
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (this.floatToFixedFloor((num / item.value), digits)).replace(rx, "$1") + item.symbol : "0";
    },
    floatToFixedFloor(num, fixed) {
        fixed = fixed || 0;
        fixed = Math.pow(10, fixed);
        return String(Math.floor(num * fixed) / fixed);
    }
}
export default utils;
