---
title: C++ 文档化：Doxygen+sphinx
date: 2023-2-6 10:42:43 +0800
categories: [C++]
tags: 工程 文档自动生成 doxygen

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


### 技巧

1. 不想每次都重复一遍选择，每个生成类似的项目，只要拷贝之前生成过的项目的Doxyfile，更改项目路径即可。

## （更新）Doxygen+Sphinx

**小前言：**

仍然是对于一个新项目，对于项目代码理解以及熟悉代码的向新成员讲解过程，结合API、图表和生成的文档会更加清晰。

然后发现微软的HTML help workshop(hhw)软件已经不维护了，安装包也很难找到（本地原本安装好的补充了一个HHA.DLL还能勉强一用）。

既然如此，原本也一直觉得chm这个帮助手册很难看，那寻找一下别的方案。

比较主流的API手册是html组织形式，在左侧导航栏索引API，中间视图显示API具体内容，即一种叫做reStructuredText (reST)的文法。

实现这种效果的一个主流工具是Sphinx。还有[Doxysphinx](https://boschglobal.github.io/doxysphinx/index.html)等。

首先要将doxygen读取源文件（.c, .cpp）转化的xml转换为reStructuredText文档使用breathe。最后再使用Exhale, 在 reStructuredText 文档中恢复 Doxygen 的类、文件和页面层次结构。

**完整的工具链**为：doxygen(提取源文件内容)+breathe(转换为reStructuredText)+exhale(重新组织类结构)+sphinx(组织reStructuredText文档显示)。

**Sphinx+breathe+cmake配置**参考：

[Clear, Functional C++ Documentation with Sphinx + Breathe + Doxygen + CMake - C++ Team Blog (microsoft.com)](https://devblogs.microsoft.com/cppblog/clear-functional-c-documentation-with-sphinx-breathe-doxygen-cmake/)

```bash
# 环境，进入虚拟env
pip install sphinx_rtd_theme
pip install breathe
pip install exhale
```

Doxygen使用参考上面。区别：output输出xml格式。

Doxygen效果:

![Doxygen's output, which has a lot of boilerplate and unused space](https://devblogs.microsoft.com/cppblog/wp-content/uploads/sites/9/2019/05/doxygen1.png)

```bash
sphinx-quickstart.exe

# 修改conf.py
...
extensions = [
    'breathe',            # 用于支持 doxygen
]
# Breathe Configuration
breathe_default_project = 'demo' # breathe 默认项目
breathe_projects = {
    'ProxyDoc': 'D:/F/Program/SimCSC/Proxy-Doc/xml' # 配置 demo 项目的 doxygen xml 路径
}
html_theme = 'sphinx_rtd_theme'
```

sphinx_rtd效果：

![image-20230206110941006](https://picbed.olimi.icu//img/image-20230206110941006.png)

可以看到只有索引页，看起来很丑。

可以使用**exhale**.参考：[Documenting C++ with Doxygen and Sphinx - Exhale :: Rohit Goswami — Reflections (rgoswami.me)](https://rgoswami.me/posts/doc-cpp-dox-sph-exhale/)

```bash
# 这里使用Poetry管理依赖
poetry init 
poetry add exhale breathe sphinx-book-theme
```

```python
# 修改conf.py
extensions = [
    'breathe',
    'exhale',
]

#—- Exhale configuration--
# Setup the breathe extension
breathe_projects = {
    "My Proj": "./../../xml"
}
breathe_default_project = "My Proj"

# Setup the exhale extension
exhale_args = {
    # These arguments are required
    "containmentFolder":     "./api",
    "rootFileName":          "library_root.rst",
    "rootFileTitle":         "Library API",
    "doxygenStripFromPath":  "..",
    # Suggested optional arguments
    "createTreeView":        True,
    # TIP: if using the sphinx-bootstrap-theme, you need
    # "treeViewIsBootstrap": True,
}

# Tell sphinx what the primary language being documented is.
primary_domain = 'cpp'

# Tell sphinx what the pygments highlight language should be.
highlight_language = 'cpp'
```

```rst
# 修改index.rst
.. toctree::
   :maxdepth: 2
   :caption: Contents:

   api/library_root
```

```bash
make.bat html
```

**坑来了！**

这里最大的坑是文件编码问题，测试的项目可能都有GB2312编码的文件（但又不全是！），导致输出的xml文件部分是utf-8格式，部分是ANSI格式。但是这些插件要求必须是utf-8编码的。因此需要转换一下格式。（当然更应该的是项目应该规范化一个编码格式）

寻找non-utf8格式文件：（[来源](https://github.com/svenevs/exhale/issues/36)），需类unix终端，git-bash即可。

```bash
find . -type f | xargs -I {} bash -c "iconv -f utf-8 -t utf-16 {} &>/dev/null || echo {}" > utf8_fail
```

找到以后逐一修改文件编码，修改方式可通过vs code、Notepad++。批量修改可使用edit plus，打开所有需要修改文件，在工具栏“文档”下->文件编码->批量修改。

之后就可以正常`make.bat html`编译完成。效果：

![image-20230206112800282](https://picbed.olimi.icu//img/image-20230206112800282.png)

另外可参考别的库的sphinx生成的编写：[LimeSuite/conf.py at sphinx · myriadrf/LimeSuite (github.com)](https://github.com/myriadrf/LimeSuite/blob/sphinx/docs/sphinx/conf.py)。

最终各版本效果对比：

1. Doxygen:

   ![image-20230206122034155](https://picbed.olimi.icu//img/image-20230206122034155.png)

2. Read The docs

   ![image-20230206122054635](https://picbed.olimi.icu//img/image-20230206122054635.png)

3. book-theme:

   ![image-20230206122138644](https://picbed.olimi.icu//img/image-20230206122138644.png)

**补充：**最后测试了一下qhp：

![image-20230206155738510](https://picbed.olimi.icu//img/image-20230206155738510.png)

然后在qt creator->工具->帮助->文档->添加，效果：

![image-20230206155834747](https://picbed.olimi.icu//img/image-20230206155834747.png)

很丑....
