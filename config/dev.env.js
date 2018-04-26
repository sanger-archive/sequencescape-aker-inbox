var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WORK_ORDER_URL: '"https://dev.psd.sanger.ac.uk:9200/work-orders"',
})
