const { withAppDelegate, withMainApplication, withAppBuildGradle } = require("expo/config-plugins");

//https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/build/utils/generateCode.js#L36
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');

const ios = async (config) => {
    const headerLine = `#import <Evergage/Evergage.h>`;
    const initMCPSDKSnippet = `
    Evergage *evergage = [Evergage sharedInstance];

    #ifdef DEBUG
        evergage.logLevel = EVGLogLevelDebug;
    #endif
    
    // Start Evergage with your Evergage Configuration:
    [evergage startWithClientConfiguration:^(EVGClientConfigurationBuilder * _Nonnull builder) {
    builder.account = @"${process.env.MCP_ACCOUNT}";
    builder.dataset = @"${process.env.MCP_DATASET}";
        builder.usePushNotifications = NO; // If you want to use Evergage push notification campaigns
    }];   
    `;

    const appDelegate = config.modResults;
    appDelegate.contents = mergeContents({
        src: appDelegate.contents,
        newSrc: headerLine,
        anchor: /(@implementation\sAppDelegate)/,
        offset: -2,
        tag: "mcp sdk - import sdk",
        comment: "//"
    }).contents;

    appDelegate.contents = mergeContents({
        src: appDelegate.contents,
        newSrc: initMCPSDKSnippet,
        anchor: /(self\.initialProps = @\{\};)/,
        offset: 2,
        tag: "mcp sdk - initialize sdk",
        comment: "//"
    }).contents;

    return config;
};

const androidMainApplication = async (config) => {

    const importLine = `
    import com.evergage.android.Evergage
    import com.evergage.android.ClientConfiguration
    import com.evergage.android.LogLevel
    `;
    
    const sdkInitSnippet = `
    Evergage.setLogLevel(LogLevel.ALL)
    Evergage.initialize(this)
    Evergage.getInstance().start(ClientConfiguration.Builder()
            .account("${process.env.MCP_ACCOUNT}")
            .dataset("${process.env.MCP_DATASET}")
            .usePushNotifications(false)
            .build())
    `;
   
    const mainApplication = config.modResults;

    mainApplication.contents = mergeContents({
        src: mainApplication.contents,
        newSrc: importLine,
        anchor: /class\sMainApplication/,
        offset: -2,
        tag: "mcp sdk - import sdk",
        comment: "//"
    }).contents;

    mainApplication.contents = mergeContents({
        src: mainApplication.contents,
        newSrc: sdkInitSnippet,
        anchor: /super\.onCreate\(\)/,
        offset: 2,
        tag: "mcp sdk - initialize sdk",
        comment: "//"
    }).contents;

    return config;
};

const androidAppBuildGradle = async (config) => {
    const buildConfig = config.modResults;
    buildConfig.contents = mergeContents({
        src: buildConfig.contents,
        newSrc: `resValue "string", "evergage_scheme", "${process.env.MCP_SCHEME_ANDROID}"`,
        anchor: /defaultConfig\s\{/,
        offset: 1,
        tag: "mcp sdk - mcp url scheme",
        comment: "//"
    }).contents;           

    buildConfig.contents = mergeContents({
        src: buildConfig.contents,
        newSrc: `implementation('com.evergage.android:evergage-android-sdk:1.4.1@aar') { transitive = true }`,
        anchor: /dependencies\s\{/,
        offset: 1,
        tag: "mcp sdk - add mcp sdk dependency",
        comment: "//"
    }).contents;
    
    return config;
};

const withMarketerCloudPersonalizationSDK = (config) => {
    if(config.ios) {
        config = withAppDelegate(config, ios);
    } 

    if(config.android) {
        config = withMainApplication(config, androidMainApplication);
        config  = withAppBuildGradle(config, androidAppBuildGradle)
    }

    return config;
}

module.exports = withMarketerCloudPersonalizationSDK;