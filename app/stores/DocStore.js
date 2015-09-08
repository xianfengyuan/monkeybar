/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import {BaseStore} from 'fluxible/addons';

class DocStore extends BaseStore {
    constructor(dispatcher) {
      super();
      
      this.docs = {};
      this.current = {};
      this.currentTitle = '';
    }

  _receiveTitle(payload) {
        this.currentTitle = payload.pageTitle;
        this.emitChange();
  }
  
    _receiveDoc(doc) {
        if (!doc || !doc.hasOwnProperty('key')) {
            return;
        }

        this.docs[doc.key] = doc;
        this.current = doc;
        this.emitChange();
    }

    get(key) {
        return this.docs[key];
    }

    getAll() {
        return this.docs;
    }

    getCurrent() {
        return this.current;
    }

  getCurrentTitle() {
    return this.currentTitle;
  }

    dehydrate() {
        return {
            docs: this.docs,
            current: this.current
        };
    }

    rehydrate(state) {
        this.docs = state.docs;
        this.current = state.current;
    }
}

DocStore.storeName = 'DocStore';
DocStore.handlers = {
  'UPDATE_PAGE_TITLE': '_receiveTitle',
    'RECEIVE_DOC_SUCCESS': '_receiveDoc'
};

export default DocStore;
