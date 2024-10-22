### 使用教程

**1. 青龙面板依赖 (依赖管理->创建依赖)**
- 选择 **NodeJs** 类型, 输入名称: `axios`

**2. 引入脚本 (脚本管理->右上角创建)**
- 根目录新建 `Follow_Checkin.js`
- 拷贝文件对应内容保存

**3. 多账号配置 (环境变量 -> 创建变量)**
- 多账号规则: `FOLLOW_ACCOUNT_X`  X 以 0 开始, 依次添加 例如: `FOLLOW_ACCOUNT_0`, `FOLLOW_ACCOUNT_1`, `FOLLOW_ACCOUNT_2`
- 输入名称: `FOLLOW_ACCOUNT_0`
- 输入值: 抓取csrf请求头中的整个Cookie
  例
  ``` js
  // 就是很长不要怀疑
  authjs.csrf-token=xxxxxx; authjs.callback-url=xxxxxx; authjs.session-token=xxxxxxx; ph_phc_EZGExxxxxxxxwEWNL_posthog=xxxxx
  ```
  
**3. 配置定时任务 (定时任务->创建任务)**
- 任务名：Follow每日签到
- 命令：`task Follow_Checkin.js`
- 定时：0 9 * * *
