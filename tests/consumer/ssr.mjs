import { writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { ConsumerApp } from './compiled/app.js';

await writeFile('ssr.html', renderToString(createElement(ConsumerApp)));
console.log('Packed exports rendered on the server without a DOM.');
