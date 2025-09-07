import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import math from '@bytemd/plugin-math';
import HLjs from 'highlight.js';

HLjs.configure({
  languages: ['javascript', 'typescript', 'html', 'css', 'json', 'xml', 'python', 'java', 'bash'],
});

const plugins = [gfm(), highlight(), math(), HLjs];

export default plugins;
