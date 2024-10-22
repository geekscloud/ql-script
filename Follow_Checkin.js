const axios = require('axios');

// 获取青龙的所有环境变量，提取以 FOLLOW_ACCOUNT 开头的变量
const envVars = process.env;
let accounts = [];
let index = 0;

while (envVars[`FOLLOW_ACCOUNT_${index}`]) {
  const cookie = envVars[`FOLLOW_ACCOUNT_${index}`].trim();

  // 从 cookie 中解析 csrfToken
  const csrfTokenMatch = cookie.match(/authjs\.csrf-token=([^;]+)/);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : null;

  if (!csrfToken) {
    console.log(`FOLLOW_ACCOUNT_${index} 中未找到 csrfToken，请检查 cookie 配置`);
    process.exit(1);
  }

  accounts.push({
    csrfToken,
    cookie
  });

  index++;
}

// 检查是否有配置账户
if (accounts.length === 0) {
  console.log('未配置任何账户，请检查 FOLLOW_ACCOUNT 环境变量');
  process.exit(1);
}

console.log(`共找到 ${accounts.length} 个账号, 开始签到...`);

// 主函数
(async () => {
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    console.log(`正在为账户 ${i + 1} 执行签到...`);
    await sign(account.csrfToken, account.cookie);
    
    // 随机延迟 3 到 8 秒
    await randomDelay(1000, 5000);
  }
  console.log('所有账户签到完毕');
})()
  .catch((e) => console.log(`脚本执行出错: ${e}`))
  .finally(() => console.log('脚本执行完毕'));

// 签到函数
async function sign(csrfToken, cookie) {
  try {
    const options = {
      url: 'https://api.follow.is/wallets/transactions/claim_daily',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.38(0x1800262c) NetType/4G Language/zh_CN',
        'content-type': 'application/json',
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'cookie': cookie
      },
      data: JSON.stringify({ csrfToken })
    };

    const response = await axios.post(options.url, options.data, { headers: options.headers });
    const { code, message } = response.data;
    
    if (code !== 0) {
      console.log(`账户签到失败: ${message}`);
    } else {
      console.log('账户签到成功');
    }
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.code === 4000) {
      console.log('今天已经签到过了');
    } else if (error.response) {
      console.log(`请求失败，HTTP状态码: ${error.response.status}`);
      console.log(`错误响应体: ${JSON.stringify(error.response.data)}`);
    } else {
      console.log(`请求失败: ${error.message}`);
    }
  }
}

// 随机延迟函数
function randomDelay(min, max) {
  return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}
