**refer to https://github.com/hua1995116/webchat/tree/v2.2.0**
## 启动项目

Dev环境: MongoDB、Node 8.5.0+、Npm 5.3.0+

Prod环境: Redis、MongoDB、Node 8.5.0+、Npm 5.3.0+

启动客户端
```
$webchat cd client

$client npm install -----安装依赖

$client npm run serve -----运行

```
启动服务端
```
$client cd ..

$webchat npm install

$webchat npm run dev
```

## 打包

打包客户端
```
cd client

npm run build
```

服务端运行
```
cd ..

npm run prod
```
