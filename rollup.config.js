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
    plugins: [
      typescript(),
      resolve({
        resolveOnly: ['rxjs', 'rxjs/operators'],
      })
    ]
  },
  {
    input: 'src/lipid-react-hook-generator.ts',
    output: {
      dir: './',
      format: 'commonjs',
      name: 'lipidReactHookGenerator',
      globals: {
        'rxjs': 'rxjs',
        'lipid': 'lipid',
        'react': 'react',
      },
    },
    plugins: [
      typescript(),
      resolve()
    ]
  }
];
