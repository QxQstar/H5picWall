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
        'index':'./app/js/index.js',
        'jQuery':['jquery']
    },
    output:{
        path:'./build/',
        publicPath:'../',
        filename:'js/[name].js',
        library:'jQuery',
        libraryTarget:'umd'
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
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'jQuery',
            filename:'js/jquery.js'
        }),
        new autoHtml({
            filename:"html/index.html",
            template:'./app/index.html',
            inject:true
        })
    ]
};