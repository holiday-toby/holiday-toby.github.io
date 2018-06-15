---
layout: post
title: "Android防止APP启动页面SplashActivity被多次启动"
category: android
---

## 问题描述
出现在部分机型，如oppo-r9s，每次app按home键切到后台，再次返回时，总是重新启动，一开始以为是oppo手机不保留后台进程，今天才发现是可以解决的。

## 解决方案

```
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (!isTaskRoot()) {//系统会重启此activty，而不是直接打开之前已经打开过的activity，因此需要关闭此activity
            Intent intent = getIntent();
            String action = intent.getAction();
            if (intent.hasCategory(Intent.CATEGORY_LAUNCHER) && action != null && action.equals(Intent.ACTION_MAIN)) {
                finish();
                return;
            }
        }
        //在super与setContentView方法之间调用
        setContentView(R.layout.layout_splash_activity);
        
     }

```

## 原因分析
isTaskRoot()用于判断activity是不是当前任务栈内的第一个activity，如果是，这里判断splashActivity是第一次启动，就执行后续逻辑。如果不是第一次启动，就直接跳过，finish()方法会返回任务栈中的下一个activity。

