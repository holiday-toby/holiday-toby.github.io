---
layout: post
title: "Flutter初体验以及各种依赖找不到的解决方案"
category: other
---

### 背景

一直看操作系统、数据结构、网络请求、设计模式这些比较古老的底层知识比较多。

最近公众号推送的flutter相关的文章不少，这个新生事物一年多来已经有了不错的生命力，感觉可以花些时间有所了解。毕竟一个代码运行到两个系统，怎么看都是一个巨大的优势。

理解上是在Android与IOS的基础上构建了一个新的中间层，编写代码，然后通过编译在还原为各自环境的原生代码，所以相比RN的h5本质，还有很不错的效率。

鸿洋的玩安卓网站推荐了一个阿里云的flutter项目，打算跑起来学习学习，[阿里为大家学习Flutter操碎了心](https://mp.weixin.qq.com/s/JvlTnZJGSESpPEwYJF1XNg)。

由于内网，每一步都遇到了依赖无法下载的问题，耽误了时间，这里统一记录一下。

[闲鱼技术flutter文章](https://www.yuque.com/xytech/flutter)

### 安装flutter环境

[Flutter中文网](https://flutterchina.club/setup-macos/)

安装过程非常友好，下载一个zip包，解压到你想安装的目录（～/Applications/），然后简单配置一下环境变量。

运行

```
flutter doctor
```

然后根据提示完善flutter的配置。

不需要安装额外的dart运行环境，已经内置在flutter中。

由于我的电脑很久以前以前安装过flutter，这里运行

```
flutter upgrade
```

更新的时候如果报unknown host，可以检查mac的dps配置。

又遇到了flutter 命令无响应的问题，可以尝试着删除flutter/bin/cache/lockfile来解决。或者卸载重装。

卸载flutter非常方便，整个删除flutter目录就好了。然后下载最新的flutter版本并解压到原目录下。

### 编译运行官方example到安卓设备

进入flutter/example目录下，选择一个项目进入，根据对应的README.md，执行相应的命令。

如果遇到获取不到https://jcenter.bintray.com/资源的问题，我的电脑是浏览器中可以打开，但是在命令行中ping不通，据说这两个请求的是不同的端口，有些服务器可以关闭ping 端口。。。

解决方案，可以在demo的android目录下找到build.gradle文件，配置成阿里的镜像服务器.

```groovy
maven{ url 'http://maven.aliyun.com/nexus/content/groups/public/'}
```

这里贴出build.gradle全部的代码

```groovy
buildscript {
    repositories {
        maven{ url 'http://maven.aliyun.com/nexus/content/groups/public/'}
        jcenter()
        google()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.1.4'
    }
}

allprojects {
    repositories {
        maven{ url 'http://maven.aliyun.com/nexus/content/groups/public/'}
        jcenter()
        google()
    }
}
```

配置后重新运行gradle，Android Studio会优先从阿里的镜像服务器拉取相应资源。

### 编译运行官方example到ios模拟器

>要准备在iOS模拟器上运行并测试您的Flutter应用，请按以下步骤操作：

1. 在Mac上，通过Spotlight或使用以下命令找到模拟器:

   ```commandline
   open -a Simulator
   ```

2. 通过检查模拟器 **硬件>设备** 菜单中的设置，确保您的模拟器正在使用64位设备（iPhone 5s或更高版本）.

3. 根据您的开发机器的屏幕大小，模拟的高清屏iOS设备可能会使您的屏幕溢出。在模拟器的 **Window> Scale** 菜单下设置设备比例

4. 运行 `flutter run`启动您的应用

### 编译flutter-go项目

上面的方法编译flutter的官方demo没有问题，在编译阿里云的flutter开源项目时，还是遇到了新的依赖问题。。

这里添加了阿里云的依赖以后，编译的时候一直仍然报一些kotlin的依赖找不到。。这是仓库中没有吗？

试了一下，这些链接都可以在浏览器中打开并下载

```
* What went wrong:
A problem occurred configuring project ':flutter_downloader'.
> Could not resolve all artifacts for configuration ':flutter_downloader:classpath'.
   > Could not download kotlin-reflect.jar (org.jetbrains.kotlin:kotlin-reflect:1.3.20)
      > Could not get resource 'https://jcenter.bintray.com/org/jetbrains/kotlin/kotlin-reflect/1.3.20/kotlin-reflect-1.3.20.jar'.
         > Read timed out
   > Could not download kotlin-stdlib.jar (org.jetbrains.kotlin:kotlin-stdlib:1.3.20)
      > Could not get resource 'https://jcenter.bintray.com/org/jetbrains/kotlin/kotlin-stdlib/1.3.20/kotlin-stdlib-1.3.20.jar'.
         > Could not GET 'https://jcenter.bintray.com/org/jetbrains/kotlin/kotlin-stdlib/1.3.20/kotlin-stdlib-1.3.20.jar'.
            > Read timed out

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

```

于是尝试mac下命令行里配置代理

```
#设置代理，不需要用户名密码，就去掉username:paasword@
export http_proxy='http://username:paasword@x.x.x.x:xx'
export https_proxy=$http_proxy
# 配置http和https访问
export all_proxy=socks5://127.0.0.1:1080

＃去掉代理
unset http_proxy
unset https_proxy

Mac OS上，除了通过系统设置的UI界面修改网络设置外，我们还可以
用 networksetup 这个命令修改需要的网络代理设置。

以下是我利用该命令导出我ss的proxy 参数：

networksetup -setwebproxy "Wi-fi" 127.0.0.1 1080;
networksetup -setsecurewebproxy "Wi-fi" 127.0.0.1 1080;  
```

然而都没有用，都没法访问jcenter以及www.google.com。

好吧，试一下所谓的gradle的高级玩法

[为**Gradle**设置镜像，解决**jcenter**依赖无法下载或者下载过慢问题](https://cloud.tencent.com/developer/article/1353772)

>如果每个项目都配置一遍可能略显麻烦，所以我们可以为初gradle写一个初始化脚本。
>
>在~/.gradle/目录下新建一个init.gradle文件(Windows默认是C:\Users\UserName\.gradle)，并录入以下容：

```
allprojects{
    repositories {
        def ALIYUN_REPOSITORY_URL = 'http://maven.aliyun.com/nexus/content/groups/public'
        def ALIYUN_JCENTER_URL = 'http://maven.aliyun.com/nexus/content/repositories/jcenter'
        all { ArtifactRepository repo ->
            if(repo instanceof MavenArtifactRepository){
                def url = repo.url.toString()
                if (url.startsWith('https://repo1.maven.org/maven2')) {
                    project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_REPOSITORY_URL."
                    remove repo
                }
                if (url.startsWith('https://jcenter.bintray.com/')) {
                    project.logger.lifecycle "Repository ${repo.url} replaced by $ALIYUN_JCENTER_URL."
                    remove repo
                }
            }
        }
        maven {
            url ALIYUN_REPOSITORY_URL
            url ALIYUN_JCENTER_URL
        }
    }
}
```

> 当然了，也可以将这段脚本放在项目根目录下的build.gradle中。
>
> 以上，再次build时候就会飞一样。

看来是这里的 def ALIYUN_JCENTER_URL = 'http://maven.aliyun.com/nexus/content/repositories/jcenter'起作用了，这次找到了所有的依赖，并且也不用改项目的build.gradle文件了。

实在是非常方便。

 ### Mac命令行中使用VPN

再看最后遗留的问题，看了许多文章，然而上面配置下来都是无效的。

[macbook如何使用vpn](https://jingyan.baidu.com/article/f96699bb085e6f894e3c1b0a.html)

觉得安装一个工具的方案可能比较靠谱，可是依然无效。。就这样吧，不折腾了，暂时没有这个需要。



