---
layout: post
title: "新APP打造之Android多渠道打包"
category: other
---

#### 方案

使用美团的walle多渠道打包方案非常方便，支持gradle和命令行两种打包模式。

#### gradle方式打渠道包

[官方集成文档](https://github.com/Meituan-Dianping/walle/blob/49676e819adaf96293a2d9a695e6579e87a268d8/README.md)

1.首先依赖中添加gradle插件

```
buildscript {
    repositories {
        google()
        jcenter()
    }
    dependencies {
        if (isChannel.toBoolean()) classpath 'com.meituan.android.walle:plugin:1.1.6'
    }
}
```

2.使用插件，并添加上用于读取渠道号的AAR
```
apply plugin: 'walle'
...
dependencies {
    compile 'com.meituan.android.walle:library:1.1.6'
}
```

3.配置打包参数:

```
/**
 * 本地打渠道包:
 * 1. 先将gradle.properties中的isChannel设置为true
 * 2. 执行命令:
 *      a. 打debug渠道包: ./gradlew :app:assembleDebugChannels
 *      b. 打release渠道包: ./gradlew :app:assembleReleaseChannels
 *
 * tips: commit代码时记得将isChannel设置为false{
 */
if (isChannel.toBoolean()){
    //apply plugin: 'walle'
    walle {
        // 指定渠道包的输出路径
        apkOutputFolder = new File("${project.buildDir}/outputs/channels");
        // 定制渠道包的APK的文件名称
        apkFileNameFormat = '${appName}-${packageName}-${channel}-${buildType}-v${versionName}-${versionCode}-${buildTime}.apk';
        // 渠道配置文件(在Project项目根目录下创建temp/channels.txt渠道号文件, 渠道号文件格式如: https://github.com/Meituan-Dianping/walle/blob/master/app/channel)
        channelFile = new File("${rootDir}/temp/channels.txt")
 }
```

#### 命令行方式打渠道包

[release版本jar下载地址](https://github.com/Meituan-Dianping/walle/releases)

[官方使用文档](https://github.com/Meituan-Dianping/walle/blob/master/walle-cli/README.md)

#### 获取渠道号

1. java命令，显示当前apk中的渠道和额外信息 

2. ```
   java -jar walle-cli-all.jar show /Users/Meituan/app/build/outputs/apk/app.apk
   ```

3. java代码

   ```
   ChannelInfo channelInfo= WalleChannelReader.getChannelInfo(this.getApplicationContext());
   if (channelInfo != null) {
      String channel = channelInfo.getChannel();
      Map<String, String> extraInfo = channelInfo.getExtraInfo();
   }
   // 或者也可以直接根据key获取
   String value = WalleChannelReader.get(context, "buildtime");
   ```

   