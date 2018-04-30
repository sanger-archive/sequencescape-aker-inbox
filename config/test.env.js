var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  ROOT_PATH: '""',
  NODE_ENV: '"testing"'
})
