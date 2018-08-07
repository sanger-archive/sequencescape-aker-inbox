var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SS_URL: '"http://localhost:3000"',
  AKER_URL: '"http://localhost:3200"',
})
