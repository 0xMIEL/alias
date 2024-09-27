export default {
	collectCoverage: true,
	moduleFileExtensions: ['ts', 'js'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.ts$': 'ts-jest',
	},
}
