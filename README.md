小米手环 10 版初高中古诗词快应用，基于 @Dreamqiu 的开源项目 [poem](https://github.com/Dreamqiucn/poem)（最初为小米手环 8 Pro 开发）衍生而来。

## 项目来源与声明

### 开发脉络

1. **原作**：@Dreamqiu — [Dreamqiucn/poem](https://github.com/Dreamqiucn/poem)，小米手环 8 Pro 版古诗词小程序
2. **二改**：@JIFENG — 重构诗文来源，内容与统编版教材相对应，分为
   - 高中版 [jfgege/band9poem](https://github.com/jfgege/band9poem)
   - 初中版 [jfgege/band9poem-middle](https://github.com/jfgege/band9poem-middle)

   原作者声明：基于 @Dreamqiu 的开源项目进行二次开发，不对该资源进行任何盈利行为（不含付费购买、捐赠等）。因小米手环 9 与手环 10 同为 Vela 平台，故一并适配发布
3. **三改（本项目）**：@dargon — 将上述初/高中两个仓库合并为一个快应用并适配小米手环 10，新增内容检索（输入法键盘）、艾宾浩斯记忆计划、已背完标记、收藏夹、字号调节等功能

### 声明

1. 本项目**不进行任何盈利行为**，不涉及付费购买、捐赠等
2. 本项目三改部分以 **GPL-3.0** 协议发布，详见 [LICENSE](./LICENSE)
3. 原仓库未声明开源协议；本项目所引用的输入法组件为 MIT 协议，详见 [src/components/InputMethod/LICENSE](./src/components/InputMethod/LICENSE)
4. 古诗文原文均为公有领域作品，篇目对应统编版中学语文教材

## 快速上手

### 1. 开发

```
npm install
npm run start
```

### 2. 构建

```
npm run build
npm run release
```

### 3. 调试

```
npm run watch
```
### 4. 代码规范化配置
代码规范化可以帮助开发者在git commit前进行代码校验、格式化、commit信息校验

使用前提：必须先关联git

macOS or Linux
```
sh husky.sh
```

windows
```
./husky.sh
```


## 了解更多

你可以通过我们的[官方文档](https://iot.mi.com/vela/quickapp)熟悉和了解快应用。