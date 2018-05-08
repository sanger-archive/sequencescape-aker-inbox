var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_PATH: '""',
  WORK_ORDER_URL: '"http://localhost:3200"',
  SS_URL: '"http://localhost:3000"',
})
