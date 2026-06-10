---
title: C++ NEW FEATURE
date: 2023-10-09 22:09
categories: [Cpp]
tags: ["技术整理"]
---

2023年8月3日 一刷现代C++教程

[第 2 章 语言可用性的强化 现代 C++ 教程: 高速上手 C++ 11/14/17/20 - Modern C++ Tutorial: C++ 11/14/17/20 On the Fly](https://changkun.de/modern-cpp/zh-cn/02-usability/#constexpr)

[GitHub - 0voice/cpp_new_features: 2021年最新整理， C++ 学习资料，含C++ 11 / 14 / 17 / 20 / 23 新特性、入门教程、推荐书籍、优质文章、学习笔记、教学视频等](https://github.com/0voice/cpp_new_features/tree/main)

[GitHub - AnthonyCalandra/modern-cpp-features: A cheatsheet of modern C++ language and library features.](https://github.com/AnthonyCalandra/modern-cpp-features/tree/master)

# 语言语法

- `std::this_thread::sleep_for`：睡眠。
- `alignas`关键字指定的是最小对齐要求，而不是实际的对齐值。例如，如果你使用`alignas(1)`对一个`int`进行对齐，那么编译器可能仍然会选择4字节对齐，因为这可以提高内存访问的性能。

## 常量

### nullptr

- 测试代码
    
    ```cpp
    #include <iostream>
    #include <type_traits>
    
    void foo(char *);
    void foo(int);
    
    int main() {
        if (std::is_same<decltype(NULL), decltype(0)>::value)
            std::cout << "NULL == 0" << std::endl;
        if (std::is_same<decltype(NULL), decltype((void*)0)>::value)
            std::cout << "NULL == (void *)0" << std::endl;
        if (std::is_same<decltype(NULL), std::nullptr_t>::value)
            std::cout << "NULL == nullptr" << std::endl;
    
        foo(0);          // 调用 foo(int)
        // foo(NULL);    // 该行不能通过编译
        foo(nullptr);    // 调用 foo(char*)
        return 0;
    }
    
    void foo(char *) {
        std::cout << "foo(char*) is called" << std::endl;
    }
    void foo(int i) {
        std::cout << "foo(int) is called" << std::endl;
    }
    //foo(int) is called
    //foo(char*) is called
    ```
    
- NULL的定义
    
    ```cpp
    #if defined (_STDDEF_H) || defined (__need_NULL)
    #undef NULL		/* in case <stdio.h> has defined it. */
    #ifdef __GNUG__
    #define NULL __null
    #else   /* G++ */
    #ifndef __cplusplus
    #define NULL ((void *)0)
    #else   /* C++ */
    #define NULL 0
    #endif  /* C++ */
    #endif  /* G++ */
    #endif	/* NULL not defined and <stddef.h> or need NULL.  */
    #undef	__need_NULL
    ```
    
    > 这段代码是针对 GNU 编译器的条件编译指令，它的作用是将 NULL 宏定义为 __null。__null 是 GNU C++ 扩展的一部分，它表示一个空指针常量，类似于 C++11 标准中的 nullptr。某些编译器可能不支持 nullptr，那么可以使用 GNU C++ 扩展中的 __null 代替。在这种情况下，如果编译器是 GNU 编译器，则将 NULL 宏定义为 __null，否则使用其他方式定义 NULL。
    > 

### **if/switch 变量声明强化**

- 测试代码
    
    ```cpp
    if (int a = 10; a != 10)
            return 1;
        switch (int a = 10; a)
        {
        case 1:
            /* code */
            break;
        default:
            break;
        }
    ```
    

## **结构化绑定**

C++17 引入了一种新的语言特性，叫做 "结构化绑定"（Structured Binding）。这个特性允许你在单个声明中创建多个新的变量，这些变量可以用来接收从数组、元组或者结构体解构（destructure）出来的值。

以下是一些使用结构化绑定的示例：

1. **从元组中解构值**：

```cpp
std::tuple<int, std::string, float> getSomeData();
auto [a, b, c] = getSomeData();
std::cout << "Int: " << a << ", String: " << b << ", Float: " << c << std::endl;
```

在这个示例中，`getSomeData` 函数返回一个元组，然后我们使用结构化绑定一次性创建了三个变量 `a`、`b`、`c`，并将元组中的值赋给了它们。

1. **从数组中解构值**：

```cpp
int arr[] = {1, 2};
auto [x, y] = arr;
std::cout << "x: " << x << ", y: " << y << std::endl;
```

在这个示例中，我们从数组 `arr` 中解构出两个值，并赋给了变量 `x` 和 `y`。

1. **从结构体中解构值**：

```cpp
struct MyStruct {
    int id;
    std::string name;
};

MyStruct s = {1, "example"};
auto [id, name] = s;
std::cout << "id: " << id << ", name: " << name << std::endl;
```

在这个示例中，我们从结构体 `s` 中解构出两个值，并赋给了变量 `id` 和 `name`。

结构化绑定是一种非常方便的特性，它可以让你更简洁、更清晰地从复合数据类型中解构出值。

# 右值引用

ref：[第 3 章 语言运行期的强化 现代 C++ 教程: 高速上手 C++ 11/14/17/20 - Modern C++ Tutorial: C++ 11/14/17/20 On the Fly (changkun.de)](https://changkun.de/modern-cpp/zh-cn/03-runtime/#3-3-%E5%8F%B3%E5%80%BC%E5%BC%95%E7%94%A8)

[现代C++之万能引用、完美转发、引用折叠(万字长文)-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1561681)（没看完）

- 右值引用
- 引用坍缩（引用折叠）
- 移动语义
- 通用转发
- 完美转发

**右值引用**

在 C++11 中，引入了右值引用的概念，用来支持移动语义和完美转发。右值引用可以绑定到一个右值（一种临时对象，例如函数返回值），然后从这个右值中"窃取"资源，避免不必要的复制。右值引用标记为 `T&&`。

```cpp
int&& r = 10; // 10 是右值，r 是右值引用
```

**引用折叠（引用坍缩）**

在模板和类型别名中，引用可以折叠。引用折叠的规则是：如果形成了引用的引用，它会折叠为一个普通引用。

```cpp
int x = 10;
int& &r = x; // 编译错误：不能形成引用的引用
int& &&rr = x; // OK：引用折叠使其成为 int&
```

**移动语义**

移动语义允许资源在对象之间转移，而不是进行昂贵的复制。这通过使用右值引用来实现，右值引用可以绑定到临时对象，然后从这个临时对象中窃取资源。

```cpp
std::vector<int> v1 = {1, 2, 3};
std::vector<int> v2 = std::move(v1); // 通过移动语义，v1 的资源被移动到 v2，而不是复制
```

**通用转发（Perfect Forwarding）**

完美转发是指在模板函数中，以与模板参数被调用处完全相同的方式（即，保持其值类别（左值或右值）不变）将参数转发给其他函数。

```cpp
template<typename T>
void wrapper(T&& arg) {
    // 将 arg 完美转发给 foo
    foo(std::forward<T>(arg));
}
```

在这个例子中，如果传递给 `wrapper` 的是左值，`foo` 会接收到一个左值；如果传递给 `wrapper` 的是右值，`foo` 会接收到一个右值。这就是 "完美转发"。

**完美转发**

完美转发是C++11中引入的一个特性，允许函数模板将其参数以原始的形式（无论是左值还是右值）转发给其他函数。这主要通过使用类型推导和右值引用来实现。

```cpp
template <typename Func, typename... Args>
auto forward_to(Func&& func, Args&&... args) -> decltype(auto) {
    return func(std::forward<Args>(args)...);
}
```

在这个例子中，`forward_to`函数模板接受一个函数和一组参数，然后将这些参数完美转发给这个函数。无论原始参数是左值还是右值，它们都会以原始的形式传递给函数。

## 移动语义

11中的移动语义。声明一个类，将其一个对象move到另一个指针，可以吗，发生了什么。

在C++中，移动语义（Move Semantics）是C++11标准中引入的新特性，主要是为了减少不必要的内存拷贝。如果你有一个大的对象，你可以“移动”它而不是复制它，这样可以节省大量的时间和内存。

C++中的移动语义主要通过特殊的类型的引用实现，称为右值引用（rvalue reference）。右值引用是一种特殊类型的引用，它可以绑定到临时对象（也就是右值）。右值引用主要用来支持移动语义和完美转发。

让我们定义一个简单的类，然后演示如何将其一个对象"移动"到另一个对象：

```cpp
#include <iostream>
#include <utility>

class MyClass {
public:
    MyClass() { std::cout << "Default constructor\\n"; }
    MyClass(const MyClass&) { std::cout << "Copy constructor\\n"; }
    MyClass(MyClass&&) { std::cout << "Move constructor\\n"; }
    ~MyClass() { std::cout << "Destructor\\n"; }
};

int main() {
    MyClass a; // 调用默认构造函数
    MyClass b(std::move(a)); // 调用移动构造函数
    return 0;
}

```

在这个例子中，`MyClass`有一个移动构造函数，它接受一个右值引用参数。在`main`函数中，我们创建了一个`MyClass`对象`a`，然后我们使用`std::move`将`a`转化为右值，并传递给`b`的构造函数。这里，`std::move(a)`不会移动`a`，而只是返回一个`a`的右值引用，这样就可以调用移动构造函数了。这个过程中并没有进行任何的复制操作，所以比复制构造函数更高效。

然而，需要注意的是，移动一个对象可能会使它处于一个有效但未定义的状态。在上面的例子中，`a`被移动后就不应再被使用。

进一步地。移动语义（std::move）主要就是将一个对象转换为右值，然后就可以相应地调用一个对象的移动构造函数（特殊情况下，如何未定义移动构造函数，就会转而选择拷贝构造函数）。

移动构造函数和拷贝构造函数的主要区别在于它们处理对象数据的方式不同。当你拷贝一个对象时，你实际上是创建了该对象的一个新副本，这个过程需要分配内存并复制数据，这可能会非常消耗资源。而当你移动一个对象时，你实际上是将原对象的数据“转移”给新对象，而不是复制这些数据。这个过程不需要复制数据，因此通常更有效率。

这是一个例子，可以帮助理解移动和复制的区别：

```cpp
class MyClass {
public:
    int* data;
    int size;

    // 拷贝构造函数
    MyClass(const MyClass& other) : size(other.size), data(new int[other.size]) {
        std::copy(other.data, other.data + other.size, data);
    }

    // 移动构造函数
    MyClass(MyClass&& other) noexcept : size(other.size), data(other.data) {
        other.size = 0;
        other.data = nullptr;
    }
};
```

在这个例子中，拷贝构造函数会创建一个新的`data`数组，并将`other.data`的数据复制到这个新数组。而移动构造函数则直接将`other.data`的所有权转移给新对象，然后将`other.data`设为`nullptr`，这样`other`就不再拥有任何数据。

这就解释了为什么移动后的对象通常不能再使用：移动构造函数会将原对象的数据“窃取”给新对象，所以原对象可能会处于一个空的、无效的状态。在上面的例子中，如果你试图访问移动后的`other.data`，你会得到一个空指针，这通常会导致运行时错误。

然而，虽然移动后的对象通常不能再使用，但是它仍然是一个有效的对象，你可以给它赋予新的值，或者让它调用不依赖于其内部数据的成员函数。你也可以让它调用那些能够处理空状态的成员函数，例如析构函数。

总的来说，如果你需要创建一个对象的副本，并且你需要保留原对象的状态，那么你应该使用拷贝构造函数。如果你不再需要原对象，或者你想要避免代价高昂的数据复制，那么你应该使用移动构造函数。

- 测试代码
    
    ```cpp
    #include <iostream>
    
    class MyClass
    {
    public:
        int *data;
        int size;
        MyClass() : size(10), data(new int[10])
        {
            for (int i = 0; i < 10; i++)
            {
                data[i] = i;
            }
            std::cout << "constructor" << std::endl;
        }
        // 拷贝构造函数
        MyClass(const MyClass &other) : size(other.size), data(new int[other.size])
        {
            std::cout << "copy constructor" << std::endl;
    
            std::copy(other.data, other.data + other.size, data);
        }
    
        ~MyClass()
        {
            std::cout << "destructor" << std::endl;
            delete[] data;
        }
    };
    
    int main()
    {
        auto obj1 = new MyClass();
        MyClass *obj2 = std::move(obj1);
    
        std::cout << obj1 << std::endl;
        std::cout << obj2 << std::endl;
        std::cout << &obj1 << std::endl;
        std::cout << &obj2 << std::endl;
        // *obj1->a = 100;
    
        std::cout << *obj1->data << std::endl;
        std::cout << *obj2->data << std::endl;
    
        std::cout << obj1->data << std::endl;
        std::cout << obj2->data << std::endl;
    
        auto obj3(std::move(*obj2));
        std::cout << &obj3 << std::endl;
        std::cout << obj3.data << std::endl;
        std::cout << *obj3.data << std::endl;
        std::cout << obj2->data << std::endl;
    
        delete obj1;
        return 0;
    }
    ```
    
    结果：
    
    ```cpp
    constructor
    0xfd1400
    0xfd1400
    0x62fe08
    0x62fe00
    0
    0
    0xfd1420
    0xfd1420
    copy constructor
    0x62fdf0
    0xfd1450
    0
    0xfd1420
    destructor
    destructor
    ```
    

**总结：**

结合测试用例，可以看出如果直接`std::move`一个普通指针的话，只是简单把这个指针变成右值，赋值给一个新的指针变量，普通指针没有移动构造函数。就相当于定义了一个新的指针变量，里面指向地址是原指针的内容。

一般情况不会这么这么使用。

**扩展：**结合`unique_ptr`和`std::move`一起使用

结合移动语义和 unique_ptr 可以实现资源的高效管理，避免资源泄漏或重复释放等问题。unique_ptr 是一个独占所有权的智能指针，它通过 RAII（资源获取即初始化）机制来确保在离开作用域时释放所管理的资源。同时，unique_ptr 支持移动语义，可以实现资源的高效转移。

下面是一个使用 unique_ptr 和移动语义的示例：

```cpp
#include <iostream>
#include <memory>

class Object {
public:
    Object() { std::cout << "Object constructed\\n"; }
    ~Object() { std::cout << "Object destroyed\\n"; }
};

int main() {
    // 创建一个 unique_ptr，管理一个 Object 对象
    std::unique_ptr<Object> ptr(new Object);

    // 使用移动语义将 ptr 转移给另一个 unique_ptr
    std::unique_ptr<Object> ptr2(std::move(ptr));

    // 此时 ptr 不再管理 Object 对象，可以被释放或重用
    if (ptr == nullptr) {
        std::cout << "ptr is nullptr\\n";
    }

    // ptr2 管理 Object 对象，会在离开作用域时自动释放
    return 0;
}

```

在上面的示例中，我们首先创建了一个 unique_ptr 对象 `ptr`，并将其初始化为指向一个 Object 对象。然后，我们使用移动语义将 `ptr` 转移给另一个 unique_ptr 对象 `ptr2`，此时 `ptr` 不再管理 Object 对象，可以被释放或重用。最后，`ptr2` 管理 Object 对象，会在离开作用域时自动释放。

需要注意的是，由于 unique_ptr 使用了独占所有权模型，因此我们应该尽量避免直接使用裸指针来操作被 unique_ptr 管理的对象。如果必须使用裸指针，也应该将其转换为智能指针，以确保资源的正确管理。例如：

```cpp
void do_something(Object* ptr) {
    // 将裸指针转换为 unique_ptr，以确保资源的正确管理
    std::unique_ptr<Object> obj(ptr);

    // 在 obj 管理的 Object 对象上进行操作
    // ...
}

```

在上面的示例中，我们将一个裸指针转换为 unique_ptr，以确保在离开函数作用域时正确释放所管理的资源。

# 并行

## 语法

- `std::atomic<int>`是一个原子类型，它可以用于实现无锁的线程安全编程。原子类型的主要作用是提供了一种方式来保证某些操作在多线程环境中的原子性，即这些操作不会被其他线程打断。例如，增加一个计数器的操作通常包含三个步骤：读取旧值、增加1、写回新值。在多线程环境中，如果这三个步骤不是原子的，那么可能会出现错误的结果。例如，两个线程可能同时读取到旧值，然后都增加1并写回新值，导致实际上只增加了1而不是2。
- `std::unique_lock`是一个通用的互斥包装器，它能够提供超出`std::lock_guard`的灵活性。`std::lock_guard`在构造时锁定互斥量，然后在析构时解锁，提供了一种方便的方式来避免忘记解锁互斥量，也确保了在函数执行过程中发生的异常情况下，互斥量能够被正确地解锁。然而，`std::lock_guard`在某些场景下可能过于严格，例如你可能需要在某些条件下提前解锁互斥量，或者在多个互斥量之间转移所有权。`std::unique_lock`提供了如下的灵活性：
    - 延迟锁定：`std::unique_lock`可以在构造时不立即锁定互斥量，然后在稍后的某个时间点手动锁定。
    - 可以解锁并重新锁定：`std::unique_lock`可以在任何时间点解锁互斥量，然后在稍后的某个时间点重新锁定。这对于某些需要在持有锁的期间进行等待的编程模式非常有用。
    - 可转移所有权：`std::unique_lock`的所有权可以转移，即一个`std::unique_lock`对象可以将其所有权转移给另一个`std::unique_lock`对象。这对于需要在函数之间传递锁的所有权的场景非常有用。
    - 可以与条件变量一起使用：`std::unique_lock`可以与`std::condition_variable`一起使用，用于等待特定条件的满足。

## 线程互斥量mutex

`std::mutex`是C++11标准库中提供的一个线程同步原语，用于保护共享资源的访问。`std::mutex`提供了基本的互斥锁功能，即在多个线程中对共享资源进行访问时，只有一个线程可以访问该资源。当一个线程持有锁时，其他线程需要等待该锁被释放后才能获得锁并继续执行。以下是一些`std::mutex`的使用场景：

1. 保护共享资源：在多线程环境下，当多个线程同时访问共享资源时，需要使用`std::mutex`保护共享资源，防止数据竞争问题的发生。例如：多个线程对一个共享的计数器进行更新时，需要使用`std::mutex`进行保护，以确保计数器的值是正确的。
2. 等待/通知机制：在多线程编程中，有时需要一个线程等待另一个线程的某个事件的发生，然后再继续执行。这可以通过`std::mutex`和`std::condition_variable`实现。`std::condition_variable`可以用于等待另一个线程的通知，并在条件满足时通知等待的线程继续执行。
3. 递归锁：当一个线程需要多次获取同一个锁时，可以使用`std::recursive_mutex`，它允许同一个线程多次获取锁，而不会发生死锁。但是，需要注意的是，`std::recursive_mutex`会增加锁的开销，因此在不需要递归锁的情况下，应该使用`std::mutex`。
4. 超时锁：如果需要在等待锁的过程中设置超时时间，可以使用`std::timed_mutex`和`std::unique_lock`。`std::timed_mutex`提供了带超时时间的`lock()`操作，而`std::unique_lock`提供了更灵活的锁定方式。

除了上述标准库提供的互斥锁类之外，C++标准库还提供了其他类型的锁，如读写锁（`std::shared_mutex`）、自旋锁（`std::spin_lock`）和屏障（`std::barrier`）等，以满足不同的需求。

需要注意的是，使用锁是一种确保线程安全的方式，但也会带来一定的性能开销。因此，在使用锁的同时，应该避免过度锁定，尽量减少锁的持有时间，以提高程序的性能。

- 具体的示例
    1. `std::mutex`：
    
    `std::mutex`是C++11标准库中最基本的互斥锁类，用于保护共享资源的访问。下面是一个简单的示例，演示了如何使用`std::mutex`来保护共享资源：
    
    ```cpp
    #include <iostream>
    #include <thread>
    #include <mutex>
    
    std::mutex mtx;
    int count = 0;
    
    void increment() {
        mtx.lock();
        count++;
        mtx.unlock();
    }
    
    int main() {
        std::thread t1(increment);
        std::thread t2(increment);
    
        t1.join();
        t2.join();
    
        std::cout << "count: " << count << std::endl;
    
        return 0;
    }
    
    ```
    
    在上述示例中，我们定义了一个全局变量`count`，并创建了两个线程`t1`和`t2`，它们都调用了`increment()`函数。由于`count`是一个共享资源，我们需要使用`std::mutex`来保护它的访问。在`increment()`函数中，我们使用`std::mutex`的`lock()`和`unlock()`函数来保证对`count`的访问是互斥的。
    
    1. `std::recursive_mutex`：
    
    `std::recursive_mutex`是一个递归互斥锁，允许同一个线程多次获取锁，而不会发生死锁。下面是一个使用`std::recursive_mutex`的示例：
    
    ```cpp
    #include <iostream>
    #include <thread>
    #include <mutex>
    
    std::recursive_mutex mtx;
    
    void foo() {
        mtx.lock();
        std::cout << "foo" << std::endl;
        mtx.unlock();
    }
    
    void bar() {
        mtx.lock();
        foo();
        std::cout << "bar" << std::endl;
        mtx.unlock();
    }
    
    int main() {
        std::thread t(bar);
        t.join();
    
        return 0;
    }
    ```
    
    在上述示例中，我们定义了一个递归互斥锁`std::recursive_mutex`，并创建了两个函数`foo()`和`bar()`，它们都使用了该锁来保护共享资源。在`bar()`函数中，我们首先获取`mtx`的锁，然后调用`foo()`函数。在`foo()`函数中，我们再次获取相同的锁，输出"foo"，然后释放锁。最后在`bar()`函数中输出"bar"，并释放锁。
    
    需要注意的是，如果在`foo()`函数中使用了非递归互斥锁来保护共享资源，那么在`bar()`函数中再次获取该锁时就会发生死锁，因为尝试获取已经被当前线程占用的锁会导致线程阻塞。而使用`std::recursive_mutex`可以避免这种情况，因为它允许同一个线程多次获取锁，而不会发生死锁。
    
    1. `std::timed_mutex`和`std::unique_lock`：
    
    `std::timed_mutex`是一个带有超时时间的互斥锁，允许等待一段时间后自动释放锁。`std::unique_lock`是一个RAII锁封装，提供了更灵活的锁定方式。下面是一个使用`std::timed_mutex`和`std::unique_lock`的示例，演示了如何等待一段时间后自动释放锁：
    
    ```cpp
    #include <iostream>
    #include <thread>
    #include <mutex>
    #include <chrono>
    
    std::timed_mutex mtx;
    
    void foo() {
        std::unique_lock<std::timed_mutex> lock(mtx, std::chrono::seconds(1));
        if (lock.owns_lock()) {
            std::cout << "foo" << std::endl;
        } else {
            std::cout << "foo failed to acquire lock" << std::endl;
        }
    }
    
    int main() {
        std::thread t(foo);
        t.join();
    
        return 0;
    }
    
    ```
    
    在上述示例中，我们定义了一个函数`foo()`，它尝试获取锁并在1秒钟后自动释放锁。在`foo()`函数中，我们使用`std::unique_lock`的构造函数，指定超时时间为1秒。如果在1秒钟内成功获取锁，则输出"foo"，否则输出"foo failed to acquire lock"。
    
    1. `std::shared_mutex`：
    
    `std::shared_mutex`是一个读写锁，允许多个线程同时读取共享资源，但只允许一个线程写入共享资源。下面是一个使用`std::shared_mutex`的示例：
    
    ```cpp
    #include <iostream>
    #include <thread>
    #include <mutex>
    #include <shared_mutex>
    
    std::shared_mutex mtx;
    int count =0;
    
    void read() {
        std::shared_lock<std::shared_mutex> lock(mtx);
        std::cout << "read: " << count << std::endl;
    }
    
    void write() {
        std::unique_lock<std::shared_mutex> lock(mtx);
        count++;
        std::cout << "write: " << count << std::endl;
    }
    
    int main() {
        std::thread t1(read);
        std::thread t2(read);
        std::thread t3(write);
    
        t1.join();
        t2.join();
        t3.join();
    
        return 0;
    }
    
    ```
    
    在上述示例中，我们定义了两个读线程和一个写线程，它们都使用了`std::shared_mutex`来保护共享资源`count`的访问。在读线程中，我们使用`std::shared_lock`来获取读锁，允许多个线程同时读取共享资源。而在写线程中，我们使用`std::unique_lock`来获取写锁，只允许一个线程写入共享资源。
    
    1. 自旋锁：
    
    自旋锁是一种基于忙等待的锁，它避免了线程切换的开销，但会消耗CPU资源。C++标准库中提供了`std::atomic_flag`来实现自旋锁。下面是一个使用`std::atomic_flag`实现自旋锁的示例：
    
    ```cpp
    #include <iostream>
    #include <thread>
    #include <atomic>
    
    std::atomic_flag flag = ATOMIC_FLAG_INIT;
    int count = 0;
    
    void increment() {
        while (flag.test_and_set(std::memory_order_acquire));
        count++;
        flag.clear(std::memory_order_release);
    }
    
    int main() {
        std::thread t1(increment);
        std::thread t2(increment);
    
        t1.join();
        t2.join();
    
        std::cout << "count: " << count << std::endl;
    
        return 0;
    }
    
    ```
    
    在上述示例中，我们使用`std::atomic_flag`来实现自旋锁。在`increment()`函数中，我们使用`test_and_set()`函数获取锁，然后执行增加操作，最后使用`clear()`函数释放锁。需要注意的是，自旋锁会消耗大量的CPU资源，因此在使用自旋锁时需要谨慎。
    
    - 自旋锁的进一步示例
        
        概念：
        
        自旋锁是一种基于忙等待的锁，即线程不断地尝试获取锁，直到锁可用为止。在自旋锁中，如果线程尝试获取锁时发现锁已经被占用，那么它会不断地循环检查锁的状态，直到锁被释放。自旋锁的优点是避免了线程切换的开销，但会消耗CPU资源。
        
        函数：
        
        C++标准库中提供了`std::atomic_flag`来实现自旋锁。`std::atomic_flag`是一个原子布尔标志，支持原子测试和设置操作。在使用自旋锁时，我们可以使用`std::atomic_flag`的`test_and_set()`函数获取锁，`clear()`函数释放锁。
        
        使用场景：
        
        **自旋锁通常用于保护非常短的代码段，这些代码段不需要等待太长时间就可以完成。如果需要保护的代码段执行时间较长，那么自旋锁会消耗大量的CPU资源，影响系统的性能。**因此，在使用自旋锁时需要根据具体情况选择合适的锁类型。
        
        下面是一个使用自旋锁的示例，演示了如何使用`std::atomic_flag`实现自旋锁：
        
        ```cpp
        #include <iostream>
        #include <thread>
        #include <atomic>
        
        std::atomic_flag flag = ATOMIC_FLAG_INIT;
        int count = 0;
        
        void increment() {
            while (flag.test_and_set(std::memory_order_acquire));
            count++;
            flag.clear(std::memory_order_release);
        }
        
        int main() {
            std::thread t1(increment);
            std::thread t2(increment);
        
            t1.join();
            t2.join();
        
            std::cout << "count: " << count << std::endl;
        
            return 0;
        }
        
        ```
        
        在上述示例中，我们定义了一个`std::atomic_flag`类型的变量`flag`，并创建了两个线程`t1`和`t2`，它们都调用了`increment()`函数。在`increment()`函数中，我们使用`test_and_set()`函数获取锁，然后执行增加操作，最后使用`clear()`函数释放锁。
        
        除了`std::atomic_flag`，还有一些其他的自旋锁实现，如`std::atomic<int>`、`std::atomic<bool>`、`std::atomic<intptr_t>`等等。此外，一些操作系统也提供了自旋锁的实现，如Linux内核中的`spinlock_t`。
        
        对于高并发的情况，可以使用更高级的自旋锁实现，如Ticket Spinlock、MCS Spinlock等。这些自旋锁实现可以更好地支持多核CPU，避免竞争和锁争用等问题。
        
        下面给出一个使用Ticket Spinlock的示例：
        
        ```cpp
        #include <iostream>
        #include <thread>
        #include <atomic>
        
        class TicketSpinLock {
        public:
            TicketSpinLock() : m_next(0), m_now_serving(0) {}
        
            void lock() {
                unsigned my_ticket = m_next.fetch_add(1, std::memory_order_relaxed);
                while (my_ticket != m_now_serving.load(std::memory_order_acquire));
            }
        
            void unlock() {
                m_now_serving.fetch_add(1, std::memory_order_release);
            }
        
        private:
            std::atomic<unsigned> m_next;
            std::atomic<unsigned> m_now_serving;
        };
        
        TicketSpinLock lock;
        int count = 0;
        
        void increment() {
            lock.lock();
            count++;
            lock.unlock();
        }
        
        int main() {
            std::thread t1(increment);
            std::thread t2(increment);
        
            t1.join();
            t2.join();
        
            std::cout << "count: " << count << std::endl;
        
            return 0;
        }
        
        ```
        
        在上述示例中，我们定义了一个Ticket Spinlock类，并创建了两个线程`t1`和`t2`，它们都调用了`increment()`函数来增加计数器`count`的值。在`TicketSpinLock`类中，我们使用两个原子变量`m_next`和`m_now_serving`来实现自旋锁。在`lock()`函数中，我们首先获取当前的票号`my_ticket`，然后不断循环检查`m_now_serving`的值，直到它等于`my_ticket`，表示当前线程获取到了锁。在`unlock()`函数中，我们将当前服务的票号加1，表示当前线程已经完成了对共享资源的操作，可以释放锁。
        
        需要注意的是，实际使用自旋锁时需要根据具体情况选择合适的锁类型，并考虑到锁的开销和线程切换的开销，以及竞争和锁争用等问题。
        

## 线程池实现

- 实现代码
    
    ```cpp
    #include <vector>
    #include <queue>
    #include <future>
    #include <thread>
    #include <functional>
    #include <stdexcept>
    #include <iostream>
    
    class ThreadPool
    {
    public:
        ThreadPool(size_t);
        template <class F, class... Args>
        auto enqueue(F &&f, Args &&... args) -> std::future<typename std::result_of<F(Args...)>::type>;
        ~ThreadPool();
    
    private:
        // need to keep track of threads so we can join them
        std::vector<std::thread> workers;
        // the task queue
        std::queue<std::function<void()>> tasks;
    
        // synchronization
        std::mutex queue_mutex;
        std::condition_variable condition;
        bool stop;
    };
    
    // the constructor just launches some amount of workers
    inline ThreadPool::ThreadPool(size_t threads)
        : stop(false)
    {
        for (size_t i = 0; i < threads; ++i)
            workers.emplace_back([this] {
                for (;;) {
                    std::function<void()> task;
    
                    {
                        std::unique_lock<std::mutex> lock(this->queue_mutex);
                        this->condition.wait(
                            lock,
                            // 谓词函数，该函数用于检查是否应该从wait函数返回.避免因假唤醒而导致的问题
                            [this] { return this->stop || !this->tasks.empty(); });
                        if (this->stop && this->tasks.empty())
                            return;
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
    
                    task();
                }
            });
    }
    
    // add new work item to the pool
    template <class F, class... Args>
    auto ThreadPool::enqueue(F &&f, Args &&... args)
        -> std::future<typename std::result_of<F(Args...)>::type>
    {
        using return_type = typename std::result_of<F(Args...)>::type;
    
        auto task = std::make_shared<std::packaged_task<return_type()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...));
    
        std::future<return_type> res = task->get_future();
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
    
            // don't allow enqueueing after stopping the pool
            if (stop)
                throw std::runtime_error("enqueue on stopped ThreadPool");
    
            tasks.emplace([task]() { (*task)(); });
        }
        condition.notify_one();
        return res;
    }
    
    // the destructor joins all threads
    inline ThreadPool::~ThreadPool()
    {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            stop = true;
        }
        condition.notify_all();
        for (std::thread &worker : workers)
            worker.join();
    }
    
    int main()
    {
        ThreadPool pool(4);
        auto result = pool.enqueue(
            [](int answer) {
                std::this_thread::sleep_for(std::chrono::milliseconds(3000));
                return answer;
            },
            42);
        std::cout << "task enqueue" << std::endl;
        std::cout << result.get() << std::endl;
    }
    ```
    

注意：

`std::condition_variable::wait`函数的第二个参数是一个谓词函数，该函数用于检查是否应该从`wait`函数返回。

`std::condition_variable::wait`函数会阻塞当前线程，直到另一个线程调用了`std::condition_variable`的`notify_one`或`notify_all`函数。但是，即使`notify_one`或`notify_all`被调用，`wait`函数也可能不会立即返回。这是因为`wait`函数可能会因为假唤醒（spurious wakeups）而被唤醒，也就是无故的、没有明确原因的唤醒。

为了避免因假唤醒而导致的问题，`wait`函数接受一个谓词函数作为参数。只有当这个谓词函数返回`true`时，`wait`函数才会返回。如果谓词函数返回`false`，`wait`函数会再次阻塞当前线程。

意义:

1. **减少线程创建和销毁的开销**
2. **限制并发线程的数量**
3. **提供任务队列**
4. **提供更高级的特性**
5. **更好的抽象和代码组织**

## 自旋互斥锁实现

- 实现代码
    
    ```cpp
    #include <atomic>
    #include <thread>
    
    class spinlock_mutex {
        std::atomic<bool> flag = ATOMIC_VAR_INIT(false);
    
    public:
        void lock() {
            bool expected = false;
            while (!flag.compare_exchange_strong(expected, true)) {
                expected = false;
                std::this_thread::yield(); // Yield to other threads
            }
        }
    
        void unlock() {
            flag.store(false);
        }
    };
    ```
    

基于**释放/获取模型**。对于选项 `std::memory_order_acq_rel` 而言，则结合了这两者的特点，唯一确定了一个内存屏障，使得当前线程对内存的读写不会被重排并越过此操作的前后。

# 容器-元组

## 元组，运行时索引

- `std::variant`是一个C++17新引入的类模板，它是一个类型安全的联合体。一个`std::variant`实例在任何时候都只能保持其模板参数类型中的一个值。例如，`std::variant<int, float>`可以持有一个`int`或`float`，但不可以同时持有。
    
    `std::variant`的主要优点之一是它的类型安全性。与C联合相比，`std::variant`知道它当前持有的类型，这使得在运行时能够安全地访问值。
    
    下面是一个`std::variant`的例子，它展示了如何使用`std::variant`和`std::get`来存储和检索值：
    
    ```cpp
    #include <variant>
    #include <iostream>
    
    int main() {
        // 创建一个variant，它可以持有int或float
        std::variant<int, float> v;
    
        // 存储一个int
        v = 10;
        std::cout << "The value of v is " << std::get<int>(v) << '\\n';
    
        // 存储一个float
        v = 1.5f;
        std::cout << "The value of v is " << std::get<float>(v) << '\\n';
    
        return 0;
    }
    
    ```
    
    在这个例子中，我们首先创建了一个可以持有`int`或`float`的`std::variant`。然后我们在`variant`中存储了一个`int`并打印它，然后我们在`variant`中存储了一个`float`并打印它。注意我们使用`std::get<T>`来获取`variant`中的值，其中`T`是我们想要获取的类型。
    
    在你的代码中，你使用了`std::variant`的`std::in_place_index<n>`构造函数。这个构造函数允许你直接在`std::variant`中构造一个值，而不需要先创建一个临时对象然后复制或移动到`std::variant`中。这可以提高性能，特别是在处理大对象或需要避免复制的对象时。
    
    下面是一个使用`std::in_place_index<n>`构造函数的例子：
    
    ```cpp
    #include <variant>
    #include <iostream>
    
    int main() {
        // 使用std::in_place_index<n>在variant中直接构造一个值
        std::variant<int, float> v(std::in_place_index<1>, 1.5f);
    
        // 打印variant中的值
        std::cout << "The value of v is " << std::get<float>(v) << '\\n';
    
        return 0;
    }
    
    ```
    
    在这个例子中，我们使用`std::in_place_index<1>`在`std::variant`中直接构造了一个`float`。注意索引是从0开始的，所以索引1对应的类型是`float`。索引指的是构造的模板类型列表对应的索引。
    
- `std::visit`是C++17中引入的一个功能，它用于访问`std::variant`中的值。`std::visit`函数接受一个访问者（visitor）和一个或多个`std::variant`对象。访问者是一个可调用对象，例如函数或者lambda表达式。
    
    当`std::visit`被调用时，它会查看`std::variant`当前持有的值的类型，然后调用访问者，传入该值作为参数。例如：
    
    ```cpp
    template <typename T0, typename ... Ts>
    std::ostream & operator<< (std::ostream & s, std::variant<T0, Ts...> const & v) {
        std::visit([&](auto && x){ s << x;}, v);
        return s;
    }
    ```
    
    `std::visit`接受一个lambda表达式作为访问者。这个lambda表达式接受一个通用引用参数`x`，并输出它到`std::ostream`对象`s`。通用引用是一个可以匹配任何类型的引用，包括左值引用和右值引用。
    
    当`std::visit`被调用时，它会查看`std::variant`对象`v`当前持有的值的类型，然后调用lambda表达式，传入该值作为参数。这样，无论`std::variant`持有何种类型的值，都将被输出到`std::ostream`对象。
    
    总的来说，`std::visit`提供了一种安全、简洁和优雅的方式来访问`std::variant`中的值，无需我们自己去手动检查`std::variant`持有的值的类型。
    

### 实现

- 代码实现
    
    ```cpp
    #include <variant>
    template <size_t n, typename... T>
    constexpr std::variant<T...> _tuple_index(const std::tuple<T...>& tpl, size_t i) {
        if constexpr (n >= sizeof...(T))
            throw std::out_of_range("越界.");
        if (i == n)
            return std::variant<T...>{ std::in_place_index<n>, std::get<n>(tpl) };
        return _tuple_index<(n < sizeof...(T)-1 ? n+1 : 0)>(tpl, i);
    }
    
    template <typename... T>
    constexpr std::variant<T...> tuple_index(const std::tuple<T...>& tpl, size_t i) {
        return _tuple_index<0>(tpl, i);
    }
    
    template <typename T0, typename ... Ts>
    std::ostream & operator<< (std::ostream & s, std::variant<T0, Ts...> const & v) { 
        std::visit([&](auto && x){ s << x;}, v); 
        return s;
    }
    ```
    

解释：

1. `_tuple_index`函数：
    
    `_tuple_index`是一个模板函数，它接受一个编译时常量`n`和一组类型参数`T...`。它的功能是从给定的`std::tuple`中获取索引为`n`的元素。如果`n`等于运行时传入的`i`，那么它会返回一个`std::variant`，该`std::variant`的值是索引为`n`的元素。如果`n`不等于`i`，它会递归调用自己，`n`+1，直到`n`等于`i`或超过`sizeof...(T)`，也就是元素的数量。
    
    注意这里使用了`if constexpr`，它是C++17引入的一种编译时`if`语句。`if constexpr`后的条件必须是一个常量表达式，只有在条件为`true`时，`if`后的代码才会被编译。
    
2. `tuple_index`函数：
    
    `tuple_index`是一个辅助函数，它调用`_tuple_index<0>(tpl, i)`来获取元素。这样用户可以不必手动指定模板参数`n`。
    
3. `<<`运算符重载：
    
    这段代码还提供了一个对`std::variant`类型的`<<`运算符重载，以便可以将`std::variant`的值打印到`std::ostream`。它使用`std::visit`函数来访问`std::variant`中的值，并将该值打印到`std::ostream`。
    

进一步解释：核心是`_tuple_index`函数。

在C++中，模板参数必须在编译时可知。所以，`std::get`函数的参数必须是一个编译时常量，这就是为什么我们不能直接传递一个运行时变量给`std::get`。

然而，我们可以通过模板元编程在编译时生成所有可能的索引，然后在运行时选择正确的索引。这就是`_tuple_index`函数的工作原理。

`_tuple_index`函数的关键部分：`_tuple_index<(n < sizeof...(T)-1 ? n+1 : 0)>(tpl, i);`是一个编译时表达式，它的值在编译时就已经确定了。这个表达式的结果就是模板参数`n`的新值。这个新值在编译时就已经确定，所以我们可以将它作为模板参数。

在每次递归调用`_tuple_index`函数时，我们都会生成一个新的模板实例，模板参数`n`的值为`(n < sizeof...(T)-1 ? n+1 : 0)`。

这样，我们就在编译时生成了所有可能的模板实例（即所有可能的索引）。然后，在运行时，我们根据实际的运行时索引`i`选择正确的模板实例（即正确的索引）。

示例：

比如：`std::tuple<std::string, double, double, int> t("123", 4.5, 6.7, 8);` 会生成以下模板实例：

- `_tuple_index<0, std::string, double, double, int>`
- `_tuple_index<1, std::string, double, double, int>`
- `_tuple_index<2, std::string, double, double, int>`
- `_tuple_index<3, std::string, double, double, int>`
