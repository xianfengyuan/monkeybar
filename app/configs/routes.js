/**
 * Copyright 2015, Xianfeng Yuan.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import config from '../configs/config';

import showDoc from '../actions/showDoc';
import showStacks from '../actions/showStacks';

import PageHome from '../components/PageHome';
import PageDocs from '../components/PageDocs';
import PageStacks from '../components/PageStacks';

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
    stacks: {
      path: '/stacks',
      method: 'GET',
      handler: PageStacks,
      action: showStacks,
      pageTitlePrefix: 'OpsWorks Stacks',
      page: 'stacks',
      service: 'opsworks',
      detail: 'deployments'
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
    helperClasses: {
        path: '/guides/helper-classes.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/helper-classes.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Helper classes',
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
    atomizer: {
        path: '/guides/atomizer.html',
        method: 'GET',
        handler: PageDocs,
        githubPath: '/docs/guides/atomizer.md',
        action: showDoc,
        pageTitlePrefix: 'Guides: Atomizer Tool',
        page: 'docs'
    }
};
