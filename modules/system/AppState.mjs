class AppState {
    constructor() {
        this.state = {};
        this.listeners = [];

        return new Proxy(this, {
            get: (target, prop) => {
                if (prop in target) {
                    return target[prop];
                } else {
                    return target.get(prop);
                }
            },
            set: (target, prop, value) => {
                if (prop in target) {
                    target[prop] = value;
                } else {
                    target.set(prop, value);
                }
                return true;
            }
        });
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        this.listeners.forEach((listener) => {
            listener(key, value, this.state);
        });
    }

    onChange(listener) {
        this.listeners.push(listener);
    }

    offChange(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

}

export default AppState;
