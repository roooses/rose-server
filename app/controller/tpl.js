'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async renderTpl() {
    const { ctx } = this;
    await ctx.service.tpl.renderTpl(ctx.request.body);
    ctx.body = 'hi, egg';
  }
  async detail() {
    const { ctx } = this;
    ctx.body = {
      "id": 1, // 模板id
      "name": "单页模板组件", // 模板名称
      "repoUrl": "git@github.com:muwoo/rose-simple.git", // 对应的git仓库
      "repoName": "luban",
      "canUse": [ // 这里存储了3个类目的组件，每个类目下对应着可以使用的组件。
        {
          "type": "basic",
          "name": "基础组件",
          "components": [{
            "name": "r-button",
            "description": "按钮",
            "src": "https://muwoo.oss-cn-beijing.aliyuncs.com/egg-multipart/WechatIMG12%201.jpeg"
          }
            // ...
          ]
        }
      ]
    }
  }

  async component() {
    const { ctx } = this;
    ctx.body = {
      "name": "RButton",
      /**
       * 组件的显示方式
       * block: 默认形式，基本上所有的都写`block`就行了，对应于css样式的`display: block`
       * inline: 行内样式，对应于css样式的`display: inline-block`
       * fixed: 对应于css样式的`display: fixed`
       */
      "className": "block",
      // 一些描述文案，可不写
      "description": "按钮",
      // 组件props参数
      "data": {
        "context": "hello node",
        "type": "success",
        "size": "large",
        "href": "",
        "style": {
          "container": {
            "textAlign": "center"
          }
        }
      },
      "editor": [{
        "blockName": "按钮布局设置",
        "settings": {
          "context": {
            "type": "i-input",
            "require": true,
            "label": "按钮文案"
          },
          "container.textAlign": {
            "type": "align",
            "require": false,
            "label": "布局方式"
          },
          "size": {
            "type": "i-select",
            "require": false,
            "options": [{
              "value": "",
              "label": "默认尺寸"
            },
              {
                "value": "large",
                "label": "大尺寸"
              },
              {
                "value": "small",
                "label": "小尺寸"
              }
            ],
            "label": "按钮尺寸"
          },
          "type": {
            "type": "i-select",
            "require": false,
            "options": [{
              "value": "error",
              "label": "错误"
            },
              {
                "value": "success",
                "label": "成功"
              }
            ],
            "label": "按钮类型"
          }
        }
      },
        {
          "blockName": "基础功能设置",
          "settings": {
            "href": {
              "type": "i-input",
              "require": false,
              "label": "点击后跳转的链接"
            }
          }
        }
      ],
      // 该组件是否需要额外加入js脚本，如果需要，这里写一下js文件的链接。比如注册组件需要额外引入注册的2个js文件
      "outJs": []
    }
  }
}

module.exports = HomeController;