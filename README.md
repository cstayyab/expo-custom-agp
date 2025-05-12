# expo-custom-agp

> An Expo config plugin to override the default Android Gradle Plugin version.

## Motivation

Expo projects use a default Android Gradle Plugin (AGP) version, which may not always match the requirements of your dependencies or the latest Android features. This plugin allows you to easily override the AGP version used during the prebuild process, ensuring compatibility with specific libraries or enabling new build system features without waiting for upstream Expo updates.

## Installation

To use this project you first need to add it to your Expo Dev-Client Project.

```sh
yarn add expo-custom-agp
```

> [!NOTE]  
> This will not work and is not needed on Expo Go projects.

## Usage

Add the plugin to your `app.json` or `app.config.js` plugins array:

```json
{
  "plugins": [
    // ... other plugins
    ["expo-custom-agp", { "version": "8.10.0" }]
  ]
  // ... some more plugins
}
```

Replace `"8.10.0"` with your desired Android Gradle Plugin version.

> [!IMPORTANT]  
> Don't forget to run `expo prebuild` after this.

# LICENSE

This project is licensed under the generic terms of [MIT License](./LICENSE).
