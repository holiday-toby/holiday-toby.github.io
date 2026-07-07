# 从容取舍即优雅

个人技术博客与工具集合，托管在 GitHub Pages：<https://holiday-toby.github.io/>。

这里主要记录 Android、工具链、工程实践、算法学习和日常折腾，也放了一些可直接访问的小工具与网页实验。站点基于 Jekyll 构建，首页会展示最新日志，并提供几个常用模块入口。

## 主要内容

- **技术博客**：文章位于 `_posts/`，内容覆盖 Android、Gradle、Retrofit、RxJava、Linux、macOS 工具链等主题。
- **算法地图**：`algorithms/` 下整理基础算法、数据结构、算法思想、工程算法和 AI 时代算法。
- **棋局大厅**：`board-room/` 提供五子棋与三炮十五兵的浏览器小游戏。
- **职业测试**：`career-test/` 提供一组 MBTI 场景题和职业建议结果。
- **环境配置**：`settings/` 收集 macOS、Ubuntu、Termux 等环境下的配置脚本和工具配置。
- **待整理笔记**：`todo/` 放置还没有整理成正式博客的草稿和资料。
- **网页实验**：`webpages/` 保存早期主题和页面实验。

## 技术栈

- Jekyll
- kramdown
- jekyll-paginate
- Ruby Bundler
- HTML / CSS / JavaScript

## 本地运行

确保本机已安装 Ruby 和 Bundler，然后在仓库根目录执行：

```bash
bundle install
bundle exec jekyll serve
```

启动成功后访问：

```text
http://localhost:4000
```

如果修改了 `_config.yml`，通常需要重启 `jekyll serve` 才能生效。

## 目录结构

```text
.
├── _config.yml        # Jekyll 站点配置
├── _includes/         # 页面公共片段
├── _layouts/          # 页面布局模板
├── _posts/            # 正式博客文章
├── algorithms/        # 算法地图页面
├── board-room/        # 浏览器棋类小游戏
├── career-test/       # MBTI 职业测试
├── css/               # 全站样式
├── images/            # 文章与页面图片资源
├── js/                # 公共脚本
├── settings/          # 环境配置与脚本
├── todo/              # 待整理笔记
├── webpages/          # 网页实验
└── index.html         # 首页
```

## 写作约定

新增文章放在 `_posts/`，文件名遵循 Jekyll 约定：

```text
YYYY-MM-DD-title.md
```

文章头部使用 Front Matter：

```yaml
---
layout: post
title: "文章标题"
category: android
---
```

图片资源建议放在 `images/`，文章中使用相对站点路径引用。

## 部署

这是一个 `holiday-toby.github.io` 仓库，推送到 GitHub 后会由 GitHub Pages 构建并发布站点。

```bash
git push origin master
```

发布前可以先本地运行一次，确认页面、文章链接和静态资源正常。

## 备注

仓库中包含历史文章、主题文件和一些实验页面。后续维护时建议优先保持首页入口清晰，再逐步整理 `todo/` 与 `webpages/` 中的旧内容。
