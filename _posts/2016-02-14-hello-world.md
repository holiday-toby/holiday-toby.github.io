---
layout: post
title: "hello world"
category: jekyll
---

[TOC]

## hello world

[jekyll主题readme的html版](/webpages/README.html)  
[Markdown 语法汇总](https://blog.csdn.net/liubingzhao/article/details/79512393)  
[MarkDown高级语法：表格、流程图等如何制作](https://jingyan.baidu.com/article/8275fc8671073a46a03cf6f5.html)  

### 一、基本语法

>图片展示
![aa](../images/mv.png "图片标题")

1. 水平线  
三个「 - 」或「 * 」都可以画出一条水平分割线

-----
***
2. 图片展示
    ![jpeg图片](https://cdn.jsdelivr.net/gh/duanholiy/imageBed@master/uPic/mv.jpeg  "妹子")
3. 换行操作  
    行尾两个空格+enter(vim中需要使用)
4. 粗体与斜体
    **这个是粗体** 
    *这个是斜体* 
    ***这个是粗体加斜体***

### 二、制作高级列表

##### 可选择列表

- [x] Markdown语法简介
- [ ] Markdoen高级语法

##### 有序列表

1.    hello
2. world
3. how
4. are
5. you  

##### 无序列表与包含引用的列表
- 你来自何方

    > 自东土大唐而来  

- 要前往何处

    > 前往西天取经

###三、 制作表格  

|学号  |  姓名  |   攻击|防御 |魅力 | 生命值 |
|------| ------: |:------:|------|------|------|
|1001  | 景天| 75| 90 | 80 | |
| 1002| 雪见|75 | 80 | 80 | |
|1003 | 龙葵| 80 | 70 | 88 | |
| 1004 | 紫萱 | 90 | 80 | 86 | |
| 1005 | 小白 | 88 | 86 | 78 | |



### 四、制作流程图

作者：Jlan
链接：https://www.jianshu.com/p/02a5a1bf1096
來源：简书

```flow
st=>start: Start
op=>operation: Your Operation
op2=>operation:hello world
cond=>condition: Yes or No?
e=>end

st->op->cond
cond(no)->op
cond(yes)->e

```

```flow
st=>start: 开始
op=>operation: 输入x
op2=>operation: 输入y
op3=>operation: 计算z = x+y
e=>end: 输出z

st->op->op2->op3
op3->e
```
这样几行简单的代码就生成了一个优雅的流程图。
流程图大致分为两段，第一段是定义元素，第二段是定义元素之间的走向。  
#### 定义元素的语法
```
tag=>type: content:>url
```
 1. tag就是元素名字，
 2. type是这个元素的类型，有6种类型，分别为：

 >- start # 开始
 - end           # 结束
 - operation     # 操作
 - subroutine    # 子程序
 - condition     # 条件
 - inputoutput   # 输入或产出

3. content就是在框框中要写的内容，注意type后的冒号与文本之间一定要有个空格。
4. url是一个连接，与框框中的文本相绑定  

#### 连接元素的语法
用->来连接两个元素，需要注意的是condition类型，因为他有yes和no两个分支，所以要写成
```
c2(yes)->io->e
c2(no)->op2->e
```

#### 实际应用
下边献上我的拙作，这是一个爬取某网站的商品评论数据，然后进行情感分析的小项目，有四个模块：获取待爬取商品id，爬取代理，爬取评论，情感分析

```flow
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End:>http://www.google.com
op1=>operation: get_hotel_ids|past
op2=>operation: get_proxy|current
sub1=>subroutine: get_proxy|current
op3=>operation: save_comment|current
op4=>operation: set_sentiment|current
op5=>operation: set_record|current

cond1=>condition: ids_remain空?
cond2=>condition: proxy_list空?
cond3=>condition: ids_got空?
cond4=>condition: 爬取成功??
cond5=>condition: ids_remain空?

io1=>inputoutput: ids-remain
io2=>inputoutput: proxy_list
io3=>inputoutput: ids-got

st->op1(right)->io1->cond1
cond1(yes)->sub1->io2->cond2
cond2(no)->op3
cond2(yes)->sub1
cond1(no)->op3->cond4
cond4(yes)->io3->cond3
cond4(no)->io1
cond3(no)->op4
cond3(yes, right)->cond5
cond5(yes)->op5
cond5(no)->cond3
op5->e
```

这个流程图有个问题，我希望ids_remain的两个条件都为空，但是markdown语法没法实现我这需求（不知道我这需求是不是有毛病），只能先这样画着了。

#### 练习
```flow
st=>start: 开始
op=>operation: 输入x 和 y
op3=>operation: 计算z = x+y
cond=>condition: z>=0
op2=>operation: x+=1,y+=1
e=>end: 输出z

st->op->op3->cond
cond(yes)->e
cond(no)->op2->op3
```



