
module.exports = {
  webpack: (config) => {
    config.resolve.symlinks = true
    return config
  }
}
