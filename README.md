# 智投学堂 - 投资学习平台

基于 React + Next.js 的纯前端投资学习平台，支持在 GitHub Pages 等静态托管服务部署。

## 项目特点

- 📚 **系统化学习**：从基础到高级的课程体系
- 💹 **模拟交易**：真实市场数据，虚拟资金操作
- 📊 **投资组合**：实时跟踪和管理投资组合
- 📱 **响应式设计**：支持桌面和移动设备
- 💾 **本地存储**：使用浏览器存储用户数据

## 技术栈

- **前端框架**：React 18 + Next.js 13
- **UI样式**：Tailwind CSS 3
- **状态管理**：React Context API
- **数据存储**：LocalStorage
- **图表库**：Chart.js（可选）

## 项目结构

```
frontend/
├── components/          # 组件目录
│   ├── Navbar.js       # 导航栏
│   ├── Footer.js       # 页脚
│   ├── Hero.js         # 首页英雄区
│   └── Features.js     # 特色功能
├── context/            # 上下文目录
│   └── AppContext.js   # 应用全局状态
├── pages/              # 页面目录
│   ├── _app.js         # 应用入口
│   ├── index.js        # 首页
│   ├── courses.js      # 课程页面
│   ├── simulation.js   # 模拟交易
│   └── portfolio.js    # 投资组合
├── styles/             # 样式目录
│   └── globals.css     # 全局样式
├── utils/              # 工具目录
│   ├── storage.js      # 本地存储工具
│   ├── marketData.js   # 市场数据工具
│   └── trading.js      # 交易系统工具
├── package.json        # 依赖配置
├── tailwind.config.js  # Tailwind配置
├── postcss.config.js   # PostCSS配置
└── next.config.js      # Next.js配置
```

## 功能模块

### 1. 首页
- 平台介绍
- 市场数据概览
- 投资组合预览
- 快速操作按钮

### 2. 课程学习
- 课程列表展示
- 课程级别筛选
- 章节预览

### 3. 模拟交易
- 实时市场数据
- 股票买卖操作
- 交易历史记录
- 账户资金管理

### 4. 投资组合
- 持仓明细
- 资产配置分析
- 盈亏统计
- 交易历史

## 数据模型

### 用户数据
- 用户信息
- 资金余额
- 投资组合
- 交易记录
- 学习进度

### 课程数据
- 课程信息
- 章节内容
- 学习进度

### 市场数据
- 股票信息
- 价格数据
- 涨跌信息

## 安装和运行

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 开发模式
```bash
npm run dev
```
访问 http://localhost:3000

### 3. 生产构建
```bash
npm run build
npm run export
```

### 4. GitHub Pages 部署
将 `out/` 目录部署到 GitHub Pages 或其他静态托管服务。

## 数据说明

- 所有数据存储在浏览器的 LocalStorage 中
- 市场数据为模拟数据，可扩展为真实API
- 用户数据仅在本地保存，不上传服务器

## 后续扩展

- [ ] 集成真实股票API
- [ ] 添加更多课程内容
- [ ] 实现数据导出功能
- [ ] 添加图表可视化
- [ ] 支持多用户账户
- [ ] 添加更多金融产品（基金、期货等）

## 免责声明

本平台仅供学习和模拟使用，不构成任何投资建议。投资有风险，入市需谨慎。

## License

MIT License