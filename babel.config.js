module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "useBuiltIns": "usage",
        "targets": {
          "browsers": [
            "defaults",
            "ie >= 9"
          ]
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
