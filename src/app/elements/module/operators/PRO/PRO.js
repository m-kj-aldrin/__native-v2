import { base_element } from "../../../base/base.js";
import template from "./PRO.html?raw";

export class op_PRO extends base_element {
    constructor() {
        super();

        this.shadowRoot.innerHTML += template;
    }

    connectedCallback() {}
    disconnectedCallback() {}
}
