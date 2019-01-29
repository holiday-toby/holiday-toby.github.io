---
layout: post
title: "Android应用第三方SDK导致ANR问题分析"
category: android
---

### 背景信息 ###  

在接入第三方SDK的时候，经常会出现一些莫名其妙的bug，如果缺少可以定位具体问题的日志，加上对SDK的逻辑理解不足，往往会导致我们在寻找解决方案的时候耽误很多时间。之前就遇到过修改一个MusicPlayService字段名studio同时误改了视频音乐合成配置字符串中的key值，以及视频编辑界面返回时原始文件被删除导致视频预览界面卡住的bug，然后已经写了很多代码，还没有错误日志可以定位。。。

项目中接入了全景相机全景拍摄的SDK，全景相机2.0发布以后，需要兼容到新的硬件设备，这个时候，同事发现新的相机拍摄页面拍摄完成之后，获取了全景图然后到下一个查看页面时一直会报ANR错误。由于缺少相关经验在分析的时候绕了一些弯路记录下来。  

>ANR的常见类型
>
>ANR一般有三种类型：
>
>1：KeyDispatchTimeout(5 seconds) --主要类型
>
>按键或触摸事件在特定时间内无响应
>
>2：BroadcastTimeout(10 seconds)
>
>BroadcastReceiver在特定时间内无法处理完成
>
>3：ServiceTimeout(20 seconds) --小概率类型
>
>Service在特定的时间内无法处理完成
>
>以上引用自[Android ANR](http://blog.csdn.net/duer8797/article/details/7258884)

有限的日志如下：
```
2019-01-09 03:18:32.681 402-479/? E/System:  ********** PLEASE READ ************ 
2019-01-09 03:18:32.681 402-479/? E/System:  * 
2019-01-09 03:18:32.681 402-479/? E/System:  * New versions of the Android SDK no longer support the Crypto provider.
2019-01-09 03:18:32.681 402-479/? E/System:  * If your app was relying on setSeed() to derive keys from strings, you
2019-01-09 03:18:32.681 402-479/? E/System:  * should switch to using SecretKeySpec to load raw key bytes directly OR
2019-01-09 03:18:32.681 402-479/? E/System:  * use a real key derivation function (KDF). See advice here : 
2019-01-09 03:18:32.681 402-479/? E/System:  * http://android-developers.blogspot.com/2016/06/security-crypto-provider-deprecated-in.html 
2019-01-09 03:18:32.681 402-479/? E/System:  *********************************** 
2019-01-09 03:18:32.681 402-479/? E/System:  Returning an instance of SecureRandom from the Crypto provider
2019-01-09 03:18:32.681 402-479/? E/System:  as a temporary measure so that the apps targeting earlier SDKs
2019-01-09 03:18:32.681 402-479/? E/System:  keep working. Please do not rely on the presence of the Crypto
2019-01-09 03:18:32.681 402-479/? E/System:  provider in the codebase, as our plan is to delete it
2019-01-09 03:18:32.681 402-479/? E/System:  completely in the future.

//以上感觉为干扰信息，以下其实可以发现CPU并没有用到100%，可以判断不是CPU饥饿导致了ANR,应该是主线程被阻塞了

2019-01-09 03:18:32.845 907-985/? E/ActivityManager: ANR in com.xxx.android.xxxxxx
    PID: 15961
    Reason: Broadcast of Intent { act=android.intent.action.SCREEN_OF
    F flg=0x50200010 }   //熄屏广播
    Load: 0.0 / 0.0 / 0.0
    CPU usage from 118855ms to 0ms ago (2019-01-09 01:04:48.708 to 2019-01-09 01:06:47.564):
      18% 907/system_server: 11% user + 6.7% kernel / faults: 45281 minor 1 major
      17% 15961/com.xxx.android.xxxxxx: 15% user + 2.8% kernel / faults: 112956 minor 6 major
      7.3% 1444/com.android.systemui: 5.9% user + 1.4% kernel / faults: 19870 minor 9 major
      6.8% 503/surfaceflinger: 3.8% user + 3% kernel / faults: 389 minor
      5.6% 9702/com.android.settings: 4.6% user + 1% kernel / faults: 33755 minor
      0.1% 727/android.hardware.biometrics.fingerprint@2.1-service: 0% user + 0.1% kernel / faults: 58 minor
      4.1% 402/com.tencent.android.qqdownloader:daemon: 2% user + 2.1% kernel / faults: 18086 minor 3 major
      2.7% 3551/com.tencent.mm:push: 1.5% user + 1.2% kernel / faults: 2154 minor 11 major
      2.4% 653/android.hardware.audio@2.0-service: 0.6% user + 1.7% kernel / faults: 88 minor
      2.2% 9814/adbd: 0.5% user + 1.7% kernel / faults: 14822 minor
      2.1% 505/android.hardware.graphics.composer@2.1-service: 0.9% user + 1.1% kernel / faults: 72 minor
      2% 703/audioserver: 1.1% user + 0.8% kernel / faults: 187 minor
      1.9% 16063/com.xxx.android.xxxxxx:pushservice: 1.6% user + 0.3% kernel / faults: 4175 minor
      1.3% 1964/com.google.android.gms.persistent: 0.8% user + 0.5% kernel / faults: 4621 minor
      1.2% 7892/com.tencent.mobileqq:MSF: 1% user + 0.2% kernel / faults: 3445 minor 1 major
      1.1% 17248/com.tencent.mobileqq: 0.6% user + 0.5% kernel / faults: 3802 minor 26 major
      1.1% 690/kschedfreq:0: 0% user + 1.1% kernel
      1.1% 16825/com.netease.cloudmusic: 0.7% user + 0.3% kernel / faults: 4542 minor 5 major
      1.1% 7/rcu_preempt: 0% user + 1.1% kernel
      0.8% 6084/kschedfreq:2: 0% user + 0.8% kernel
      0.8% 5686/com.eg.android.AlipayGphone:push: 0.3% user + 0.4% kernel / faults: 3143 minor 5 major
      0.7% 29046/com.baidu.searchbox: 0.5% user + 0.2% kernel / faults: 6831 minor
      0.7% 14978/kworker/u8:1: 0% user + 0.7% kernel
      0.7% 481/logd: 0.2% user + 0.4% kernel / faults: 81 minor
      0.6% 7011/com.xxx.android.app:pushservice: 0.4% user + 0.2% kernel / faults: 2094 minor 2 major
      0.6% 6793/kworker/u8:6: 0% user + 0.6% kernel
      0.6% 244/kgsl_worker_thr: 0% user + 0.6% kernel
      0.6% 293/irq/480-synapti: 0% user + 0.6% kernel
      0.5% 22586/com.wandoujia.phoenix2: 0.3% user + 0.2% kernel / faults: 2252 minor 11 major
      0.5% 612/netd: 0.1% user + 0.4% kernel / faults: 4088 minor
      0.5% 3/ksoftirqd/0: 0% user + 0.5% kernel
      0% 21831/com.google.android.inputmethod.pinyin: 0% user + 0% kernel / faults: 4176 minor 1 major
      0.4% 1533/com.ustwo.lwp: 0.2% user + 0.1% kernel / faults: 232 minor
      0.4% 16632/com.tencent.android.qqdownloader: 0.2% user + 0.1% kernel / faults: 2365 minor
      0.4% 5569/com.eg.android.AlipayGphone: 0.2% user + 0.1% kernel / faults: 2757 minor 20 major
      0.3% 669/android.hardware.sensors@1.0-service: 0.1% user + 0.2% kernel / faults: 43 minor
      0.3% 2875/VosMCThread: 0% user + 0.3% kernel
      0.3% 25078/perfd: 0.2% user + 0.1% kernel / faults: 6 minor
      0.3% 1618/com.android.phone: 0.2% user + 0% kernel / faults: 1086 minor
      0.3% 540/jbd2/sda35-8: 0% user + 0.3% kernel
      0.3% 23/ksoftirqd/2: 0% user + 0.3% kernel
      0.3% 3232/com.wandoujia.phoenix2:channel: 0.2% user + 0.1% kernel / faults: 1330 minor 1 major
      0.3% 32747/com.tencent.android.qqdownloader:connect: 0.1% user + 0.1% kernel / faults: 599 minor
      0.3% 482/servicemanager: 0% user + 0.2% kernel / faults: 5 minor
      0.3% 13654/kworker/0:3: 0% user + 0.3% kernel
      0.3% 10013/kworker/u8:2: 0% user + 0.3% kernel
      0.2% 16887/kworker/u8:8: 0% user + 0.2% kernel
      0.2% 5584/kworker/0:2: 0% user + 0.2% kernel
      0.2% 27705/kworker/u8:4: 0% user + 0.2% kernel
      0.2% 50/smem_native_rpm: 0% user + 0.2% kernel
      0% 77/system: 0% user + 0% kernel
      0.2% 356/nanohub: 0% user + 0.2% kernel
      0.2% 2290/com.google.android.gms: 0.1% user + 0% kernel / faults: 926 minor
      0.2% 19773/co
```
#### 1.首先采用传统的方式定位问题，注释了页面跳转的代码之后，发现在只要离开这个页面的时候仍然会报这个错误。判断是在页面的onPause方法中出现了问题，查看onPause中代码如下：
```java
    @Override
    protected void onPause() {
        super.onPause();
        ...
        mJpegView.stopPlay();
    }

```
mJpegView为相机的预览界面，这个stopPlay()方法为关闭相机预览界面，如下：
```java
private class MJpegViewThread extends Thread {
...
    public void stopPlay() {
        if (mMJpegViewThread != null) {
            mMJpegViewThread.cancel(); //将线程中的循环标记置为fasle,方便退出预览循环任务
            boolean retry = true;
            while (retry) {  //一直重试，直到关闭预览执行成功
                try {
                    mMJpegViewThread.join();//强制加入执行，调用join的主线程等待
                    retry = false;//等待上面的线程执行完以后才会继续执行这一句代码
                    mMJpegViewThread = null;
                } catch (InterruptedException e) {
                    e.getStackTrace();
                }
            }
        }
    }
...
     public void cancel() {
            keepRunning = false;
     }

            @Override
        public void run() {
            Bitmap bitmap;
            Rect bitmapRect;
            Canvas bitmapCanvas = null;

            while (keepRunning) {
                if (existSurface) {
                //以下为相机预览中操作
                    try {
                        bitmapCanvas = mSurfaceHolder.lockCanvas();
                        synchronized (mSurfaceHolder) {
                            try {
                                if ((mMJpegInputStream != null) && (bitmapCanvas != null)) {
                                    bitmap = mMJpegInputStream.readMJpegFrame();
                                    bitmapRect = getImageRect(bitmap.getWidth(), bitmap.getHeight());
                                    bitmapCanvas.drawColor(Color.BLACK);
                                    bitmapCanvas.drawBitmap(bitmap, null, bitmapRect, new Paint());
                                    bitmap.recycle();
                                }
                            } catch (IOException e) {
                                e.getStackTrace();
                                keepRunning = false;
                            }
                        }
                    } finally {
                        try {
                            if (bitmapCanvas != null && mSurfaceHolder != null) {
                                Surface surface = mSurfaceHolder.getSurface();
                                if (surface.isValid()) {
                                    mSurfaceHolder.unlockCanvasAndPost(bitmapCanvas);
                                }
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }

            //以下为关闭预览操作
            bitmapCanvas = mSurfaceHolder.lockCanvas();
            synchronized (mSurfaceHolder) {
                if (bitmapCanvas != null) {
                    bitmapCanvas.drawColor(Color.BLACK);
                }
            }

            try {
                if (bitmapCanvas != null && mSurfaceHolder != null) {
                    Surface surface = mSurfaceHolder.getSurface();
                    if (surface.isValid()) {
                        mSurfaceHolder.unlockCanvasAndPost(bitmapCanvas);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (mMJpegInputStream != null) {
                try {
                    mMJpegInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
} }
```
可以发现这里跑了一个循环方法来试图关闭相机，通过预览线程的cancel方法改变循环标记，然后通过join方法暂时阻塞主线程执行关闭操作。打断点发现在join之后，主线程的方法就没有继续走了，一直到anr出现。然而子线程的run方法中对关闭逻辑打断点一直没有走到，无法判断哪一步是耗时操作。  
对比SDKdemo与项目中的代码，怀疑漏掉了什么配置更新，在作了种种推测尝试没有结果还耽误时间之后，怀疑是锁的问题，决定走anr分析流程

```
✗ adb pull /data/anr/traces_com.xxx.android.xxxxxx_2019-01-08-19-34-38.txt ~/Desktop
google pixel手机会报权限拒绝，需要root,手中的oppo手机刚好可以正常获取
```
#### 2.找了一台可以获取anr日志的手机复现了这个anr，获取到了anr日志,部分信息摘录如下：
```
"main" prio=5 tid=1 Waiting
  | group="main" sCount=1 dsCount=0 obj=0x74633360 self=0xf52c2500
  | sysTid=652 nice=0 cgrp=default sched=0/0 handle=0xf75a7b34
  | state=S schedstat=( 14071488829 2321444073 14783 ) utm=1084 stm=323 core=4 HZ=100
  | stack=0xff225000-0xff227000 stackSize=8MB
  | held mutexes=
  at java.lang.Object.wait!(Native method)
  - waiting on <0x0dedb184> (a java.lang.Object)
  at java.lang.Thread.join(Thread.java:724)
  - locked <0x0dedb184> (a java.lang.Object)
  at com.xxx.android.xxxxxx.panorama.view.widget.MJpegView.stopPlay(MJpegView.java:99)
  at com.xxx.android.xxxxxx.panorama.activity.PanoShootActivity.onPause(PanoShootActivity.java:196)
  at android.app.Activity.performPause(Activity.java:6609)
  at android.app.Instrumentation.callActivityOnPause(Instrumentation.java:1312)
  at android.app.ActivityThread.performPauseActivity(ActivityThread.java:3594)
  at android.app.ActivityThread.performPauseActivity(ActivityThread.java:3562)
  at android.app.ActivityThread.handlePauseActivity(ActivityThread.java:3537)
  at android.app.ActivityThread.access$1300(ActivityThread.java:170)
  at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1505)
  at android.os.Handler.dispatchMessage(Handler.java:102)
  at android.os.Looper.loop(Looper.java:179)
  at android.app.ActivityThread.main(ActivityThread.java:5769)
  at java.lang.reflect.Method.invoke!(Native method)
  at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:784)
  at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:674)

  ···

  "Thread-9384" prio=5 tid=89 Native
  | group="main" sCount=1 dsCount=0 obj=0x13cad400 self=0xd0bb6600
  | sysTid=15028 nice=0 cgrp=default sched=0/0 handle=0xd07fc930
  | state=S schedstat=( 2031417632 64534168 1396 ) utm=162 stm=41 core=5 HZ=100
  | stack=0xd06fa000-0xd06fc000 stackSize=1038KB
  | held mutexes=
  kernel: __switch_to+0x70/0x7c
  kernel: sk_wait_data+0x8c/0xf0
  kernel: tcp_recvmsg+0x458/0xa54
  kernel: inet_recvmsg+0xb0/0xe8
  kernel: sock_recvmsg+0xa8/0xe4
  kernel: SyS_recvfrom+0xd4/0x144
  kernel: compat_SyS_recvfrom+0x10/0x1c
  kernel: el0_svc_naked+0x20/0x28
  native: #00 pc 00042124  /system/lib/libc.so (recvfrom+16)
  native: #01 pc 00021b19  /system/lib/libjavacore.so (???)
  native: #02 pc 0042665d  /data/dalvik-cache/arm/system@framework@boot.oat (Java_libcore_io_Posix_recvfromBytes__Ljava_io_FileDescriptor_2Ljava_lang_Object_2IIILjava_net_InetSocketAddress_2+168)
  at libcore.io.Posix.recvfromBytes(Native method)
  at libcore.io.Posix.recvfrom(Posix.java:189)
  at libcore.io.BlockGuardOs.recvfrom(BlockGuardOs.java:250)
  at libcore.io.IoBridge.recvfrom(IoBridge.java:549)
  at java.net.PlainSocketImpl.read(PlainSocketImpl.java:481)
  at java.net.PlainSocketImpl.access$000(PlainSocketImpl.java:37)
  at java.net.PlainSocketImpl$PlainSocketInputStream.read(PlainSocketImpl.java:237)
  at com.android.okhttp.okio.Okio$2.read(Okio.java:135)
  at com.android.okhttp.okio.AsyncTimeout$2.read(AsyncTimeout.java:211)
  at com.android.okhttp.okio.RealBufferedSource.request(RealBufferedSource.java:71)
  at com.android.okhttp.okio.RealBufferedSource.require(RealBufferedSource.java:64)
  at com.android.okhttp.okio.RealBufferedSource.readHexadecimalUnsignedLong(RealBufferedSource.java:270)
  at com.android.okhttp.internal.http.HttpConnection$ChunkedSource.readChunkSize(HttpConnection.java:479)
  at com.android.okhttp.internal.http.HttpConnection$ChunkedSource.read(HttpConnection.java:460)
  at com.android.okhttp.okio.RealBufferedSource$1.read(RealBufferedSource.java:349)
  at java.io.BufferedInputStream.fillbuf(BufferedInputStream.java:175)
  at java.io.BufferedInputStream.read(BufferedInputStream.java:234)
  - locked <0x00c472a4> (a java.io.BufferedInputStream)
  at java.io.DataInputStream.readUnsignedByte(DataInputStream.java:157)
  at com.xxx.android.xxxxxx.panorama.view.widget.MJpegInputStream.getEndOfSequence(MJpegInputStream.java:44)
  at com.xxx.android.xxxxxx.panorama.view.widget.MJpegInputStream.getStartOfSequence(MJpegInputStream.java:66)
  at com.xxx.android.xxxxxx.panorama.view.widget.MJpegInputStream.readMJpegFrame(MJpegInputStream.java:93)
  at com.xxx.android.xxxxxx.panorama.view.widget.MJpegView$MJpegViewThread.run(MJpegView.java:196)
  - locked <0x0d6af80d> (a android.view.SurfaceView$4)
```
这里有主线程和子线程的具体信息，main-Thread状态果然为waiting，看子线程，- locked <0x00c472a4> (a java.io.BufferedInputStream)，显示在DataInputStream.readUnsignedByte方法这里被阻塞了，然后上方是okhttp的堆栈信息，没看懂。。。这时先入为主猜测这里没有拿到锁，和另一个okhttp网络任务冲突了，而demo中应该没有这个网络任务。。。

如果是锁冲突，可以搜索这个锁找到对应的线程，然而只有这一处。这里的okhttp是android内部的okhttp，然后这里是一个文件读取操作阻塞了，一直获取不到相应的信息，然后又没有设置超时时间，或者超时时间超过了5秒，导致了主线程的anr，这个时候还是在预览线程的循环中没有退出来，所以也执行不到后面的关闭逻辑了。找到对应的流创建的地方，设置了一个3秒超时的逻辑，果然页面可以正常跳转了。
#### 3.再看run方法中代码：

```java
          try {
                                if ((mMJpegInputStream != null) && (bitmapCanvas != null)) {
                                    bitmap = mMJpegInputStream.readMJpegFrame();
                                    bitmapRect = getImageRect(bitmap.getWidth(), bitmap.getHeight());
                                    bitmapCanvas.drawColor(Color.BLACK);
                                    bitmapCanvas.drawBitmap(bitmap, null, bitmapRect, new Paint());
                                    bitmap.recycle();
                                }
                            } catch (IOException e) {
                                e.getStackTrace();
                                keepRunning = false;
                            }

```
回顾一下，
- 这里的 bitmap = mMJpegInputStream.readMJpegFrame();明显是一个文件读取的耗时操作，而我一直没有意识到这里耗时，只是往线程被锁住的方向上思考。PS怎么没有跳出循环也是个问题，最后一次刚好挂了？
- java中所有的文件读取操作都是一个流操作，无论如何封装，怎样面貌，底层或者使用java，或者使用okio，万变不离其中。
- anr日志中的com.android.okhttp，前缀明显可以表明这是android内部的okhttp，可以证明android内部的io与网络操作都是用okhttp实现的
- app是连接到全景相机的wifi进行拍摄的，不同设备之间数据的交换，可能都需要进行http的传输，在子线程的堆栈中也发现com.android.okhttp.internal.http.HttpConnection这个类,可能是全景sdk对http请求的封装。
- join()方法，会阻塞当前调用join函数的线程，知道接收线程执行完毕以后，才会继续执行join()之后的代码
- 如果没有具体的报错信息，定位问题时可以通过checkout commitId或者修改文件排查，缩小范围。但是定位到的sdk问题仍然没有解决方案的话，优先走正规的方式去分析问题，而不是对比demo漫无目的的尝试，既浪费时间，还不能通过深入的分析问题来加深理解。
- 发挥出已有的工具的作用，也要合理去尝试新的分析方法与工具，不要害怕未知。维手熟尔。
- 最后，老的全景相机默认超时时间为20秒是可以正确退出预览的，新的全景相机必须设置为3秒才可以正确退出，然后sdk的demo中并没有设置超时时间也是正常的，所以在退出的时候新相机真正导致读取超时的原因其实并没有找到。所以有待后续更新。
