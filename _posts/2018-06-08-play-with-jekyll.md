---
layout: post
title: "玩转jekyll+github搭建个人博客"
categories: jekyll
---
# 玩转jekyll主题，搭建赏心悦目的个人博客
之前选择云服务器+Wordpress搭建了一个技术博客，详情可查看 [Ubuntu下搭建LNMP环境安装wordpress]()。不过文章没有写几篇，一年的特价服务器倒快要到期了。看了续费的金额觉得不值，都没怎么用呀，只是布置好了环境。听说github也可以搭建博客，于是尝试了一下github + jekyll。

对比下来，github + jecyll更加专注与写作，是写技术博客的程序员更好的选择。

- 首先，可以省下一笔服务器的费用，还可以不用公共域名再省下一笔
- 保存在github上，不用担心网站被黑，也不用担心资料丢失
- 书写体验非常流畅，直接操作本地的一个文件夹下的md文档
- 没有数据库或者php的操作，专注于文字内容

##搭建过程

网上的帖子很多，这里贴一下我用的

- [jekyll+github搭建个人博客](https://www.cnblogs.com/yehui-mmd/p/6286271.html)
- [GitHub + Jekyll 搭建并美化个人网站](https://www.jianshu.com/p/85ca31174488)
- [github官方教程](https://pages.github.com/)
- [jekyll中文版文档](https://www.jekyll.com.cn/docs/home/)

##使用主题

[Jekyll Themes](https://link.jianshu.com?t=http://jekyllthemes.org/)

https://jasonlong.github.io/cayman-theme/

[**jekyll-cayman-theme**](https://github.com/pietromenna/jekyll-cayman-theme)

下载下来相关的主题，拷贝index.html到自己github仓库的主目录下面就好了，文章一般写在_post文件夹中，各种页面链接可以通过HTTP URL 或者本地绝对路径与相对路径来设置。

##遇到的坑
```
---
layout: post
title: "玩转jekyll+github搭建个人博客"
date: 2018-06-08 16:30:00
categories:jekyll
---
```

这里只要设置了date行，如果时间是2018年，就无法正常生成html文件与索引，标题上已有书简，一般无需设置date行。