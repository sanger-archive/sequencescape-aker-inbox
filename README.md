# Sequencescape - Aker Inbox

[![Build Status](https://travis-ci.org/sanger/sequencescape-aker-inbox.svg?branch=devel)](https://travis-ci.org/sanger/sequencescape-aker-inbox)
[![Maintainability](https://api.codeclimate.com/v1/badges/4fabbd38bfa5695c91ed/maintainability)](https://codeclimate.com/github/sanger/sequencescape-aker-inbox/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4fabbd38bfa5695c91ed/test_coverage)](https://codeclimate.com/github/sanger/sequencescape-aker-inbox/test_coverage)

## Build Setup

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report

# run unit tests
yarn run unit

# run e2e tests
yarn run e2e

# run all tests
yarn test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Development
[json-server](https://github.com/typicode/json-server) is to mock a REST API locally. To run the API

## Misc
### Travis
Travis will only deploy assets to a release when the build is not a pull request, i.e. a push to a
branch.


### Useful links
* [This](https://blog.sqreen.io/authentication-best-practices-vue/) guide was helpful for authentication set-up.
* [json-server](https://github.com/typicode/json-server) to mock a REST API locally.
* [faker](https://github.com/Marak/faker.js) was useful to mock data.
* [This](https://developers.google.com/web/fundamentals/primers/promises#events_arent_always_the_best_way) Google
guide was helpful in understanding promises.
