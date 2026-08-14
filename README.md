# LiteRT 中文开发者门户 (React + Bun 原生技术栈)

Google AI Edge LiteRT 高性能端侧 AI 运行时中文门户网站，基于 **React 19 + TypeScript + Bun 原生工具链（无需 Vite）** 构建。

---

## 🛠️ 技术栈特性

- **运行时 / 包管理器**: [Bun](https://bun.sh/) (`v1.3.14`)
- **打包工具**: **Bun Native Bundler** (`Bun.build`，单次构建耗时仅 **~70ms**)
- **开发与服务引擎**: **Bun Native HTTP Server** (`Bun.serve` + SSE 文件热重载)
- **UI 框架**: React 19 + TypeScript
- **图标系统**: Lucide React
- **样式方案**: 现代化原生 CSS 变量设计系统（深色/浅色极客双主题、微动效与全端响应式）

---

## 🚀 常用开发指令

### 1. 安装依赖
```bash
bun install
```

### 2. 启动本地开发服务 (支持实时热重载)
```bash
bun run dev
```
浏览器打开：`http://localhost:3000`

### 3. 生产环境打包构建 (Bun 原生单文件打包)
```bash
bun run build
```
输出构建产物至 `dist/` 目录。

### 4. 预览生产环境构建包
```bash
bun run preview
```

---

## 📂 项目结构

```text
├── src/
│   ├── components/       # 模块化 UI 组件
│   │   ├── Navbar.tsx        # 顶部导航、滚动监听与主题切换
│   │   ├── Hero.tsx          # 英雄区与实时端侧 Telemetry 监视器
│   │   ├── Features.tsx      # LiteRT 6 大核心架构支柱
│   │   ├── Pipeline.tsx      # 5 阶段模型转换与执行交互流水线
│   │   ├── Builder.tsx       # 交互式模型转换与部署代码配置台
│   │   ├── Benchmarks.tsx    # 异构硬件性能实测与动态进度条
│   │   ├── SdkWorkbench.tsx  # 多语言原生 SDK 代码工作台 (Python/C++/Kotlin/Swift/JS)
│   │   ├── HardwareMatrix.tsx# 芯片厂商生态矩阵与 CI 构建状态
│   │   ├── Adventures.tsx    # 开发旅程路线导航
│   │   ├── CliSimulator.tsx  # 交互式 LiteRT CLI 终端模拟器
│   │   └── Footer.tsx        # 官方项目链接与版权声明
│   ├── context/          # React 全局状态管理
│   │   ├── ThemeContext.tsx  # 深色/浅色主题上下文 (持久化到 localStorage)
│   │   └── ToastContext.tsx  # 剪贴板复制及全局提示 Toast 系统
│   ├── data/             # 静态数据与代码模板
│   │   └── portalData.ts
│   ├── types/            # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx           # 根组件
│   ├── index.css         # 全局样式系统与主题变量
│   └── main.tsx          # React 应用入口
├── index.html            # 单页应用 HTML 入口模版
├── build.ts              # Bun 原生极速打包构建脚本 (Bun.build)
├── dev.ts                # Bun 原生开发热重载服务器 (Bun.serve + SSE)
├── server.ts             # Bun 生产环境静态文件服务器
├── package.json          # 项目依赖与 Scripts 配置
└── tsconfig.json         # TypeScript 编译器配置
```
