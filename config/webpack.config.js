const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin",{ favicon: "../src/assets/favicon.ico"});
const TerserPlugin = require("terser-webpack-plugin");
const webpackPromptPlugin = require('./prompt-plugin');

let mode = "development";
let target = "web";
const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "../src/index.html"),
    favicon: path.resolve(__dirname, "../src/assets/favicon.ico"),
    filename: './index.html',
  }),
  new webpackPromptPlugin(),
];

if (process.env.NODE_ENV === "production") {
  mode = "production";
  // Temporary workaround for 'browserslist' bug that is being patched in the near future
  target = "browserslist";
}

if (process.env.SERVE) {
  // We only want React Hot Reloading in serve mode
  plugins.push(new ReactRefreshWebpackPlugin());
}

// Cannot load "react-refresh/babel" in production
const pluginsBabel = [];
if (process.env.NODE_ENV !== "production") {
  pluginsBabel.push("react-refresh/babel");
}

const performance = {
  hints: false,
  maxEntrypointSize: 512000,
  maxAssetSize: 512000
}

module.exports = {
  // mode defaults to 'production' if not set
  mode: mode,
  performance: process.env.NODE_ENV === "production" && performance,
  // This is unnecessary in Webpack 5, because it's the default.
  // However, react-refresh-webpack-plugin can't find the entry without it.
  entry: path.resolve(__dirname, "../src/index.js"),

  output: {
    // output path is required for `clean-webpack-plugin`
    path: path.resolve(__dirname, "../build"),
    // this places all images processed in an image folder
    assetModuleFilename: "assets/[name][ext][query]",
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // This is required for asset imports in CSS, such as url()
            options: { publicPath: "" },
          },
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        /**
         * The `type` setting replaces the need for "url-loader"
         * and "file-loader" in Webpack 5.
         *
         * setting `type` to "asset" will automatically pick between
         * outputing images to a file, or inlining them in the bundle as base64
         * with a default max inline size of 8kb
         */
        type: "asset",

        /**
         * If you want to inline larger images, you can set
         * a custom `maxSize` for inline like so:
         */
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 30 * 1024,
        //   },
        // },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          // without additional settings, this will reference .babelrc
          loader: "babel-loader",
          options: {
            /**
             * From the docs: When set, the given directory will be used
             * to cache the results of the loader. Future webpack builds
             * will attempt to read from the cache to avoid needing to run
             * the potentially expensive Babel recompilation process on each run.
             */
            cacheDirectory: true,
            presets: [
              "@babel/preset-env",
              // Runtime automatic with React 17+ allows not importing React
              // in files only using JSX (no state or React methods)
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: pluginsBabel,
          },
        },
      },
    ],
  },

  plugins: plugins,

  target: target,

  devtool: "source-map",

  resolve: {
    extensions: [".js", ".jsx"],
  },

  // required if using webpack-dev-server
  
    devServer: {
      stats:"errors-warnings",
      contentBase: "../build",
      hot: true,
      host: '0.0.0.0',
      useLocalIp: true,
      port: "3000",
  
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
};
