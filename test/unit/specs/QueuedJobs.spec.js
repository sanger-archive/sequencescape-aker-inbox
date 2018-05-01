require('es6-promise').polyfill();

import Vue from 'vue';
import QueuedJobs from '@/components/QueuedJobs';

describe('QueuedJobs.vue', () => {

  it('has a name', () => {
    expect(QueuedJobs.name).to.equal('queued-jobs');
  });

  it('has data', () => {
    expect(QueuedJobs.data).to.be.a('function');
  });

  it('has a title', () => {
    const Constructor = Vue.extend(QueuedJobs)
    const vm = new Constructor({ data: { totalQueuedJobs: 12 }}).$mount();
    expect(vm.$el.textContent).to.include('Queued jobs (12)');
  });

});
