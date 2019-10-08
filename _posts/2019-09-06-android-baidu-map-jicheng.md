---
layout: post
title: "百度mapSDK集成遇到的问题"
category: other
---

### 1.百度地图找不到so包

百度地图是作为微聊发送地理位置的一个功能集成在微聊模块中，然后微聊模块整体打包成一个aar包集成到工程中。微聊第一个版本集成进来后是有so包，可以正常跑的，微聊模块升级后再次集成就在百度地图的初始化方法中报错了.
```java
  // BaiduMap
  	SDKInitializer.initialize(this);
  		
	//报错信息
    java.lang.UnsatisfiedLinkError: No implementation found for int com.baidu.platform.comjni.engine.JNIEngine.initClass(java.lang.Object, int) (tried Java_com_baidu_platform_comjni_engine_JNIEngine_initClass and Java_com_baidu_platform_comjni_engine_JNIEngine_initClass__Ljava_lang_Object_2I)
        at com.baidu.platform.comjni.engine.JNIEngine.initClass(Native Method)
        at com.baidu.platform.comjni.engine.AppEngine.InitClass(Unknown Source:6)
        at com.baidu.platform.comapi.a.<clinit>(Unknown Source:23)
        at com.baidu.platform.comapi.a.a(Unknown Source:0)
        at com.baidu.platform.comapi.c.a(Unknown Source:16)
        at com.baidu.mapapi.SDKInitializer.initialize(Unknown Source:0)
        at com.baidu.mapapi.SDKInitializer.initialize(Unknown Source:1)
```

打开apk文件分析，发现libs下面果然没有so的包。

网上都是要求添加ndkfilter的配置，但是都没有用。

```
//        ndk {
//            abiFilters 'arm64-v8a',"armeabi"
//        }
//无效的方法
```

我把依赖库中jniLibs目录在这个项目src/main/目录下复制了一份，相当于百度的so文件重新复制了一份在当前工程目录下，问题解决了。。。但是还是一头雾水，感觉是谷歌aar文件生成apk时候的bug。

### 2.发送位置信息的时候为空白网格页面

这是由于baidu的key是与包名以及签名文件的md5值绑定的，如果是新的APP就需要申请新的签名。

申请过程比较简单，需要填写一下签名文件的sha1值，debug一般使用~/.android/debug.keystore，release包需要自己去配置签名，一般同公司多个app使用一个签名文件就可以了。附上命令：

```
命令行：keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey （注意目录选择、开发版本、发布版本等问题）

密码：原始密码一般为android，开发者根据实际情况填写。

调试版本使用 debug.keystore，命令为：keytool -list -v -keystore debug.keystore。
发布版本使用 apk 对应的 keystore，命令为：keytool -list -v -keystore apk 的 keystore。

```

