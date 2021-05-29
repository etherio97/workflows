const { default: axios } = require("axios");
const { parse } = require("fast-xml-parser");
const { JSDOM } = require("jsdom");

// "fuse.js": "^6.4.6"

const comDetails = {
  name: 'RFA',
  fullname: 'RFA လွတ်လပ်တဲ့အာရှအသံ',
  homepage: 'https://www.rfa.org/burmese',
  images: {
    logo: 'https://www.nweoo.com/images/logo/rfa.png',
    cover: 'https://api.nweoo.com/rfa.jpg',
  },
  feeds: [
    {
      title: "မြန်မာဌာန",
      name: "articles",
      url: "https://www.rfa.org/burmese",
      rss "https://www.rfa.org/burmese/rss2.xml"
    },
    {
      title: "သတင်းများ",
      name: "news",
      url: "https://www.rfa.org/burmese/news",
      rss: "https://www.rfa.org/burmese/news/rss2.xml"
    },
    {
      title: "ဗီဒီယိုများ",
      name: "videos",
      url: "https://www.rfa.org/burmese/multimedia",
      rss: "https://www.rfa.org/burmese/multimedia/rss2.xml"
    }
  ],
};



/**
 * Get RSS Feed for asyncornously in `XML` format
 * 
 * @private
 * @params {string} url
 * @returns {!Promise<object>}
 */
function getRSSFeed(url) {
  const parseOptions = {
      attributeNamePrefix: "",
      attrNodeName: "attr",
      textNodeName: "text",
      trimValues: true,
      parseAttributeValue: true,
      ignoreAttributes: false,
    };
  return axios.get(url, { responseType: 'text' }).then(res => parse(res.data, parseOptions));
}

/**
 * @private
 * @returns {!Array<object>}
 */
function fetchVideos() {
  let config = comDetails.feeds.find(({ name }) => name === 'videos');
  return getRSSFeed(config.url).then(res => res.rss.item);
}

/**
 * @private
 * @returns {!Array<object>}
 */
function fetchNews() {
  let config = comDetails.feeds.find(feed => feed.name === 'news');
  return getRSSFeed(config.url).then(res => res.rss.item);
}

/**
 * @private
 * @returns {!Array<object>}
 */
function fetchArticles() {
  let config = comDetails.feeds.find(feed => feed.name === 'articles');
  return getRSSFeed(config.url).then(res => res.rss.item);
}

/**
 * @private
 * @params {object} item
 * @returns {object}
 */
function wrapArticle(item) {
  const article = {
    id: undefined,
    title: undefined,
    content: undefined,
    image: undefined,
    link: undefined,
    caption: null,
    source: comDetails.name,
    timestamp: Date.now(),
    post_id: null,
    photo_id: null,
    video_id: null,
    message_id: null,
  };
  
  return article;
}

/**
 * @export
 */
async function fetchAll() {
  const articles = await fetchNews();
  const multimedia = await fetchVideos();
  
  for (let data of (await fetchAll())) {
    
  }
  
}

exports.fetchAll = fetchAll;
