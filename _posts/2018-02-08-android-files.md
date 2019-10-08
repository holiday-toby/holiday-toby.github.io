---
layout: post
title: "Android开发中的文件操作"
category: android
---

### 一、Android中的那些文件常规操作
app专用的文件夹包括两块区域，都会随app的卸载而清除所有数据，推荐用android文件系统的api来访问。
1. app不可见私有目录，用于存放应用自身数据，位于“data/data/包名"路径下，需要root手机或者debug包才可以查看，获取方式如下
```

Context#getFilesDir()   => /data/data/com.xxx.xxx/files

Context#getCacheDir()     => /data/data/com.xxx.xxx/cache

```


2. 可见私有存储目录，位于/Android/data/com.xxx.xxx/下，用于存放应用产生的用户数据，可以通过文件管理自由查看
```

* @param type The type of files directory to return. May be {@code null}
*            for the root of the files directory or one of the following
*            constants for a subdirectory:
*            {@link android.os.Environment#DIRECTORY_MUSIC},
*            {@link android.os.Environment#DIRECTORY_PODCASTS},
*            {@link android.os.Environment#DIRECTORY_RINGTONES},
*            {@link android.os.Environment#DIRECTORY_ALARMS},
*            {@link android.os.Environment#DIRECTORY_NOTIFICATIONS},
*            {@link android.os.Environment#DIRECTORY_PICTURES}, or
*            {@link android.os.Environment#DIRECTORY_MOVIES}.
* @return the absolute path to application-specific directory. May return
*         {@code null} if shared storage is not currently available.
context.getExternalFilesDir("")  => /mnt/sdcard/Android/data/com.xxx.xxx/files 
context.getExternalFilesDir("pictures");  =>    /mnt/sdcard/Android/data/com.xxx.xxx/files/pictures

//对应的缓存文件夹
context.getExternalCacheDir();   /mnt/sdcard/Android/data/com.xxx.xxx/cache

```

3. 手机外部公共文件夹，所有app共享，一般下载或者导出文件到公用目录时使用

```
* @param type The type of storage directory to return. Should be one of
*            {@link #DIRECTORY_MUSIC}, {@link #DIRECTORY_PODCASTS},
*            {@link #DIRECTORY_RINGTONES}, {@link #DIRECTORY_ALARMS},
*            {@link #DIRECTORY_NOTIFICATIONS}, {@link #DIRECTORY_PICTURES},
*            {@link #DIRECTORY_MOVIES}, {@link #DIRECTORY_DOWNLOADS},
*            {@link #DIRECTORY_DCIM}, or {@link #DIRECTORY_DOCUMENTS}. May not be null.
Environment.getExternalStoragePublicDirectory(String type)   =>  //手机存储下，/Pictures， /Download, /DCIM ，/Movies...
Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES); => /Pictures


Environment.getExternalStorageDieectory()
```
### 二、在打开文件夹前需要判断是否可用

需要进行一系列判断，判断是否有外部存储，外部存储是否可用，是否存在文件夹，是否可读可写，建议封装到Utils中



### 三、安卓7.0引入的FileProvider机制

- 目标与实现原理

  主要适用于在不同app中传递文件路径的场景，Android中四大组件都是可以跨进程调用的，并且可以传递文件到不同的app中处理，比如调用APP相机拍一张照片再调用系统剪切组件处理，最后返回到app中。

- 基本使用方法，首先在xml中声明FileProvider以及对外暴露的应用私用目录范围

```xml

       <!--
        7.0以后的手机必须使用FileProvider。   If your targetSdkVersion is 24 or higher,
        we have to use FileProvider class to give access to
        the particular file or folder to make them accessible for other apps.
         * 项目中有多个FileProvider节点的问题
         * http://blog.csdn.net/jdsjlzx/article/details/68487013
        -->
        <provider
            android:name=".XXXFileProvider"
            android:authorities="${applicationId}.provider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/provider_paths" />
        </provider>
```

provider_paths的定义，这里定义你希望对外暴露的文件夹

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <paths>
          <!--空格代表根目录-->
        <external-path name="download" path="" />      
          <!--Android目录下-->
        <external-files-path  name="download" path="" />
         <external-cache-path   name="wow-external-cache-image" path="wow/image/"/>
          <!--data/data/目录下-->
      	<cache-path name="wow-image-cache" path="wow/image"/>
      	<files-paht name="appimages"  paht="images/"/>
    </paths>
</resources>
```



Example1，app升级安装，需要把下载好的文静路径传递到包管理器进行安装 

```java
    /**
     * 去安装更新包，7.0需要适配FileProvider, 8.0还需要申请权限，允许从未知来源安装app
     */
    private void installApk() {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) { //判读版本是否在7.0以上
            Uri uri = FileProvider.getUriForFile(this, getApplicationContext().getPackageName() + ".provider", appFile);
            //添加这一句表示对目标应用临时授权该Uri所代表的文件

            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
        } else {
            intent.setDataAndType(Uri.fromFile(appFile), "application/vnd.android.package-archive");
        }
        startActivity(intent);
        finish();
    }

    /**
     * 判断是否是8.0,8.0需要处理未知应用来源权限问题,否则直接安装。minifast中声明
     * <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
     */
    private void checkIsAndroidO() {
        if (Build.VERSION.SDK_INT >= 26) {
            boolean b = getPackageManager().canRequestPackageInstalls();
            if (b) {
                installApk();//安装应用的逻辑(写自己的就可以)
            } else {
                //请求安装未知应用来源的权限
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.REQUEST_INSTALL_PACKAGES}, PermissionConstant.PERMISSIONS_REQUEST_INSTALL_PACKAGES);
            }
        } else {
            installApk();
        }

    }
```
Example2，打开pdf
```java
    private void openPdf(Context context, String filePath) {
        File file = new File(filePath);
        if (!file.exists()) return;
        Intent intent1 = new Intent();
        intent1.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent1.setAction(Intent.ACTION_VIEW);
        Uri uri;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) { //判读版本是否在7.0以上
            uri = FileProvider.getUriForFile(this, getApplicationContext().getPackageName() + ".provider", file);
            //添加这一句表示对目标应用临时授权该Uri所代表的文件
            intent1.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } else {
            uri = Uri.fromFile(file);
        }

        intent1.setDataAndType(uri, "application/pdf");
        //在此之前最好判断是否存在相应的Activity接受intent,略
        context.startActivity(intent1);
    }

```

