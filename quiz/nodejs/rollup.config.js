const productionMode = (process.env.NODE_ENV === 'production');
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/js/main.js',
  output: {
    file: './static/js/main.js',
    format: 'es',
    plugins: [
      terser({
        mangle: {
          toplevel: true
        },
        compress: {
          drop_console: productionMode,
          drop_debugger: productionMode
        },
        output: {
          quote_style: 1
        }
      })
    ]
  }
};
