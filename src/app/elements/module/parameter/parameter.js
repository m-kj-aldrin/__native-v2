import { log_cli } from "../../../com/index.js";
import { get_host } from "../../../dom/query.js";
import { base_element } from "../../base/base.js";
import { com_module } from "../module.js";
import template from "./parameter.component.html?inline";

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

    if (this.module_pointer) {
        this.shadowRoot.getElementById("picker").textContent = "p";
        this.module_pointer = undefined;
    }

    if (typeof value == "boolean") {
        value = +value;
    }

    this.pace(() => {
        log_cli(repr_str.call(this, value));
    });
}

function debounce(window = 20) {
    let timeout_id;
    return function (fn) {
        clearTimeout(timeout_id);
        timeout_id = setTimeout(fn, window);
    };
}

function pace(window = 100) {
    let last = performance.now();
    return function (fn) {
        let now = performance.now();
        let dt = now - last;
        if (dt > window) {
            last = now;
            fn();
        }
    };
}

/**
 *
 * @this {com_parameter}
 * @param {number} value
 */
function repr_str(value) {
    let repr_str = `p -m ${this.parent.parent.index}:${this.parent.index} -v${this.index}:${value}`;
    return repr_str;
}

export class com_parameter extends base_element {
    /**@type {"slider" | "button"} */
    #_type = "button";

    #_index = -1;

    /**@type {com_module} */
    #_parent;

    #_init = false;

    /**@type {com_module} */
    #_module_pointer;

    bounce = debounce();
    pace = pace();

    constructor() {
        super();

        this.shadowRoot.innerHTML += template;

        this.shadowRoot.addEventListener("change", change_handler.bind(this));
        this.shadowRoot.addEventListener("input", change_handler.bind(this));
    }

    get parent() {
        return this.#_parent;
    }

    get index() {
        return this.#_index;
    }

    get value() {
        if (this.#_module_pointer) {
            let p = this.#_module_pointer;
            let c = p.parent.index;
            let m = p.index;
            return `[${c}:${m}]`;
        }
        return (
            +this.firstElementChild?.normValue || +this.firstElementChild?.value
        );
    }

    signal() {
        let repr = repr_str.call(this, this.value);

        let c = this.#_module_pointer.parent.index;
        let m = this.#_module_pointer.index;
        this.shadowRoot.getElementById("picker").textContent = `${c}:${m}`;

        log_cli(repr);
    }

    /**@param {com_module} p */
    set module_pointer(p) {
        if (this.#_module_pointer != p) {
            this.#_module_pointer?.dettach_param(this);
            this.#_module_pointer = p;
            p?.attach_param(this);
        }

        if (!p) return;

        let c = p.parent.index;
        let m = p.index;

        this.shadowRoot.getElementById("picker").textContent = `${c}:${m}`;

        log_cli(repr_str.call(this, `[${c}:${m}]`));
    }

    get module_pointer() {
        return this.#_module_pointer;
    }

    get label() {
        return this.shadowRoot.getElementById("label").textContent;
    }

    /**@param {number} v*/
    set norm_value(v) {
        this.firstElementChild.normValue = v;
    }

    set_module_pointer(p) {
        if (document.documentElement.hasAttribute("data-module-picking"))
            return;

        document.documentElement.setAttribute("data-module-picking", "true");
        let m = get_host(this).closest("com-module");
        m.toggleAttribute("data-picker-destination");

        window.addEventListener(
            "keyup",
            (bound_key = key_handler.bind(this, m))
        );

        window.addEventListener(
            "click",
            (bound_handler = pick_module.bind(this, m))
        );
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
/**
 * @this {com_parameter}
 * @param {com_module} m
 * @param {KeyboardEvent & {target:HTMLElement}} e
 */

function key_handler(m, e) {
    if (e.key == "Escape") {
        m.removeAttribute("data-picker-destination");
        document.documentElement.removeAttribute("data-module-picking");
        window.removeEventListener("keypress", bound_key);
        window.removeEventListener("click", bound_handler);
    }
}

let bound_key;

let bound_handler;

/**
 * @this {com_parameter}
 * @param {com_module} m
 * @param {MouseEvent & {target:HTMLElement}} e
 */
function pick_module(m, e) {
    let target_module = e.target.closest("com-module");
    if (target_module) {
        if (target_module == m) return;

        this.module_pointer = target_module;
        m.removeAttribute("data-picker-destination");

        document.documentElement.removeAttribute("data-module-picking");

        window.removeEventListener("click", bound_handler);
        window.removeEventListener("keypress", bound_key);
    }
}
