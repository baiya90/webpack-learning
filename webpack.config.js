const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { library } = require('webpack');

module.exports = {
    /*
     context 配置项主要用于指定 Webpack
     打包过程中入口文件（entry）和加载器（loader）等资源的查找基础目录
     通过传入的绝对路径，(__dirname确定webpack.config.js文件的绝对路径,第二个参数确定.config.js文件位置的src文件夹) ,
     来确定context的基础目录，如果这个时候entry再输入./src/index.js,那么entry就指向了src文件夹下的src/index.js文件，这样找不到文件会报错
     应该直接输入./index.js，这样entry就指向了src文件夹下的index.js文件
     */
    // context:path.resolve(__dirname, 'src'),
    /*-----------------------单项入口---------------------------------*/ 
    // entry: './src/index.js',
    /*--------------------------------------------------------*/ 
    /*-----------------------多项入口，对应打包出多个文件---------------------------------*/ 
    entry:{
        // 分成对象形式配置入口文件，同样可以配置多个入口文件，每个入口对应一个对象
        index:{
            // 入口文件
            import:'./src/index.js',
            // 把react部分打包成一个js文件，把test部分打包成一个js文件
            dependOn:['react-vendor','test-vendor'],
        },
        // 配置react-vendor打包文件的内容
        'react-vendor':['react','react-dom'],
        // 配置test-vendor打包文件的内容，来源是test.js，然后输出的打包文件名字是app.js
        'test-vendor':{
            import:'./src/test.js',
            filename:'app.js'
        },
    },
    output: {
        // 指定输出的文件位置
        path:path.resolve(__dirname,'build' ),
        // 指定输出的文件名
        filename: 'bundle.js' ,
        /*
          entry这些入口文件会作为打包的起点，Webpack会分析这些文件以及它们所依赖的其他模块，然后将它们打包成一个或多个bundle。
          然而，在某些情况下，Webpack还会生成一些额外的chunk文件，这些文件可能不是由入口文件直接依赖的，
          而是由异步加载（例如通过import()语法）或代码拆分（code splitting）功能产生的。
          chunkFilename 属性就是用来指定这些非入口chunk文件的名称的
        */ 
        chunkFilename:'asset_[id].js',
        /*
        主要用于配置打包后生成的库（library）的一些基础信息，
        特别是将你的代码打包成一个可复用的库时。
        可以将一些常用的工具函数、UI组件或业务逻辑打包成库。
        */ 

        library:'my_libary',


    },
//   module: {
//     loaders: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: 'babel-loader',
//         query: {
//           presets: ['es2015','react']
//         }
//       }
//     ]
//   },
    plugins: [
        new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./src/index.html')  
        })
    ]
}