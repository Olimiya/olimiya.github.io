---
title: Windows Terminal + WSL + Ubuntu + 图形化 总结
date: 2022-03-27 19:49
categories: [通用]
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

## Linux子系统WSL

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
# 不然安装完成后会提示Linux wsl子系统安装以及报错“请运行‘dmesg‘”解决方案
# 4 设置WSL2
wsl --set-default-version 2
# 5 下载Ubuntu镜像包 https://wslstorestorage.blob.core.windows.net/wslblob/CanonicalGroupLimited.UbuntuonWindows_2004.2021.825.0.AppxBundle
# 6 把它解压，解压两次，运行Ubuntu.exe安装 或者可以使用这个命令
Add-AppxPackage .\app_name.appx
```

**更新+3：**最近升级win11后按照上述做法，似乎这样安装ubuntu程序还是会安装到C盘（然后可以使用ubuntu config这样的命令配置终端）。然后还是需要根据下面这个导出、导入的配置完成系统镜像路径的更换。

然后升级win11的话，一台电脑的wsl直接没了用不了（提示`WslRegisterDistribution failed with error: 0x80070050`），但系统镜像存在之前指定的路径，一台电脑的wsl还有但是安装的ubuntu包没了。如果wsl没了，**只需要：**使用原本安装ubuntu的安装包（或者重新安装相同版本的ubuntu），安装完成后替换系统镜像（即ext4.vhdx）即可

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

# 迁移后如果不按照创建的用户登录，而是root登录
ubuntu版本号.exe config --default-user 用户名
```

上述整个过程的官方文档：
[安装WSL|Microsoft Docs](https://docs.microsoft.com/zh-cn/windows/wsl/install)
​[旧版 WSL 的手动安装步骤](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual)

**更新+2：**

输入：`wsl --set-default-version 2`之前，需启动BIOS虚拟化：

```powershell
bcdedit /set hypervisorlaunchtype auto
```

然后重启电脑。否则会显示：

> 请启用虚拟机平台 Windows 功能并确保在 BIOS 中启用虚拟化。

## Windows Terminal

安装就直接通过Microsoft store安装即可（这里本人碰到个问题是，挂着代理的情况下连不上Microsoft store，要关掉代理，还试过连上了但一直显示无法连接Internet没办法安装，这时换一个网络，比如手机热点，就解决了）。安装完之后可以到设置里面更改位置，本人是放在D盘，更改方式：

设置->应用和功能->搜索应用->移动

另外，设置->系统->存储->更改新内容的保存位置，可以修改应用保存位置，但本人改了之后并没有什么反应。

**更新：**

关于安装路径：在新电脑安装，安装完成后无法移动位置。但是设置->系统->存储->更改新内容的保存位置，倒是可以在重装之后装到指定磁盘去。个人装到了D盘，就是多出了很多文件夹有点难看。

![image-20220802162801767](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220802162801767-16594325879651.png)

关于右键菜单：似乎安装在D盘，自动添加的右键菜单也没了。不过没事，刚好可以自定义。方法：使用ContextMenuManager添加。

![image-20220802162745286](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220802162745286-16594325943023.png)

-d 是指定目录为当前目录。

可以再添加多级菜单，选定打开的终端实例。

更多命令行参数：[Windows 终端命令行参数 | Microsoft Docs](https://docs.microsoft.com/zh-cn/windows/terminal/command-line-arguments?tabs=windows)

本人的Windows Terminal主要添加了CMD、Power Shell、Git Bash、Ubuntu这几个终端。~~具体的使用和配置已经非常人性化了，可自行摸索。~~

**更新：**

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

### 更新+3 管理员权限

参考：[windows terminal使用管理员权限打开_qq_30262407的博客-CSDN博客_windows terminal 管理员](https://blog.csdn.net/qq_30262407/article/details/114921714)

**更新：**WT更新以后，似乎可以通过勾选设置里的”以管理员身份运行此配置文件“，即可获得管理员权限打开终端。不过为windows安装一个sudo也是件好事。

~~个人采用Gsudo方案：~~

1. 安装Gsudo

   ```bash
   $ PowerShell -Command "Set-ExecutionPolicy RemoteSigned -scope Process; iwr -useb https://raw.githubusercontent.com/gerardog/gsudo/master/installgsudo.ps1 | iex"
   $ Set-ExecutionPolicy RemoteSigned #允许执行脚本
   $ Import-Module 'C:\Program Files (x86)\gsudo\gsudoModule.psd1' # 添加sudo别名
   ```

2. 配置WT的setting.json

   ```json
   // 这行改成这样
   "commandline": "sudo powershell.exe",
   ```

## Powershell

Windows上自带的终端来说还是powershell比较好用，虽然语法感觉更复杂。那也自定义增强一下。

运行执行脚本：

```bash
$ Set-ExecutionPolicy RemoteSigned #允许执行脚本
```

### 手动刷新环境变量

制作一个命令RefreshEnv：

```bash
# 制作一个存放RefreshEnv这种小脚本的文件夹，添加到环境变量PATH。
New-Item $env:USERPROFILE\Documents\bin -itemtype directory | Out-Null

Set-ItemProperty `

	-Path "HKCU:\Environment\" `
	
	-Name "Path" ` -Value ((Get-ItemPropertyValue -Path "HKCU:\Environment\" -Name "Path") +`
	
		";" + ($env:USERPROFILE) + "\Documents\bin;")
		
# 刷新环境变量脚本
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/chocolatey/choco/master/src/chocolatey.resources/redirects/RefreshEnv.cmd" -OutFile ("$env:USERPROFILE"+"\Documents\bin\RefreshEnv.cmd")

```

### Windows包管理器

Windows安装软件基本都是通过安装包方式，但繁多的小功能软件自行管理会显得很麻烦，所以如果有一个类似ubuntu的apt系统也挺好的。windows有一个自带winget，但是个人使用一直显示源报错，其中一个源是msstore，而微软商店在国内网络经常抽风。所以选择另一个管理器scoop。

安装：

> Scoop 默认使用普通用户权限，其本体和安装的软件默认会放在 %USERPROFILE%\scoop(即 C:\Users\用户名\scoop)，使用管理员权限进行全局安装 (-g) 的软件在 C:\ProgramData\scoop。如果有自定安装路径的需求，那么要提前设置好环境变量，否则后续再改不是一件容易的事情。

所以先设置用户安装路径

```bash
$env:SCOOP='D:\Scoop'
[Environment]::SetEnvironmentVariable('SCOOP', $env:SCOOP, 'User')
```

然后以非管理员权限打开powershell

```bash
# Change execution policy
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
# Download and install scoop
iwr -useb get.scoop.sh | iex
# Add useful buckets (resembles repos in apt)
scoop bucket add extras
scoop bucket add versions
```

之后就可以`scoop install`安装包，比如`scoop install sudo`.

### on-my-posh

类似于zsh和oh-my-zsh（Linux装机必备），在powershell中获取类似主题体验。

oh-my-posh新版本不能使用powershell的module安装方式，许多21年以前的博客安装说明已失效。以官方说明为准：[Windows  Oh My Posh](https://ohmyposh.dev/docs/installation/windows)

安装：

```bash
# scoop
scoop install https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/oh-my-posh.json
# powershell脚本
Set-ExecutionPolicy Bypass -Scope Process -Force; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://ohmyposh.dev/install.ps1'))
```

然后：

1. 安装字体（Nerd字体），因为很多主题使用图标，需要图标字体支持。

2. 配置字体到终端使用，用的是Windows Terminal在全局设置即可。

3. 配置终端使用oh-my-posh.

   ```bash
   notepad $PROFILE
   
   # profile中输入：
   oh-my-posh init pwsh | Invoke-Expression
   ```

配置和可能碰到的问题：

```bash
# 缺少这个可能导致上面$profile加载失败
Install-Module -Name PSReadLine -AllowPrerelease -Force # PSReadLine
# 如果上面这行出错，执行以下
Install-Module -Name PackageManagement -Repository PSGallery -Force
Install-Module -Name PowerShellGet -Repository PSGallery -Force
# 重启终端
Install-Module -Name Az.StorageSync -AllowPrerelease -AllowClobber -Force

# posh-git 作用是powershell中集成git相关环境，帮助主题能够显示git项目的状态
Install-Module posh-git -Scope CurrentUser 

```

为添加命令历史记录、tab补全、搜索历史记录等功能，配置profile文件，完整如下：

```text
Import-Module posh-git # 引入 posh-git
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\cobalt2.omp.json" | Invoke-Expression

Set-PSReadLineOption -PredictionSource History # 设置预测文本来源为历史记录

Set-PSReadlineKeyHandler -Key Tab -Function Complete # 设置 Tab 键补全
Set-PSReadLineKeyHandler -Key "Ctrl+g" -Function MenuComplete # 设置 Ctrl+d 为菜单补全和 Intellisense
Set-PSReadLineKeyHandler -Key "Ctrl+z" -Function Undo # 设置 Ctrl+z 为撤销
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward # 设置向上键为后向搜索历史记录
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward # 设置向下键为前向搜索历史纪录
```

上面可以看到主题配置，个人选择了cobalt2主题，主题选择可查看：[Themes  Oh My Posh](https://ohmyposh.dev/docs/themes).

然后字体高亮上面可以配置$pshome\profile.ps1实现，个人不想折腾这个，直接使用Window Terminal自带的主题方案得了。

还有一些像conda配置关联的问题，没碰到先不管了。

参考：

1. [Windows Terminal + PowerShell 的配置 - 丏谷  Miangu Blog (zhangtianrong.github.io)](https://zhangtianrong.github.io/2020/01/09/WT+POSH/)
2. [Window终端 Powershell zsh同款 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/384591031)
3. [Scoop 安装使用 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/489898732)

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

> 目前常用的 Linux 系统和 OS X 系统的默认 Shell 都是 bash，但是真正强大的 Shell 是深藏不露的 zsh， 这货绝对是马车中的跑车，跑车中的飞行车，史称『终极 Shell』，但是由于配置过于复杂，所以初期无人问津，很多人跑过来看看 zsh 的配置指南，什么都不说转身就走了。直到有一天，国外有个穷极无聊的程序员开发出了一个能够让你快速上手的zsh项目，叫做「oh my zsh」，Github 网址是：<https://github.com/robbyrussell/oh-my-zsh。这玩意就像「X>天叫你学会 C++」系列，可以让你神功速成，而且是真的。
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
	sed -i '/^plugins=/c\plugins=(git sudo z zsh-syntax-highlighting zsh-autosuggestions zsh-completions colored-man-pages)' ~/.zshrc	
	6.最后应用配置
	source ~/.zshrc
```

以上几种插件是需要额外安装，其他一些插件在./plugins中有，可直接启用。oh my zsh 本人使用主题是**amuse**，可以在<https://github.com/ohmyzsh/ohmyzsh/wiki/Themes>这里查看各种主题。

贴个成品图：
​​![在这里插入图片描述](https://img-blog.csdnimg.cn/3a9cb487114d4ab5ab1677d984561447.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAQWxlemFu,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
​

## 服务器图形用户界面-远程桌面登录

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



**更新：** *之前一次弄到最后没什么精力了，所以将这部分偷懒了。有时间把这部分补充完整。*

要远程控制ubuntu桌面，主要就是就是通过VNC或RDP协议。相关概念参考[ubuntu远程桌面连接方式(vnc、xrdp、vino、xorg等概念) – late哥哥笔记 (lategege.com)](https://www.lategege.com/?p=691).

需要远程桌面登录肯定需要一个桌面系统，ubuntu桌面版自带gnome，ubuntu服务端默认没有桌面。关于ubuntu的桌面系统：

> ubuntu的图形化界面主要有几种:unity\gnome\xfce\kde 其中unity在ubuntu早期版本中常用，新版本ubuntu默认桌面是gnome,而如果安装的是ubuntu server系统，需要在图形化操作，一般安装xfce，它非常轻量，kde在ubuntu中不常用。

### VNC

第一种最简单是安装的ubuntu带有默认的桌面系统，内置有VNC服务端，这里用的是WSL没有默认的桌面系统就不进行尝试了。同样的道理优先选择轻量级的xfce(不过即使是轻量级也有2-3G，穷人的辣鸡云服务器就不敢装了). VNC服务默认端口为5900端口，注意同时只能有一个vnc服务，端口占用无法共存。

1. 安装桌面

   ```bash
   # 首先更新
   sudo apt-get update
   sudo apt-get upgrade
   
   # 安装要选择桌面管理环境gdm3或lightdm，这里选的轻量级lightdm
   sudo apt-get install xubuntu-desktop 
   # 这里有个小问题是安装会自动安装locate，会扫描磁盘建立索引方便查找文件，问题是在WSL里会把挂载的外部windows文件系统也一同扫描，速度可能相当慢，可使用以下方式省略扫描windows：add /mnt to PRUNEPATHS in /etc/updatedb.conf
   # 或者尝试以下命令
   sudo apt-get install xorg
   sudo apt-get install xfce4
   ```

2. 安装VNC Server。这里的选择很多，VNC是一种协议，有许多实现版本，比如开源的vnc4server、tightvncserver，付费的realvncserver（有破解码）.

   ```bash
   # 多选一
   sudo apt-get install vnc4server # 这个在默认源中没有，要在/etc/apt/sources.list中添加deb http://cn.archive.ubuntu.com/ubuntu/ bionic universe
   
   sudo apt-get install tightvncserver
   
   https://downloads.realvnc.com/download/file/vnc.files/VNC-Server-6.11.0-Linux-x64.deb
   ```

3. 启动

   ```bash
   vncserver
   # 输出
   You will require a password to access your desktops.
   
   Password:
   Verify:
   Would you like to enter a view-only password (y/n)? n
   xauth:  file /home/olimi/.Xauthority does not exist
   
   New 'X' desktop is Olimi-PC-541:1
   ```

4. 配置。默认配置启动连接会一片灰白。

   ```bash
   vncserver -kill :1 # 结束前面启动的窗口1
   # 备份原来的配置文件
   mv ~/.vnc/xstartup ~/.vnc/xstartup.bak
   # 编辑新的配置文件
   nano ~/.vnc/xstartup
   # 输入以下内容
   ```

   ```sh
   #!/bin/sh
   
   # Uncomment the following two lines for normal desktop:
   unset SESSION_MANAGER
   # exec /etc/X11/xinit/xinitrc
   
   [ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
   [ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
   xsetroot -solid grey
   vncconfig -iconic &
   x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
   startxfce4 &
   ```

   ```bash
   # 授予可执行权限
   chmod u+x ~/.vnc/xstartup
   ```

5. 重新启动

   ```bash
   vncserver # 或vncserver -geometry 1920x1080 :1
   ```

6. 使用VNC Viewer工具访问。[RealVNC](https://www.realvnc.com/en/connect/download/viewer/?spm=a2c4g.11186623.0.0.51f42d32DpaFkW)下载Viewer，还是付费软件好用，虽然只是server付费。输入：`IP:端口号`。VNC默认端口为5900，每建立一个连接，VNC 端口号 +1。比如第一个VNC窗口，开放的端口就是5901. 也可以用MobaXterm软件连接。

   ![image-20221115221854928](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20221115213339061.png)

   *（经典死老鼠）*

### RDP

关于RDP：

> rdp是windows系统专用的远程连接方式，但是ubuntu等linux系统下可以通过移花接木的方式，也就是xrdp, xrdp本身不具备桌面服务功能，需要和图形化桌面配合，这个提供桌面能力的其实就是xorg，xorg在ubuntu中默认存在，所以通过xrdp连接远程桌面默认会选择xorg，xorg为xrdp提供桌面服务，xrdp本身提供远程连接能力。如果你安装了GNOME, 那xorg就将GNOME桌面远程提供给你，如果你安装了xfce,xorg就将xfce桌面提供给你。可以说xorg是远程桌面服务的中间件，但是xorg和gnome配合不是很好，往往会有问题，但是网上也有解决方案，最佳的配合还是xfce+xorg+xrdp，由于xorg是ubuntu默认存在的图形化能力，所以只要在ubuntu中安装上xrdp，如果你的桌面系统是xfce就能直接使用远程桌面。

1. 安装桌面系统同上。

2. 安装xrdp

   ```bash
   sudo apt-get install xrdp
   ```

3. 安装完成后，Xrdp服务将自动启动。没启动可以自行启动。

   ```bash
   sudo systemctl status xrdp # 查看状态
   # WSL不能执行systemctl，可以使用service命令
   sudo service xrdp status
   sudo service xrdp start
   ```

   ![img](https://img2020.cnblogs.com/blog/1234034/202009/1234034-20200930083230253-965519395.jpg)

4. 默认情况下，Xrdp会读取使用`/etc/ssl/private/ssl-cert-snakeoil.key`文件，但该文件仅由ssl-cert组的成员读取。 因此你需要运行以下命令以将`xrdp`用户添加到ssl-cert组：

   ```bash
   sudo adduser xrdp ssl-cert  # 添加用户组
   sudo systemctl restart xrdp # 重启服务
   ```

5. Xrdp配置文件位于：`/etc/xrdp/xrdp.ini`。可自行配置。

6. *可选。远程桌面连接测试时黑屏，闪退：`rdp session has been disconnected.` 解决：

   ```bash
   echo "startxfce4" > ~/.Xsession
   chmod +x ~/.Xsession
   sudo service xrdp restart
   ```

windows可以通过远程桌面客户端连接了，xrdp的端口和rdp一样都是**3389**，所以可以直接使用windows自带的远程桌面连接工具，连接口弹出窗口，默认选中了xorg，输入ubuntu用户名密码就可以登录. 

> 当然，xrdp不仅可以选择xorg，还能选择vnc-any，也就是选择了这个，你可以连接vnc服务端，也就是 xrdp不仅可以和xorg配合，也能和vnc4server、vino、tightvncserver等vnc服务端配置使用。

![image-20221115213339061](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20221115220102750.png)

（这里因为没指定分辨率，而电脑屏幕是4k屏，没放缩的情况下显得很小）

### X11+SSH转发

X Window System 常被简称为X11或X，其功能包括窗口的绘制、移动，以及与鼠标、键盘等输入设备的交互。X Window采用的是X11协议。X11 中的 X 指的就是 X 协议；11 指的是采用 X 协议的第 11 个版本。

关于什么是X11

> 它采用C/S模型：一个X server 和多个应用程序（client）通信。server接收client的请求绘制窗口，并将来自鼠标、键盘等设备的输入传递给client。
> X server和client可以位于同一计算机上，就类似于平时使用的Windows操作系统；当X server和client不在同一计算机时，使用本地的X server 进行绘制、交互，就变成了远程桌面。
> 举个例子：前者是你在披萨店点了一份披萨，店员在你旁边帮你做好拿给你（这家店相当于同一台计算机）；后者是你在网上叫了一份披萨，店员接单后到你家帮你做了一份披萨（注意：VNC是使用店里厨房，做好给你送过来；X转发是使用你家厨房做披萨）

一般Xserver默认不允许直接网络传输，这时候就可以借助ssh通道进行显示。进一步的原理：

![sshforwarding.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/630a6cf2d5284c6cbf98a43bb5b8d567~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

流程：

1. sshd接受请求建立连接，并将本次ssh会话的DISPLAY指定为`hostname:10.0`，这里需要注意的是DISPLAY环境变量格式为`hostname:displaynumber.screennumber`,若hostname为空，则表示Xserver运行在本机，当以tcp连接时，displaynumber的值为实际连接的端口减去6000，即本次的监听端口为6010，而6010的监听者就是sshd程序。
2. 在ssh会话中执行图形程序，ssh客户端本质上只负责输入和显示，程序的执行在sshd上。假设在命令行上运行xclock，这在pstree查看sshd进程可以看到`sshd(822369)---bash(822539)---xclock(1014618)`。xclock的父进程为bash。该程序与6010进行TCP通信，将X11协议数据发送到6010,sshd再将该数据放入ssh通道与ssh客户端进行通信。
3. ssh运行在客户端，该端同时运行Xserver.ssh与Xserver建立连接，将ssh通道中的X11协议数据发送到Xserver。

![X11 转发设置](https://goteleport.com/blog/_next/static/media/x11-forwarding-setup.c67f3da7.png)

**实践：**最简单的方案就是使用MobaXterm，自带内置的X Server，可以直接接管远程系统的图形化绘制请求。在连接ssh时默认会勾选x11-forwarding，就可以接收x11转发请求。剩下的是X11 Client端的配置。

![image-20221115222834486](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20221115221854928.png)

![image.png](https://bbs-img.huaweicloud.com/blogs/img/20220615/1655256876815937924.png)

如果登录时显示这个界面，就需要配置连接的远程客户端：

1. 安装X认证包：`apt install xorg-x11-xauth`

2. 打开ssh转发：编辑`/etc/ssh/sshd_config`：

   ```
   #AllowAgentForwarding yes
   AllowTcpForwarding yes   #这里打开
   #GatewayPorts no
   X11Forwarding yes      #这里原本就是打开的
   #X11DisplayOffset 10
   #X11UseLocalhost yes
   #PermitTTY yes
   ```

   ```bash
   service sshd restart
   ```

以上是看来的未亲测。用云服务器测试（未安装桌面，小、穷、破），连进去就可以用：

![image-20221115220102750](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20221115222834486.png)

以下是个人配置：

```bash
~ ⌚ 22:28:52
sudo dpkg -l | grep x11
ii  libx11-6:amd64                        2:1.6.9-2ubuntu1.2                amd64        X11 client-side library
ii  libx11-data                           2:1.6.9-2ubuntu1.2                all          X11 client-side library
ii  libx11-xcb1:amd64                     2:1.6.9-2ubuntu1.2                amd64        Xlib/XCB interface library
ii  x11-apps                              7.7+8                             amd64        X applications
ii  x11-common                            1:7.7+19ubuntu14                  all          X Window System (X.Org) infrastructure
ii  x11-utils                             7.7+5                             amd64        X11 utilities
rc  x11-xserver-utils                     7.7+8                             amd64        X server utilities

~ ⌚ 22:29:07
$ cat /etc/ssh/sshd_config | grep AllowTcpForwarding
#AllowTcpForwarding yes
#       AllowTcpForwarding no

```

使用命令测试：

```bash
xclock
# 如果找不到则安装
sudo apt-get install x11-apps
```

![image-20221115223152999](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20221115223152999.png)

**总结：**可以发现，这种途径是使用远程系统，需要使用GUI，但系统默认未安装图形界面时，最简便的途径。特别是一般情况下服务端空间宝贵，资源珍贵，使用GUI机会少，用X11转发流量是非常有性价比的行为。

References：

1. [ubuntu20.10中设置桌面共享的三种方式(任选其一) - 星宇x - 博客园 (cnblogs.com)](https://www.cnblogs.com/xingyu666/p/14132923.html#autoid-1-0-0)
2. [如何在Ubuntu 20.04上安装Xrdp服务器 | myfreax](https://www.myfreax.com/how-to-install-xrdp-on-ubuntu-20-04/)
3. [ubuntu远程桌面连接方式(vnc、xrdp、vino、xorg等概念) – late哥哥笔记 (lategege.com)](https://www.lategege.com/?p=691#comment-1998)
4. [Ubuntu 18.04 中安装 Xfce 和 SVN 开启远程桌面访问 | Ethan's Blog - 记录和思考 (ethanblog.com)](https://ethanblog.com/tips/enable-remote-desktop-in-ubuntu-18-04-with-xface-and-svn.html)
5. [(11条消息) 【华为云】用VNC远程连接Ubuntu20.04图形界面_Desny的博客-CSDN博客_vnc远程连接ubuntu桌面](https://blog.csdn.net/weixin_40908748/article/details/125431387)
6. [通过VNC搭建Ubuntu 18.04和20.04图形界面 (aliyun.com)](https://help.aliyun.com/document_detail/59330.html)
7. [remote desktop - Xrdp on Ubuntu 20.04 - Ask Ubuntu](https://askubuntu.com/questions/1245020/xrdp-on-ubuntu-20-04)
8. [忘掉VNC/RDP，拿起手中的MobaXterm轻松上手远程桌面 - 思兼 - 博客园 (cnblogs.com)](https://www.cnblogs.com/sjqlwy/p/mobaxterm.html)
9. [ssh X11 Forwarding机制浅析 - 掘金 (juejin.cn)](https://juejin.cn/post/7093898366475567118)
10. [您需要了解的有关 X11 转发的信息 (goteleport.com)](https://goteleport.com/blog/x11-forwarding/)

## 后述

在玩的过程有碰到什么有意思的再补充吧。

