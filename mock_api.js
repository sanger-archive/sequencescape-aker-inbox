const jsonServer = require('json-server');
const faker = require('faker');
const moment = require('moment');

const data = { jobs: [] };
// Create 100 jobs
for (let i = 0; i < 1000; i += 1) {
  data.jobs.push({
    id: i,
    dateRequested: moment(faker.date.past()).format('L'),
    requestedBy: faker.internet.email(),
    project: `Project ${faker.random.number({ min: 1, max: 100 })}`,
    desiredDate: moment(faker.date.future()).format('L'),
    woNum: faker.random.number({ min: 1, max: 100 }),
    product: faker.commerce.productName(),
    productOptions: faker.commerce.productMaterial(),
    batchSize: faker.random.number({ min: 1, max: 100 }),
    barcode: faker.random.uuid(),
    comments: faker.hacker.phrase(),
    startDate: faker.random.number({ min: 1, max: 10 }) > 5 ? moment(faker.date.future()).format('L') : '',
    completedDate: faker.random.number({ min: 1, max: 10 }) > 5 ? moment(faker.date.past()).format('L') : '',
    cancelledDate: faker.random.number({ min: 1, max: 10 }) > 5 ? moment(faker.date.past()).format('L') : '',
  });
}

const server = jsonServer.create();
const router = jsonServer.router(data);
const middlewares = jsonServer.defaults();

function isAuthorized(req) {
  console.log(`req.headers.authorization: ${req.headers.authorization}`);
  return parseInt(req.headers.authorization, 10) > 0;
}

server.use(middlewares);
// Add custom routes before JSON Server router
server.post('/auth', (req, res) => {
  console.log('posting...');
  res.jsonp({
    access_token: 12345,
    token_type: 'Bearer',
    expires_in: 3600
  });
});
server.use((req, res, next) => {
  // console.log(req.headers);
  if (isAuthorized(req)) { // add your authorization logic here
    console.log('request authorized');
    next(); // continue to JSON Server router
  } else {
    res.sendStatus(401);
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
