/**
 * Created by Administrator on 2016/10/19.
 */
var autoHtml = require('html-webpack-plugin');
var webpack = require('webpack');
var extractTextWebpack = require('extract-text-webpack-plugin');
module.exports = {
    entry:{
        'index':'./app/js/index.js',
        'jquery':['jquery']
    },
    output:{
        path:'./build/',
        filename:'js/[name].js'
    },
    module:{
        loaders:[
            {
                test:/\.css/,
                loader:extractTextWebpack.extract('style','css')
            }
        ]
    },
    plugins:[
        new extractTextWebpack('css/[name].css',{
            allChunks:true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'jquery',
            filename:'js/jquery.js'
        }),
        new autoHtml({
            title:"мов╖",
            filename:"drag.html",
            template:'./app/darg.html',
            inject:true
        })
    ]
};