import test from 'ava'
import { httpResponse } from './fixtures/http-response.js'
import { Propmaster } from '../src/index.js';

test.skip('lullabot article page', t => {

  // This is a test to reproduce the internal 'propertymapper' behaviors in Spidergram.

  const p = new Propmaster(httpResponse)
    .set('content.title', ['head.meta.og.title', 'head.meta.twitter.title', 'head.title'])
    .set('content.description', ['head.meta.og.description', 'head.meta.twitter.description', 'head.meta.description'])
    .set('content.published', ['head.schemaOrg.Article.datePublished', 'head.date', 'head.meta.description']) // Need body selector for `div.hero-article__date`
    .set('content.tags', 'head.schemaOrg.Article.about') // Need body selector for `li.tags-with-label__tag`
    .set('content.author', ['head.schemaOrg.Article.author.name', 'head.artist']);
})