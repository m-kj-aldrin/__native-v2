/**
 * @typedef {Object} HTMLTarget
 * @property {HTMLElement} target
 * @property {HTMLElement} currentTarget
 */

import { com_chain } from "../elements/chain/chain.js";
import { com_module } from "../elements/module/module.js";

// import com_module from "./elements/internal/Module.js";
// import com_out from "./elements/internal/Out.js";

/**
 * @template {DragEvent | InputEvent | MouseEvent} T
 * @typedef {T & HTMLTarget} HTMLEvent
 */

/**@param {HTMLEvent<DragEvent>} e */
function dragStart(e) {
    if (e.currentTarget != e.target) return;
    e.currentTarget.setAttribute("data-dragged", "true");
    document.documentElement.classList.add(e.currentTarget.tagName);
    document.documentElement.setAttribute("data-dragging", "true");
}

/**@param {HTMLEvent<DragEvent>} e */
function dragEnd(e) {
    e.currentTarget.removeAttribute("data-dragged");
    document.documentElement.classList.remove(e.currentTarget.tagName);
    document.documentElement.removeAttribute("data-dragging");
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 */
export function draggable(target, drag_el = target) {
    drag_el.draggable = true;
    drag_el.onpointerdown = (e) => {
        if (e.currentTarget == e.target) {
            drag_el.draggable = true;
        } else {
            drag_el.draggable = false;
        }
    };
    drag_el.onpointerup = () => (drag_el.draggable = true);

    target.addEventListener("dragstart", dragStart);
    target.addEventListener("dragend", dragEnd);

    return target;
}

/**
 * @param {NodeListOf<HTMLElement>} children
 * @param {number} y
 */
function getClosest(children, y) {
    let closestElement = null;
    let closestoffsetY = Number.NEGATIVE_INFINITY;

    for (const child of children) {
        const childBox = child.getBoundingClientRect();
        const offsetY = y - childBox.top - childBox.height / 2;

        if (offsetY < 0 && offsetY > closestoffsetY) {
            closestElement = child;
            closestoffsetY = offsetY;
        }
    }

    return closestElement;
}

/**
 * @param {HTMLEvent<DragEvent> & {currentTarget:com_chain}} e
 */
function dragOver(e) {
    e.preventDefault();

    /**@type {com_module } */ // @ts-ignore
    const dragged = document.querySelector("[data-dragged='true']");

    /**@type {NodeListOf<HTMLElement>} */
    const children = e.currentTarget.querySelectorAll(
        `:scope > :not([data-dragged="true"])`
    );

    /**@type {com_module} */
    let closest = null;
    closest = getClosest(children, e.clientY);

    const from_chain = dragged.parentElement;
    if (!from_chain) return;
    const to_chain = e.currentTarget;
    if (!to_chain) return;

    if (closest == null) {
        if (dragged == to_chain.lastElementChild) return;
        to_chain.insert_module(dragged);
    } else if (closest.previousElementSibling != dragged) {
        to_chain.insert_module(dragged, closest);
    }
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 */
export function dragZone(target) {
    target.addEventListener("dragover", dragOver.bind({}));
    return target;
}
