---
title: C++新项目学习-逆向工程之使用Doxygen
date: 2022-07-28 16:01:09 +0800
categories: [杂记,C++]
tags: 记录

---

## 前言

学习C++项目，无论是调用的C++库，亦或者查看一个别人的项目，再或者接手一个老项目（shishan），直接硬撸源码是不太现实的。有些库文档写得不好，看文档不如直接看源码了。这个时候，如果我们手上已经有了源码，那使用逆向工程生成一些比较适合阅读的输出文档、图表就是一个自然而然的念头。对于C++来说，doxygen应该是个较为通用的解决方案。

## 汇总

- doxygen
- visual paradigm
- rational rose
- start uml

visual paradigm: [How to generate UML from C++ - Visual Paradigm (visual-paradigm.com)](https://circle.visual-paradigm.com/docs/code-engineering/instant-reverse/how-to-generate-uml-from-cpp/)

doxygen: [Doxygen + Graphviz + Htmlhelp, 成为文档好手 - maxweii - 博客园 (cnblogs.com)](https://www.cnblogs.com/weiqubo/archive/2011/08/30/2159643.html)

后面两个在UML领域也比较出名（虽然可能比较菜觉得不太好用）。

都试用一遍，绘图工具主要专注于某种图的生成，最有性价比的选择还是doxygen.

## Doxygen生成

使用doxywizard.exe非常傻瓜式，根据向导一步步选择即可。环境安装参考上述一个链接，主要就是下载doxygen, 需要合成chm的再安装个htmlhelp, 图表生成更好看的话增加graphviz。单纯就doxygen就可以。下面是我的一些步骤记录。

### 关键步骤

1. 第一步必填的一些信息，其他信息根据喜好添加。

![image-20220728094214937](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728094214937.png)

2. 第二步选择。

   - 勾选分析的对象选择All Entity：让Doxygen分析所有内容。因为并不见得所有的代码都按Doxygen的注释方式进行了注释，为保证不会漏掉东西，所以选此项。这就是Doxygen的优势，兼容非doxygen注释（或者根本没有注释）的工程，一样可以看到一些结构信息。
   - “Include cross-referenced source code in the output”：简单来说就是把源代码也放到生成的文档中。个人比较喜欢选择这一项，虽然会导致API文档体积增大，但在以后查阅API文档时，可以直接看到源代码，不用专门去打开相应的源代码文件了。

   ![image-20220728094355016](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728094355016.png)

3. 第三步输出。

   ![image-20220728094711555](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728094711555.png)

4. 第四步图表。

   ![image-20220728094840343](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728094840343.png)

5. Build.

   - “FILE_PATTERNS”：告诉Doxygen需要分析哪些文件。这里要注意OSG和osgEarth的头文件都是没有扩展名的，所以这里加了个“*”，以确保Doxygen能扫描到这些头文件。

   ![image-20220728100425356](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728100425356.png)

6. 输入。这里输入的patterns，可在输出完成后，检查有什么信息少的或者不必要的，再回来补充。

   ![image-20220728095050060](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728095050060.png)

6. Dot。如果勾选了Dot，需指定路径。

   ![image-20220728100212430](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728100212430.png)

8. 同理htmlhelper也是。

   ![image-20220728151104545](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728151104545.png)

### 可选步骤

1. 图标。在第一步选择icon后在expert张也加上。

   ![img](https://raw.githubusercontent.com/Olimiya/PicBed/main/clip_image002-16589732820631.jpg)

   不知道为什么在Wizard中设置的logo切换到Expert下就没有了，所以在这里又设置了一次。同样，如果不想在文档中显示图片logo，不填这一项就可以了。

2. Expert：HTML。

   “HTML_DYNAMIC_SECTIONS”：让Doxygen产生可以显示/隐藏的动态块。生成的所有图片初始都是隐藏状态，需要哪个展开来看就是了，个人比较喜欢这个功能。

   “CHM_FILE”：指定要生成的chm文档路径及名称。如果不加“../”生成的文件在“Doc/HTML”下，里面文件太多了不好找，加上“../”让Doxygen放到“Doc”下。

   “HHC_LOCATION”：告诉Doxygen用于编译chm的工具hhc.exe在哪儿。这个工具是生成CHM的关键，通常在“C:/Program Files/HTML help workshop”路径下，如果没有就到网上找一个。

![img](https://raw.githubusercontent.com/Olimiya/PicBed/main/clip_image002-16589734221812.jpg)

3. 搜索引擎。使用index.html查看时的搜索框和htmlhelper不能共用。所以使用index查看就要禁止生成htmlhelp.

   ![image-20220728160514575](https://raw.githubusercontent.com/Olimiya/PicBed/main/image-20220728160514575.png)

   
