import { get_host } from "./dom/query.js";
import "./elements/flexy-inpu/inputs";
import "../style/style.css";
import "./elements";

window.get_host = get_host;

let network = document.createElement("com-network");
document.body.appendChild(network);

let c0 = network.add_chain();
c0.insert_module("BCH");
c0.insert_module("LFO");
c0.insert_module("PRO");

let c1 = network.add_chain();
let c1m0 = c1.insert_module("PTH");
c1.insert_module("PRO");
