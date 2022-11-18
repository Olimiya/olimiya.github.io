---
title: GithubPage
date: 2022-03-18 01:48:54
categories: 教程
tags: 网站 博客
description: .
---

## Github Page + Jekyll + Chirpy

**更新：**

### Jekyll安装

官方指南参考：[Jekyll on Windows \|Jekyll • 简单、博客感知的静态站点 (jekyllrb.com)](https://jekyllrb.com/docs/installation/windows/)

强烈推荐安装步骤：[在 Windows 上安装 Jekyll (github.com)](https://gist.github.com/arthurattwell/281a5e1888ffd89b08b4861a2e3c1b35)

但是之前第一次安装的时候按道理应该很简单，但是不知道为啥踩了很多坑，对于Ruby也不熟悉，也因此重装以后一直没重新Jekyll（由Github自动部署吧）。

因此尝试用Chocolatey一键安装。（所有命令如果找不到指令，尝试使用refreshenv，或重启终端）

1. 安装Choco，参见《windows命令行总结-包管理器》

2. 安装Ruby （与官方步骤第一步安装Ruby+Devkit步骤匹配，但是从RubyInstaller-2.4开始，它使用MSYS2作为他们的开发工具包，而不是DevKit。所以这里安装ruby无需安装ruby.devkit）

   ```bash
   choco install ruby # 安装完成后重启终端，ruby\bin会自动加入环境变量
   
   ruby --version # test
   ```

3. 安装MSYS2以及RIDK安装程序  (与官方步骤第二步匹配，但是在ridk之前先自行安装msys2，否则会提示“MSYS2 installation failure: 'MSYS2 seems to be unavailable'”，根据这个[回答](https://github.com/oneclick/rubyinstaller2/issues/56#issuecomment-350196713)解决)。因为Ruby依赖与MSYS2+Mingw工具链去编译包（但是ruby安装包本身又不包含msys2，差评！）

   ```bash
   # 自行安装MYSY2，这提供jekyll原生扩展所需的额外工具
   choco install msys2  # 根据提示选择默认的[1,3]
   # 这里安装msys2时可能会卡在updating trust database，Ctrl+C取消然后重新运行一次即可 --force重新安装
   
   # 然后运行ridk，包括更多用于本机扩展的工具
   ridk install
   ```

4. 安装Bundler

   ```bash
   gem install bundler
   ```

5. 安装jeykyll

   ```bash
   gem install jekell # 如果前面安装错误或不运行ridk install，会出现Error installing jekyll: ERROR: Failed to build gem native extension. 无法编译
   ```

关于上面安装都是在干什么：

- chocolatey: windows平台的包管理器。
- ruby: 一种开源的面向对象程序设计的服务器端脚本语言。
- msys2:  适用于 Windows 的软件分发和构建平台，提供 原生Windows软件的构建环境。用于Ruby程序构建。
- ridk: [ridk](https://msp-greg.github.io/ri2/file.The-ridk-tool.html)是管理 RubyInstaller-2.4 及更高版本运行时环境的辅助工具。
- jekyll：静态博客框架，Github推荐使用（然而资料比hexo真的少很多）。Ruby语言编写。
- bundler: 提供ruby依赖管理，跟踪并安装所需特定版本的gem，后面jekyll网站初始化时，`bundle`从Gemfile中安装所需的依赖。

References:

1. [在 Windows 上安装 Jekyll (github.com)](https://gist.github.com/arthurattwell/281a5e1888ffd89b08b4861a2e3c1b35)
2. [(9条消息) Winget、Scoop 和 Chocolatey 安装位置更改方法_Ayka的博客-CSDN博客_winget 安装目录](https://blog.csdn.net/yihuajack/article/details/123852060)
3. [Windows下的包管理器 Chocolatey 的使用 - 简书 (jianshu.com)](https://www.jianshu.com/p/abaa0e8c261f)

------

当前选用。开箱即用。无需复杂的配置（自定义样式），效果就较好。  

Fork Nihil大佬的个人定制化版本。有轮子就不要造轮子了好吧。（其实就是懒）

开箱即用这点还是非常方便的。以后如果有时间折腾了，再去尝试吧。

使用方法：

基于 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 主题定制化的个人博客.

[Nihil的定制化版本](https://github.com/NichtsHsu/nichtshsu.github.io)

### Jekyll使用

- 首次运行

  ```bash
  bundle # 处理依赖
  ```

- 本地启动服务器

  ```bash
  bundle exec jekyll serve
  ```

### TODO

1. 迁移或同时备份至腾讯云COS，添加自动CI处理
2. 替换图床，考虑也使用COS

### 注意

**开启HTTPS：**可以在github page的项目中：设置->Pages->Enforce HTTPS. 强制github page使用https.

## Github page + Hexo

Reference:

<https://alobal.github.io/2020/07/15/Github-Hexo-%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2/>

1. 创建[username.github.io](https://username.github.io/)仓库
2. 安装hexo环境。
3. 配置hexo项目。
4. 配置主题等。
5. 编写blog。
