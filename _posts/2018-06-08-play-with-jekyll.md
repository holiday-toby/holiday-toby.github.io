---
layout: post
title: "玩转jekyll主题，搭建赏心悦目的个人博客"
categories: jekyll
---
# 玩转jekyll主题，搭建赏心悦目的个人博客
之前选择云服务器+Wordpress搭建了一个技术博客，详情可查看 [Ubuntu下搭建LNMP环境安装wordpress]()。不过文章没有写几篇，一年的特价服务器倒快要到期了。看了续费的金额觉得不值，都没怎么用呀，只是布置好了环境。听说github也可以搭建博客，于是尝试了一下github + jekyll。

对比下来，github + jecyll更加专注与写作，是写技术博客的程序员更好的选择。

- 首先，可以省下一笔服务器的费用，还可以不用公共域名再省下一笔
- 保存在github上，不用担心个人简陋的网站被黑，也不用担心资料丢失
- 书写体验非常流畅，直接操作本地的一个文件夹下的md文档
- 也没有数据库、html或者php的操作，专注于文字创作

## 搭建过程

网上的帖子很多，这里贴一下我用的

- [jekyll+github搭建个人博客](https://www.cnblogs.com/yehui-mmd/p/6286271.html)

- [GitHub + Jekyll 搭建并美化个人网站](https://www.jianshu.com/p/85ca31174488)

- [github官方教程](https://pages.github.com/)

- [jekyll中文版文档](https://www.jekyll.com.cn/docs/home/)

**具体步骤**
1. github创建一个同名仓库，yourGithubName.github.io

2. 打开setting ->githubPages中->选择main分支，选择一个主题，然后

  ```
  ~ $git clone 你的仓库路径
  ~ $cd yourGithubName.github.io
  ~ $echo "hello world" >> README.md
  ~ $git add .
  ~ $git commit -m "first commit"
  ~ $git push -u origin/main
  ```
   这时候打开yourGithubName.github.io显示的是README.md中的内容

3. 本地安装Jekyll
    ```
    # Install Jekyll and Bundler gems through RubyGems
    ~ $gem install jekyll bundler
    
    # Create a new Jekyll site at ./myblog
    ~ $jekyll new myblog
    
    # Change into your new directory
    ~ $cd myblog
    
    # Build the site on the preview server
    ~ $bundle exec jekyll serve
    
    # => Now browse to http://localhost:4000
    
    或者直接
    ~/myblog$jekyll serve
    
    注： Jekyll server 其实可以在任何一级目录下使用，都会基于当前目录下的内容生成_site文件夹
    ```
    这样打开的是一个默认主题的jekyll网站，将myblog下的内容复制到yourGithubName.github.io目录下，执行jekyll serve可以预览，push到github就可以浏览示例网站了

## 使用主题

上面的过程使用的是jekyll自带的默认主题，如果更换主题，需要下载对应的资源，并替换git文件夹根目录下的内容

[Jekyll Themes](https://link.jianshu.com?t=http://jekyllthemes.org/)

[本博客使用的Jekyll主题模版](https://jasonlong.github.io/cayman-theme/)

[**jekyll-cayman-theme源码**](https://github.com/pietromenna/jekyll-cayman-theme)

下载下来相关的主题，拷贝覆盖到自己github仓库的主目录下面就好了，文章一般写在_post文件夹中，各种页面链接可以通过HTTP URL 或者本地绝对路径与相对路径来设置。

之前主题一些附属的资源最好在覆盖之前手动清一下，只保留下来自己的博客与资源文件夹，避免庸余的资源。

## 遇到的坑
```
---
layout: post
title: "玩转jekyll+github搭建个人博客"
date: 2018-06-08 16:30:00
categories:jekyll
---
```

有时候会遇到设置了date行，jekyll主题无法正常生成html文件与索引。这个时候可以删除date行。配置标题上已有时间，一般无需设置date行。

<p>Small images should be shown at their actual size.</p>
<p><a href="https://camo.githubusercontent.com/16a9d5241f679b6429fc0597f10816dd2665bbb2/687474703a2f2f706c6163656b697474656e2e636f6d2f672f3330302f3230302f" target="_blank"><img src="https://camo.githubusercontent.com/16a9d5241f679b6429fc0597f10816dd2665bbb2/687474703a2f2f706c6163656b697474656e2e636f6d2f672f3330302f3230302f" alt="" data-canonical-src="https://placekitten.com/g/300/200/" style="max-width:100%;"></a></p>
    
<p>Large images should always scale down and fit in the content container.</p>
    
<p><a href="https://camo.githubusercontent.com/afe46418285497605cf4f6376b75f8c818658fb1/687474703a2f2f706c6163656b697474656e2e636f6d2f672f313230302f3830302f" target="_blank"><img src="https://camo.githubusercontent.com/afe46418285497605cf4f6376b75f8c818658fb1/687474703a2f2f706c6163656b697474656e2e636f6d2f672f313230302f3830302f" alt="" data-canonical-src="https://placekitten.com/g/1200/800/" style="max-width:100%;"></a></p>

<pre><code>This is the final element on the page and there should be no margin below this.</code></pre>

