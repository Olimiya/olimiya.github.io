# AI 助手指南 — olimiya.github.io

基于 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 主题定制的个人 Jekyll 博客，通过 Vercel 部署，域名 `https://olimi.icu`。

## 项目概览

- **框架**：Jekyll + Chirpy 主题（自定义版本，Fork 自 Nihil）
- **部署**：Vercel（自动从 `master` 分支构建部署）
- **语言**：`zh-CN`，时区 `Asia/Shanghai`
- **评论系统**：Waline（`https://waline.olimi.icu/`）
- **分析**：Google Analytics（`G-NKV7205XPP`）
- **本地依赖**：`jekyll-archives` 位于 `.gems/jekyll-archives/`

## 常用命令

```bash
# 安装依赖
bundle install

# 本地预览（含草稿）
bundle exec jekyll serve --drafts

# 构建
bundle exec jekyll build

# 测试（html-proofer）
bundle exec htmlproofer ./_site
```

> Windows 用户：已配置 `wdm` 和 `tzinfo-data`，直接运行上述命令即可。

## 目录结构

| 路径                        | 说明                             |
| --------------------------- | -------------------------------- |
| `_posts/`                 | 正式文章，按主题分子目录         |
| `_drafts/`                | 草稿，`serve --drafts` 可预览  |
| `_config.yml`             | 站点主配置，中文注释             |
| `_data/locales/zh-CN.yml` | 中文 UI 文本                     |
| `_tabs/`                  | 导航页（关于、归档、分类、标签） |
| `_includes/`              | 布局组件（Liquid 模板）          |
| `_sass/`                  | 样式文件                         |
| `_javascript/`            | 前端 JS 源码（通过 rollup 打包） |
| `assets/`                 | 静态资源（CSS/JS/图片）          |

## 文章编写规范

### Front Matter 格式

```yaml
---
title: 文章标题
date: YYYY-MM-DD HH:MM
categories: [一级分类, 二级分类]   # 最多两级
tags: [标签1, 标签2]               # 小写
---
```

- 文件名格式：`YYYY-MM-DD-标题.md`（中文标题直接使用，无需转拼音）
- 图片推荐托管在 `https://picbed.olimi.icu/`，路径以 `/img/` 开头
- `future: true` 已启用，允许未来日期的文章

### 分类目录

现有分类子目录：`3D游戏引擎/`、`Cpp/`、`windows/`、`工作记录/`、`通用/`、`随笔/`、`在草稿/`

## 配置注意事项

- `_config.yml` 全中文注释，修改前确认字段含义
- `panel.post.trending_tags: false` — 热门标签已关闭
- `backgroud_animation: false`、`mouse_click_effect: false` — 特效已关闭
- `img_cdn: ""` — 未启用 CDN，图片路径保持原始

## 常见陷阱

- **时区问题**：`future: true` 已设置以避免因时区差异导致文章被跳过
- **本地 gem**：`jekyll-archives` 使用本地路径 `.gems/jekyll-archives/`，勿删除该目录
- **JS 打包**：修改 `_javascript/` 后需运行 `npm run build` 重新打包；`package.json` 定义了构建脚本
- **Vercel 构建**：Vercel 自动执行 `npm run build && JEKYLL_ENV=production bundle exec jekyll build`，配置见 `vercel.json`
- **Ruby 版本**：Vercel 通过 `.ruby-version` 文件识别 Ruby 版本（当前 3.2）
