/**
 * Created by Administrator on 2016/10/19.
 */
/**
 * Created by Administrator on 2016/10/19.
 */
var autoHtml = require('html-webpack-plugin');
var webpack = require('webpack');
var extractTextWebpack = require('extract-text-webpack-plugin');
module.exports = {
    entry:{
        'curIndex':'./app/js/curIndex.js',
        'jquery':['jquery']
    },
    output:{
        path:'./build/',
        publicPath:'../',
        filename:'js/[name].js'
    },
    module:{
        loaders:[
            {
                test:/\.css/,
                loader:extractTextWebpack.extract('style','css')
            },
            {
                test:/\.(png|jpg|jpge)$/,
                loader:'url?limit=5000&name=img/[name].[ext]'
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
            filename:"html/index.html",
            template:'./app/index.html',
            inject:true
        })
    ]
};