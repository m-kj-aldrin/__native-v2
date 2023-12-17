import u from "../../../style/utils.css?raw";
import r from "../../../style/reset.css?raw";

import template from "./base.html?raw";

export class base_element extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
        <style>
        ${u}
        ${r}
        </style>
        ${template}
        `;
    }

    // //declared as method on a Custom Element:
    // closestElement(
    //     selector, // selector like in .closest()
    //     base = this, // extra functionality to skip a parent
    //     __Closest = (el, found = el && el.closest(selector)) =>
    //         !el || el === document || el === window
    //             ? null // standard .closest() returns null for non-found selectors also
    //             : found
    //             ? found // found a selector INside this element
    //             : __Closest(el.getRootNode().host) // recursion!! break out to parent DOM
    // ) {
    //     return __Closest(base);
    // }

    connectedCallback() {}
    disconnectedCallback() {}
}
