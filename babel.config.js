module.exports = function (api) {
	if (api.env() === "test") {
		return {
			presets: ["module:@react-native/babel-preset", "@babel/preset-typescript"],
		};
	}

	return {};
};