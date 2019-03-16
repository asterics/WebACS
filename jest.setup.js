import fs from "fs";
import path from "path";

import $ from "jquery";

global.$ = global.jQuery = $;


import { JSDOM } from "jsdom";

const doc = fs.readFileSync(path.join(__dirname, "src/tests/index.html"),"utf-8");
const dom = new JSDOM(doc);
global.document.body.innerHTML = dom.window.document.body.innerHTML;
