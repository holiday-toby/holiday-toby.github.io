---
layout: default
title:  "从Vim到NeoVim一些配置备案"
date:   2017-09-30 17:50:00
categories: linux 
---
##从Vim到NeoVim一些配置备案

### neovim优点

- 通过简化维护以改进 Bug 修复及特性添加的速度；
- 分派各个开发人员的工作；
- 实现新的、现代化的用户界面，而不必修改核心源代码；
- 利用新的、基于协同进程的新插件架构改善扩展性，并支持使用任何语言编写插件；
### 安装neovim
```
#For mac
brew install neovim
#For ubuntu
apt-get install neovim
#打开命令及检查
nvim
:checkhealth
```
### 安装space-vim，自动配置
#### Vim-Plug 
Vim-Plug的杀手级特性：按需加载控件
Vundle是之前Vim插件管理比较流行的工具。转向使用Vim-Plug，最大的原因还在于相比Vundle，所有的插件更新和安装都是并行的，这样比Vundle效率提升了不是一点半点。

```
" 让NERDTree插件，在第一次被触发的时候才加载
Plug 'scrooloose/nerdtree', { 'on': 'NERDTreeToggle' }

" 让YCM插件在打开go源代码文件时才被加载
Plug 'Valloric/YouCompleteMe', { 'for': 'go' }
```
[从vim到Neovim](https://xiaozhou.net/from-vim-to-neovim-2016-05-21.html)