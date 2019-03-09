'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/tpl/component', controller.tpl.component);
  router.get('/tpl/detail', controller.tpl.detail);
  router.post('/tpl/renderTpl', controller.tpl.renderTpl);
};
