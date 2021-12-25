const { createPage } = require('@vuepress/core')
const { readFileSync } = require('fs')
const { GlobSync } = require('glob')

const VuePressPlugin = {
  name: 'vuepress-plugin',
  async onInitialized(app) {
    // add /doc
    app.pages.push(await createPage(app, {
      path: '/doc.html',
      lang: 'en',
      content: readFileSync(__dirname + '/../../packages/README.md', 'utf-8').toString()
        .replaceAll('https://github.com/faasjs/faasjs/tree/main/packages/', '/doc/')
    }))

    // add /doc/*
    for (const path of GlobSync(__dirname + '/../../packages/*/README.md').found) {
      const paths = path.split('/')
      const pathsLength = paths.length
      const page = {
        path: `/doc/${paths[pathsLength - 2]}.html`,
        lang: 'en-US',
        content: readFileSync(path, 'utf-8').toString()
      }
      app.pages.push(await createPage(app, page))
    }
  }
}

module.exports = VuePressPlugin
