const { withProjectBuildGradle } = require("@expo/config-plugins");
const https = require("https");

function checkVersionExists(version) {
  const url = `https://repo1.maven.org/maven2/com/android/tools/build/gradle/${version}/gradle-${version}.pom`;

  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        resolve(res.statusCode === 200);
      })
      .on("error", () => {
        resolve(false);
      });
  });
}

async function withCustomAGP(config, props = {}) {
  let version = props.version;
  if (!version) {
    throw new Error("AGP version is required. Please provide a version.");
  }
  if (typeof version !== "string") {
    throw new Error("AGP version must be a string.");
  }
  if (!/^(\\d+)(\\.\\d+){0,2}$/.test(version)) {
    throw new Error(
      'AGP version must be in the format "X", "X.Y", or "X.Y.Z" where X, Y, Z are integers.',
    );
  }

  // Normalize to remove redundant trailing ".0" blocks
  version = version.replace(/(\\.0)+$/, "");

  const isValid = await checkVersionExists(version);
  if (!isValid) {
    throw new Error(
      `Invalid AGP version "${version}". Please check https://repo1.maven.org/maven2/com/android/tools/build/gradle/ for valid versions.`,
    );
  }

  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /classpath\\(['"]com\\.android\\.tools\\.build:gradle:[^'"]+['"]\\)/,
      `classpath('com.android.tools.build:gradle:${version}')`,
    );
    return config;
  });
}

module.exports = withCustomAGP;
