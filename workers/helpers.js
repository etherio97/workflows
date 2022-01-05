const { default: axios } = require("axios");
const { parse } = require("fast-xml-parser");
const { zg2uni } = require("rabbit-node");
const isZawgyi = require("is-zawgyi");

const parseOptions = {
    attributeNamePrefix: "",
    attrNodeName: "attr",
    textNodeName: "text",
    trimValues: true,
    parseAttributeValue: true,
    ignoreAttributes: false,
};

/**
 * @param {string} content
 * @returns {string}
 */
exports.removeWhitespace = function removeWhitespace(content) {
    return String(content).split("\n").map(p => p.trim()).filter(p => !!p).join("\n\n");
};

/**
 * @param {string} date
 * @returns {number}
 */
exports.publishedDate = function publishedDate(datetime) {
    return new Date(datetime || Date.now).getTime();
};

/**
 * @param {string} url
 * @returns {!Promise<object>}
 */
exports.fetchRSS = function fetchRSS(url) {
    return axios.get(url).then(({ data }) => parse(data, parseOptions));
};

/**
 * @returns {boolean}
 */
exports.exists = function exists(id) {
    return axios.get('https://nwe-oo-default-rtdb.firebaseio.com/v1/_articles/' + id + '/_id.json')
        .then(res => res.data);
};

exports.publishArticle = function publishArticle(requestBody) {
    return axios.post('https://nweoo-developer.herokuapp.com/publish', requestBody);
};

/**
 * @param {string} text
 * @returns {string}
 */
exports.convertBurmeseFont = function convertBurmeseFont(text) {
    return isZawgyi(text) ? zg2uni(text) : text;
};