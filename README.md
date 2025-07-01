# expo-marketercloudpersonalization

Expo React native wrapper for marketer cloud personalization sdk

Currently supports:
- mcp custom data campaigns

Does not support:
- push notificaitons
- in-app messaging

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/@mobile/marketercloudpersonalization.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/@mobile/marketercloudpersonalization/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

### Add the package
```
npx expo install expo-marketercloudpersonalization
```

### Create environment variables

add the following to your `.bashrc`, `.zshrc`, `.zprofile` (or wherever you create your env vars for terminal)
```bash
export MCP_DATASET=[YOUR_MCP_DATASET_FROM_THE_PLATFORM]
export MCP_ACCOUNT=[YOUR_MCP_ACCOUNT_FROM_THE_PLATFORM]
export MCP_SCHEME_IOS=[YOUR_MCP_SCHEME_FROM_THE_PLATFORM]
export MCP_SCHEME_ANDROID=[YOUR_MCP_SCHEME_FROM_THE_PLATFORM]
```

to update your terminal with the new vars, you can `source` the updates in to an already running terminal (example):
```bash
source ~/.bashrc
```
or simply restart your terminal...

> These variables are only used when generating the native project, so you could extend the expo prebuild script command to set all of these values in your package json as well if you like, instead of setting them in your terminal config.

### Update plugins entry in `app.json`
```json
    "plugins": [
      "expo-marketercloudpersonalization/plugins/withMarketerCloudPersonalizationSDK", {
        "mcpAccount": "your_mcp_account",
        "mcpDataset": "your_mcp_dataset",
        "android": {
            "scheme": "your_mcp_android_scheme"
        },
        "ios": {
            "scheme": "your_mcp_ios_scheme"
        }
      }
    ],
```

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-marketercloudpersonalization
```

## Configure for iOS

### Add sdk initialization code to `app delegate`
<details open>
<summary>objective-c</summary>

In the imports section
```objective-c
    #import <Evergage/Evergage.h>
```

In the `didFinishLaunchingWithOptions` method
```objective-c
    Evergage *evergage = [Evergage sharedInstance];

    #ifdef DEBUG
        evergage.logLevel = EVGLogLevelDebug;
    #endif
    
    // Start Evergage with your Evergage Configuration:
    [evergage startWithClientConfiguration:^(EVGClientConfigurationBuilder * _Nonnull builder) {
    builder.account = @"MCP_ACCOUNT";
    builder.dataset = @"MCP_DATASET}";
        builder.usePushNotifications = NO; // If you want to use Evergage push notification campaigns
    }];     
```
</details>

<details>
<summary>swift</summary>

In the imports section
```swift
    //todo
```

In the `didFinishLaunchingWithOptions` method
```swift
    //todo
```
</details>

Note: MCP_ACCOUNT and MCP_DATASET should be replaced with their respective values from the MCP platform.


## Configure for Android

### Add native MCP SDK dependency to `app/build.gradle`

Update `defaultConfig`
```kotlin
    resValue "string", "evergage_scheme", "MCP_SCHEME_ANDROID"
```
Note: MCP_SCHEME_ANDROID should be replaced with the value defined in the MCP platform.

Update `dependencies`
```kotlin
    implementation('com.evergage.android:evergage-android-sdk:M.M.P@aar') { transitive = true }
```
Note: M.M.P (major.minor.patch) should be replaced with the appropriate version of the SDK.

### Update `MainApplication` file

<details open>
<summary>kotlin</summary>

In the imports section
```kotlin
    import com.evergage.android.Evergage
    import com.evergage.android.ClientConfiguration
    import com.evergage.android.LogLevel
```

In the `onCreate` method
```kotlin
    Evergage.setLogLevel(LogLevel.ALL) //use log level that makes sense
    Evergage.initialize(this)
    Evergage.getInstance().start(ClientConfiguration.Builder()
            .account("MCP_ACCOUNT")
            .dataset("MCP_DATASET")
            .usePushNotifications(false)
            .build())
```
</details>

<details>
<summary>java</summary>

In the imports section
```java
    import com.evergage.android.Evergage;
    import com.evergage.android.ClientConfiguration;
    import com.evergage.android.LogLevel;
```

In the `onCreate` method
```java
    Evergage.initialize(this);  //use log level that makes sense

    Evergage evergage = Evergage.getInstance();

    evergage.start(new ClientConfiguration.Builder()
            .account(BuildConfig.MCP_ACCOUNT)
            .dataset(BuildConfig.MCP_DATASET)
            .usePushNotifications(false)
            .build());
```
</details>

Note: MCP_ACCOUNT and MCP_DATASET should be replaced with their respective values from the MCP platform.



# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
