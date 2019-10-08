---
layout: post
title: "mac上的不同java版本管理"
category: java
---

### mac环境下java不同版本的管理
由于发现java控制面板中的版本，命令行版本及Android Studio中的版本均不一致，所以折腾了一番整理在这里。
- cd /Library/Java/JavaVirtualMachinesc查看已安装JDK版本,当前版本为在.bash_profile中配置  

```
➜  JavaVirtualMachines la
total 0
drwxr-xr-x  3 root  wheel    96B May 22  2017 jdk1.8.0_131.jdk
drwxr-xr-x  3 root  wheel    96B Apr  3  2018 jdk1.8.0_151.jdk
➜  JavaVirtualMachines java -version
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
#和.bash_pofile中配置一致
export PATH = ~/Applications/flutter/bin:${PATH}
#Setting PATH for Java 1.8
```
- 系统偏好设置中打开java控制面板，显示更新到最新版本Java 9 Update 191.
查看路径为/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/bin/java
这里是系统java runtime Environment，与JDK(java开发工具)并不会一致。如果想使用最新版本的jdk，可以安装新的JDK并在.bash_profile中修改配置。   

```
➜  bin pwd
/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/bin
➜  bin ./java -version
java version "1.8.0_191"
Java(TM) SE Runtime Environment (build 1.8.0_191-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.191-b12, mixed mode)
```
- Android Studio中工程配置中(cmd+;)找到java location，既可以配置本机JDK目录的，也可以使用推荐的自带JDK版本
- java面板中更新的只是系统运行的JRE环境的版本，开发用的JDK的升级需要另行操作，下面这段引用的文字讲得很明白。

> 我们知道运行JAVA程序的额时候，只需要有JRE就能够运行了，而并不需要使用JDK中的开发工具（如javac java等等），公共JRE就是为运行加载到计算机中的JAVA程序来提供运行环境的，也就是说，如果我们并不需要开发JAVA程序，而仅仅是运行他人的已有的JAVA程序的时候，仅仅安装这个在 JDK外部的JRE文件就足够了。但是如果我们需要开发JAVA程序，那么就必须安装JDK，JDK中包含专用JRE和开发工具，这些开发工具需要专用JRE才能够使用，也就说专用JRE是为我们开发JAVA程序准备的。同时要注意，这两个JRE文件中的内容是有区别的，所以不能够简单的进行替换。另外，注意平时所说的“java自动更新”根本不是所安装的JDK版本的更新，它指的是这个公用JRE运行时环境的更新，这个更新为的是让你的计算机能够使用最新版本正常的运行一些网站或则Web应用等等当中的java程序，如果不及时更新的话，可能我们在浏览一些网页或者web应用时，不能够正常的交互和显示，这与JDK没有任何的关系，很多人认为“java的自动更新”指的是JDK版本的自动更新，这就大错特错了。所以如果我们要想升级JDK的版本，只能够从官网中下载最新版本的JDK，重新安装即可。
>
> ---------------------
> 作者：轻扰时光 
> 来源：CSDN 
> 原文：https://blog.csdn.net/qingjianduoyun/article/details/76735294 