---
layout: post
title: "android开发小技巧之覆盖资源文件"
category: other
---

### 背景

有时候我们开发中用到了google官方或者第三方SDK里面的一些UI组件，但是又不完全满足我们设计师的需求，需要修改其中的部分样式或者图片，这个时候通过新增同名的资源文件来覆盖原有的xml或者图片就是一个非常方便优雅的解决方案。

### 示例一，自定义BottomNavigationView的样式

[使用谷歌官方BottomNavigationView实现非md风格的底部状态栏](https://www.jianshu.com/p/24278f3259b3)

这个是Google的模版Activity中提供的新控件，支持页面底部导航+多个fragment来回切换的效果，不需要viewpager，不支持左右滑动。

默认是material风格的，如果需要定制自己的风格，就需要去调整部分属性，或者完全定制自己的布局文件，来覆盖掉系统的item布局。

>在BottomNavigationItemView这个类中, 发现每个item的布局加载:
>LayoutInflater.from(context).inflate(layout.design_bottom_navigation_item, this, true);
>我们可以自定义这个布局, 替换原始实现, 从而随意的定制自己的UI.
>先看看谷歌的这个布局文件是怎么做的:
>https://github.com/dandar3/android-support-design/blob/master/res/layout/design_bottom_navigation_item.xml
>不列出来的. 然后依葫芦画瓢, 实现自己的一份:



### 示例二，接入第三方聊天SDK，但是需要修改UI样式

自家的app中接入的其他部门提供的微聊SDK，这个微聊SDK由于面向很多业务线，不同业务线的产品风格不一。由于风格是需要自己来定义的，引入的时候需要去修改SDK的UI层代码，于是开放了UI层的代码给我们。

但是随着改动与定制的增加，每次在版本升级的时候，都需要去修改SDK的UI层的代码工作量也越来越大，非常不方便。需要比对之前的代码找出之前修改的地方，然后引入到新的SDK的UI层源码中。。。。

理想的方法当然是不对UI层做任何修改，直接通过AAR的包完整引入进来，这个时候通过继承覆盖java方法实现，通过同名资源文件去覆盖SDK中的布局效果，就是一种比较理想的方案。可以尽量减少对SDK源码的改动，只到完全不需要去修改SDK中的代码。

- 覆盖themes，修改colors的值
- 覆盖布局文件，定制一些小的UI差异
- 覆盖图片，修改默认头像
- 重写BaseActivity，实现新的ActionBar