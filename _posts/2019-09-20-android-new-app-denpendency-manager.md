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

1. so依赖冲突，不同的模块使用了同名的so包，使用pickFirst和exclude

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

   

#### 参考文章

   [Gradle依赖项学习总结，dependencies、transitive、force、exclude的使用与依赖冲突解决](http://www.paincker.com/gradle-dependencies)
   [一文搞清Gradle依赖](https://www.bjsxt.com/a/10771.html)

