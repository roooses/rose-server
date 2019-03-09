/**
 * @author muwoo
 * Date: 2019/3/3
 */
const Service = require('egg').Service;
const process = require('child_process');
const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars')
const download = require('download-git-repo')
const path = require('path')
const fs = require('fs')
const utils = require('./fileUtils');


function resolveData(data) {
  data.noRepeatCpsName = [];
  data.outJsList = [];
  for (let item of data.components) {
    if (data.noRepeatCpsName.indexOf(item.name) < 0) {
      data.noRepeatCpsName.push(item.name);
    }
    for (let jsItem of item.outJs) {
      if (data.outJsList.indexOf(jsItem) < 0) {
        data.outJsList.push(jsItem);
      }
    }
  }
  return data
}

function build(data, temp_dest, source, dest, cb, ignore) {
  if (data.length) {
    let result = {
      repoName: data.repoName,
      version: data.version
    }
    data.forEach((pageConfig, index) => {
      result[`page${index + 1}`] = resolveData(pageConfig)
    })
    data = result
  } else {
    data = resolveData(data)
  }
  let metalsmith = Metalsmith(temp_dest)
    .use(renderTemplateFiles(data))
    .source(source)
    .destination(dest)
    .clean(false)

  if (ignore) {
    metalsmith.ignore(filePath => {
      filePath = filePath.replace(path.join(temp_dest, source), '')
      filePath = path.join(dest, filePath)
      return fs.existsSync(filePath)
    })
  }
  return metalsmith.build((error, files) => {
    if (error) console.log(error);
    let f = Object.keys(files)
      .filter(o => fs.existsSync(path.join(dest, o)))
      .map(o => path.join(dest, o))
    cb(error, f)
  })
}

function renderTemplateFiles(data) {
  return function (files) {
    Object.keys(files).forEach((fileName) => {
      console.log(fileName)
      let file = files[fileName]
      // 渲染方法
      file.contents = Handlebars.compile(file.contents.toString())(data)
    })
  }
}

function downloadFunc(downloadRepoUrl, temp_dest) {
  return new Promise(async (resolve, reject) => {
    console.log(downloadRepoUrl);
    download(downloadRepoUrl, temp_dest, {clone: true}, (err) => {
      if (err) {
        console.log(err);
        reject('请求模板下载失败');
      } else {
        resolve('请求模板下载成功');
      }
    })
  });
}

function buildFunc(req, temp_dest) {
  return new Promise(async (resolve, reject) => {
    req.templateConfig.port = await utils.getPort();
    if (req.templateConfig.port) {
      build(req.templateConfig, temp_dest, 'template', req.templateConfig.repoName, (err, f) => {
        if (err) {
          reject(err);
        } else {
          console.log('to repoName完成')
          resolve(req.templateConfig.port);
        }
      })
    } else {
      reject('未正确获取到port');
    }
  });
}
class TplService extends Service {
  async renderTpl(req, tplDetail) {
    return new Promise(async (resolve, reject) => {
      Handlebars.registerHelper('upcasefirst', function (value) {
        let str = '';
        let arr = value.split('-');
        for (let item of arr) {
          str += item[0].toUpperCase() + item.slice(1);
        }
        return str;
      });

      Handlebars.registerHelper('tostring', function (value) {
        return JSON.stringify(value);
      });

      Handlebars.registerHelper('parse', function (value) {
        let result = '';
        Object.keys(value).forEach((key) => {
          result += `\:${key}\=\'${value[key]}\' `
        });
        return result;
      });
      if (!(await utils.existOrNot('./static'))) {
        await utils.mkdirFolder('static');
      }
      // 基础模版所在目录
      const temp_dest = `static/tmp${req.templateId}`
      // 删除本地该仓库内容
      process.exec(`cd static && rm -rf tmp${req.templateId}/${req.templateConfig.repoName}`, async function (error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          let hasExist = await utils.existOrNot(`./static/tmp${req.templateId}`);
          if (!hasExist) {
            console.log('temp_dest:', temp_dest)
            let downloadRes = await downloadFunc(req.templateConfig.repoUrl, temp_dest);
          }
          let port = await buildFunc(req, temp_dest);
          resolve(port);
        }

      })
    })
  }
}

module.exports = TplService;