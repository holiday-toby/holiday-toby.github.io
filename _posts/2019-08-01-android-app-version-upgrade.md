---
layout: post
title: "新APP打造之Android版本升级比较算法"
category: android
---

例如本地APP版本为1.1.12.3，通过接口获取到的远程版本为1.2.0这种格式，判断本地版本是否需要升级，有两个思路：

1. 一种是按位比较法，将两个字段通过"."分割，转化为两个数组，然后逐位去比较
2. 第二种是补位法，按较长的那个字符串给较短的字符串补上0，然后去掉"."号，整体比较两个蒸熟的大小。

下面按第一种方式实现一下：

```java
    /**
     * 比较服务器版本和当前版本
     *
     * @param remoteVersion 三种形式: X.X或X.X.X或x.x.x.x
     * @return true - 需要更新, false-不需要更新
     */
    public static boolean needUpdate(String remoteVersion) {
        //处理本地版本号
        //String localVersion = BuildConfig.VERSION_NAME;
        PackageManager manager = App.get().getPackageManager();
        PackageInfo info = null;
        String localVersion = "";

        try {
            info = manager.getPackageInfo(App.get().getPackageName(), 0);
            localVersion = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        boolean needUpdate = isNeedUpdate(localVersion, remoteVersion);
        //进行版本比较
        if (needUpdate) {
            Log.d(TAG,"服务器版本" + remoteVersion + "高于本地版本" + localVersion + "，需要更新");
        } else {
            Log.d(TAG,"服务器版本" + remoteVersion + "等于或低于本地版本" + localVersion + "，不需要更新");
        }
        return needUpdate;
    }
    
    /**
     * 抽取便于写测试用例
     *
     * @param localVersion
     * @param remoteVersion
     * @return
     */
    public static boolean isNeedUpdate(String localVersion, String remoteVersion) {
        String[] localVersions = localVersion.split("\\.");
        String[] remoteVersions = remoteVersion.split("\\.");


        int length = Math.min(remoteVersions.length, localVersions.length);
        int diff = 0;
        boolean needUpdate = false;

        for (int i = 0; i < length; i++) {
            diff = localVersions[i].length() - remoteVersions[i].length();
            if (diff < 0) {//后者位数长
                needUpdate = true;
                break;
            } else if (diff == 0) { //位数相同时，比较大小
                if (localVersions[i].compareTo(remoteVersions[i]) < 0) { //后者数字大
                    needUpdate = true;
                    break;
                } else if (localVersions[i].compareTo(remoteVersions[i]) > 0) {
                    return false; // 后者数字小，直接返回false退出比较，主要出现在测试环境，防止误报
                }
            } else { //前者位数长。。。
                return false;
            }
        }

        if (!needUpdate && remoteVersions.length > localVersions.length) {
            needUpdate = true;
        }

        return needUpdate;
    }
```

编写测试用例：

```java
    @Test
    public void testVerisonCompare() {
        Assert.assertTrue(Utility.isNeedUpdate("1.4.1","1.5"));
        Assert.assertTrue(Utility.isNeedUpdate("1.4.14","1.5"));
        Assert.assertTrue(Utility.isNeedUpdate("1.4","1.4.84"));
        Assert.assertTrue(Utility.isNeedUpdate("1.9","1.10"));
        Assert.assertFalse(Utility.isNeedUpdate("1.4.14","1.4"));
        Assert.assertFalse(Utility.isNeedUpdate("1.5","1.4.1"));
        Assert.assertFalse(Utility.isNeedUpdate("1.6","1.5"));
        Assert.assertFalse(Utility.isNeedUpdate("1.4.12","1.4.10.1"));
        Assert.assertFalse(Utility.isNeedUpdate("1.5.1","1.4.10.1"));
        Assert.assertTrue(Utility.isNeedUpdate("1.4.10.1","1.4.11"));
        Assert.assertFalse(Utility.isNeedUpdate("1.11","1.7.1"));
        Assert.assertTrue(Utility.isNeedUpdate("1.7.2","1.8.1"));
        Assert.assertTrue(Utility.isNeedUpdate("1.7.2","1.8"));
        Assert.assertTrue(Utility.isNeedUpdate("1.8.1","1.99"));
        System.out.println("hello world");
    }

```

