# 部署检查清单

## 已修复的问题

### 1. 资源路径修复 ✅
- CSS 文件路径改为绝对路径：`/styles.css`、`/calendar-styles.css`
- JS 文件路径改为绝对路径：`/app.js`、`/calendar-functions.js`、`/words.js`
- 添加了 words.js 的引用（之前缺失）

### 2. HTML 优化 ✅
- 添加了 `X-UA-Compatible` meta 标签
- 添加了内联回退样式，防止外部 CSS 加载失败
- 优化了资源加载顺序

### 3. Vercel 配置 ✅
- 简化了 `vercel.json` 配置
- 添加了 `_headers` 文件用于静态资源缓存控制

### 4. 文件检查 ✅
所有必需文件都存在：
- ✅ index.html
- ✅ styles.css (43KB)
- ✅ calendar-styles.css (9KB)
- ✅ app.js (60KB)
- ✅ calendar-functions.js (12KB)
- ✅ words.js (167KB) - 单词数据库

## 重新部署步骤

### 方法 1：Vercel 网页重新部署
1. 登录 Vercel Dashboard
2. 找到你的项目
3. 点击 "Redeploy" 或上传更新的文件

### 方法 2：Git 更新（如果使用 Git）
```bash
cd /Users/peter_god/codebuddy/20251126单词王比赛
git add .
git commit -m "修复部署后样式问题"
git push
```

Vercel 会自动检测并重新部署。

### 方法 3：清除缓存
如果重新部署后仍有问题，在浏览器中：
1. 按 `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows) 强制刷新
2. 或者打开开发者工具 → Network → 勾选 "Disable cache" → 刷新页面

## 验证步骤

部署完成后，打开开发者工具（F12）检查：
1. **Console 标签页** - 不应该有 404 错误
2. **Network 标签页** - 确认所有 CSS/JS 文件都成功加载（状态码 200）
3. **Elements 标签页** - 检查 `<head>` 中的 CSS 是否正确加载

## 常见问题

### Q: 页面仍然没有样式？
A: 
1. 清除浏览器缓存并强制刷新 (Cmd+Shift+R)
2. 检查 Network 面板，查看哪个资源加载失败
3. 确认 Vercel 部署日志中没有错误

### Q: 样式部分生效，部分不生效？
A:
1. 可能是 CSS 文件太大，检查是否完整加载
2. 检查控制台是否有 CSS 解析错误
3. 尝试分段加载或压缩 CSS

### Q: JavaScript 功能不工作？
A:
1. 确认 words.js 已成功加载（167KB）
2. 检查控制台是否有 JavaScript 错误
3. 确认文件加载顺序：xlsx.js → words.js → app.js → calendar-functions.js

## 技术支持

如果问题仍然存在，请提供：
1. Vercel 部署 URL
2. 浏览器控制台截图（Console + Network）
3. 具体的错误信息
