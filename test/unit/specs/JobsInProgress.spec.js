import { mount } from '@vue/test-utils'
import Vue from 'vue';
import JobsInProgress from '@/components/JobsInProgress';

describe('JobsInProgress.vue', () => {

  it('has a name', () => {
    expect(JobsInProgress.name).to.equal('started-jobs');
  });

  it('has data', () => {
    expect(JobsInProgress.data).to.be.a('function');
  });

  it('has a title', () => {
    const wrapper = mount(JobsInProgress, { data: { totalStartedJobs: 12 }});
    expect(wrapper.html()).to.contain('Jobs in progress (12)');
  });

  it('has a table', () => {
    const wrapper = mount(JobsInProgress);
    expect(wrapper.contains('b-table')).to.eq(true);
  });

  it('has set data defined', () => {
    const wrapper = mount(JobsInProgress);

    expect(wrapper.vm.fields.length).to.eq(11);
    expect(wrapper.vm.isBusy).to.equal(false);
    expect(wrapper.vm.currentPage).to.equal(1);
    expect(wrapper.vm.perPage).to.equal(5);
    expect(wrapper.vm.pageOptions).to.be.a('array');
    expect(wrapper.vm.totalStartedJobs).to.equal(0);
    expect(wrapper.vm.sortBy).to.equal('date-requested');
    expect(wrapper.vm.sortDesc).to.equal(false);
    expect(wrapper.vm.items).to.be.a('array');
    expect(wrapper.vm.detailedItems).to.be.a('object');
  })

});
