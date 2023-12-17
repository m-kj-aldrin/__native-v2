import { log_cli } from "../../com/index.js";
import { draggable } from "../../dom/drag.js";
import { base_element } from "../base/base.js";
import { com_chain } from "../chain/chain.js";
import template from "./module.component.html?inline";
import { com_parameter } from "./parameter/parameter.js";

export class com_module extends base_element {
    #_type = "";
    #_init = false;
    #_index = -1;

    /**@type {com_chain} */
    #_parent;

    /**@type {HTMLElement} */
    #_operator;

    /**@type {Set<com_parameter>} */
    #_attached_params = new Set();

    constructor() {
        super();

        this.shadowRoot.innerHTML += template;
    }

    /**@param {string} v */
    set type(v) {
        if (this.#_init && this.#_type) {
            console.warn("module type already set", this);
            return;
        }

        this.#_type = v;
        this.shadowRoot.getElementById("type").textContent = v.toUpperCase();

        if (v.toLowerCase() == "pth") {
            this.toggleAttribute("minimized", true);
            this.shadowRoot.getElementById("minimize").remove();
            return;
        }

        let op = document.createElement(`op-${v.toLocaleLowerCase()}`);
        this.#_operator = op;

        this.appendChild(op);

        // let test_inp = document.createElement("input");
        // test_inp.value = 33;
        // this.appendChild(test_inp);
    }

    get type() {
        return this.#_type;
    }

    /**@param {number} v */
    set index(v) {
        this.#_index = v;
        this.shadowRoot.getElementById("index").textContent = `idx ${v}`;
    }

    get index() {
        return this.#_index;
    }

    get parent() {
        return this.#_parent;
    }

    remove() {
        if (document.documentElement.hasAttribute("data-module-picking"))
            return;
        this.#_parent.remove_module(this);
    }

    /**@param {com_parameter} p */
    attach_param(p) {
        this.#_attached_params.add(p);
        // this.shadowRoot.getElementById("param-pointers").innerHTML = `
        // ${[...this.#_attached_params.values()]
        //     .map((p) => {
        //         let c = p.parent.parent.index;
        //         let m = p.parent.index;
        //         return `<div>[${c}:${m}]</div>`;
        //     })
        //     .join("\n")}
        // `;
    }

    /**@param {com_parameter} p */
    dettach_param(p) {
        this.#_attached_params.delete(p);
    }

    minimize() {
        this.toggleAttribute("minimized");
        if (this.hasAttribute("minimized")) {
            let box = this.shadowRoot
                .getElementById("operator")
                .getBoundingClientRect();

            this.shadowRoot
                .getElementById("operator")
                .animate(
                    [
                        { height: `${box.height}px` },
                        { opacity: 0 },
                        { height: "0px", paddingBlock: "0px", opacity: 0 },
                    ],
                    {
                        duration: 300,
                        fill: "forwards",
                        easing: "ease",
                    }
                );
        } else {
            let a = this.shadowRoot.getElementById("operator").getAnimations();
            if (a[0]) {
                a[0].reverse();
            } else {
                console.log("min ani missing ???");
            }
        }
    }

    get parameters() {
        let ps = this.#_operator?.shadowRoot?.querySelectorAll("com-parameter");
        if (ps?.length) {
            return [...ps].sort((p_a, p_b) => p_a.index - p_b.index);
        }
        return [];
    }

    connectedCallback() {
        let parent = this.parentElement;
        if (!(parent instanceof com_chain)) return;
        this.#_parent = parent;

        parent.index_modules();

        //parameters intial value is set in the markup...
        //values will be parsed after its connected which happends after
        //the module is connected... hacky :*(

        if (!this.#_init) {
            setTimeout(() => {
                let params_repr = [...this.parameters]
                    .map((p) => p.value)
                    .join(":");

                let repr_str = `m -c ${parent.index} -i ${this.index}:${
                    this.#_type
                }${params_repr}`;

                log_cli(repr_str);
            }, 0);
            draggable(this, this.shadowRoot.querySelector("header"));
            this.#_init = true;
        } else {
            let params_repr = [...this.parameters]
                .map((p) => p.value)
                .join(":");

            let repr_str = `m -c ${parent.index} -i ${this.index}:${
                this.#_type
            }${params_repr}`;

            log_cli(repr_str);

            this.#_attached_params.forEach((p) => p.signal());
        }
    }
    disconnectedCallback() {
        if (!(this.#_parent instanceof com_chain)) return;

        let repr_str = `m -c ${this.#_parent.index} -r ${this.#_index}`;

        log_cli(repr_str);

        this.#_parent.index_modules();

        this.#_parent = undefined;
    }
}
