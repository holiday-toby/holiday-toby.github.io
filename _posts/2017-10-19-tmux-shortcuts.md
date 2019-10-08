---
layout: default
title:  "tmux常规使用手册"
date:   2017-10-19 17:50:00
categories: linux 
---

#### 修改快捷键
查看prefix现有绑定键：
```
 tmux show-options -g | grep prefix

```
要在tmux内置命令中修改及时生效，可在终端中输入以下命令：
```
tmux set -g prefix C-x
tmux unbind C-b
tmux bind C-x send-prefix
```
要永久生效，则在创建或修改系统级的/etc/tmux.conf或用户级的~/.tmux.conf，里面的内容是上面三个单独命令集，如下：
```
 set -g prefix C-x
 unbind C-b
 bind C-x send-prefix
```
这个不是及时生效，需要重启系统
####  常用的快捷键
session指的是按下tmux命令后 存在的连接便是session
```
//创建session
tmux

//创建并指定session名字
tmux new -s $session_name

//删除session
Ctrl+b :kill-session

//临时退出session
Ctrl+b d

//列出session
tmux ls

//进入已存在的session
tmux a -t $session_name

//删除所有session
Ctrl+b :kill-server

//删除指定session
tmux kill-session -t $session_name
```
window在session里，可以有N个window，并且window可以在不同的session里移动
```
//创建window
Ctrl+b +c

//删除window
Ctrl+b &

//下一个window
Ctrl+b n

//上一个window
Ctrl+b p

//重命名window
Ctrl+b ,

//在多个window里搜索关键字
Ctrl+b f

//在相邻的两个window里切换
Ctrl+b l
```
pane在window里，可以有N个pane，并且pane可以在不同的window里移动、合并、拆分

```
//创建pane
//横切split pane horizontal
Ctrl+b ” (问号的上面，shift+’)

//竖切split pane vertical
Ctrl+b % （shift+5）

//按顺序在pane之间移动
Ctrl+b o

//上下左右选择pane
Ctrl+b 方向键上下左右

//调整pane的大小
Ctrl+b :resize-pane -U #向上
Ctrl+b :resize-pane -D #向下
Ctrl+b :resize-pane -L #向左
Ctrl+b :resize-pane -R #向右
在上下左右的调整里，最后的参数可以加数字 用以控制移动的大小，例如：
Ctrl+b :resize-pane -D 50

//在同一个window里左右移动pane
Ctrl+b { （往左边，往上面）
Ctrl+b } （往右边，往下面）

//删除pane
Ctrl+b x
//更换pane排版
Ctrl+b “空格”

//移动pane至window
Ctrl+b !

//移动pane合并至某个window
Ctrl+b :join-pane -t $window_name

//显示pane编号
Ctrl+b q

//按顺序移动pane位置
Ctrl+b Ctrl+o
```
其他：
```
复制模式
Ctrl+b [
空格标记复制开始，回车结束复制。

//粘贴最后一个缓冲区内容
Ctrl+b ]

//选择性粘贴缓冲区
Ctrl+b =

//列出缓冲区目标
Ctrl+b :list-buffer

//查看缓冲区内容
Ctrl+b :show-buffer

//vi模式
Ctrl+b :set mode-keys vi

//显示时间
Ctrl+b t

//快捷键帮助
Ctrl+b ? (Ctrl+b :list-keys)

//tmux内置命令帮助
Ctrl+b :list-commands
```
参考：[tmux常用命令与快捷键](https://www.jianshu.com/p/71999b35ead7)
