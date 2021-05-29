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
    thumbnail: 'https://api.nweoo.com/rfa.jpg',
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


/** @interface */
class Article {
  /**
   * @params {object}
   */
  constructor(item) {
    this.id = item.id || undefined;
    this.content = item.content || undefined;
    this.image = item.image || undefined;
    this.link = item.link || undefined;
    this.timestamp = item.timestamp || undefined;
    this.title = item.title || undefined
    this.source = item && item.source || undefined;
    this.caption = item.caption || null;
    this.message_id = item.message_id || null;
    this.photo_id = item.photo_id || null;
    this.post_id = item.post_id || null;
    this.video_id = item.video_id || null;
  }
}


/** @interface */
class ArticleContent {
  /**
   * @params {object}
   */
  constructor(item) {
    this.content = item.content;
    this.youtube_id = item.youtube_id;
  }
  
  get hasVideo() {
    return Boolean(this.youtube_id);
  }
}

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
 * @params {string} content
 * @returns {string}
 */
function removeWhitespace(content) {
  return content.split("\n").map(p => p.trim()).filter(p => !!p).join("\n\n'));
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
 * @params {!string}
 * @returns {!ArticleContent}
 */
function createContent(content) {
  let youtube_id;
  let { window } = new JSDOM(content);
  let { document } = window;
  let videoFrame = document.querySelector("iframe");
  
  if (videoFrame instanceof HTMLElement) {
    youtube_id = videoFrame.src.split("/").pop();
    videoFrame.remove();
  }
  
  content = removeWhitespace(content.textContent);
  
  return new ArticleContent({
    content,
    youtube_id,
  });
}

/**
 * @private
 * @params {string} date
 * @returns {number}
 */
function publishedDate(datetime) {
  return new Date(datetime || Date.now).getTime();
}

/**
 * @private
 * @params {object} item
 * @returns {!Article}
 */
function wrapArticle(item) {
  let id = (Date.now() - 1600000000000).toString();
  let { content, isVideo, youtube_id } = createContent(item["content:encoded"].text);
  let media = item["media:content"] || {};
  let image = media.attr?.url || comDetails.images.thumbnail;
  let caption = media['media:description'] && media['media:description'].text;

  return {
    id,
    isVideo,
    youtube_id,
    data: new Article({
      id,
      title: item.title.trim(),
      content: undefined,
      image: ,
      link: item["link"],
      source: comDetails.name,
      timestamp: publishedDate(item.pubDate),
      caption,
      video_id: null,
      message_id: null,
      photo_id: null,
      post_id: null,
    }),
  };
}

/**
 * @export
 */
async function fetchAll() {
  const articles = await fetchNews();
  const multimedia = await fetchVideos();
  
  for (let data of await fetchAll()) {
    console.log(data)
  }
  
}

exports.fetchAll = fetchAll;
