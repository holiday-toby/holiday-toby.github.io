# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:/usr/local/mysql/bin:/Users/ldh/Library/Android/SDK/platform-tools:$PATH

# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load. Optionally, if you set this to "random"
# it'll load a random theme each time that oh-my-zsh is loaded.
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Uncomment the following line to use case-sensitive completion.
CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# The optional three formats: "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git textmate ruby autojump osx mvn gradle vi-mode)

source $ZSH/oh-my-zsh.sh
#shell中开启vim编辑模式
set -o vi
EDITOR=vim
sxport EDITOR
#[[-s ~/.autojump/etc/profile.d/autojump.sh]]&&. ~/.autojump/etc/profile.d/autojump.sh
# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
 alias rm='rm -i'
 alias zshconfig="mate ~/.zshrc"
 alias ohmyzsh="mate ~/.oh-my-zsh"
 alias ajp="adb shell screencap /sdcard/screen.png && adb pull /sdcard/screen.png /Users/ldh/Desktop && adb shell rm /sdcard/screen.png"
 alias gitlog="git log --pretty=format:'%Cred%h%Creset - %s %C(yellow)(%ar %ad) %Cblue <%an>' --graph"
 #查看端口信息
 alias lsofm="lsof -n -P -i TCP -s TCP:LISTEN"
 #当前目录生成.ctag文件
 alias ctags="/usr/local/bin/ctags -R -f .tags"
 #查看当前目录文件大小
 alias dush="du -sh *"
#漂亮又实用的命令高亮界面
setopt extended_glob
 TOKENS_FOLLOWED_BY_COMMANDS=('|' '||' ';' '&' '&&' 'sudo' 'do' 'time' 'strace')
  
   recolor-cmd() {
        region_highlight=()
        colorize=true
        start_pos=0
        for arg in ${(z)BUFFER}; do
            ((start_pos+=${#BUFFER[$start_pos+1,-1]}-${#${BUFFER[$start_pos+1,-1]## #}}))
            ((end_pos=$start_pos+${#arg}))
            if $colorize; then
               colorize=false
               res=$(LC_ALL=C builtin type $arg 2>/dev/null)
               case $res in
                    *'reserved word'*)   style="fg=magenta,bold";;
                    *'alias for'*)       style="fg=cyan,bold";;
                    *'shell builtin'*)   style="fg=yellow,bold";;
                    *'shell function'*)  style='fg=green,bold';;
                    *"$arg is"*)
                        [[ $arg = 'sudo' ]] && style="fg=red,bold" || style="fg=blue,bold";;
                    *)                   style='none,bold';;
                    esac
                    region_highlight+=("$start_pos $end_pos $style")
               fi
               [[ ${${TOKENS_FOLLOWED_BY_COMMANDS[(r)${arg//|/\|}]}:+yes} = 'yes' ]] && colorize=true
               start_pos=$end_pos
          done
   }
check-cmd-self-insert() { zle .self-insert && recolor-cmd }
check-cmd-backward-delete-char() { zle .backward-delete-char && recolor-cmd }
                                                
zle -N self-insert check-cmd-self-insert
zle -N backward-delete-char check-cmd-backward-delete-char
####
if which pyenv > /dev/null; then eval "$(pyenv init -)"; fi
export PYENV_ROOT=/usr/local/var/pyenv
