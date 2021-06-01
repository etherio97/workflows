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

VOA.fetchAll()
    .then(async ({ articles }) => {
        for (let article of articles) {
            await article.getFullArticle();
            const { writeFileSync } = require('fs');
            const content = article.content.split("\n\n");
            const time = moment(article.timestamp).tz('Asia/Yangon');
            const quote = [34, 39, 8220, 8221];
            const paragraph = (text) => {
                if (text.split('').filter(x => quote.includes(String(x).charCodeAt())).length) {
                    return `> ${text}`;
                }
                return text;
            };

            const template = `---
layout: article
title: ${article.title} - ${article.source}
---

## ${article.title}

[${article.source}](${article.link}) | _${time.format('DD/MM/YYYY')}_
        
![${article.caption || article.title}](${article.image})

_${article.caption || article.title}_

${content.map(text => paragraph(text)).join('\n\n')}`;
            writeFileSync(`_posts/${time.format('YYYY-MM-DD')}-${article.id}.md`, template, 'utf-8');
        }
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        let ended = Date.now() - started;
        let datetime = new Date().toLocaleString('my-MM', { timeZone: 'Asia/Yangon' });
        console.log('completed: %ss | %s', (ended / 1000).toFixed(2), datetime);
    });