import { mount } from '@vue/test-utils';
import Inbox from '@/components/Inbox';

describe('Inbox.vue', () => {
  it('has a name', () => {
    expect(Inbox.name).to.equal('app-container');
  });

  it('has components', () => {
    expect(Inbox.components).to.be.a('object');
  });

  it('has imported components', () => {
    const wrapper = mount(Inbox);
    expect(wrapper.html()).to.contain('Aker');
    expect(wrapper.html()).to.contain('Queued jobs');
    expect(wrapper.html()).to.contain('Jobs in progress');
    expect(wrapper.html()).to.contain('Completed jobs');
  });
});
