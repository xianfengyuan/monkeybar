/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import {BaseStore} from 'fluxible/addons';

class StackStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher);

    this.stacks = {};
    this.current = {};
    this.currentTile = '';
  }

  _receiveTitle(payload) {
    this.currentTitle = payload.pageTitle;
    this.emitChange();
  }
  
  _receiveStack(stack) {
    if (!stack || !stack.hasOwnProperty('key')) {
      return;
    }
    
    this.stacks[stack.key] = stack;
    this.current = stack;
    this.emitChange();
  }

  get(key) {
    return this.stacks[key];
  }
  
  getAll() {
    return this.stacks;
  }

  getCurrentTitle() {
    return this.currentTitle;
  }

  getCurrent() {
    return this.current;
  }
  
  getState() {
    return {
      stacks: this.current
    };
  }
  
  dehydrate() {
    return this.getState();
  }
  
  rehydrate(state) {
    this.stacks = state.stacks;
  }
}

StackStore.storeName = 'StackStore';
StackStore.handlers = {
  'UPDATE_PAGE_TITLE': '_receiveTitle',
  'RECEIVE_STACK_SUCCESS': '_receiveStack'
};

export default StackStore;
