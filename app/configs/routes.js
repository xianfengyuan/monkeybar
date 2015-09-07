/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import config from '../configs/config';

import showDoc from '../actions/showDoc';
import showPage from '../actions/showPage';
import showStacks from '../actions/showStacks';
import PageHome from '../components/PageHome';
import PageDocs from '../components/PageDocs';

export default {
    // home
    home: {
        path: '/',
        method: 'GET',
        handler: PageHome,
        githubPath: '/docs/home.md',
        action: showDoc,
      pageTitle: config.appTitle,
        page: 'home'
    },

    // docs - root
    quickStart: {
        path: '/quick-start.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/quick-start.md',
        action: showDoc,
        pageTitlePrefix: 'Quick Start',
        page: 'docs'
    },
    thinkingInAtomic: {
        path: '/thinking-in-atomic.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/thinking-in-atomic.md',
        action: showDoc,
        pageTitlePrefix: 'Thinking in Atomic',
        page: 'docs'
    },
    faq: {
        path: '/frequently-asked-questions.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/frequently-asked-questions.md',
        action: showDoc,
        pageTitlePrefix: 'FAQ',
        page: 'docs'
    },

    // docs - guides
    atomicClasses: {
        path: '/guides/atomic-classes.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/atomic-classes.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Atomic classes',
        page: 'docs'
    },
    helperClasses: {
        path: '/guides/helper-classes.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/helper-classes.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Helper classes',
        page: 'docs'
    },
    shorthand: {
        path: '/guides/shorthand.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/shorthand-notation.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Shorthand',
        page: 'docs'
    },
    syntax: {
        path: '/guides/syntax.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/syntax.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Thinking in Atomic',
        page: 'docs'
    },
    atomizer: {
        path: '/guides/atomizer.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/atomizer.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Atomizer Tool',
        page: 'docs'
    },
    // docs - tutorials
    grid: {
        path: '/tutorials/grid-system.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/tutorials/grid.md',
        action: showDoc,
        pageTitlePrefix: 'Tutorials: Shorthand',
        page: 'docs'
    },
    rwd: {
        path: '/tutorials/responsive-web-design.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/tutorials/responsive-web-design.md',
        action: showDoc,
        pageTitlePrefix: 'Tutorials: RWD',
        page: 'docs'
    }
};
