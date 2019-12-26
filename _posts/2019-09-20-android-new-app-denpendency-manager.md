---
layout: post
title: "使用gradle管理android项目中的依赖包"
category: other
---



### 查看依赖信息

1. 命令行方式

   ```
   ➜  MyProject git:(develop) ./gradlew :app:dependencies > ./dependen.txt
   ```
   ![屏幕快照 2019-09-25 下午5.34.56](/images/屏幕快照 2019-09-25 下午5.34.56.png)
2. 鼠标操作

   ![屏幕快照 2019-09-25 下午5.37.15](/images/屏幕快照 2019-09-25 下午5.37.15.png)



3. 浏览器查看

   ```
   /gradlew build --scan
   出现提示
   Publishing a build scan to scans.gradle.com requires accepting the Terms of Service defined at https://scans.gradle.com/terms-of-service. Do you accept these terms? [yes, no]
   输入yes ，打开链接即可
   Gradle Terms of Service accepted.
   
   Publishing build scan...
   https://gradle.com/s/x x x x x x
   ```

4. 使用Gradle View插件

   

### 解决依赖冲突

1. so依赖冲突，不同的模块使用了同名的so包，使用pickFirst和exclude，以及merge

   在不同的库中出现相同的so文件pickFirst只会打包第一个遇到的冲突的so，merge(碰到冲突会合并)和exclude(直接排除匹配到的文件,不建议使用)
   
   [Android动态加载so文件（解决so文件冲突）](https://www.jianshu.com/p/9609e1fb8756)

```
android {
    packagingOptions {
        exclude 'META-INF/rxjava.properties'
        exclude 'META-INF/*'
        pickFirst 'lib/*/libengine.so'
        pickFirst 'lib/*/libwffmpeg.so'
    }
}
```

2. jar版本冲突，一个项目的多个模块对同一模块的不同版本不同版本有依赖

   Transitive用于自动处理子依赖项。默认为true，gradle自动添加子依赖项，形成一个多层树形结构；设置为false，则需要手动添加每个依赖项。

   单个排除

```
compile('com.taobao.android:accs-huawei:1.1.2@aar') {
        transitive = true
        exclude group: 'com.taobao.android', module: 'accs_sdk_taobao'
}
```
```
	//1.直接依赖第三方开源库，一般是托管在 jitpack 或者 jcenter
	implementation 'com.google.code.gson:gson:2.2.4'
	implementation 'com.android.support:cardview-v7:25.0.0'
	implementation 'com.android.support:design:25.0.0'
	//2.直接依赖本地的aar文件，一般是在libs目录下
	implementation(name: 'LiteAVSDK_Professional_5.1.5293', ext: 'aar')
	//3.直接依赖本地的jar文件
	 implementation files('libs/bdasr_V3_20170801_60da871.jar')
	//4.依赖本地的model
	implementation project(':wavelibrary')
	implementation project(':android-ffmpeg')

```

   

#### 参考文章

   [Gradle依赖项学习总结，dependencies、transitive、force、exclude的使用与依赖冲突解决](http://www.paincker.com/gradle-dependencies)
   [一文搞清Gradle依赖](https://www.bjsxt.com/a/10771.html)

[Android Gradle依赖管理、去除重复依赖、忽略](https://blog.csdn.net/wapchief/article/details/84974219)