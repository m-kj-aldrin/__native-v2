import { base_element } from "../../../base/base.js";
import template from "./LFO.component.html?inline";

export class op_LFO extends base_element {
    constructor() {
        super();

        this.shadowRoot.innerHTML += template;
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
