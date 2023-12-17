// /**@type {import('vite').UserConfig} */
// export default {
//     root: "src",
//     build: {
//         outDir: "../dist",
//     },
// };

import { minify } from "html-minifier";

/**@type {import('vite').UserConfig} */
export default {
    root: "src",
    build: {
        outDir: "../dist",
    },
    plugins: [htmlMinify()],
};

const htmlComponentFile = /\.component\.html\?inline$/;

const minifyHTMLConfig = {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
};

function htmlMinify() {
    return {
        name: "html-minify",

        /**
         * @param {string} src
         * @param {string} id
         */
        transform(src, id) {
            if (htmlComponentFile.test(id)) {
                return {
                    code: `export default \`${minify(src, minifyHTMLConfig)}\``,
                    map: null,
                };
            } else {
                return;
            }
        },
    };
}
