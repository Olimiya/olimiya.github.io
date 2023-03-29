---
title: openCV with CUDA 编译：乱码错误+no such file
date: 2020-03-18 17:41
categories: [工作记录]
tags: 记录 OpenCV
---
## 前言

关于OpenCV编译教程非常多，个人参考的链接如下：
[https://blog.csdn.net/stjuliet/article/details/84640094](https://blog.csdn.net/stjuliet/article/details/84640094)
基本上按照步骤一步一步下来没有什么问题，这个流程经过很多小伙伴的验证也是可行的。但是在cmake完成，使用VS进行build的时候，本人就出现了一大堆错误，直接导致编译失败。
**查找输出，发现第一个错误是在nvcc编译.cu文件的过程中，输出的信息全部都是”锟斤拷”之类的乱码，其中大部分是warning，只有一个是error，是乱码+No such file。**
本人编译的版本openCV4.2.0 + CUDA9.2(10.2也试过) + VS2017 + CMAKE3.15。

## 探讨

由于VS输出报错中，主要error是no such file，个人查找了相应位置，发现**项目中C/C++附加包含库目录是有相应头文件的**，而且修改源码，输出#include时也有相应提示，所以**此时我认为库目录路径应该是有的，那问题就是出在乱码上**。
![在这里插入图片描述](https://picbed.olimi.icu//img/202303291926829.png)
此时查阅了一些其他人遇到的问题，如[https://blog.csdn.net/Angle_Cal/article/details/79376233](https://blog.csdn.net/Angle_Cal/article/details/79376233)，提出的问题是因为MSVC编译器编译出现乱码，并就此更改了各个编译器地址但都没用。
**在与该博客作者探讨了一番后无果。据说这是CUDA以往的bug，在新版本中已经修复了，所以也没见身边小伙伴遇到过。**

一番折腾（特别是阅读cmake文档。）感觉越走越偏。换个思路，既然是编译.cu文件出现的问题，那我自己编译该.cu文件。于是通过命令行nvcc手动编译.cu文件，**此时完全没有乱码**！但还是报了no such file的错误。然后通过**指定参数--include-path添加库路径**，这时编译通过了！
就此**我单独拿了一个子项目出来就行编译，然后在VC++目录中添加包含目录，这时同样成功了！**

## 解决

经过上面的发现，那显然是nvcc编译.cu的时候真的找不到库的头文件（虽然在C/C++附加包含目录中有）。
**解决方案就是在cmake时，手动指定nvcc的参数，设置--include-path**
![在这里插入图片描述](https://picbed.olimi.icu//img/202303291926830.png)
这时本人的设置：

```bash
--include-path F:/library/vs/OPenCV_CUDA/build/3rdparty/ippicv/ippicv_win/icv/include,F:/library/vs/OPenCV_CUDA/build/3rdparty/ippicv/ippicv_win/iw/include,F:/library/vs/OPenCV_CUDA/opencv-4.2.0/modules/core/src,F:/library/vs/OPenCV_CUDA/opencv-4.2.0/modules/core/include,F:/library/vs/OPenCV_CUDA/build/modules/core,F:/library/vs/OPenCV_CUDA/opencv_contrib-4.2.0/modules/cudev/include,F:/library/vs/OPenCV_CUDA/opencv-4.2.0/3rdparty/zlib,F:/library/vs/OPenCV_CUDA/build/3rdparty/zlib,F:/library/vs/OPenCV_CUDA/opencv-4.2.0/3rdparty/include/opencl/1.2,F:/library/vs/OPenCV_CUDA/opencv-4.2.0/3rdparty/ittnotify/include,F:/library/vs/OPenCV_CUDA/build,F:/tools/CUDA10.2/CUDA_Development/include
```

**至于上面的路径怎么找，本人是找了其中一个项目，复制了C/C++附加包含库路径（可能有遗漏）。编译后错误大量减少，碰到少量错误再一个一个添加其路径即可。**

## 最后

最终是编译成功了。反思了一下，一个是被**VS一堆乱码给误导了**。就这个问题，明明我活动代码页一直设置是Unicode，而且我手动输出调试信息或者在命令行cmd编译.cu都是正常的。可能跟cmake中一些设置有关。
**另外一个是cmake之后库目录默认放在每个项目C/C++的附加包含目录而不是VC++包含目录，原因是前者是对当前项目生效的，而后者是对全局生效的。但本人就是因为这一点而编译不通过.cu文件（毕竟人家都说了是C/C++的设置）。但所有其他人都从未遇到该问题，本人甚是不解。**
以上便是本次“解谜过程”，由于拖了很久才进行记录总结，很多截图已无法获取，对阅读者致以歉意。
