---
layout: post
title: "dialog各种适配总结"
category: other
---

最近实现了一个仿微信的悬浮在软键盘上方可编辑的dialog效果，系统整理了dialog与fr agment之间的区别与联系，需要注意的点，以及各种现有的实现方案。

## Dialog实现原理

### Dialog与DialogFrament

### DialogFrament与window

## 各种网络实现方案

### BottomSheetDialogFragment

### CommonDialog

### KeyBoardDialogFragment

### 获取软键盘高度

引用[获取android软键盘高度](https://www.jianshu.com/p/d25743da213b)

**SoftKeyBoardListener.java**

```java
public class SoftKeyBoardListener {
    private View rootView;//activity的根视图
    int rootViewVisibleHeight;//纪录根视图的显示高度
    private OnSoftKeyBoardChangeListener onSoftKeyBoardChangeListener;

    public SoftKeyBoardListener(Activity activity) {
        //获取activity的根视图
        rootView = activity.getWindow().getDecorView();

        //监听视图树中全局布局发生改变或者视图树中的某个视图的可视状态发生改变
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
                @Override
                public void onGlobalLayout() {
                //获取当前根视图在屏幕上显示的大小
                Rect r = new Rect();
                //获取rootView在窗体的可视区域
                rootView.getWindowVisibleDisplayFrame(r);
                int visibleHeight = r.height();
                if (rootViewVisibleHeight == 0) {
                    rootViewVisibleHeight = visibleHeight;
                    return;
                }

                //根视图显示高度没有变化，可以看作软键盘显示／隐藏状态没有改变
                if (rootViewVisibleHeight == visibleHeight) {
                    return;
                }

                //根视图显示高度变小超过200，可以看作软键盘显示了
                if (rootViewVisibleHeight - visibleHeight > 200) {
                    if (onSoftKeyBoardChangeListener != null) {
                        onSoftKeyBoardChangeListener.keyBoardShow(rootViewVisibleHeight - visibleHeight);
                    }
                    rootViewVisibleHeight = visibleHeight;
                    return;
                }

                //根视图显示高度变大超过200，可以看作软键盘隐藏了
                if (visibleHeight - rootViewVisibleHeight > 200) {
                    if (onSoftKeyBoardChangeListener != null) {
                        onSoftKeyBoardChangeListener.keyBoardHide(visibleHeight - rootViewVisibleHeight);
                    }
                    rootViewVisibleHeight = visibleHeight;
                    return;
                }

            }
        });
    }

    private void setOnSoftKeyBoardChangeListener(OnSoftKeyBoardChangeListener onSoftKeyBoardChangeListener) {
        this.onSoftKeyBoardChangeListener = onSoftKeyBoardChangeListener;
    }

    public interface OnSoftKeyBoardChangeListener {
        void keyBoardShow(int height);

        void keyBoardHide(int height);
    }

    public static void setListener(Activity activity, OnSoftKeyBoardChangeListener onSoftKeyBoardChangeListener) {
        SoftKeyBoardListener softKeyBoardListener = new SoftKeyBoardListener(activity);
        softKeyBoardListener.setOnSoftKeyBoardChangeListener(onSoftKeyBoardChangeListener);
    }
  }
```

**MainActivity**

```java
   SoftKeyBoardListener.setListener(this, new SoftKeyBoardListener.OnSoftKeyBoardChangeListener() {
        @Override
        public void keyBoardShow(int height) {
            Toast.makeText(MainActivity.this, "键盘显示 高度" + height, Toast.LENGTH_SHORT).show();
        }

        @Override
        public void keyBoardHide(int height) {
            Toast.makeText(MainActivity.this, "键盘隐藏 高度" + height, Toast.LENGTH_SHORT).show();
        }
    });
```

**或 SoftKeyBoardListener.java ：**

```java
  interface IKeyBoardVisibleListener{
        void onSoftKeyBoardVisible(boolean visible , int windowBottom);
    }
    boolean isVisiableForLast = false;
    public void addOnSoftKeyBoardVisibleListener(Activity activity, final IKeyBoardVisibleListener listener) {
        //获取activity的根视图
        final View decorView = activity.getWindow().getDecorView();
        decorView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                //获取当前根视图在屏幕上显示的大小
                Rect rect = new Rect();
                decorView.getWindowVisibleDisplayFrame(rect);
                //计算出可见屏幕的高度
                int displayHight = rect.bottom - rect.top;
                //获得屏幕整体的高度
                int hight = decorView.getHeight();
                //获得键盘高度
                int keyboardHeight = hight - displayHight;
                boolean visible = (double) displayHight / hight < 0.8;
                if(visible != isVisiableForLast){
                    listener.onSoftKeyBoardVisible(visible,keyboardHeight );
                }
                isVisiableForLast = visible;
            }
        });
    }
```

