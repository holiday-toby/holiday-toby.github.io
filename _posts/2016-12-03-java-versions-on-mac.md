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

