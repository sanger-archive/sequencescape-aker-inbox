import { mount } from '@vue/test-utils'
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
    const wrapper = mount(QueuedJobs, { data: { totalQueuedJobs: 12 }});
    expect(wrapper.html()).to.contain('Queued jobs (12)');
  });

  it('has a table', () => {
    const wrapper = mount(QueuedJobs);
    expect(wrapper.contains('b-table')).to.eq(true);
  });

  it('has set data defined', () => {
    const wrapper = mount(QueuedJobs);

    expect(wrapper.vm.fields.length).to.eq(10);
    expect(wrapper.vm.isBusy).to.equal(false);
    expect(wrapper.vm.currentPage).to.equal(1);
    expect(wrapper.vm.perPage).to.equal(5);
    expect(wrapper.vm.pageOptions).to.be.a('array');
    expect(wrapper.vm.totalQueuedJobs).to.equal(0);
    expect(wrapper.vm.sortBy).to.equal('date-requested');
    expect(wrapper.vm.sortDesc).to.equal(false);
    expect(wrapper.vm.items).to.be.a('array');
    expect(wrapper.vm.detailedItems).to.be.a('object');
  })

});
