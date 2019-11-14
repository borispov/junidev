module.exports = {
  apps: [
    {
      name: "junidev-1",
      script: "npm run prod",
      instances: 2,
      increment_var: "PORT",
      env: {
        "PORT": 3000,
        "NODE_ENV": "production"
      },
      env_development: {
        "PORT": "3000",
        "NODE_ENV": "development"
      }
    },
    // {
    //   name: "junidev-2",
    //   script: "./server.js",
    //   instances: 'max',
    //   env: {
    //     "PORT": "3001",
    //     "NODE_ENV": "production"
    //   },
    //   env_development: {
    //     "PORT": "3001",
    //     "NODE_ENV": "development"
    //   }
    // }
  ]
}
