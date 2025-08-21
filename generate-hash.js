const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 从环境变量中获取密码
const password = process.env.NAV_PASSWORD;

if (!password) {
    console.error('错误：未设置环境变量 NAV_PASSWORD！');
    process.exit(1);
}

// 计算密码的 SHA-256 哈希值
const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
console.log('成功生成密码哈希值。');

// 读取 script.js 文件内容
const scriptPath = path.join(__dirname, 'public', 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// 替换占位符
scriptContent = scriptContent.replace('__PASSWORD_HASH__', hashedPassword);

// 将修改后的内容写回文件
fs.writeFileSync(scriptPath, scriptContent, 'utf8');
console.log('已将哈希值成功注入到 script.js！');