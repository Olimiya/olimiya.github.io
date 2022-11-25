---
title: GithubPage
date: 2022-03-18 01:48:54
categories: [教程]
tags: 网站 博客
description: .
---

## Github Page + Jekyll + Chirpy

这是一句测试。

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
   choco install msys2  
   # 这里安装msys2时可能会卡在updating trust database，Ctrl+C取消然后重新运行一次即可 --force重新安装
   
   # 然后运行ridk，包括更多用于本机扩展的工具
   ridk install# 根据提示选择默认的[1,3]
   ```

4. 安装Bundler

   ```bash
   gem install bundler
   # rubygems.org连不上的话
   gem sources --add https://mirrors.ustc.edu.cn/rubygems/ --remove https://rubygems.org/
   # 列出已有源
   gem sources -l
   # 应该只有 一个
    bundle config mirror.https://rubygems.org https://mirrors.ustc.edu.cn/rubygems/
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

### 注意

1. **开启HTTPS：**可以在github page的项目中：设置->Pages->Enforce HTTPS. 强制github page使用https.

2. **Google收录**：[概述 (google.com)](https://search.google.com/search-console)。根据个人网站情况，选择网域或网址，如果是白嫖的github.io域名，只能使用网址前缀，根据提示申请资源，所有权验证方式选择HTML标记，然后再_config.yml中添加`google_site_verification:content`，content改为google提供给你的字符串。如果是有自己域名，则通过DNS解析验证，根据提示操作即可。一般收录之后得好久才能扫描索引（一个月以上）。随缘吧，本来也没啥人看。

3. **Google Analystic**：GA工具，查看网站的情况，比如用户数之类的。[[Analytics (google.com)](https://analytics.google.com/analytics/web/?authuser=0#/)](https://analytics.google.com/analytics/web/#/p311381697/reports/reportinghub?params=_u..nav%3Dmaui)在设置中添加媒体资源，根据流程设置数据流，填写网站url之类的。获得一个ID。将ID填入_config.yml中google_analytics下的id即可。

   ![image-20221125183951452](https://picbed-1307731756.cos.ap-hongkong.myqcloud.com/img/image-20221125184259830.png)

   ![image-20221125184259830](https://picbed-1307731756.cos.ap-hongkong.myqcloud.com/img/image-20221125183951452.png)

4. **Bing收录**：[Bing Webmaster Tools - Bing Webmaster Tools](https://www.bing.com/webmasters/home)。这个可以直接从Google Search中导入进来。
5. **百度收录**：这个就要求必须有备案的域名了。[站点管理_站长工具_百度搜索资源平台 (baidu.com)](https://ziyuan.baidu.com/site/index#/)。不过这个不能便捷地在_config.yml加标识，google那个是有jekyll-seo-tag插件自动完成的。老老实实添加到`_include\head.html`里面吧。

## 腾讯云COS托管+图床

### 迁移至腾讯云COS

1. 开通[腾讯云COS](https://console.cloud.tencent.com/cos)。**关于价格：**价格很便宜，有免费的50G空间用6个月，用完以后如果买资源包，一个一年10GB的空间也不到10块钱，如果按使用付费，价格可能更低。
2. 创建桶：命名、地域、访问权限等。按需选择。
   - 地域：哪个地方近选哪个，注意选国内的话后续挂域名需要有备案的域名，如果选国外或香港，则域名无需备案。建议选择香港。
   - 访问权限必须选公有读私有写。
3. 配置COS：管理桶，开启静态网站，按需添加强制HTTPS、索引页、重定向等，[阅读使用帮助](https://cloud.tencent.com/document/product/436/14984)；
4. 上传文件、已生成的网页（Jekyll中_site文件夹），注意索引文档默认是在根目录中，如果不在，需要在静态网站管理中指定路径。上传文件有一个[COSBrowser](https://cloud.tencent.com/document/product/436/11366)工具，工具作用不是特别大，如果只是上传文件，在网页端上传即可。工具有一个同步文件夹功能，但好像只能同步一个文件夹，而且需要一直开着COSBrowser。
5. 即可使用静态网站中的访问节点URL访问。
6. 可选* 域名太过丑陋，可自定义域名，在“域名与传输管理”中，[查看帮助](https://cloud.tencent.com/document/product/436/36638)。省事的话建议直接自定义源站域名，省略CDN相关的处理（处理得不好可能比源站更慢）。HTTPS需要证书，没有的话参考《个人云服务器》一文。

现在已经把当前状态迁移完成，但是每次更新后都需要手动同步，太麻烦了。

关于自动化部署（静态网站）这个问题，随便搜有非常多Hexo迁移至COS的[博客](https://juejin.cn/post/6844903810091974670)，大概都是通过`hexo-deployer-cos-enhanced-dev`这样的插件。嗨，hexo的文章资源永远比jekyll多，hexo更加傻瓜式。

Jekyll官方[推荐](https://jekyllrb.com/docs/deployment/automated/)有一些自动部署工具，核心主要是通过一些CI工具。比如[Travis CI使用](https://www.freecodecamp.org/chinese/news/continuous-deployment-with-travis-ci/)。而Jekyll+COS的大多都是通过[云开发Cloud Base](https://ke.qq.com/itdoc/cloudbasehosting-6ut238bq.html). 最后根据这个[博客](https://www.vnf.cc/2020/02/github-pages-sync-qcloud-cos/)确定思路：**之前一直有用Github Action自动构建并部署到gh-pages里，现在只需要把构建完成的网页文件自动推送到COS即可，而推送这个有COSCMD这个腾讯云提供的工具。**实现action的文件如下（可能有改动，参考仓库中.github\workflows下为准）：

```yaml
name: "Build and Deploy"
on:
  push:
    branches:
      - master
    paths-ignore:
      - .gitignore
      - README.md
      - LICENSE

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          # submodules: true
          # If using the 'assets' git submodule from Chirpy Starter, uncomment above
          # (See: https://github.com/cotes2020/chirpy-starter/tree/main/assets)

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v1

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3 # reads from a '.ruby-version' or '.tools-version' file if 'ruby-version' is omitted
          bundler-cache: true

      - name: Build site
        run: bundle exec jekyll b -d "_site${{ steps.pages.outputs.base_path }}"
        env:
          JEKYLL_ENV: "production"

      - name: Test site
        run: |
          bundle exec htmlproofer _site --disable-external --check-html --allow_hash_href

      - name: Upload page artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: "_site${{ steps.pages.outputs.base_path }}"

      - name: Upload site artifact
        uses: actions/upload-artifact@v3
        with:
          name: 'gh-artifact'
          path: "_site${{ steps.pages.outputs.base_path }}" # or path/to/artifact
    
  deploy:
    environment:
      name: gh-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1

  deploy-to-cos:
    needs: [build,deploy]

    runs-on: ubuntu-latest

    steps:
      - uses: actions/download-artifact@v3
        id: download
        with:
          name: 'gh-artifact'
        
      - name: Install coscmd
        run: sudo pip install coscmd

      - name: Configure coscmd
        env:
          secret_id: ${{ secrets.SecretId }}
          secret_key: ${{ secrets.SecretKey }}
          bucket: ${{ secrets.BUCKET }}
          region: ${{ secrets.Region }}
        run: coscmd config -a $secret_id -s $secret_key -b $bucket -r $region
      - name: Upload to Tencent COS
        run: coscmd upload -rs --delete --yes ./ /
```

将该文件夹存在`.github\workflow\xxx.yml`。上半部分来源Nihil的参考，最后推送至COS中的几个参数`SecretId`等，在仓库的Settings中配置好。

**补充关于Git Action，可跳过：**

1. 入门教程：[GitHub Actions 入门教程 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)
2. 官方文档：[GitHub Actions 的基本功能 - GitHub Docs](https://docs.github.com/cn/actions/learn-github-actions/essential-features-of-github-actions)
3. 官方的市场：[GitHub Marketplace · Actions to improve your workflow](https://github.com/marketplace?type=actions)

### 替换图床

图床就更加简单了，个人使用的工具链是：Typora + Picgo-Core + COS。

- Typora端：在偏好设置->图像->[说明](https://support.typora.io/Upload-Image/#picgo-core-command-line-opensource)。

- Picgo-Core：[配置文件 \| PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/zh/guide/config.html)。配置Config.json.

  ```json
  {
    "picBed": {
      "current": "tcyun",
      "tcyun": {
        "secretId": "",
        "secretKey": "",
        "bucket": "",
        "appId": "",
        "area": "",
        "path": "img/",
        "customUrl": "",
        "version": "v5"
      },
      "github": {
        "repo": "",
        "branch": "main",
        "token": "",
        "path": "",
        "customUrl": ""
      },
      "uploader": "tcyun",
      "transformer": "path"
    },
    "picgoPlugins": {}
  }
  ```

- COS：创建好桶就行。同时可以开启防盗链。个人配置是：白名单、空referer允许（可直接使用url访问资源）、Referer填写自己的域名。

![image-20221125120020537](https://picbed-1307731756.cos.ap-hongkong.myqcloud.com/img/image-20221125120020537.png)

References:

1. [HKL's Notes (vnf.cc)](https://www.vnf.cc/2020/02/github-pages-sync-qcloud-cos/)

## Github page + Hexo

Reference:

<https://alobal.github.io/2020/07/15/Github-Hexo-%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2/>

1. 创建[username.github.io](https://username.github.io/)仓库
2. 安装hexo环境。
3. 配置hexo项目。
4. 配置主题等。
5. 编写blog。
