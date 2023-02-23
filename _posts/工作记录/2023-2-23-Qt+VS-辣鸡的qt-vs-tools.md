---
title: Qt+VS项目迁移时配置问题
date: 2023-2-23 23:19:09
categories: [工作记录]
tags: 记录 Qt

---

## 问题

迁移别人的VS+QT项目，配置的一个炸裂问题就是Qt版本问题，一般来说，每个人安装的Qt版本、路径都不一样，所以基本都要重新配置这个。QT VS Tools应该是将配置好的qt version写入到新项目中，使用硬编码的方式写入$(QTDIR)这个宏的路径，而默认写入的路径应该是xx.vcxproj.user。

![image-20220719105336776](https://picbed.olimi.icu//img/image-20220719105336776.png)

所以迁移的时候怎么办呢。

## 方案1：

- 迁移的时候删除所有.user文件。
- 迁移后打开项目，查看QTDIR宏是否自动配置，如果为空，可以设置一个环境变量，指向正确的位置。如果不为空而且是错误的，everything搜索一下残留的设置，都清除掉。
- 如果项目，即.user文件不多，也可以考虑手动替换掉QTDIR宏。

reference：

1. [visual studio - 在 MSVC 中找不到 QTDIR 构建项目时出错 - Stack Overflow](https://stackoverflow.com/questions/2139495/qtdir-not-found-error-building-project-in-msvc#11388901)
2. https://stackoverflow.com/questions/61942091/qt-vs-tools-error-reading-vs-project-settings
3. https://stackoverflow.com/questions/46547769/qtdir-refers-to-wrong-directory-in-visual-studio

## 方案2：

- 使用Qt VS tools自动完成。这个功能本来就应该提供！
- 老版本右键解决方案即可change qt version，新版本只有项目可以设置Qt Project setting，但是点击会显示object reference is not set to an instance of the object。不知道为什么。
- 解决方法：卸载最新的qt-addin插件，安装老版本的。如2.2版本就有该功能。



## 其他的坑：

### 问题：未能找到qt.natvis.conf。

也是因为qt vs tools 没把qt version设置好。上面这个问题是因为需要QTMajorVersion这个宏，qt相关的宏。

解决方案：没有就只能自己手动加一个吧。添加用户宏或者添加环境变量，QTMajorVersion=5