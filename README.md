This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Set Up Your Environment

In this guide, you'll learn how to set up your environment, so that you can run your project with Android Studio and Xcode. This will allow you to develop with Android emulators and iOS simulators, build your app locally, and more.

### Development OS - macOS

### Target OS - iOS

## Installing dependencies

You will need **Node**, **Watchman**, the React Native command line interface, **Xcode** and **CocoaPods**.

## Node & Watchman

We recommend installing Node and Watchman using [Homebrew](https://brew.sh/). Run the following commands in a Terminal after installing Homebrew:

```sh
brew install node
brew install watchman
```

If you have already installed Node on your system, make sure it is Node 18.18 or newer.

## Xcode

Please use the latest version of Xcode.

The easiest way to install Xcode is via the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835?mt=12). Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

## CocoaPods

[CocoaPods](https://cocoapods.org/) is one of the dependency management system available for iOS. CocoaPods is a Ruby gem. You can install CocoaPods using the version of Ruby that ships with the latest version of macOS.

### Target OS - Android

## Installing dependencies

You will need a **JDK**, and **Android Studio**.

## Java Development Kit

We recommend installing the OpenJDK distribution called Azul Zulu using Homebrew. Run the following commands in a Terminal after installing Homebrew:

```sh
brew install --cask zulu@17

# Get path to where cask was installed to find the JDK installer
brew info --cask zulu@17

# ==> zulu@17: <version number>
# https://www.azul.com/downloads/
# Installed
# /opt/homebrew/Caskroom/zulu@17/<version number> (185.8MB) (note that the path is /usr/local/Caskroom on non-Apple Silicon Macs)
# Installed using the formulae.brew.sh API on 2024-06-06 at 10:00:00

# Navigate to the folder
open /opt/homebrew/Caskroom/zulu@17/<version number> # or /usr/local/Caskroom/zulu@17/<version number>
```

After opening Finder, double click the Double-Click to Install Azul Zulu JDK 17.pkg package to install the JDK.

After the JDK installation, add or update your JAVA_HOME environment variable in ~/.zshrc (or in ~/.bash_profile).

If you used above steps, JDK will likely be located at /Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home:

```sh
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

If you have already installed JDK on your system, we recommend JDK 17. You may encounter problems using higher JDK versions.

## Android development environment

### 1. Install Android Studio

[Download and install Android Studio](https://developer.android.com/studio). While on Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

- Android SDK
- Android SDK Platform
- Android Virtual Device

### 2. Install the Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 15 (VanillaIceCream) SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

### 3. Configure the ANDROID_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

Add the following lines to your ~/.zprofile or ~/.zshrc (if you are using bash, then ~/.bash_profile or ~/.bashrc) config file:

```sh
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Run source ~/.zprofile (or source ~/.bash_profile for bash) to load the config into your current shell. Verify that ANDROID_HOME has been set by running echo $ANDROID_HOME and the appropriate directories have been added to your path by running echo $PATH.

## That's it!

Congratulations! You successfully set up your development environment.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

### Debug Builds

| Environment | Command             |
| ----------- | ------------------- |
| Development | `yarn android:dev`  |
| Testing     | `yarn android:test` |
| Staging     | `yarn android:stag` |
| Production  | `yarn android:prod` |

### Release Builds

| Environment | Command                     |
| ----------- | --------------------------- |
| Development | `yarn android:dev-release`  |
| Testing     | `yarn android:test-release` |
| Staging     | `yarn android:stag-release` |
| Production  | `yarn android:prod-release` |

### Generate Apk/Aab Files (Testing Env)

| Environment | Command                 |
| ----------- | ----------------------- |
| Testing     | `yarn android:test-aab` |
| Testing     | `yarn android:test-apk` |

Generated AAB/APK files can be found in the /android/app/build/outputs/ directory.

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

### Debug Builds

| Environment | Command         |
| ----------- | --------------- |
| Development | `yarn ios:dev`  |
| Testing     | `yarn ios:test` |
| Staging     | `yarn ios:stag` |
| Production  | `yarn ios:prod` |

By default, these commands run the app on the iPhone 16 Pro simulator.

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
