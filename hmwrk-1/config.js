const env = process.env.NODE_ENV || "staging"

const strContains = (s, a) => s.indexOf(a) >= 0

const getSetEnvironment = e =>
  strContains(e, "dev")
    ? "dev"
    : strContains(e, "staging")
      ? "staging"
      : strContains(e, "prod")
        ? "prod"
        : "staging"

const environments = {
  dev: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "development"
  },
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
  },
  prod: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
  },
}

module.exports = environments[getSetEnvironment(env)]
