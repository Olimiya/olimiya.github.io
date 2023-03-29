---
title: C++隐式类型转换 operator T()
date: 2020-02-09 19:51
categories: [C++]
tags: 智能指针
---
最近研究智能指针，osg::ref_ptr的机制时候发现一个有趣的问题。就是C++智能指针都会提到一点：

>由于智能指针是一个对象，所以if (my_smart_object)永远为真，要判断智能指针的裸指针是否为空，需要这样判断：if (my_smart_object.get())。

但是我在写osg的时候，下意识都是直接判定的if(myPtr)也没碰到问题。研究后发现原来是osg::ref_ptr重载了一个函数：

```cpp
        operator T*() const { return _ptr; }
```

仔细一看，emmm，发现没看懂这是啥。百度之后发现这是隐式类型转换的重载，即使用到osg::ref_ptr对象时，可以把对象隐式转换成T*类型。

继而仔细思考了一下，上面第一段引用的那段话
>由于智能指针是一个对象，所以if (my_smart_object)永远为真

觉得非常不合理，因为如果普通的类的对象，根本就不能判断if(my_smart_object)，因为这个对象不能隐式转换成boo类型的值，所以上述判断又从何而来呢？比如：

![在这里插入图片描述](https://picbed.olimi.icu//img/202303291940957.png)

而一旦可以用if判断，那其实就是重载了隐式转换，既然重载了，为什么要转换成毫无意义的this指针？而不是内部保存的指针。

基于使用纯C++的智能指针较少（指STL或BOOST），暂时不能下什么结论。先 Mark一下。
