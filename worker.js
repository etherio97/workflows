const { writeFileSync } = require('fs');
const moment = require('moment-timezone');
const VOA = require('./workers/VOA');
const RFA = require('./workers/RFA');
const {
    exists,
    publishArticle
} = require("./workers/helpers");

const publish = async (article) => {
    if (await exists(article.id)) {
        console.log('[ ] skipped article "%s"', article.id);
    } else {
        let started = Date.now();
        console.log('[-] publishing article "%s" from "%s"', article.id, article.source);
        return publishArticle({ article })
            .then(() => console.log('[o] load time: %dms | SUCCESS:%s', Date.now() - started, id))
            .catch((e) => console.error('[x] load time: %dms | ERROR:%s', Date.now() - started, e.response?.data || e.message))
            .finally(() => console.log());
    }
}
let started = Date.now();
const publishCollection = (items) => items.map(item => publish(item));
const createArticleMarkdown = (article) => {
    const quote = [34, 39, 8220, 8221];
    const paragraph = (text) => {
        if (text.split('').filter(x => quote.includes(String(x).charCodeAt())).length) {
            return `> ${text}`;
        }
        return text;
    };
    const content = article.content.split("\n\n");
    return `---
layout: article
title: ${article.title} - ${article.source}
---

## ${article.title}

[${article.source}](${article.link}) | _${moment(article.timestamp).tz('Asia/Yangon').format('DD/MM/YYYY hh:mm A')}_
        
![${article.caption || article.title}](${article.image})

_${article.caption || article.title}_

${content.map(text => paragraph(text)).join('\n\n')}`;
};
const saveMarkdownArticle = (article) => writeFileSync(`_posts/${moment(article.timestamp).tz('Asia/Yangon').format('YYYY-MM-DD')}-${article.id}.md`, createArticleMarkdown(article), 'utf-8');

!async function () {
    console.log('running RFA Feed');
    await RFA.fetchAll()
        .then(async ({ articles }) => {
            for (let article of articles) {
                saveMarkdownArticle(article);
            }
        })
        .catch(err => {
            console.error(err);
        })

    console.log('.running VOA Feed');
    await VOA.fetchAll()
        .then(async ({ articles }) => {
            for (let article of articles) {
                await article.getFullArticle();
                saveMarkdownArticle(article);
            }
        })
        .catch(err => {
            console.error(err);
        });

    let ended = Date.now() - started;
    let datetime = new Date().toLocaleString('my-MM', { timeZone: 'Asia/Yangon' });
    console.log('completed: %ss | %s', (ended / 1000).toFixed(2), datetime);
}();
