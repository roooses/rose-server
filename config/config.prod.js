/**
 * @author muwoo
 * Date: 2018/9/11
 */
'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1536632890880_4190';

  // add your config here
  config.middleware = [];
  return config;
};
