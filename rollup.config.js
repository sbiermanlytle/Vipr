import pkg from './package.json';

export default [
  {
    input: 'src/vipr.js',
    output: {
      format: 'umd',
      file: pkg.browser,
      indent: '\t'
    },
    plugins: [
      resolve({
        jsnext: true,
        browser: true,
        extensions: [ '.mjs', '.js', '.jsx', '.json' ],
      })
    ]
  },
  {
    input: 'src/vipr.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
