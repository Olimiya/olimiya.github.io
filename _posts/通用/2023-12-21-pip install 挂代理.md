---
title: pip install 挂代理
date: 2023-12-21 23:47
categories: [通用]
tags: ["工作经验"]
---

挂了代理之后，pip install包时会出现：

```yaml
(tool) F:\研究生工作\工具库  pip install pyperclip
WARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProxyError('Cannot connect to proxy.', ConnectionResetError(10054, '远程主机强迫关闭了一个现有的连接。', None, 10054, None))': /simple/pyperclip/
WARNING: Retrying (Retry(total=3, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProxyError('Cannot connect to proxy.', ConnectionResetError(10054, '远程主机强迫关闭了一个现有的连接。', None, 10054, None))': /simple/pyperclip/
WARNING: Retrying (Retry(total=2, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProxyError('Cannot connect to proxy.', ConnectionResetError(10054, '远程主机强迫关闭了一个现有的连接。', None, 10054, None))': /simple/pyperclip/
ERROR: Operation cancelled by user
```

关闭代理即可正常安装。

当然正确姿势是在挂着代理时也能正常安装。

方法是给pip配置代理。参考：[6.python设置代理和添加镜像源介绍 - 大-道-至-简 - 博客园 (cnblogs.com)](https://www.cnblogs.com/bonheur/p/12306108.html)

windows下在user目录下创建pip/pip.ini，写入(对于clash代理)：

```yaml
[global]
proxy=http://127.0.0.1:7890
```

即可正常。

ps，还会出现一次的，有点奇怪。

```yaml
(tool) F:\研究生工作\工具库  pip install numpy
Collecting numpy
  WARNING: Retrying (Retry(total=4, connect=None, read=None, redirect=None, status=None)) after connection broken by 'ProxyError('Cannot connect to proxy.', ConnectionResetError(10054, '远程主机强迫关闭了一个现有的连接。', None, 10054, None))': /packages/72/b2/02770e60c4e2f7e158d923ab0dea4e9f146a2dbf267fec6d8dc61d475689/numpy-1.25.2-cp311-cp311-win_amd64.whl
  Downloading numpy-1.25.2-cp311-cp311-win_amd64.whl (15.5 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 15.5/15.5 MB 2.3 MB/s eta 0:00:00
Installing collected packages: numpy
Successfully installed numpy-1.25.2
```