import type { Config } from 'jest';
const requireJSON5 = require('require-json5');

const TS_CONFIG_PATH = './tsconfig.json';
const SRC_PATH = '<rootDir>';

function makeModuleNameMapper(srcPath: string, tsconfigPath: string) {
	const { paths } = requireJSON5(tsconfigPath).compilerOptions;

	const aliases: any = {};

	Object.keys(paths).forEach((item) => {
		const key = item.replace('/*', '/(.*)');
		const path = paths[item][0].replace('/*', '/$1');
		aliases[key] = srcPath + '/' + path;
	});
	return aliases;
}

const config: Config = {
	preset: 'ts-jest',
	collectCoverageFrom: ['src/**/*.{ts,js,tsx,jsx}'],
	moduleDirectories: ['node_modules', 'src'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleNameMapper: makeModuleNameMapper(SRC_PATH, TS_CONFIG_PATH),
};

export default config;
