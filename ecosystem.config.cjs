module.exports = {
  apps: [
    {
      name: 'claude-history-viewer',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3100',
      cwd: '/path/to/claude-history-viewer',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3100,
      },
    },
  ],
}
