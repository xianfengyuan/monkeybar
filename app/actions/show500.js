/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

export default function (context, payload, done) {
    context.dispatch('STATUS_500', payload);
    done();
}
