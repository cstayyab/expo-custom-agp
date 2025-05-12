const { withProjectBuildGradle } = require("@expo/config-plugins");
const https = require("https");
const deasync = require("deasync");
const { URL } = require("url");

function syncHttpGet(urlString) {
  const url = new URL(urlString);
  let done = false;
  let response = {};
  let error;

  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "GET",
    port: url.port || 443,
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      response = {
        statusCode: res.statusCode,
        headers: res.headers,
        body: data,
      };
      done = true;
    });
  });

  req.on("error", (e) => {
    error = e;
    done = true;
  });

  req.end();

  while (!done) {
    deasync.runLoopOnce();
  }

  if (error) throw error;

  return response;
}

function checkVersionExists(version) {
  const url = `https://dl.google.com/dl/android/maven2/com/android/tools/build/gradle/${version}/gradle-${version}.pom`;
  const response = syncHttpGet(url);
  return response.statusCode === 200;
}

function withCustomAGP(config, props = {}) {
  let version = props.version;
  if (!version) {
    throw new Error("AGP version is required. Please provide a version.");
  }
  if (typeof version !== "string") {
    throw new Error("AGP version must be a string.");
  }
  if (!/^(\d+)(\.\d+){0,2}$/.test(version)) {
    throw new Error(
      'AGP version must be in the format "X", "X.Y", or "X.Y.Z" where X, Y, Z are integers.',
    );
  }

  // Normalize to remove redundant trailing ".0" blocks
  version = version.replace(/(\\.0)+$/, "");

  const isValid = checkVersionExists(version);
  if (!isValid) {
    throw new Error(
      `Invalid AGP version "${version}". Please check https://mvnrepository.com/artifact/com.android.tools.build/gradle/ for valid versions.`,
    );
  }

  return withProjectBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /classpath\(['"]com\.android\.tools\.build:gradle:[^'"]+['"]\)/,
      `classpath('com.android.tools.build:gradle:${version}')`,
    );
    return config;
  });
}

module.exports = withCustomAGP;
