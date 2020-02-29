---
layout: post
title: "Android项目在Studio中的编译流程及常见错误"
category: other
---

### 背景
项目中在接入或者升级sdk时经常会报一些编译的错误，如果不了解Android工程的编译原理，每次遇到这种问题都只是Google搜索尝试解决方案，效率就很低了。

之前学了一些gradle和groove的知识，最近对代码的编译原理，操作系统，树结构有了一定程度的感知，是时候对整个编译流程有一个清晰的认识了。

### Andriod Studio编译流程

[Android 官网的流程图](<https://developer.android.google.cn/studio/build>)

![img](https://duanholiy.github.io/images/build-process_2x.png)
图 1. 典型 Android 应用模块的构建流程。

如图 1 所示，典型 Android 应用模块的构建流程通常依循下列步骤：

编译器将您的源代码转换成 DEX（Dalvik Executable) 文件（其中包括 Android 设备上运行的字节码），将所有其他内容转换成已编译资源。
APK 打包器将 DEX 文件和已编译资源合并成单个 APK。 不过，必须先签署 APK，才能将应用安装并部署到 Android 设备上。
APK 打包器使用调试或发布密钥库签署您的 APK：
如果您构建的是调试版本的应用（即专用于测试和分析的应用），打包器会使用调试密钥库签署您的应用。 Android Studio 自动使用调试密钥库配置新项目。
如果您构建的是打算向外发布的发布版本应用，打包器会使用发布密钥库签署您的应用。 要创建发布密钥库，请阅读在 Android Studio 中签署您的应用。
在生成最终 APK 之前，打包器会使用 zipalign 工具对应用进行优化，减少其在设备上运行时占用的内存。
构建流程结束时，您将获得应用的调试 APK 或发布 APK，您可使用它们进行部署、测试，或向外部用户发布。

#### [编译过程概括](<https://blog.csdn.net/jq_motee/article/details/80780075>)

>①资源合并 
>- 合并Manifest文件，生成Merged Manifest(使用Manifest Merger插件） 
>- 合并Resources文件，生成Merged Resources(使用Resource Merger插件) 
>- 合并Assests文件，生成Merged Assests（使用Assest Merger插件）
>
>②打包资源文件，生成R.java和Compiled Resources（使用aapt构建工具） 
>③将.aidl文件处理成.java文件(使用aidl构建工具) 
>④将java文件（R.java、aidl处理过的.java以及java代码）编译为.class文件（使用JDK中的javac工具） 
>⑤将④中的.class文件和三方库中的.class文件生成混淆的.jar文件（使用proguard插件） 
>⑥将.jar文件打包成.dex文件（使用dex构建工具） 
>⑦将Compiled Resources、项目中的Resources和.dex文件打包生成未签名的.apk文件（使用apkbuilder插件） 
>⑧用keystore文件进行签名（使用JDK中的Jarsigner工具） 
>⑨优化apk(使用zipalign 构建工具)
>
>提示
>
>上述构建工具位于SDK中的/build-tools目录中
>上述JDK工具位于其JDK路径中的/bin目录中
>上述其他插件位于SDK中的/tools目录中

### 常见错误

#### 1.aapt报错，一般是资源的问题，也是今天刚好遇到的问题

![](https://cdn.jsdelivr.net/gh/duanholiy/imageBed@master/uPic/屏幕快照%202019-03-27%20下午12.10.47.png)

```
Caused by: org.gradle.process.internal.ExecException: Process 'command '/Users/ldh/Library/Android/sdk/build-tools/27.0.2/aapt'' finished with non-zero exit value 1
```

最后合并资源形成的文件，点开两处的代码

```xml
   //1590行
   <declare-styleable name="custom_button_style">
     <attr format="string" name="buttonText"/>
     <attr format="color" name="buttonTextColor"/>
     <attr format="dimension" name="buttonTextSize"/>
     <attr format="dimension" name="buttonWidth"/>
     <attr format="dimension" name="buttonHeight"/>
     <attr format="reference" name="buttonBackground"/>
     <attr format="color" name="textViewColor"/>
     <attr format="dimension" name="textViewSize"/>
     <attr format="boolean" name="textViewVisibility"/>
		</declare-styleable>
    //1207行
    <declare-styleable name="DialogStyle">
      <attr format="reference" name="dialogBackground"/>
      <attr format="color|reference" name="dialogTitleTextColor"/>
      <attr format="color|reference" name="dialogTitleSeparatorColor"/>
      <attr format="color|reference" name="messageTextColor"/>
      <attr format="color|reference" name="buttonTextColor"/>
      <attr format="color|reference" name="buttonSeparatorColor"/>
      <attr format="color|reference" name="buttonBackgroundColorNormal"/>
      <attr format="color|reference" name="buttonBackgroundColorPressed"/>
      <attr format="color|reference" name="buttonBackgroundColorFocused"/>
		</declare-styleable>

```



可见是一个buttonTextColor的属性冲突报错，如果sdk降级到历史版本又不在报错了，搜索整个项目中只在DialogStyle中使用了一次，推测sdk中定义了相同name的自定义属性，导致命名空间冲突。

```xml
	<declare-styleable name="DialogStyle">
		<attr name="dialogBackground" format="reference" />
		<attr name="dialogTitleTextColor" format="color|reference" />
		<attr name="dialogTitleSeparatorColor" format="color|reference" />
		<attr name="messageTextColor" format="color|reference" />
		<attr name="buttonTextColor" format="color|reference" />
		<attr name="buttonSeparatorColor" format="color|reference" />
		<attr name="buttonBackgroundColorNormal" format="color|reference" />
		<attr name="buttonBackgroundColorPressed" format="color|reference" />
		<attr name="buttonBackgroundColorFocused" format="color|reference" />
	</declare-styleable>
```



于是修改该处xml的逻辑，buttonTextColor改为声明的方式，sync project顺利通过，似乎问题解决了

```xml
	<attr name="buttonTextColor" format="color|reference" />
	<declare-styleable name="DialogStyle">
		<attr name="dialogBackground" format="reference" />
		<attr name="dialogTitleTextColor" format="color|reference" />
		<attr name="dialogTitleSeparatorColor" format="color|reference" />
		<attr name="messageTextColor" format="color|reference" />
		<attr name="buttonTextColor"  />
		<attr name="buttonSeparatorColor" format="color|reference" />
		<attr name="buttonBackgroundColorNormal" format="color|reference" />
		<attr name="buttonBackgroundColorPressed" format="color|reference" />
		<attr name="buttonBackgroundColorFocused" format="color|reference" />
	</declare-styleable>
```



#### 2. 然而这一次Databinding继续报错，同步的时候可以通过，打包的时候报错
```java
Caused by: android.databinding.tool.util.LoggedErrorException: failure, see logs for details
Error reading contents of /xxx/build/intermediates/data-binding-compiler/debug/dependent-lib-artifacts directory java.nio.file.NoSuchFileException: /xxxx/build/intermediates/data-binding-compiler/debug/dependent-lib-artifacts
```

[stackoverflow上这个问题的链接](<https://stackoverflow.com/questions/48143395/error-reading-contents-of-build-intermediates-data-binding-compiler-debug-depend>)

但是里面提到的方法都解决不了我的问题，删除了主项目和报错module中的build文件夹。最后再次报了上面哪个问题，于是把提到的buttonTextColor的名字删除掉一个字母，终于可以打包成功了。>_<

看来那样声明一下只能解决同步预编译中的报错，并不能解决实际编译中的报错。

于是stackoverflow添加上了我的答案。

不得不说，databinding对真实报错信息的隐藏与误导加大了我们排查问题的难度。

#### 3.databinding的其他报错，这个有各种原因，多分支并行开发时比较常见

- 多数时候是由于某个分支生成了databinding的文件，在切换分支后找不到报错，这个时候clean+重启studio可以顺利解决

- 有时候是xml中的写法有问题导致databinding辅助类无法生成，这时候可以在一堆报错信息中查找最上面那个报错信息仔细排查一下

- 最近项目做模块化，遇到一个比较隐蔽的报错，代码中引用对应的xml中对应的id都是存在的，但是打包时一直报资源找不到，明明文件生成了，没有更清晰的报错信息。不知道新写的代码哪里出了问题。就在我打算放弃，修改databinding的写法为findviewbyId的时候，同事说之前遇到过类似问题，是不同的module下面存在相同的layout文件导致的。。。然后想起来，之前在单模块打包的时候可以顺利通过，应该是改成合并打包以后的报错。引用一下当时的笔记

  >Databinding报databinding 找不到符号符号:变量 位置:类id
  >
  >1.据网上所言，这可能是R文件引用错误
  >
  >module中布局文件移动文件之后，发现代码编译错误，报错信息如下：
  >
  >```
  >错误: 找不到符号
  >
  >符号:  变量 tv_content
  >
  >位置: 类 id
  >```
  >
  >但是，在Android Studio里面点击id的使用，仍然可以跳转到xml里面。
  >
  >原因是：代码是从一个module移动到另一个module，对R的引用还是引用的之前的module的，导致无法找到。
  >
  >网上解决方法是：把import里面对R的引用删除掉，让AS自动再次引入就可以了。
  >
  >但是对我不适用，解决时多次重启as，rebuild项目，各种搜，说多了都是泪。。。
  >
  >2.还有一种情况我遇到的，就是在多模块开发的时候，其他module下存在与这个layout同名的xml文件，太坑

