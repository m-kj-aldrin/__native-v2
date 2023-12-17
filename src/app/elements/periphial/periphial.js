import { log_cli } from "../../com/index.js";
import { get_host } from "../../dom/query.js";
import { base_element } from "../base/base.js";
import { com_chain } from "../chain/chain.js";
import { InputSelect } from "../flexy-inpu/inputs/select/select.js";
import template from "./periphial.component.html?inline";

export class com_periphial extends base_element {
    /**@type {com_chain} */
    #_parent;
    constructor() {
        super();

        this.shadowRoot.innerHTML += template;

        this.shadowRoot.addEventListener("change", (e) => {
            this.#_parent.signal(true);
        });
    }

    signal() {
        let { pid, ch } = this.value;

        // console.log({ pid, ch });
    }

    get value() {
        /**@type {InputSelect} */
        let pid = this.shadowRoot.getElementById("pid").normValue;
        /**@type {InputSelect} */
        let ch = this.shadowRoot.getElementById("ch").normValue;
        return { pid, ch };
    }

    connectedCallback() {
        let parent = get_host(this).closest("com-chain");
        if (!parent) return;

        this.#_parent = parent;
    }
    disconnectedCallback() {}
}
