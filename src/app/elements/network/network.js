import { base_element } from "../base/base.js";
import { com_chain } from "../chain/chain.js";
import template from "./network.html?raw";

export class com_network extends base_element {
    constructor() {
        super();

        this.shadowRoot.innerHTML += template;
    }

    get chains() {
        return this.querySelectorAll("com-chain");
    }

    index_chains() {
        this.querySelectorAll("com-chain").forEach(
            (chain, i) => (chain.index = i)
        );
    }

    add_chain() {
        let new_chain = document.createElement("com-chain");
        new_chain.index = this.chains.length;

        this.appendChild(new_chain);

        return new_chain;
    }

    /**@param {com_chain | number} chain */
    remove_chain(chain) {
        if (chain instanceof com_chain) {
            this.removeChild(chain);
            this.index_chains();
        } else {
            this.children.item(chain).remove();
        }
    }
}
