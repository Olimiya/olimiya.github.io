---
title: Windows Terminal + WSL + Ubuntu + 图形化 总结
date: 2022-03-27 19:49
categories: [工具]
tags: [Windows Terminal, WSL]
---

## 前言

最近上高级操作系统的研究生课，又开始折腾Linux系统。虽然我挺菜的，但就是差生文具多。所以先折腾折腾一个舒适的Linux环境吧。

配置Linux环境大致分为三种：

- 双系统：划分一块硬盘空间，通过U盘等作为安装盘从镜像开始构建系统。最彻底最真实的Linux环境。好处就是更能折腾、自由度更高，不会出现各种兼容性问题。缺点是配置起来比较麻烦，不能自由切换windows与linux。
- 虚拟机：使用VMVare或VBox等软件，直接加载一个系统镜像启动虚拟机，硬盘分配可以是动态的。好处就是最方便快捷，也便于迁移（直接把整个虚拟机拷贝或复制到其他地方就能实现系统的迁移、移动或者复制），缺点是虚拟机运行效率不高，资源占用率高，可能会比较卡。
- WSL：windows10开始内置的Linux子系统，是windows从内核层开发进行支持的GNU/Linux环境，优点是不会产生传统虚拟机或双启动设置开销，效率高，配置、使用起来也较为方便，非常适合用来进行轻量级的Linux开发。缺点是，并不是真正的Linux系统，使用范畴和使用方式还有所约束（比如硬件交互、图形化方式等等）。但好的地方在于，毕竟是微软爸爸推的东西，更新迭代还是可以期待的。

总结一下本人的需求跟使用情况，以上三种我都有尝试跟使用。双系统对于我来说最主要的问题就是耗电速度太快了！不插电源的情况下是百分之20百分之20的掉，虚拟机则是又不方便用起来又low，于是开始尝试一下WSL。

除了关于WSL整个配置过程，在使用Windows Terminal过程的一些问题和配置情况也会进行记录。

之前发过了一次，重新发一次是因为，CSDN富文本编辑器是真滴难用！！每次回来补充记录就是折磨。故此重新弄一份MD的取代原本的。

## ​Linux子系统WSL

启动方式：
​​​​​​​​​​​​​​![启动Linux子系统](https://img-blog.csdnimg.cn/e91dbafc30114d8c8e3cf38d0194444b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

 启动后忘记要不要重启了，最好重启一下吧，windows是这样的。

重启后在powershell输入：

```bash
wsl --install
```

即可进行安装。默认会安装Ubuntu 20.04的系统（当前）。

可以使用

```bash
wsl --list --online
```

查询可以安装的系统。或者也可以通过Microsoft store微软商店中搜索WSL，安装需要的系统。

但这种安装方式似乎是默认使用C盘进行安装的，好像强行改路径会出问题。Microsoft store微软商店中安装的软件可以在设置->应用和功能->搜索应用->移动，去修改路径。

于是本人使用的安装方式是手动安装的方式，就是先手动安装WSL2，下载系统镜像，直接安装系统镜像包。

整个流程大概：

```bash
# 1 启用适用于 Linux 的 Windows 子系统 启用过了可以不运行这个
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
# 2 启用虚拟机功能
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
# 3 下载WSL2安装 https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
# 4 设置WSL2
wsl --set-default-version 2
# 5 下载Ubuntu镜像包 https://wslstorestorage.blob.core.windows.net/wslblob/CanonicalGroupLimited.UbuntuonWindows_2004.2021.825.0.AppxBundle
# 6 把它解压，解压两次，运行Ubuntu.exe安装 或者可以使用这个命令
Add-AppxPackage .\app_name.appx
```

**更新+1：**
安装、下载、卸载、更改目录的操作可以参考一下：

```bash
$ wsl -l -v
  NAME            STATE           VERSION
* Ubuntu          Running         2
  Ubuntu-18.04    Running         2
$ wsl --export Ubuntu-18.04 d:\wsl\ubuntu18.04.tar
$ wsl --unregister Ubuntu-18.04
$ wsl --import Ubuntu-18.04 d:\wsl\ubuntu\Ubuntu-18.04 d:\wsl\ubuntu18.04.tar --version 2
$ del d:\wsl\ubuntu18.04.tar
```

上述整个过程的官方文档：
[安装WSL|Microsoft Docs](https://docs.microsoft.com/zh-cn/windows/wsl/install)
​[旧版 WSL 的手动安装步骤](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual)

## Windows Terminal

安装就直接通过Microsoft store安装即可（这里本人碰到个问题是，挂着代理的情况下连不上Microsoft store，要关掉代理，还试过连上了但一直显示无法连接Internet没办法安装，这时换一个网络，比如手机热点，就解决了）。安装完之后可以到设置里面更改位置，本人是放在D盘，更改方式：

设置->应用和功能->搜索应用->移动

另外，设置->系统->存储->更改新内容的保存位置，可以修改应用保存位置，但本人改了之后并没有什么反应。

本人的Windows Terminal主要添加了CMD、Power Shell、Git Bash、Ubuntu这几个终端。~~具体的使用和配置已经非常人性化了，可自行摸索。~~

更新：

摸了一段时间，发现主题还是好难看，又摸索了一下。

先放一下最终成果图。

- CMD
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/10b8625b0b974eb8ba49ececc2ab99f6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- Power Shell
![在这里插入图片描述](https://img-blog.csdnimg.cn/75e40438dc3a4112afb4ce58d9d097c2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

- Ubuntu
![在这里插入图片描述](https://img-blog.csdnimg.cn/d48e851c42ab46f08c54d9474f4f576e.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
其实首要的需求是**清晰**看到命令行信息，**对比度高**，不要特别沉闷（默认的CMD），几个终端之间有一定**区分度**。只要满足这些条件即可。最终选定的配置是：

- CMD：One Half Dark主题，开亚克力，不透明度0.8.
- Power Shell：AdventureTime主题，开亚克力，不透明度0.7.

- Ubuntu：Contrast Light主题，不开亚克力（个人建议背景图和亚克力不要一起开），加背景图（注意背景图整体色调跟选择的主题保持一定的相性，比如亮色主题选择浅色一点的背景图），背景不透明度0.25.

[主题网站](https://windowsterminalthemes.dev/)

[主流主题的介绍](https://sspai.com/post/53008)

### 更新+1 Git Bash

使用了一段时间，win端普通使用喜欢用git-bash，将git-bash设为了默认。要几个要注意的是：

1. 命令使用：**GIT安装目录\bin\bash.exe --login -i** (bash命令与WSL的bash冲突，指定完整路径，添加后面两个option)；

2. git-bash中文问题：在**GIT安装目录\etc\bash.bashrc**最后添加：export LANG="zh_CN.UTF-8"
export LC_ALL="zh_CN.UTF-8"
![在这里插入图片描述](https://img-blog.csdnimg.cn/c87ed40e7d584c75b88924f0c3b85820.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

### 更新+2 Git-Bash闪烁

Git更新以后（Git建议还是可以持续更新的），GitBash终端在按删除键跟type补全时老会闪烁，闪烁这个不是Bug，就是个功能（不怕瞎的人才会用吧），在Windows Terminal中高级->铃声通知样式可以设置。
GitBash要关闭这个，创建~/.inputrc，添加：**set bell-style none**。即可。

最后配置文件懒得放了，天天改。

​

## Ubuntu

### 文件系统

基于WSL使用Ubuntu，最方便的一点是，两个系统是直接互通的，什么意思呢？在WSL里面输入pwd.exe，可以看到结果为：

```bash
$ pwd.exe
//wsl$/Ubuntu/home/olimi
```

所以在Windows里面可以直接使用这个路径访问WSL里面的文件。可以在文件系统右键我的电脑添加一个网络映射器，固定上述路径：
![在这里插入图片描述](https://img-blog.csdnimg.cn/a4efb33eb23e44d080f261c453d2f2a1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
​
反过来在WSL中可以直接使用cd访问windows文件，注意windows的硬盘是通过mnt挂载

```bash
~ ⌚ 20:13:03
$ cd /mnt/c/

/mnt/c ⌚ 20:13:05
$ pwd
/mnt/c
```

这里还有一个需求是希望每次打开时自动进入用户目录，windows terminal提供了startingDirectory的选项，但如果设置为上述那个路径，类似于//wsl$/Ubuntu/home/olimi，会出现一个问题时，开机时因为不会自动启动WSL（一般也不需要开机启动），所以这个时候访问上面的路径是无法访问的，这就出现先有鸡还是先有蛋的问题，是先要启动WSL再能进入WSL。

**解决方案：**

~~在ubuntu的终端脚本（.bashrc、.zshrc等）添加一句命令，cd \~.~~

后续因为集成到文件目录右键菜单，直接在此处打开WSL，所以取消了这个设置。确实没啥必要。真要过去直接输入~就行了。

### zsh

上面这里截取的命令可以看到，命令行提示跟默认的终端不一致，是因为我配置了zsh shell。这是非常建议使用的一个终端，非常强大（至少大神都是这么说的）。

> ​目前常用的 Linux 系统和 OS X 系统的默认 Shell 都是 bash，但是真正强大的 Shell 是深藏不露的 zsh， 这货绝对是马车中的跑车，跑车中的飞行车，史称『终极 Shell』，但是由于配置过于复杂，所以初期无人问津，很多人跑过来看看 zsh 的配置指南，什么都不说转身就走了。直到有一天，国外有个穷极无聊的程序员开发出了一个能够让你快速上手的zsh项目，叫做「oh my zsh」，Github 网址是：<https://github.com/robbyrussell/oh-my-zsh。这玩意就像「X>天叫你学会 C++」系列，可以让你神功速成，而且是真的。
​
安装也非常简单：

 1. 安装zs

```bash
1.先看下自己有哪一些 shell
cat /etc/shells
2.如果没有 zsh 需要安装
sudo apt-get install zsh #Ubuntu Linux 记得先升级下 apt-get
sudo yum install zsh #Redhat Linux
3.安装完成后设置zsh 为默认shell
chsh -s /bin/zsh #安装完成后设置当前用户使用 zsh 并重启 wsl
```

- 安装oh my zsh

```bash
wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh
sh install.sh
```

- 添加插件和修改主题

```bash
# 安装 Oh My Zsh 插件
	1.安装 zsh-syntax-highlighting（代码高亮）
	git clone https://github.com/zsh-users/zsh-syntax-highlighting $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
	2.安装 zsh-autosuggestions（自动建议）
	git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
	3.安装 zsh-completions（自动补全）
	git clone https://github.com/zsh-users/zsh-completions $ZSH_CUSTOM/plugins/zsh-completions
	4.zsh-com­ple­tions 插件需要将 autoload -U compinit && compinit 添加到.zshrc，输入命令可一键添加：
	[ -z "`grep "autoload -U compinit && compinit" ~/.zshrc`" ] && echo "autoload -U compinit && compinit" >> ~/.zshrc
	5.把需要启用的插件写入到配置文件中，使用 sed 命令一键操作：
	sed -i '/^plugins=/c\plugins=(git sudo z zsh-syntax-highlighting zsh-autosuggestions zsh-completions colored-man-pages)' ~/.zshrc	6.最后应用配置
	source ~/.zshrc
```

以上几种插件是需要额外安装，其他一些插件在./plugins中有，可直接启用。oh my zsh 本人使用主题是**amuse**，可以在<https://github.com/ohmyzsh/ohmyzsh/wiki/Themes>这里查看各种主题。

贴个成品图：
​​![在这里插入图片描述](https://img-blog.csdnimg.cn/3a9cb487114d4ab5ab1677d984561447.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
​

## 图形用户界面

使用VNC的解决方案。

在官网：[RealVNC® - Remote access software for desktop and mobile | RealVNC](https://realvnc.com/)

下载服务端和客户端。其中服务端是收费的。自行搜索一个破解码即可。

安装完之后记得重启一下电脑，windows是这样的*2...

但有个问题是这个破解码是每次重启后就失效了。没有深究这个的原因，简单在.zshrc脚本中，添加如下命令：

```bash
alias sudo='sudo env PATH=$PATH '
alias vncinit="vnclicense -add BQ24G-PDXE4-KKKRS-WBHZE-F5RCA"
```

然后先调用`sudo vncinit`来解决。

另外还有像xrdp+远程连接的解决方案，个人尝试后觉得比较卡，就不赘述了。

还有类似于MobaXTerm软件的解决方案，内置了XServer，但跟上面xrdp一样卡，也不赘述了。

## 后述

在玩的过程有碰到什么有意思的再补充吧。

​
​
