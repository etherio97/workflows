const { parseHTML } = require("linkedom");
const { default: axios } = require("axios");
const Article = require("./Article");
const {
    fetchRSS,
} = require("./helpers");

const comDetails = {
    name: 'VOA',
    title: 'ဗွီအိုအေ - Voice of America',
    homepage: 'https://burmese.voanews.com',
    images: {
        logo: 'https://www.nweoo.com/images/logo/voa.png',
        thumbnail: 'https://api.nweoo.com/voa.png',
    },
    feeds: [
        {
            title: "ထိပ်တန်းသတင်းများ",
            name: "top",
            url: "https://burmese.voanews.com/api/",
            rss: "https://burmese.voanews.com/api/"
        },
        {
            title: "မြန်မာ",
            name: "articles",
            url: "https://burmese.voanews.com/z/2517",
            rss: "https://burmese.voanews.com/api/z$_u_etrky"
        },
        {
            title: "ဗီဒီယိုများ",
            name: "videos",
            url: "https://burmese.voanews.com/z/2513",
            rss: "https://burmese.voanews.com/api/zykqqyeqmoqy"
        }
    ],
};

/**
 * @private
 */
function fetchNews() {
    let config = comDetails.feeds.find(feed => feed.name === 'top');
    return fetchRSS(config.rss).then(xml => xml.rss.channel);
}

/**
 * @private
 */
function fetchVideos() {
    let config = comDetails.feeds.find(({ name }) => name === 'videos');
    return fetchRSS(config.rss).then(xml => xml.rss.channel);
}

/**
 * @private
 */
function fetchArticles() {
    let config = comDetails.feeds.find(feed => feed.name === 'articles');
    return fetchRSS(config.rss).then(xml => xml.rss.channel);
}

/**
 * @private 
 */
function wrapArticle(item) {
    let article = new Article({
        id: item.guid.split('.html').shift().split('/').pop(),
        title: item.title,
        content: item.description,
        image: item.enclosure?.attr?.url,
        link: item.link,
        source: comDetails.name,
        timestamp: item.pubDate,
    });
    return Article.optimize(article);
}

/**
 * @returns {!Promise<{
 *  articles: !Array<Article>;
 *  videos: !Array<Article>;
 * }>}
 */
async function fetchAll() {
    const articles = (await fetchArticles()).item.map(article => wrapArticle(article));
    const videos = (await fetchVideos()).item.map(article => wrapArticle(article));
    return { articles, videos };
}

/**
 * @param {string} url 
 */
function fetchAMP(url) {
    return axios.get(url.replace('/a/', '/amp/'))
        .then(({ data }) => parseHTML(data));
}

Article.prototype.getFullArticle = async function getFullArticle() {
    const contents = [];
    const { document } = await fetchAMP(this.link);
    let articleEl = document.querySelector('article');
    let image = articleEl.querySelector('amp-img')?.getAttribute('src');
    let caption = articleEl.querySelector('.caption')?.textContent;
    let mediaElem = articleEl.querySelector('.media-elem');
    // let video = mediaElem.querySelector('amp-video')?.querySelector('source')?.getAttribute('src');
    // let audio = mediaElem.querySelector('amp-audio')?.querySelector('source')?.getAttribute('src');
    let body = articleEl.querySelector('.article-body').children[0];
    articleEl.querySelectorAll('a').forEach(el => el.remove());
    for (let i = 0; i < body.childElementCount; i++) {
        let el = body.children[i];
        if (el.className == mediaElem.className) {
            break;
        }
        if (el.textContent.trim() === this.title) {
            break;
        }
        if (i > 2 && el.textContent.includes('Unicode')) {
            break;
        }
        if (!(i < 2 && el.textContent.includes('Unicode'))) {
            contents.push(el.textContent);
        }
    }
    if (image) { this.image = image; }
    if (caption) { this.caption = caption };
    if (video) { this.video = video };
    if (audio) { this.audio = audio };
    this.content = contents.join("\n\n");
    return this.optimize();
};

exports.fetchAll = fetchAll;