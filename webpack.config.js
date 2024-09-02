const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { library, cli } = require('webpack');

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
            filename:'test.js'
        },
    },
    output: {
        // 指定输出的文件位置
        path:path.resolve(__dirname,'build' ),
        // 所有资源的公共路径前缀,publicPath的值应该是相对于服务器URL的，而不是相对于Webpack打包后的输出目录。
        // publicPath:'/assets',
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

        // library:'my_libary',


    },

    //--------------source-map-------------------// 
    /*
    devtool可以配置生成source-map，在调试时直接定位到源代码中的错误位置，而不是在打包后的文件中
    配置参数：[inline- | hidden- | eval- ] [nosource-] [ cheap- [ module- ] ] source-map
    1.source-map:生成一个独立的.map文件，该文件包含源代码与打包后代码之间的完整映射关系。这是质量最高、最完整的SourceMap，但生成速度较慢，且会增加构建后文件的大小。
    适用场景：适用于开发环境，因为它提供了最准确的调试信息。
    2. inline-source-map：将完整的SourceMap内容以Base64编码的形式嵌入到打包后的JS文件中，不生成独立的.map文件。这样做的好处是避免了额外的HTTP请求，但会增加打包后文件的大小。
    适用场景：在需要快速调试且不介意文件大小增加的情况下使用。
    3. eval-source-map：使用eval()来包裹每个模块，并生成一个包含所有源代码映射的DataURL。这种方式生成的SourceMap可以非常快地提供源代码位置信息，但可能会使源代码难以被调试器正确解析。
    适用场景：适用于开发环境，尤其是当需要非常快的构建速度和调试反馈时。
    4. cheap-source-map：生成一个没有列信息的SourceMap，这意味着它不会映射到源代码的具体列，只会映射到行。这样可以加快构建速度并减小SourceMap文件的大小。
    适用场景：适用于生产环境，当列信息不是必需时，可以减少文件大小并提高性能。
    5. cheap-module-source-map：类似于cheap-source-map，但它还包含了由loader生成的SourceMap信息。这对于使用各种loader（如Babel、TypeScript等）处理源代码的情况特别有用。
    适用场景：适用于开发环境，特别是当源代码经过了多个loader的处理时。
    6. eval-cheap-source-map：结合了eval()和cheap-source-map的特点，既快速又减少了SourceMap的大小，但同样不会包含列信息。
    适用场景：适用于需要快速反馈且对调试信息要求不是特别高的开发环境。
    7. eval-cheap-module-source-map：这是eval-source-map和cheap-module-source-map的结合体，既快速又包含了loader生成的SourceMap信息，但同样不会映射到具体的列。
    适用场景：适用于开发环境，特别是当源代码经过多个loader处理且需要快速调试时。
    */ 
    devtool:'source-map',
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

    //--------------mode-------------------// 
    /*
    mode为development时，Webpack会启用大量的开发友好特性：
        代码分割，
        优化构建速度：通过缓存来加速构建过程
        Webpack不会执行一些生产环境特有的优化，比如压缩代码和删除未引用的代码。
    mode为production时，Webpack会启用所有用于生产环境的优化特性：
    代码压缩（Minification）：使用UglifyJSPlugin或TerserPlugin等插件来压缩代码
    作用域提升（Scope Hoisting）：通过合并模块到一个函数中来提升代码执行效率。
    模块和chunk的优化：更高效地打包模块和chunks。
    树摇（Tree Shaking）：删除JavaScript中的未引用代码。

    */ 
    mode:'development',

    //--------------devServer-------------------// 
    /*
    1. 基本配置
        contentBase: 指定服务器资源的根目录。默认是项目的根目录，但你可以设置为一个具体的目录，如dist或build。
        port: 设置开发服务器监听的端口号，默认为8080。
        host: 设置开发服务器监听的主机地址，默认为localhost。如果你希望服务器可以被局域网内的其他设备访问，可以设置为0.0.0.0。
    2. 自动化功能
        open: 设置为true时，启动服务器后会自动打开浏览器。
        hot: 开启热模块替换（Hot Module Replacement，HMR）功能。这允许在应用程序运行时更新各种模块，而无需进行完全刷新。
        watchContentBase: 设置为true时，服务器会监听contentBase目录下的文件变化，并自动刷新浏览器。
    3. 性能优化
        compress: 设置为true时，会开启gzip压缩功能，压缩服务器响应的内容。
        historyApiFallback: 在单页面应用（SPA）中，当使用HTML5 History API时，
                            如果访问的路由在服务器上不存在，服务器会返回404错误。
                            historyApiFallback可以设置为true或配置对象，以解决这个问题，
                            确保SPA应用能够正常路由。
    4. 代理设置
        proxy: 用于设置开发过程中的代理，解决跨域请求问题。可以配置一个或多个代理规则，将请求转发到目标服务器。
    5. 其他配置
        publicPath: 指定资源（如打包后的JS、CSS文件）的公共路径。这有助于在开发环境中正确处理文件路径。
        clientLogLevel: 设置客户端日志的级别，例如none、error、warning或info。
        quiet: 设置为true时，控制台只输出必要的启动信息，减少日志输出。
        overlay: 设置为true时，编译错误会显示在浏览器页面上，而不是控制台。
    */ 

    devServer: {
        client: {
            overlay: true,
        },
        // hot: true,
        // open: true,
        // host: 'localhost',
        // static: {
        //     directory: path.join(__dirname, 'dist'),
        // },
        // contentBase: path.join(__dirname, 'dist'),
        // compress: true,
        // port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
        template:path.resolve(__dirname,'./src/index.html')  
        })
    ]
} 

//---------使用函数形式导出Webpack配置------------//  
/*
const config ={
     entry:{..},
     ....
}
module.exports = (env, argv) => {  
    使用函数形式来module.exports导出配置时，
    函数默认接收两个参数:env（环境变量）和argv（命令行参数）。
    可以根据不同的环境或命令行参数来动态地调整Webpack的配置
    // 使用env参数   
    const isProduction = env.production === true;  
    
    return {  
      mode: isProduction ? 'production' : 'development',  
      // 其他Webpack配置...  
    
      // 示例：根据argv中的某个参数来修改配置  
      // 注意：在实际使用中，直接操作argv来修改配置可能不是最佳实践，  
      // 因为argv包含了所有命令行参数，直接解析它们可能比较复杂且容易出错。  
      // 这里只是为了展示argv的用法。  
      // if (argv.someArgument) {  
      //   // 修改配置...  
      // }  
    };  
  };

*/ 
