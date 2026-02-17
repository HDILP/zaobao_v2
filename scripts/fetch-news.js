const fs = require('fs');
const path = require('path');

async function fetchNews() {
    const token = process.env.ALAPI_TOKEN;
    const apiUrl = 'https://v3.alapi.cn/api/zaobao';

    if (!token) {
        console.error('❌ 错误：未找到 ALAPI_TOKEN 环境变量');
        process.exit(1);
    }

    try {
        console.log('🔄 正在获取每日早报数据...');
        // 使用 Node 18+ 原生 fetch，或者你可以安装 node-fetch
        const response = await fetch(`${apiUrl}?token=${token}&format=json`);
        const data = await response.json();

        if (data.code === 200) {
            const outputPath = path.join(__dirname, '..', 'data.json');
            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
            console.log('✅ 数据已成功保存至 data.json');
            console.log(`📅 日期：${data.data.date}`);
        } else {
            console.error('❌ API 请求失败:', data.msg || data.message);
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ 发生错误:', error.message);
        process.exit(1);
    }
}

fetchNews();
