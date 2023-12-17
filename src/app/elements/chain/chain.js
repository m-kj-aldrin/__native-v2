import { log_cli } from "../../com/index.js";
import { dragZone } from "../../dom/drag.js";
import flip from "../../dom/flip.js";
import { base_element } from "../base/base.js";
import { com_module } from "../module/module.js";
import { com_network } from "../network/network.js";
import template from "./chain.component.html?inline";

export class com_chain extends base_element {
    #_index = -1;

    /**@type {com_network} */
    #_parent = undefined;
    #_init = false;

    constructor() {
        super();

        this.shadowRoot.innerHTML += template;
    }

    get index() {
        return this.#_index;
    }

    set index(v) {
        this.shadowRoot.getElementById("index").textContent = `idx: ${v}`;
        this.#_index = v;
    }

    get modules() {
        return this.querySelectorAll("com-module");
    }

    index_modules() {
        this.modules.forEach((module, i) => (module.index = i));
    }

    remove() {
        if (!this.#_parent) return;
        this.#_parent.remove_chain(this);
    }

    /**
     * @param {string | com_module} type
     * @param {number | com_module} [index]
     */
    insert_module(type, index) {
        let flip_elements = flip(this.modules);

        /**@type {com_module} */
        let module;
        if (type instanceof com_module) {
            module = type;
        } else {
            module = document.createElement("com-module");
            module.type = type;
        }

        if (index instanceof com_module) {
        } else if (isNaN(index)) {
            index = this.modules.item(this.modules.length);
        }

        this.insertBefore(module, index);

        flip_elements.play();

        return module;
    }

    /**@param {com_module | number} module */
    remove_module(module) {
        if (module instanceof com_module) {
            let flip_elements = flip(this.modules);
            this.removeChild(module);
            flip_elements.play();
        } else {
            this.children.item(module).remove();
        }
    }

    signal(modules = false) {
        let repr_str = `c -n `;
        let ps = this.shadowRoot.querySelectorAll("com-periphial");
        let inputs_repr = `cv${ps[0].value.pid}:${ps[0].value.ch},gt${ps[1].value.pid}:${ps[1].value.ch}`;

        repr_str += inputs_repr + ">";

        let module_repr = "";
        if (modules) {
            module_repr = [...this.modules]
                .map((m) => {
                    return `${m.type}${m.parameters
                        .map((p) => p.value)
                        .join(":")}`;
                })
                .join(",");
        }

        repr_str += module_repr;

        log_cli(repr_str);
    }

    connectedCallback() {
        let parent = this.closest("com-network");
        if (!parent) return;

        setTimeout(() => {
            // let repr_str = `c -n `;
            // let ps = this.shadowRoot.querySelectorAll("com-periphial");
            // let inputs_repr = `cv${ps[0].value.pid}:${ps[0].value.ch},gt${ps[1].value.pid}:${ps[1].value.ch}`;
            // repr_str += inputs_repr + ">";
            // log_cli(repr_str);
            this.signal();
        }, 0);

        this.#_parent = parent;

        if (!this.#_init) {
            dragZone(this);
            this.#_init = true;
        }
    }

    disconnectedCallback() {
        let repr_str = `c -r ${this.index}`;

        log_cli(repr_str);
    }
}
