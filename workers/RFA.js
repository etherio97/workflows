const { JSDOM } = require("jsdom");
const Article = require("./Article");
const ArticleContent = require("./ArticleContent");
const {
  removeWhitespace,
  publishedDate,
  getRSSFeed,
} = require("./helpers");

const comDetails = {
  name: 'RFA',
  title: 'RFA လွတ်လပ်တဲ့အာရှအသံ',
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
      rss: "https://www.rfa.org/burmese/rss2.xml"
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
 * @private
 * @returns {{
 *  !Article[]: item
 * }}
 */
function fetchVideos() {
  let config = comDetails.feeds.find(({ name }) => name === 'videos');
  return getRSSFeed(config.rss).then(xml => xml.rss.channel);
}

/**
 * @private
 * @returns {{
 *  !Article[]: item
 * }}
 */
function fetchNews() {
  let config = comDetails.feeds.find(feed => feed.name === 'news');
  return getRSSFeed(config.rss).then(xml => xml.rss.channel);
}

/**
 * @private
 * @returns {{
 *  !Article[]: item
 * }}
 */
function fetchArticles() {
  let config = comDetails.feeds.find(feed => feed.name === 'articles');
  return getRSSFeed(config.rss).then(xml => xml.rss.channel);
}

async function fetchAll() {
  const articles = (await fetchNews()).item.map(context => wrapArticle(context));
  const videos = (await fetchVideos()).item.map(context => wrapArticle(context));
  (await fetchArticles()).item.map(context => wrapArticle(context))
    .forEach(context => context.hasVideo ? videos.push(context) : articles.push(context));
  return {
    articles: articles.filter(({ id }) => articles.find((article) => article.id !== id)),
    videos: videos.filter(({ id }) => videos.find((video) => video.id !== id))
  };
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
  if (videoFrame) {
    youtube_id = videoFrame.src.split("/").pop();
    videoFrame.remove();
  }
  content = removeWhitespace(document.body.textContent);
  return new ArticleContent({
    content,
    youtube_id,
  });
}

/**
 * @private
 * @params {!{
 *  object: item
 * }}
 * @returns {!{
 *  string: id,
 *  !Article: value,
 *  boolean: hasVideo,
 *  string?: youtube_id,
 * }}
 */
function wrapArticle(context) {
  let id = context.guid.text?.split("/").pop().split(".html")[0].match(/(\d+)$/)[1];
  let media = context["media:content"] || {};
  let image = media.attr?.url || comDetails.images.thumbnail;
  let caption = media['media:description'] && media['media:description'].text;
  let content = createContent(context["content:encoded"].text);

  return {
    id,
    hasVideo: content.hasVideo,
    youtube_id: content.youtube_id,
    value: new Article({
      id,
      title: context.title.trim(),
      content: content.content,
      image,
      link: context["link"],
      source: comDetails.name,
      timestamp: publishedDate(context.pubDate),
      caption,
      video_id: null,
      message_id: null,
      photo_id: null,
      post_id: null,
    }),
  };
}

exports.fetchAll = fetchAll;
