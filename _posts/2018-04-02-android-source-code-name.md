---
layout: post
title: "阅读源码时那些常见的类名后缀所代表的含义（持续更新）"
category: android
---

### 背景

阅读源码时又很多常见的单词后缀，如handler、adapter、poxy、holder、imp、delegate……，往往代表着一种代码分层的思路，或者对应着某种设计模式中的一个角色。

系统地整理收集并理解这样的一些单词，在阅读源代码时候可以更容易的去理解上下文，获得全局的视角，而不致于因为一个小点陷入到了无数层的方法跳转当中，裹足于代码细节之中，却不得其意。

这和懂得设计模式是异曲同工的，我们编写程序时也按照相应的方式来为代码分层，就可以写出更加标准的代码，也让后面阅读维护代码时容易理清逻辑。这就是约定领域语言的力量。

### 大纲

如是，有以下列表，排名不分先后：

|name  |  翻译 | 常见场合 |备注 |  |  |
|------| :-----: |:------:|------|------|------|
|handler|处理者|RejectedExecutionHandler 、Android消息处理机制||||
|adapter|适配器|各种列表View的适配器||||
|poxy|代理|动态代理，静态代理||||
|behavior|行为,表现|策略模式，CoordinatorLayout||||
|builder|建筑者|构建者模式||||
|||||||
|||||||
|||||||
|||||||


### 详解

#### -Handler

处理者，这个是最常见的。
1. 常见于处理回调成功失败的逻辑，如线程池的创建，这里的handler供拒绝执行时调用，方便执行不同的策略。
```java
/**
* 初始化一个线程池供AsyncTask使用，防止下载任务等待过久
*/
private ExecutorService initDownloadThreadPool() {
        int corePoolSize = 2;
        int maxPoolSize = Runtime.getRuntime().availableProcessors() * 2 + 1;
        long keepAliveTime = 1L;
        BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<Runnable>();
        ThreadFactory threadFactory = new ThreadFactory() {
            private final AtomicInteger mCount = new AtomicInteger(1);

            public Thread newThread(Runnable r) {
                return new Thread(r, "ApkDownloadThread #" + mCount.getAndIncrement());
            }
        };
        RejectedExecutionHandler handler = new ThreadPoolExecutor.DiscardOldestPolicy();
        //使用单线程池同样会出现等待问题, 出现场景: 下载一半, 如果连接断掉了(这时要关闭流), 然后再尝试下载
        //因此此处改成多线程池
  			return new ThreadPoolExecutor(corePoolSize, maxPoolSize, keepAliveTime,
                TimeUnit.SECONDS, workQueue, threadFactory, handler);
    }
```
2. 或者用于Android中事件的分发。这个不再多说。

### -Adapter