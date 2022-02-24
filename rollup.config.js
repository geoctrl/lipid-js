import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/lipid.ts',
    output: {
      dir: './',
      format: 'commonjs',
      name: 'lipid',
    },
    external: ['rxjs', 'rxjs/operators'],
    plugins: [
      typescript(),
      resolve(),
    ]
  },
  {
    input: 'src/lipid-react-hook-generator.ts',
    output: {
      dir: './',
      format: 'commonjs',
      name: 'lipidReactHookGenerator',
    },
    external: ['react'],
    plugins: [typescript()]
  }
];
