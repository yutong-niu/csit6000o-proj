const proxy = require('http-proxy-middleware');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/function",
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false
      }
    }
  }

}