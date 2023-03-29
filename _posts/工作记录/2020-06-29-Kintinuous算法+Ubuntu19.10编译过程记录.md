---
title: Kintinuous算法+Ubuntu19.10编译过程记录
date: 2020-06-29 12:04
categories: [工作记录]
tags: Kintinuous编译 CV
---
## 写在前面

**这篇博文告诉你什么**：Kintinuous编译过程可能遇到的一些问题和解决办法。属于汇总贴。同时证明了较新系统中运行编译Kintinuous的可行性。
**不告诉你什么**：算法解析。

## 工作过程

下面将记录一遍整个工作的流程（具体命令将省去，详情见参考链接）。

 1. 查询获取Kintinuou项目，并从项目中获知所需的依赖环境。
    （[https://github.com/mp3guy/Kintinuous](https://github.com/mp3guy/Kintinuous)）
 2. 进入ubuntu实体机（具体版本为19.10），本项目环境配置必须在Linux的实体机上进行。因为项目需要使用cuda，而虚拟机中大概率获取不到真正的显卡硬件。
（[https://blog.csdn.net/cbd_2012/article/details/84581621](https://blog.csdn.net/cbd_2012/article/details/84581621)）
 3. 安装必备的依赖。
（下几步库安装可参考[https://blog.csdn.net/lzRush/article/details/89089233](https://blog.csdn.net/lzRush/article/details/89089233)）
 4. 安装NVDIA及CUDA。本人的系统自带NVDIA的430版本驱动，适合10.1版本的CUDA，故直接安装CUDA。该步骤耗时较长，但直接根据官方提示进行即可。
 5. 安装OpenNI2及PCL1.7。

 6. 安装OpenCV2.4。这步应该是问题最大的。可能的出现的问题和解决方案如下： cmake库找不到：
    [https://blog.csdn.net/qq_17783559/article/details/105078293](https://blog.csdn.net/qq_17783559/article/details/105078293)；
    非常常见的openCV版本与CUDA版本不兼容，即找不到CUDA_nppi_LIBRARY (ADVANCED)，使用下面的1235步：
    [https://blog.csdn.net/u014613745/article/details/78310916](https://blog.csdn.net/u014613745/article/details/78310916)；
    Make过程也可能出现许多报错，如缺少stdlib.h库，通过cmake增加-DENABLE_PRECOMPILED_HEADERS=OFF解决；
    avcodec_free_frame not
    declared等报错属于ffmpeg库不兼容，可自行编译ffmpeg库，操作见Kintinuous项目Readme，或可在cmake中取消with_ffmpeg，据说并不会影响其他功能；
    其他一些make错误不一一指出直接google就有解决方案，一个比较汇总的链接如下：
    [https://blog.csdn.net/u012796629/article/details/89857190；](https://blog.csdn.net/u012796629/article/details/89857190) Make
    install成功后，其他库引用openCV可能出现找不到shared library（本人在编译Kintiuous时遇到），解决方案：
    [https://stackoverflow.com/questions/12335848/opencv-program-compile-error-libopencv-core-so-2-4-cannot-open-shared-object-f](https://stackoverflow.com/questions/12335848/opencv-program-compile-error-libopencv-core-so-2-4-cannot-open-shared-object-f)；
    以及找不到一些与cuda相关的opencv_dev_cudart库等，解决方案是自行拷贝CUDA目录中相关库，或者在提示错误的项目cmake增加-D
    CUDA_USE_STATIC_CUDA_RUNTIME=OFF，参考：
    [https://blog.csdn.net/Hansry/article/details/90675208](https://blog.csdn.net/Hansry/article/details/90675208)；
    另外可能注意的问题是gcc与g++版本，由于cuda10安装仅支持gcc8，故整个过程都使用的是gcc8及g++8，注意两者版本应一致。Linux中多版本软件可自行切换，具体参考google。
 7. 安装DLib（v1.0），DBoW2（v1.0）,
    DLooperDetector（v1.0），ISAM（v1.7），Pangolin（最新）。链接均可参考Kintinuous中给出的。
 8. 编译Kintinuous。该步也可能出现较多问题。如使用高版本导致abs的报错，自行更改源码即可；Unsupported gpu
    architecture 'compute_20'及no kernel image is available for execution
    on the device ，两个问题都通过cmake中增加-D
    CUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda-10.1 -D CUDA_ARCH_BIN=6.1 -D
    CUDA_ARCH_PTX=6.1解决了（本人CUDA10.1+GPU GTX1050
    Pascal架构），如无法解决则查询GPU所适配的架构和算力。参考Kintinuous项目中的Issues:
    [https://github.com/mp3guy/Kintinuous/issues/40](https://github.com/mp3guy/Kintinuous/issues/40)。
 9. Kintinuous正常运行样例。
 10. 下载TUM测试集。通过png_to_klg项目把RGB_D数据转换为Kintinuous读取的klg文件，项目地址：<https://github.com/HTLife/png_to_klg（该项目配置在完成前面的配置后可轻松完成）。转换数据集进行测试。测试过程Kintinuous出现报错，Assertion> `deformationGraph' failed.已放弃
     (核心已转储)，解决方法同样参考Issues：[https://github.com/mp3guy/Kintinuous/issues/63](https://github.com/mp3guy/Kintinuous/issues/63)；
     或是[https://blog.csdn.net/solo_ws/article/details/72887562](https://blog.csdn.net/solo_ws/article/details/72887562)
     。上述核心已转储问题以已其他方式出现，针对特定的数据集无法正常运行，未找到原因。

至此成功完成了Kintinuous算法的编译运行测试等工作。

## 最后

最后放几张运行结果：
![在这里插入图片描述](https://picbed.olimi.icu//img/202303291926432.png)
![在这里插入图片描述](https://picbed.olimi.icu//img/202303291926433.png)
![在这里插入图片描述](https://picbed.olimi.icu//img/202303291926434.png)
