var path = require('path')
var webpack = require('webpack')

module.exports = {

    // 入口文件
    entry: './src/main.js',

    // 输出文件
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },

    // 依赖模块，描述了处理不同类型的文件
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    // 改变模块引入（import or require）的时候的行为
    resolve: {
        alias: {

            // 配置后，便 require('vue') = require('vue/dist/vue.esm.js')
            'vue$': 'vue/dist/vue.esm.js'
        }
    },

    // 在开发环境中，启动 server
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },

    // 控制关于性能的报警
    performance: {

        // 不报警
        hints: false
    },

    /**
     * 定义了是否生成，以及如何生成 source map
     * 「eval-source-map」：
     * 每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。
     * 初始化 SourceMap 时比较慢，但是会在重构建时提供很快的速度，并且生成实际的文件。
     * 行数能够正确映射，因为会映射到原始代码中。
     */
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {

    // 生成完整的 SourceMap，输出为独立文件。由于在 bundle 中添加了引用注释，所以开发工具知道在哪里去找到 SourceMap。
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([

        // 在编译阶段植入一些环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

        // 脏化 js 文件
        new webpack.optimize.UglifyJsPlugin({

            // 输出 source map
            sourceMap: true,

            // 压缩时候的配置
            compress: {
                warnings: false
            }
        }),

        // 用于兼容 webapck 1 的 plugin
        new webpack.LoaderOptionsPlugin({

            // loader 是否要切换到优化模式。
            minimize: true
        })
    ])
}