module.exports = {
  apps: [
    // 生产环境：使用构建后的静态文件
    {
      name: 'toolhub-production',
      script: 'npm',
      args: 'run start:prod',
      cwd: './',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    
    // 开发环境：使用开发服务器（备选）
    {
      name: 'toolhub-development',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'development'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
    
    // 备选方案：分别启动前后端（已注释）
    // {
    //   name: 'toolhub-frontend',
    //   script: 'npm',
    //   args: 'run dev',
    //   cwd: './toolhub',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 3000
    //   },
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '1G'
    // },
    // {
    //   name: 'toolhub-backend',
    //   script: 'npm',
    //   args: 'start',
    //   cwd: './toolhub-server',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 3001
    //   },
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '1G'
    // }
  ]
}; 