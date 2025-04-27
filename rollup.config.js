import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/bundle.js',
    output: {
        file: 'dist/bundle.js',
        format: 'esm', // ES6 modules
        sourcemap: false
    },
    plugins: [
        terser({
            compress: {
                passes: 2,
                drop_console: true
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false
            }
        }),
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
                { src: 'src/analysis.html', dest: 'dist' },
                { src: 'src/assets', dest: 'dist' },
                { src: 'src/css', dest: 'dist' }
            ]
        })
    ]
};
