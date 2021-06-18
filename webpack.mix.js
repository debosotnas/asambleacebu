require("dotenv").config();
// require("dotenv").config({
//     "process.env": {
//         APP_NAME: JSON.stringify(process.env.APP_NAME || "Default Asamblea"),
//         NODE_ENV: JSON.stringify("development"),
//     },
// });
// let webpack = require("webpack");

const mix = require("laravel-mix");

// let dotenvplugin = new webpack.DefinePlugin({
//     "process.env": {
//         APP_NAME: JSON.stringify(process.env.APP_NAME || "Default Asamblea"),
//         NODE_ENV: JSON.stringify("development"),
//     },
// });

// mix.webpackConfig({
//     options: {
//         skipEnvCheck: true,
//     },
//...
// new webpack.DefinePlugin({
//   'process.env': {
//     APP_NAME: JSON.stringify(process.env.APP_NAME || 'Default app name'),
//     NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
//   }
// })
//     plugins: [dotenvplugin],
// });

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js("resources/js/index.js", "public/js").react();

mix.browserSync("127.0.0.1:8000");
// .sass("resources/sass/app.scss", "public/css");
