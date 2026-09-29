const crypto = require('crypto');
const fs = require('fs');

/** 同一句中文始终得到同一个 12 位大写哈希。 */
const hashKey = (text) =>
  crypto.createHash('sha256').update(text).digest('hex').slice(0, 12).toUpperCase();

module.exports = {
  input: ['src/**/*.{js,ts,vue}', '!src/i18n/**'],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t', '$t'],
      extensions: [],
    },
    lngs: ['zh-CN', 'en-US', 'de-DE'],
    defaultLng: 'zh-CN',
    defaultNs: 'translation',
    defaultValue(_lng, _ns, _key, options) {
      return options?.defaultValue || '';
    },
    resource: {
      loadPath: 'src/i18n/locales/{{lng}}.json',
      savePath: 'src/i18n/locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
  transform(file, enc, done) {
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    parser.parseFuncFromString(content, { list: ['t', '$t'] }, (key) => {
      parser.set(hashKey(key), { defaultValue: key });
    });
    done();
  },
};
