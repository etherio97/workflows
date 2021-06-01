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

module.exports = ArticleContent;