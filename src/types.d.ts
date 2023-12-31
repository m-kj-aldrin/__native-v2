import { get_host } from "./app/dom/query";
import { com_chain } from "./app/elements/chain/chain.js";
import { com_module } from "./app/elements/module/module.js";
import { com_parameter } from "./app/elements/module/parameter/parameter.js";
import { com_network } from "./app/elements/network/network.js";
import { com_periphial } from "./app/elements/periphial/periphial.js";

declare global {
    interface Window {
        get_host: typeof get_host;
    }

    interface HTMLElementTagNameMap {
        "com-network": com_network;
        "com-chain": com_chain;
        "com-module": com_module;
        "com-parameter": com_parameter;
        "com-periphial": com_periphial;
        // "com-out": COMOut;
    }

    interface HTMLElementEventMap {
        // "com:bus": ComBusEvent;
    }
}
