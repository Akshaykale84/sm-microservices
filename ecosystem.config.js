// global environment
const commonEnv = {
  dev: {
    MONGO_URI: 'mongodb://localhost:27017',
    MONGO_DB_NAME: 'serviceDB'
  },
  prod: {
    MONGO_URI: 'mongodb://localhost:27017',
    MONGO_DB_NAME: 'serviceDB'
  }
}
module.exports = {
  apps: [{
    cwd: 'sm-api',
    name: 'sm-api',
    script: './sm-api/index.js',
    args: 'run build',
    restartDelay: 1000,
    instances: 1,
    autorestart: true,
    exec_mode:"fork",
    watch: false,
    max_memory_restart: '200M',
    env: {
      ...commonEnv.dev,
      SERVICE_NAME: 'sm-api',
      PORT: 9999,
      NODE_ENV: 'development'
    },
    env_production: {
      ...commonEnv.prod,
      SERVICE_NAME: 'sm-api',
      PORT: 9999,
      NODE_ENV: 'production'
    }
  },
  {
    cwd: 'sm-comm',
    name: 'sm-comm',
    script: './sm-comm/index.js',
    args: 'run build',
    restartDelay: 1000,
    instances: 1,
    autorestart: true,
    exec_mode:"fork",
    watch: false,
    max_memory_restart: '200M',
    env: {
      ...commonEnv.dev,
       SERVICE_NAME: 'sm-comm',
      PORT: 4000,
      NODE_ENV: 'development'
    },
    env_production: {
      ...commonEnv.prod,
      SERVICE_NAME: 'sm-comm',
      PORT: 4000,
      NODE_ENV: 'production'
    }
  }]
};