/**
 * Created by Administrator on 2016/10/19.
 */
var autoHtml = require('html-webpack-plugin');
var webpack = require('webpack');
var extractTextWebpack = require('extract-text-webpack-plugin');
module.exports = {
    entry:{
        'text':'./app/js/text.js',
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
            title:"≤‚ ‘",
            filename:"text.html",
            template:'./app/text.html',
            inject:true
        })
    ]
};