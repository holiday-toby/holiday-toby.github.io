---
layout: post
title: "termux手机终端快速配置"
category: tools
---


感谢各位大牛们的分享，我这里只做备忘，就不再详细描述了
[Termux 高级终端安装使用配置教程](http://www.sqlsec.com/2018/05/termux.html)
### 1.google应用商店下载Termux
### 2.基本操作，右滑会展示导航栏，长按屏幕
```
长按屏幕
├── COPY:复制
├── PASTE:更多
├── More:更多
   ├── Select URL: 选择网址
   └── Share transcipt: 分享命令脚本
   └── Reset: 重置
   └── Kill process: 杀掉当前终端会话进程
   └── Style: 风格配色
   └── Help: 帮助文档
```
### 3.使用pgk install 命令安装htop man openssh tree vim curl git wget unzip unrar...与apt命令通用
```shell
pkg search <query>              搜索包
pkg install <package>           安装包
pkg uninstall <package>         卸载包
pkg reinstall <package>         重新安装包
pkg update                      更新源
pkg upgrade                     升级软件包
pkg list-all                    列出可供安装的所有包：
pkg list-installed              列出已经安装的包
pkg shoe <package>              显示某个包的详细信息
pkg files <package>             显示某个包的相关文件夹路径

cat /etc/shells                 查看系统中已安装的shell
chsh -s /bin/zsh                设置zsh为当前用户默认shell

如果需要修改源
export EDITOR=vi 
apt edit-sources

或者vi  $PREFIX/etc/apt/sources.list

安装基本工具
pkg update
pkg install vim curl git wget unzip unrar

```
安装git需[配置ssh信息](https://blog.csdn.net/hustpzb/article/details/8230454/)  
git config --global user.name "ldh"  
git config --global user.email "lin@gmail.com"

### 4.安装termux-ohmyzsh
在oh-my-zsh基础上有改动，添加了命令颜色信息
```
sh -c "$(curl -fsSL https://github.com/Cabbagec/termux-ohmyzsh/raw/master/install.sh)"
#如果安装失败，home目录下手动创建termux-ohmyzsh，然后再次手动安装

#再次运行配置文件 ,选择背景色默认14，字体6
~/termux-ohmyzsh/install.sh
```
### 5.使用htop 查看系统中正在运行的进程 
[htop使用详解](http://www.178linux.com/4394)
### 6.使用cheat sheet查看代码提示 
```shell
curl https://cht.sh/:cht.sh > /bin/cht.sh
chmod +x /bin/cht.sh
```
### 7.需要root权限，推荐安装proot
然后也可以操作storage 中的文件
```shell
pkg install proot
termux-chroot
```
### 8.使用python 继续安装python ,vim-python 

