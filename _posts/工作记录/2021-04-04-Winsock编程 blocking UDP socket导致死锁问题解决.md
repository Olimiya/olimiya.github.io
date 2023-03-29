---
title: Winsock编程 blocking UDP socket导致死锁问题解决
date: 2021-04-04 22:39
categories: [工作记录]
tags: 多线程 windows UDP
---

# 项目场景

项目需求是通过UDP与服务器通讯。其中客户端有一个功能模块，进入该模块运行时需要监听端口，停止运行或退出时应停止监听。使用了一个监听线程去管理接受数据。服务器是纯C++代码，因此采用了Winsock。客户端基于Qt库，但为保持一致性，也是用Winsock进行通讯。

# 问题描述

监听线程继承于QThread，实现了挂起、恢复、终止等服务，代码类似于：

```cpp
void UDPThread::stop()
{
    if (QThread::isRunning())
    {
//        qDebug() << "stop thread : " << QThread::currentThreadId();
        mutex.lock();
        stopFlag = true;
        condition.wakeAll();
        mutex.unlock();
    }
}

void UDPThread::pause()
{
    if (QThread::isRunning())
    {
//        qDebug() << "pause thread : " << QThread::currentThreadId();
        mutex.lock();
        pauseFlag = true;
        mutex.unlock();
    }
}

void UDPThread::resume()
{
    if (QThread::isRunning())
    {
//        qDebug() << "resume thread : " << QThread::currentThreadId();
        mutex.lock();
        pauseFlag = false;
        condition.wakeAll();
        mutex.unlock();
    }
}
```

另外，QThread的线程循环类似于:

```cpp
void UDPThread::run()
{
    qDebug() << "enter thread : " << QThread::currentThreadId();

    while (!stopFlag && !isInterruptionRequested())
    {
        qDebug() << "task work : " << QThread::currentThreadId();

        startUDPClient();
        {
            if (pauseFlag)
            {
                qDebug() << "lock thread : " << QThread::currentThreadId();
                mutex.lock();
                condition.wait(&mutex);
                mutex.unlock();
                qDebug() << "unlock thread : " << QThread::currentThreadId();
            }
        }
    }
    pauseFlag = false;
    stopFlag = false;

    qDebug() << "exit thread : " << QThread::currentThreadId();
}
```

```cpp
void UDPThread::startUDPClient()
{
	...
	
    if(!pUDPMsg)
        pUDPMsg = new WinUDPSendRecv(RevcIPTest, recvPort, SendIPTest, selfPort);

    int count = 0;
    ENTITY_STATE_INFO EntityState;
    Struct_UDPMsgKind head;
    if(pUDPMsg->ReceiveMsg((char *)&EntityState, (char *)&head, sizeof(head)))
    {

		...处理数据
    }

}
```

`startUDPClient`函数是处理监听和数据过程。

然后就出现一个问题，无法退出该线程，即在析构函数调用`wait()`函数会一直陷入停等状态。查阅发现是前面`pause`即无法上锁，确定是一直停留在UDP的`recvfrom`函数。（这里对UDP客户端经过封装，内部调用`recvfrom`函数，且设为阻塞式）。

# 解决方案

 1. **方案1**  调用`shutdown`函数。
 网上有说如何退出阻塞式监听，提到使用`shutdown`函数，类似于`shutdown(SOCKET, SD_BOTH)`。

 	~~一度已经生效！！~~
 	新的问题是，shutdown后的套接字无法重新调用，则必须关闭所有资源在新调用时重新分配。
 	于是在UDP管理类（`WinUDPSendRecv`）的析构函数中调用`closesocket`，关闭套接字，在恢复监听时重新生成一次UDP管理类。
 	新问题又出现，在`shutdown`，可能需要一点时间准备退出（猜测），所以紧接着调用和`closesocket`并析构所有资源会导致失败，再次陷入`recvfrom`的忙等中。
 	可以参考下面的一些讨论：
 	[https://stackoverflow.com/questions/28957279/how-to-exit-a-blocking-recv-call](https://stackoverflow.com/questions/28957279/how-to-exit-a-blocking-recv-call)
 	[https://stackoverflow.com/questions/38936093/how-to-exit-a-blocking-recv-in-windows](https://stackoverflow.com/questions/38936093/how-to-exit-a-blocking-recv-in-windows)
 [https://social.msdn.microsoft.com/Forums/security/en-US/ce2ff382-b1bf-40a1-8877-84ba82479799/how-to-exit-a-blocking-recv-call?forum=vcgeneral](https://social.msdn.microsoft.com/Forums/security/en-US/ce2ff382-b1bf-40a1-8877-84ba82479799/how-to-exit-a-blocking-recv-call?forum=vcgeneral)
 2. **方案2** `ioctlsocket`
      在需要停止监听时，使用`ioctlsocket`函数，将套接字重新设为非阻塞式，即可退出忙等。
      但该解决方案又碰到一个问题，就是在监听时，如果监听地址是无效的，这个设置就不会生效。
      参考：
      [https://www.codeproject.com/Questions/723382/How-to-close-a-blocking-recv-socket-from-another-t](https://www.codeproject.com/Questions/723382/How-to-close-a-blocking-recv-socket-from-another-t)

 3. **方案3** **放弃阻塞**

      看了上面几张帖子，尤其是：

      ![在这里插入图片描述](https://picbed.olimi.icu//img/202303291928361.png)忽然才意识到没有必要非要使用阻塞式，毕竟监听线程具有大循环，一次超时继续监听下一次即可。因此**直接取消阻塞式设置**即解决了问题.....

 4. **方案4** 放弃Winsock
    QUDPSocket不香吗... 不过据说项目组其他人测试了Qt UDP服务，存在bug，未亲测。WinAPI是真的ugly..
