export default {
  appTitle: 'An acss web',
  appUrl: 'https://github.com/xianfengyuan/monkeybar',
  gdir: function(key) {
    var cdir = process.env.CACHEDIR;
    if (cdir === undefined) {
      cdir = '/var/lib';
    }
    return cdir + '/' + key + '.json';
  }
};
