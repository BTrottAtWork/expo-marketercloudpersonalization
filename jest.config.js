module.exports = {
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{ts,tsx}"],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
	transform: {
		"^.+\\.(ts|tsx|js|jsx)?$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/.+\\.ts$"],
	preset: "react-native",
	setupFiles: [
		"./jest.setup-marketercloudpersonalization.js"
	],
};