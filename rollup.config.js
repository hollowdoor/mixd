const pack = require('./package.json');
const external = Object
.keys(pack.dependencies)
.concat(['os', 'fs', 'path']);

export default {
  input: 'src/index.js',
  external: external,
  output: {
    file: 'index.js',
    format: 'cjs'
  }
};
