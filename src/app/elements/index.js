import { com_chain } from "./chain/chain.js";
import { com_module } from "./module/module.js";
import { com_network } from "./network/network.js";
import { com_parameter } from "./module/parameter/parameter.js";

import { op_PRO } from "./module/operators/PRO/PRO.js";

customElements.define("com-network", com_network);
customElements.define("com-chain", com_chain);
customElements.define("com-module", com_module);
customElements.define("com-parameter",com_parameter)

customElements.define("op-pro", op_PRO);
