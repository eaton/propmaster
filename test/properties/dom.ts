import test from 'ava';
import { Propmaster } from '../../src/index.js'
import * as values from '../fixtures/http-response.js';

test('cheerio coercion', t => {
  const p = new Propmaster(values.httpResponse);
  t.is(1,1);
})

test('extract values', t => {
  const p = new Propmaster(values.httpResponse);
  p.get('body').extract({
    title: 'title',
    headline: 'body h1',
    link: 'body a | attr:href'
  });

  t.is(p.get('body.title').value, 'Example Domain');
  t.is(p.get('body.headline').value, 'Example Domain');
  t.is(p.get('body.link').value, 'https://www.iana.org/domains/example');
})
