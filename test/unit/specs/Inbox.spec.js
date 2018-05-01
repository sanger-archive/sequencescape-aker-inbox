require('es6-promise').polyfill();

import Vue from 'vue';
import Inbox from '@/components/Inbox';

describe('Inbox.vue', () => {

  it('has a name', () => {
    expect(Inbox.name).to.equal('app-container');
  })

  it('has components', () => {
    expect(Inbox.components).to.be.a('object');
  })

  it('has imported components', () => {
    const Constructor = Vue.extend(Inbox)
    const vm = new Constructor({}).$mount();
    expect(vm.$el.textContent).to.include('Aker');
    expect(vm.$el.textContent).to.include('Queued jobs');
    expect(vm.$el.textContent).to.include('Jobs in progress');
    expect(vm.$el.textContent).to.include('Completed jobs');

    expect(vm.$options.beforeCreate).to.be.defined;
  })

});
