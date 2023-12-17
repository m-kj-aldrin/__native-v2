import { log_cli } from "../../../com/index.js";
import { get_host } from "../../../dom/query.js";
import { base_element } from "../../base/base.js";
import { com_module } from "../module.js";
import template from "./parameter.html?raw";

/**
 * @this {com_parameter}
 * @param {InputEvent & {target:HTMLInputElement}} e
 */
function change_handler(e) {
    if (this.index == -1) {
        console.warn("parameter need to be indexed, index='i' ", this);
        return;
    }

    let value = e.target?.normValue || e.target.value;
    let repr_str = `p -m ${this.parent.parent.index}:${this.parent.index} -v${this.index}:${value}`;

    log_cli(repr_str);
}

export class com_parameter extends base_element {
    /**@type {"slider" | "button"} */
    #_type = "button";

    #_index = -1;

    /**@type {com_module} */
    #_parent;

    #_init = false;

    constructor() {
        super();

        this.shadowRoot.innerHTML += template;

        this.shadowRoot.addEventListener("change", change_handler.bind(this));
    }

    get parent() {
        return this.#_parent;
    }

    get index() {
        return this.#_index;
    }

    get value() {
        return (
            +this.firstElementChild?.normValue || +this.firstElementChild?.value
        );
    }

    /**@param {number} v*/
    set norm_value(v) {
        this.firstElementChild.normValue = v;
    }

    connectedCallback() {
        let parent = get_host(this).closest("com-module");
        if (!(parent instanceof com_module)) return;
        this.#_parent = parent;

        if (!this.#_init) {
            this.shadowRoot.getElementById("label").textContent =
                this.getAttribute("label");

            let index = this.getAttribute("index");
            index && (this.#_index = +index);

            let norm_value = this.getAttribute("norm-value");
            if (norm_value) {
                this.norm_value = +norm_value;
            }

            this.#_init = true;
        }
    }
    disconnectedCallback() {}
}
