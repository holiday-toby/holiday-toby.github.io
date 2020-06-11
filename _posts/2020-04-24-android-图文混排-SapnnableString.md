---
layout: post
title: "android中实现图文混排"
category: other
---
UI设计师需要实现如下图的效果，图中的描述信息由4个部分+3个分割线组成，这里如果使用多个view无法合理的换行（最后一个textview换行会导致展示错乱），发现用SpannableStringBuilder 来实现是最方便的选择。

这应该也是聊天中文字表情混排的基本实现。

<img src="https://cdn.jsdelivr.net/gh/holiday-toby/imageBed@master/uPic/device-2020-04-24-115428.png" style="zoom:50%">


1. xml中写分割线
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <layer-list xmlns:android="http://schemas.android.com/apk/res/android">

       <item>
           <shape android:shape="rectangle">
               <size
                   android:width="10dp"
                   android:height="8dp" />
               <solid android:color="@color/tranparent" />
           </shape>
       </item>
       <item android:gravity="center_horizontal">
   
           <shape android:shape="rectangle">
               <solid android:color="#e6e6e6" />
   
               <size
                   android:width="0.5dp"
                   android:height="8dp" />
   
               <padding
                   android:left="5dp"
                   android:right="5dp" />
           </shape>
   
       </item>
   </layer-list>
   
   ```
   
   这里考虑到了图片左右各有5dp的间距
   
   还有一种绘制方式，使用矢量图更加简洁灵活
   
   ```xml
   <vector xmlns:android="http://schemas.android.com/apk/res/android"
       android:width="10dp"
       android:height="8dp"
       android:viewportWidth="10"
       android:viewportHeight="8">
   
   
       <path
           android:name="septalLine"
           android:pathData="M 5,0 l 0,10"
           android:strokeWidth="0.5"
           android:strokeAlpha="1"
           android:strokeColor="@color/septalLineColor" />
   
   </vector>
   ```
   
   
   
2. 创建SpannableStringBuilder

   ```java
       public SpannableStringBuilder getCaseInfoMsg(Context context) {
           String iconPlaceholder = "[icon]";
           SpannableStringBuilder spannable = new SpannableStringBuilder(styleName);
           spannable.append(iconPlaceholder);
           Drawable drawable = context.getResources().getDrawable(R.drawable.linear_divider_double_list);
           drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
   
           CenterAlignImageSpan imageSpan1 = new CenterAlignImageSpan(drawable, ImageSpan.ALIGN_BASELINE);
   
           spannable.setSpan(imageSpan1, spannable.length() - 6, spannable.length(), Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
   
           spannable.append(getHouseTypeStr()).append(iconPlaceholder);
   
           CenterAlignImageSpan imageSpan2 = new CenterAlignImageSpan(drawable, ImageSpan.ALIGN_BASELINE);
   
           spannable.setSpan(imageSpan2, spannable.length() - 6, spannable.length(), Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
   
           spannable.append(areaNum).append(iconPlaceholder);
   
           CenterAlignImageSpan imageSpan3 = new CenterAlignImageSpan(drawable, ImageSpan.ALIGN_BASELINE);
   
           spannable.setSpan(imageSpan3, spannable.length() - 6, spannable.length(), Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
           spannable.append(amount);
           return spannable;
       }
   ```
   附一下让Image与文字居中的CenterAlignImageSpan
   ```java
   public class CenterAlignImageSpan extends ImageSpan {
   
       public CenterAlignImageSpan(Drawable d) {
           super(d);
       }
   
       public CenterAlignImageSpan(Drawable d, int verticalAlignment) {
           super(d, verticalAlignment);
       }
   
       @Override
       public void draw(@NonNull Canvas canvas, CharSequence text, int start, int end, float x, int top, int y, int bottom,
                        @NonNull Paint paint) {
           Drawable drawable = getDrawable();
           Paint.FontMetricsInt fm = paint.getFontMetricsInt();
           //计算y方向的位移
           int translationY = (y + fm.descent + y + fm.ascent) / 2 - drawable.getBounds().bottom / 2;
           canvas.save();
           //绘制图片位移一段距离
           canvas.translate(x, translationY);
           drawable.draw(canvas);
           canvas.restore();
       }
   }
   ```

3. 在xml中使用

   ```xml
   <TextView
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@{viewModel.getCaseInfoMsg(context)}"
       android:textColor="#0b0f12"
       android:textSize="12sp"
       tools:text="浦东" />
   ```
   
   *** 注释：使用databinding时context可以不声明直接使用 ***
   
4. 图片被截取问题
   <img src="https://cdn.jsdelivr.net/gh/holiday-toby/imageBed@master/uPic/device-2020-04-24-122125.png" style="zoom:60%">
   
   这里有一个注意点 ，如果Imageview比较大的时候，如果居中展示可能底部会被截取一部分，这时候需要给TextView设置android:paddingBottom。
   ```xml
       <TextView
             android:id="@+id/tv_prompt2"
             android:layout_width="wrap_content"
             android:layout_height="wrap_content"
             android:layout_marginTop="30dp"
             android:paddingBottom="10dp"
             android:text="2. 点击右下角“相册” [icon] ，识别二维码"
             android:textColor="#0b0f12"
             android:textSize="14sp"/>
   ```
![截屏2020-04-24 下午12.17.37](https://cdn.jsdelivr.net/gh/holiday-toby/imageBed@master/uPic/截屏2020-04-24%20下午12.17.37.png)
   

