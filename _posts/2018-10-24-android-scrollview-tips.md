---
layout: post
title: "Android开发中ScrollView那些事"
category: android
---

### 简介

```
java.lang.Object
  ↳android.view.View
    ↳android.view.ViewGroup
      ↳android.widget.FrameLayout
        ↳android.widget.ScrollView

```

ScrollView称为滚动视图，当在一个屏幕的提示显示不下布局的UI控件时，可以采用滑动的方式，使控件显示。ScrollView`原来是一个`FrameLayout的容器，不过在他的基础上添加了滚动，允许显示的比实际多的内容。

## XML中常用属性介绍

1。`android:fadingEdge="none"`

无（边框颜色不变），水平（水平方向颜色变淡），垂直（垂直方向颜色变淡）。

2。`android:overScrollMode="never"`

删除`ScrollView`拉到尽头（顶部，底部），然后继续拉出现的阴影效果，适用于2.3及以上的否则不用设置。

3。`android:scrollbars="none"`

设置滚动条显示，无（隐藏），水平（水平），垂直（垂直）。

4。`android:descendantFocusability=""`

该属性是当一个为视图获取焦点时，定义`ViewGroup`状语从句：其子控件两者之间的关系。
属性的值有三种：

```java
beforeDescendants	//viewgroup会优先其子类控件而获取到焦点
afterDescendants	//viewgroup只有当其子类控件不需要获取焦点时才获取焦点
blocksDescendants	//viewgroup会覆盖子类控件而直接获得焦点
```

5.`android:fillViewport=“true"`

这是`ScrollView`独有的属性，定义为`ScrollView`对象是否需要拉伸内部内容来
`viewport`填充。通俗而言，就是允许`ScrollView`去`ScrollView`填充整个屏幕。插入的子控件高度达不到屏幕高度时，虽然`ScrollView`高度设置了`match_parent`，也无法充满整个屏幕，需要设置`android:fillViewport=“true"`使`ScrollView`填充整个页面，给`ScrollView`设置背景颜色能够体现。

### 使用常见问题

1. 嵌套ListView问题

   使用NestedScrollView（推荐）

   ```xml
           <androidx.core.widget.NestedScrollView
               android:layout_width="match_parent"
               android:layout_height="match_parent"
               android:fillViewport = "true"
               android:background="@color/bg_color">
               <LinearLayout
                   android:layout_width="match_parent"
                   android:layout_height="match_parent"
                   android:orientation="vertical">
               
               		......
               
                </LinearLayout>
           </androidx.core.widget.NestedScrollView>
   ```

   或者自定义ListView，在onMeasure方法中计算ListView的高度（不推荐）

   ```java
   
   public class ScrollListView extends ListView {
       public ScrollListView(Context context) {
           super(context);
       }
    
       public ScrollListView(Context context, AttributeSet attrs) {
           super(context, attrs);
       }
    
       @Override
       protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
           int height = MeasureSpec.makeMeasureSpec(Integer.MAX_VALUE >> 2, MeasureSpec.AT_MOST);
           super.onMeasure(widthMeasureSpec, height);
       }
   
   ```

   

2. 解决原生setOnScrollChangeListener() 需要在API23+的限制

   ```java
   public class ObservableScrollView extends ScrollView {
       private List<ScrollViewListener> listeners = new ArrayList<>();
   
       public interface ScrollViewListener {
           void onScrollChanged(ObservableScrollView scrollView, int x, int y, int oldx, int oldy);
       }
   
       public ObservableScrollView(Context context) {
           super(context);
       }
   
       public ObservableScrollView(Context context, AttributeSet attrs) {
           super(context, attrs);
       }
   
       public ObservableScrollView(Context context, AttributeSet attrs, int defStyleAttr) {
           super(context, attrs, defStyleAttr);
       }
   
       public void addScrollViewListener(ScrollViewListener listener) {
           listeners.add(listener);
       }
   
       public void removeScrollViewListener(ScrollViewListener listener) {
           listeners.remove(listener);
       }
   
       public void removeAllListener() {
           listeners.clear();
       }
   
       @Override
       protected void onScrollChanged(int x, int y, int oldx, int oldy) {
           super.onScrollChanged(x, y, oldx, oldy);
           for (ScrollViewListener listener : listeners) {
               if (listener != null) {
                   listener.onScrollChanged(this, x, y, oldx, oldy);
               }
           }
       }
   }
   
   ```

   

3. ScrollView 布局不能撑满全屏的问题

   >当适配小屏幕手机上高度不够全部显示的时候，往往会使用 ScrollView 包裹最外层布局 LinearLayout，这样就会解决在小屏幕手机上显示不全的问题; 但同时也带来了新的问题, 那就是在大屏幕手机上下面会留白，问题的解决办法是在最外层 布局外包裹一层 ScrollView, 并将中ScrollView 的android:fillViewport 设置为 true;
   >
   >当 ScrollView 没有 fillVeewport=“true”时, 里面的元素(比如LinearLayout)会按照wrap_content来计算(不论它是否设了”fill_parent”), 而如果LinearLayout的元素设置了fill_parent,那么也是不管用的，因为LinearLayout依赖里面的元素，而里面的元素又依赖 LinearLayout,这样自相矛盾.所以里面元素设置了fill_parent，也会当做wrap_content来计算.
   >————————————————
   >版权声明：本文为CSDN博主「青雨xh」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
   >原文链接：https://blog.csdn.net/u010784887/article/details/79052818

4. 实现快速滚动：FastScrollViewScrollVIew 

   ```java
   public class FastScrollView extends ScrollView {
   
       private float scrollY;
       private int ratio = 2;
   
       public FastScrollView(Context context) {
           super(context);
       }
   
       public FastScrollView(Context context, AttributeSet attrs) {
           super(context, attrs);
       }
   
       public FastScrollView(Context context, AttributeSet attrs, int defStyleAttr) {
           super(context, attrs, defStyleAttr);
       }
   
       @Override
       public boolean onTouchEvent(MotionEvent ev) {
           switch (ev.getAction()) {
               case MotionEvent.ACTION_DOWN:
                   scrollY = ev.getY();
                   break;
               default:
                   if (Math.abs(scrollY - ev.getY()) >= UIKitEnvi.screenHeight * 0.3f) {
                       ratio = 8;
                   } else {
                       ratio = 2;
                   }
           }
           return super.onTouchEvent(ev);
       }
   
       @Override
       public void fling(int velocityY) {
           super.fling(velocityY * ratio);
       }
   
   }
   ```
