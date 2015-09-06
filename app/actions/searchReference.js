/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */ 
export default function (context, payload) {
    var query = (typeof payload === 'string') ? payload : '';

    context.dispatch('CHANGE_SEARCH_TERM', {
        query: query
    });
}