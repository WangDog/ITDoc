#将本地项目上传至github
## 1. 本地新建项目`myProject`, 进入项目根目录
  > git init //初始化git本地项目`myProject`
  
## 2. github上新建repository
  > 拷贝仓库地址,如: `https://github.com/WangDog/myProject.git`
  
## 3.本地项目增加远程仓库
  > `git remote add https://github.com/WangDog/myProject.git`
  > `git remote -v` //查看项目的远程仓库

## 4.提交本地代码
  > `git add .`
  > `git commit -m "commit comment"`
  > `git push origin master`
