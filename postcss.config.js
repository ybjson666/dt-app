module.exports = {
  plugins: {
    'autoprefixer': {
      overrideBrowserslist: [
        'Android 4.1',
        'iOS 7.1',
        'Chrome > 31',
        'ff > 31',
        'ie >= 8'
      ]
    },
    'postcss-pxtorem': {
      rootValue: 100,
      propList: ['*'],
      selectorBlackList: ['.am-'] // 过滤掉.am-开头的class，不进行rem转换
    }
  }
}