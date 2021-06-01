const { removeWhitespace, convertBurmeseFont } = require("./helpers");

class Article {
    constructor(item) {
        this.id = item.id;
        this.content = item.content;
        this.image = item.image;
        this.link = item.link;
        this.title = item.title
        this.source = item && item.source;
        this.timestamp = item.timestamp;
        this.caption = item.caption || null;
        this.message_id = item.message_id || null;
        this.photo_id = item.photo_id || null;
        this.post_id = item.post_id || null;
        this.video_id = item.video_id || null;
    }

    optimize() {
        return Article.optimize(this);
    }

    /**
     * 
     * @param {!Article} article 
     */
    static optimize(article) {
        article.title = convertBurmeseFont(article.title.trim());
        article.content = convertBurmeseFont(removeWhitespace(article.content));
        if (article.caption) {
            article.caption = convertBurmeseFont(removeWhitespace(article.caption));
        }
        if (typeof article.timestamp !== 'number') {
            article.timestamp = new Date(article.timestamp || Date.now()).getTime();
        }
        return article;
    }
}

module.exports = Article;