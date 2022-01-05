module.exports = class ArticleSync {
    constructor({
        id,
        title,
        content,
        image,
        video,
        source,
        timestamp,
        link,
    }) {
        this.id = id;
        this._title = title;
        this._source = source;
        this._content = content;
        this._image = image;
        this._video = video;
        this._timestamp = timestamp || Date.now();
        this._link = link;
    }

    async title() {
        // 
    }

    async content() {
        // 
    }

    async image() {
        //
    }

    async video() {
        //
    }

    async link() {
        // 
    }

    async timestamp() {
        // 
    }

    async source() {
        // 
    }
}