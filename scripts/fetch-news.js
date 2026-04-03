const fs = require('fs');
const path = require('path');

async function fetchNews() {
    const token = process.env.ALAPI_TOKEN;
    const apiUrl = 'https://v3.alapi.cn/api/zaobao';
    const outputPath = path.join(__dirname, '..', 'data.json');

    if (!token) {
        console.error('❌ 错误：未找到 ALAPI_TOKEN 环境变量');
        process.exit(1);
    }

    try {
        console.log('🔄 正在获取每日早报数据...');
        const response = await fetch(`${apiUrl}?token=${token}&format=json`);
        const data = await response.json();

        if (data.code === 200) {
            const newDate = data.data.date;

            // --- 新增：日期检测逻辑 ---
            if (fs.existsSync(outputPath)) {
                try {
                    const localData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
                    if (localData.data && localData.data.date === newDate) {
                        console.log(`ℹ️ 数据尚未更新（日期仍为 ${newDate}），跳过保存。`);
                        return; // 直接退出函数
                    }
                } catch (readError) {
                    console.warn('⚠️ 读取旧文件失败，将视作首次运行。');
                }
            }
            // -----------------------

            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
            console.log('✅ 数据已成功保存至 data.json');
            console.log(`📅 日期：${newDate}`);
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
