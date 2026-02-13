module.exports = {
  apps: [
    {
      name: 'devora-app',
      script: 'npm',
      args: 'run start',
      cwd: '/home/ceo/apps/devora-app/client/',
      watch: false,
      env: {
        "NODE_ENV": "production",
      }
    },
  ],
};
