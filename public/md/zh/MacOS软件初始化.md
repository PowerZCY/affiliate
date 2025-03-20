---
id: "macos-init-software"
title: "MacOS软件初始化"
slug: "macos-init-software"
excerpt: "Mac OS好用软件，20年+骨灰级玩家鼎力推荐，好用到爆！！"
tags: ["tutorials", "insights"]
author:
  name: "帝八哥"
  avatar: "/images/default.webp"
publishedAt: "2020-04-25"
imageUrl: "/images/default.webp"
featured: false
---

# MacOS软件初始化
- 输入法切换快捷键`cmd+alt+sft+space`, 禁用其他快捷键✅
- Google账号✅
- Apple账号✅
- Iterm2配置文件✅
- IDEA配置文件✅
- 软件及其安装指南✅

## 软件列表
- iterm2+OHMyZSH+基础脚本
- VPN
- Chrome+Google账号+扩展程序
  - Adblock Plus
  - cookies.txt
  - EditThisCookie
  - Enhanced GitHub
  - GitHub Isometric Contributions
  - GitHub加速, GitHub--Gitee
  - Google Chrome的超级拖曳
  - JetBrains Toolbox Extension
  - Octotree - GitHub code tree
  - The Great Suspender
  - 划词翻译
- JetBrains, ToolBox
- IDEA
  - Maven Helper
  - LaoYouTiao
  - D8gerAutoCode
  - END
  - Translation
  - iBATIS/MyBatis plugin
  - Key Promoter X
  - Rainbow Brackets
  - AsciiDoc
  - Arthas Idea
- Redis客户端: Another Redis Desktop Manager
- Zookeeper客户端: PrettyZoo
- GC日志分析: 离线GCViewer
- 压缩解压: The Unarchiver
- App Store
  - Downlink
  - Magnet
  - Manico
  - Xnip
  - CheatSheet
- Linux工具
  - sshpass
  - Graph::Easy
  - D8gerConcurrent
  - httpie
  - python3
  - pip3, 走国内清华大学镜像

### MacOS好用软件(brew命令行安装)

```plaintext
autojump    快速目录跳转, 根据历史命令统计学习
gource      基于git项目提交日志, 动画展示代码树的生长过程
httpie      http(s)接口请求工具, 详细展示与格式化请求头及响应信息
lrzsz       上传下载命令支持
rename      批量修改文件名
sshpass     自动填充密码, 常用于服务器登录
thefuck     命令自动修正, 根据历史命令统计学习
tree        将目录树以层级方式展示
youtube-dl  音视频资源下载利器
ffmpeg      音频视频快速处理爽歪歪
ttygif      shell终端录像(回放), 并支持将录像生成gif文件
gifsicle    压缩gif文件
asciidoc    与pandoc配合将asciidoc文档转为makrdown格式
pandoc      与asciidoc配合将asciidoc文档转为makrdown格式
ohmyzsh     智能终端
Graph::Easy 用文本绘图写注释, 骚气十足(只能通过压缩包编译安装)
```

### MacOS好用软件(pip\|pip3命令行安装)

```plaintext
asciinema          shell终端录像, 生成的录像文件可以在终端播放, 相当于iterm2的历史回放('cmd' + 'alt' + 'B')
D8gerConcurrent    登录及简易并发测试
speedtest-cli      网速测试工具
rich               终端控制台富文本(Python引用包)
shell-functools    python中调用任何函数(Python引用包)
VerbalExpressions  正则利器(Python引用包)
```


## 使用示例
- **htop**, `htop`, 替代top命令 
- **autojump**
    - `git clone git://github.com/joelthelion/autojump.git`
    - `cd autojump && ./install.py`
    - 控制台输出信息会让你将如下配置写入.zshrc中
    - **`[[ -s /home/caofan/.autojump/etc/profile.d/autojump.sh ]] && source /home/caofan/.autojump/etc/profile.d/autojump.sh`**
    - 重新加载`.zshrc`配置
    - 然后使用`cd` 命令跳转一些目录, 让autojump'学习'跳转目录
    - `j 目录关键字`  
- **gource**, `gource`  
- **http**, `http或https www.baidu.com`  
- **lrzsz**, `rz -bey 选一个文件(上传覆盖)`, `sz -be 文件1 文件2...`  
- **rename**, `rename 原名 新名称 目录下匹配的文件`  
- **sshpass**, `shpass -f 密码文件(首行就是密码) ssh   用户名@服务器IP地址`  
- **thefuck**, 敲错命令来一发`fuck`  
- **tree**, `tree -CDgp -L 3`, **`-C`为颜色**\|**`-D`为时间**\|**`-g`为群组**\|**`-p`为权限**, **`-L 3` 限制只显示3层结构**  
- **youtube-dl**使用, 代理即为梯子
    - 安装: `pip3 install youtube-dl`
    - 更新: `pip3 install --upgrade youtube-dl`  
    - 查看解析视频网页信息, `youtube-dl --proxy http://127.0.0.1:1087/  -F  X视频网址X`  
    - 选择指定格式下载视频及最佳音频, `youtube-dl --proxy http://127.0.0.1:1087/  -f 视频编码编号+bestaudio  X视频网址X`  
    - 只下载音频(Music), `youtube-dl --proxy http://127.0.0.1:1087/  X视频网址X   -x --audio-format mp3`  
- **ffmpeg使用**  
    - 截取音频, 从0秒到6分18秒, `ffmpeg -ss 00:00:00 -t 00:06:18 -i  IN.mp3 OUT.mp3`  
    - 合并两个音频(混音), `ffmpeg -i input1.mp3 -i input2.mp3 -filter_complex amerge -ac 2 -c:a libmp3lame -q:a 4 output.mp3`  
    - 拼接两个音频(建立一个文件名txt), `ffmpeg -f concat -i xxx.txt -c out.mp3`  
    - 录屏转GIF或者mp4, `ffmpeg -ss 00:00:26 -t 7 -i D6.mov -r 15 D88-REGEX.gif`, `ffmpeg -ss 00:00:08 -t 686 -i D8-Manul.mov  D8-ManulUsage.mp4`  
    - 合成GIF, 同文件夹命名规律--转avi再转gif  
        - `ffmpeg -r 5 -i BUG_%d.png BUG.avi`  
        - `ffmpeg -i BUG.avi -pix_fmt rgb24 BUG.gif`  
        - `ffmpeg -f image2 -i 原文件目录/文件名匹配正则  -vcodec libx264  -r 10 OUTPUT.mp4 -y`  
        - `ffmpeg -r 1 -i INPUT -vf fps=1 -vcodec libx264 OUTPUT -y`  
- **shell终端录屏使用**
    - asciinema
        - 录制, asciinema rec FILENMAE.cast
        - 播放, asciinema play FILENMAE.cast
    - ttygif及gifsicle
        - 录制, ttyrec FILENMAE
        - 转换, ttygif FILENMAE -f
        - 压缩, gifsicle --colors 16 --scale 0.5  tty.gif -o TARGET-FILENAME.gif
- **asciidoc文档转markdown文档**
    - 确保已安装asciidoc, brew install asciidoc
    - 确保已安装pandoc, brew install pandoc
    - asciidoc -b TMP ORIGIN-FILENAME.adoc
    - iconv -t utf-8 ORIGIN-FILENAME.xml | pandoc -f TMP -t markdown_strict --wrap=none | iconv -f utf-8 > ORIGIN-FILENAME.md
- **D8gerConcurrent**
    - `pip3 install D8gerConcurrent`
    - `login`-cookie -h`
    - `easyhttp -h`

- **Graph::Easy**
    - 参见下文, 配合插件[LaoYouTiao](https://github.com/caofanCPU/LaoYouTiao/blob/master/README_CN.md)风味更佳

## MacOS好用软件(dmg界面安装)
![软件列表](http://file.debuggerpowerzcy.top/power/Mac-Software.png)
![IDEA插件列表](http://file.debuggerpowerzcy.top/power/IDEA-plugins.png)
- IDEA快捷键设置导入
- IDEA插件列表
- IDEA全局数据库链接设置
- 服务器连接设置

## MacOS安装文本式图形注释, **Graph::Easy**
- Graph::Easy
    - [下载安装包](http://file.debuggerpowerzcy.top/power/Graph-Easy-0.76.tar.gz)
    - 解压, **`tar -xzf G-E-xxx.tar`**
    - 切换到子目录, 检查环境 **`perl Makefile.PL`**
    - 执行测试, **`make test`**
    - root权限安装, **`sudo make install`**
    - 基础语法
        - 图的顶点, 也叫元素, 用**`[]`**包围, 也就是说**`[`**和**`]`**都是识别的关键字, 如要展示时使用, 用**`\[`**进行转义
        - 图的边缘, 也叫连接, 位于元素之间, 且必须以**`>`**结尾, 并且中间内容除注释外要镜像对称
            - **`-->`**    实线
            - **`=>`**     双实线
            - **`.>`**     点线
            - **`~>`**     波浪线
            - **`- >`**    虚线
            - **`.->`**    点虚线
        - 图的注释, 位于连接中, 最好用英文(否则图不能对齐), **且注释前后都必须有空格** 
        - 将图的定义写入**`a.txt`**文件中, 每行都可以指定图的关系, 然后使用 **`graph-easy a.txt`** 解析
        - 也可以将多行变为一行, 中间用空格分开即可, 见下面示例
- 入门示例
```shell
echo "[A]- send ->[B]-  backup - >[C]= back =>[A] [M]~ ticket ~>[N].-  auth  .->[O] " | graph-easy
输出:

+---+  ticket   +---+  auth     +---+
| M | ~~~~~~~~> | N | .-.-.-.-> | O |
+---+           +---+           +---+
        back
    #===============================#
    v                               H
+---+  send     +---+  backup   +---+
| A | --------> | B | - - - - > | C |
+---+           +---+           +---+
```

![文字绘图骚气十足](http://file.debuggerpowerzcy.top/power/GraphEasy.png)

## MacOS专属iTerm2终端
- 安装iterm2
    - 软件安装, `brew cask install iterm2`
        - 如果没有梯子, 帝八哥送你一程: [iTerm2-3_3_12安装包](http://file.debuggerpowerzcy.top/power/iTerm2-3_3_12.zip)
    - 更改配置
        - 下载[配置包](http://file.debuggerpowerzcy.top/power/ItermConfig.zip)
            - **必备** 核心配置文件: **`iTerm2_ConfigProfiles.json`**
            - **必备** rz命令支持脚本: **`iterm2-recv-zmodem.sh`**
            - **必备** sz命令支持脚本sz: **`iterm2-send-zmodem.sh`**
            - ***可选*** 颜色文件(设置界面色彩布局): **`material-design-colors.itermcolors`**
            - ***可选*** 字体文件(设置界面字体样式): **`Meslo LG L DZ Regular Nerd Font Complete.otf`**
            - **示例** : **`iterm2-config.png`**
            - **使用快捷键** : **`d8ger-shortcut.txt`**
        - 核心配置文件**`iTerm2_ConfigProfiles.json`**
            - `69行`, `@请配置工作目录`需要你指定目录, 一般是用户家目录, /Users/用户名
            - `316~329行`, 增加Iterm2对 **`rz`**, **`sz`**命令的支持, 需要将**`iterm2-recv-zmodem.sh`**, **`iterm2-recv-zmodem.sh`**放到**`/usr/local/bin`目录下**
            - 上述操作完成后, 将**`iTerm2_ConfigProfiles.json`**放置`~/Library/Application Support/iTerm2/DynamicProfiles/`目录(也就是iterm2的安装目录)
        - 重启iterm2

![iterm安装配置](http://file.debuggerpowerzcy.top/power/iterm2-config.png)

- 傻瓜式安装***oh~my~zsh***
    - 下载安装包[OH-MY-D8GER](http://file.debuggerpowerzcy.top/power/OH-MY-D8GER.zip)
    - 在用户家目录(**`~`**)解压, 将解压的内容移动到家目录下, 也就是**`~`**下出现**`.oh-my-zsh`目录**和**`.zshrc`文件**
    - 重新加载shell配置文件, **`source ~/.zshrc`**, 就OK了

- ~~命令安装***oh~my~zsh***~~
    - 准备工作
        - 安装zsh
            - 首先查看当前终端是否为zsh, `echo $SHELL`, 如果不是`/bin/zsh`, 说明当前终端不是zsh
            - 那就需要查看系统终端shell安装情况, `cat /etc/shells`
            - 如果找不到`/bin/zsh`说明没有安装zsh, 先安装zsh
                - MAC系统, `brew install zsh`
                - LINUX系统, `yum install zsh`
            - 如果找到或安装后需要切换zsh, `chsh -s /bin/zsh`, 可能需要输入用户密码
        - 安装lrzsz, 安装过程需要上传文件
            - MAC: `brew install lrzsz`
            - LINUX: `yum install -y lrzsz`
        - 下载ohmyzsh配置包
    - 安装ohmyzsh软件
        - 安装ohmyzsh(**`~`**下), `cd ~  &&  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
        - 安装成功后, 当前目录(**`~`**)下会出现`.oh-my-zsh`目录
    - 添加ohmyzsh语法高亮插件
        - 上传文件, **`cd ~/.oh-my-zsh/custom/plugins  &&  rz -bey `**, 弹框选中上传`P1.zip文件`
        - 解压P1.zip(并删除原始压缩包), **`unzip P1.zip -d . && mv P1/* . && rm -rf P1*`**
    - 更换ohmyzsh皮肤及配置文件
        - 上传文件, **`cd ~/.oh-my-zsh/custom/themes  &&  rz -bey `**, 弹框选中上传`T1.zip文件`
        - 解压T1.zip(并删除原始压缩包), **`unzip T1.zip -d . && mv T1/* . && rm -rf T1*`**
    - 更换ohmyzsh配置文件
        - 上传文件, **`cd ~  &&  rz -bey `**, 弹框选中上传`.zshrc文件`
    - 一般不建议更新ohmyzsh, 如需更新, **`upgrade_oh_my_zsh`**
    - 卸载ohmyzsh, **`uninstall_oh_my_zsh`**

![ohmyzsh安装配置](http://file.debuggerpowerzcy.top/power/ohmyd8ger-config.jpg)