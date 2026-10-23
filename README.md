# Comfy 课堂 · ComfyUI Desktop 中文实操图解课

一个面向零基础学员的本地交互式 ComfyUI 教学网站。重点不是死记节点英文名，而是让学员对每一步都做到：**知道现在在整个工作流的哪一环、在界面哪个位置点哪里、这个节点和参数到底干什么、调大调小会发生什么、做对后会看到什么、卡住时怎么排查**。

## 打开就能学

直接双击本目录的 **index.html**。不需要 `npm install`，不需要联网，不需要登录。课程、交互图解、实机红框截图、26 个核心节点参数百科和 56 道情境自测均在本地；官方参考链接需要联网打开。

也可以在当前目录运行：

```powershell
node server.cjs
```

然后打开 <http://127.0.0.1:4173>。服务器只绑定本机地址，按 Ctrl+C 停止；它只提供教学静态文件，不连接或控制 ComfyUI。默认端口被占用时，可在 PowerShell 中设置 `$env:PORT = '4174'` 后再启动。

## 核心教学升级（让学员真正看懂、会调、能举一反三）

1. **每一步带「当前工作流位置迷你图」**：在 14 课共 78 个操作步骤卡片顶部，实时标出当前步骤处于整条生成流水线的哪一环（已完成的环节、当前正在操作的环节、后续环节一目了然）。
2. **真实 ComfyUI 中文界面红框截图与全屏放大灯箱（`assets/screenshots/` · 共 24 张）**：基于真实运行的 ComfyUI v0.42.4（前端 v1.55.18，简体中文界面）截取并标注红框，对照讲解左栏、顶栏、画布、Hugging Face 2.13 GB 文件页、模型根目录对号入座、7 节点全貌、KSampler、图生图、MaskEditor 遮罩画板、Z-Image 三加载器、队列面板与设置弹窗；每张步骤截图支持点击放大全屏查看细节（按 `Esc` 关闭）。
3. **26 个核心节点与参数百科（`nodes.js` + 页内可搜索手册）**：
   - 每个步骤卡片内直接展开「本步涉及的节点与参数速查」；
   - 页面底部提供完整的 **#node-manual 节点与参数百科**（支持按 7 大分类筛选和关键词搜索），把每个节点的**输入/输出槽颜色与数据类型、每个参数是什么意思、调大/调小会怎样、新手什么时候改/什么时候别动、常见踩坑**全部讲透。
4. **SD1.5 一体包 + Z-Image Turbo 拆件式双轨教学 + 可视化参数实验室**：
   - 先用结构最精简的 SD1.5 一体式 Checkpoint（1 个加载器出 3 根线）打牢数据流基础；
   - 第 07 课参数实验室提供 `Steps` / `CFG` / `Denoise` 实时视觉对照色卡，直观看到欠收敛噪点、过高 CFG 过饱和硬边与图生图重绘幅度差异；
   - 新增 **[第 09 课：Z-Image 拆件式模型实战](http://127.0.0.1:4173/#z-image)**，用本机已安装的 `z_image_turbo_bf16.safetensors` + `qwen_3_4b.safetensors` + `ae.safetensors` 拆解现代大模型的「三加载器拼装法」（`UNETLoader` + `CLIPLoader` + `VAELoader`），彻底搞懂为什么新模型要分 3 个文件夹存放。
5. **每课 4 道情境排错与实操自测题（共 56 题，`quizzes.js`）**：不再只有单题概念问答，而是覆盖「界面找入口、连线报错排查、参数调整判断、真实翻车现场诊断」4 类场景，答错即时给出原因分析。

## 推荐的学习方式

把课堂与 ComfyUI Desktop 并排打开。每次只上一课：先看交互图解建立全局关系，再跟着每步的「当前位置迷你图 + 实机红框截图 + 本步节点参数速查」在 Desktop 中完成操作，对照“做对了会看到什么”自检，最后完成课末的 4 道情境自测题。

| 阶段 | 课程 | 你会掌握什么 |
| --- | --- | --- |
| 起步 | 01 认识 ComfyUI、02 Desktop 与模型、03 界面操作、04 模型下载与识别 | 分清软件与模型，熟悉中文界面每个按钮，从 Hugging Face 下载正确单文件并放进对的目录 |
| 核心练习 | 05 第一张图、06 读懂节点与连线、07 KSampler 参数实验室、08 图生图、09 Z-Image 拆件式模型实战 | 跑通一体包与三件套分体式两种主流文生图/图生图流程，读懂数据流与全部核心参数 |
| 拓展与排错 | 10 局部重绘、11 LoRA / ControlNet、12 保存与队列、13 自定义节点、14 排错 | 掌握局部重绘遮罩、风格/结构控制配件、资产备份与报错定位顺序 |

进度保存在当前浏览器本地存储（`comfy-classroom.v1`），不联网同步；原有课程 ID、步骤索引与首题完成状态完全向后兼容。

## 五份可直接导入的原生节点工作流

- `workflows/01-text-to-image.json`：原生 7 节点，SD1.5 一体包文生图（教学基线）。
- `workflows/02-image-to-image.json`：原生 9 节点，SD1.5 图生图（含 `ImageScale` 512 × 512 中心裁剪与 `VAEEncode`）。
- `workflows/03-z-image-turbo.json`：原生 10 节点，Z-Image Turbo 三加载器分体式文生图（`UNETLoader` + `ModelSamplingAuraFlow` + `CLIPLoader(lumina2)` + `ConditioningZeroOut` + `EmptySD3LatentImage` + `KSampler` + `VAELoader` + `VAEDecode` + `SaveImage`），已在本机 ComfyUI v0.42.4 实机跑通出图。
- `workflows/04-inpaint.json`：原生 11 节点，SD1.5 局部重绘与像素级遮罩合成（含 `MaskToImage` + `PreviewImage` 黑白真值核查、`VAEEncodeForInpaint` 与 `ImageCompositeMasked` 严格保护遮罩外背景）。
- `workflows/05-lora-style.json`：原生 8 节点，SD1.5 风格 LoRA 串联工作流（演示 `LoraLoader` 同时接管 `MODEL` 与 `CLIP` 路径）。

详细操作与注意事项见 [工作流练习说明](workflows/README.md)。

## 项目文件

```text
index.html              课堂入口（含顶部快捷手册入口、全屏截图灯箱与节点百科区）
styles.css              响应式样式（320px ~ 1600px 全尺寸适配）
lessons.js              14 节中文课程与 78 个分步实操内容
diagrams.js             原创交互式教学示意（含 Z-Image 三加载器拼装图与可视化参数实验室）
nodes.js                26 个核心节点与参数百科数据（对照实机 /object_info 核验）
quizzes.js              14 课 × 4 道情境自测题库（共 56 题）
media.js                78 个步骤的流程迷你图配置、实机截图映射与关联节点
assets/screenshots/     24 张真实 ComfyUI 中文界面红框标注截图、图解与实机生成样张
app.js                  章节、步骤、流程迷你图、截图灯箱、节点抽屉、节点百科搜索与多题自测逻辑
server.cjs              可选的本机只读静态预览服务
workflows/              五份原生节点练习 JSON 与使用说明
tests/                  内容、工作流、静态服务器与无头浏览器回归检查
docs/sources.md         官方资料来源与适用边界
docs/verification.md    实际验证与实机跑图记录
```

全部是 UTF-8 文件，无第三方运行时依赖、构建工具或远程字体。

## 自检

已安装 Node.js 时：

```powershell
npm run check
```

或直接运行 `node --test tests/*.test.cjs`。测试验证 14 课内容完整性、图解热点、26 个节点百科 schema、56 道自测题、78 步截图与流程迷你图映射、5 份工作流端口和连线、静态服务器安全限制。浏览器回归与实机跑图记录见 [验证记录](docs/verification.md)。

## 诚实的边界

- `assets/screenshots/` 中的界面图采自本机真实运行的 ComfyUI v0.42.4（前端 v1.55.18）；不同版本或自定义主题的按钮位置可能略有差异。
- 参数实验室滑块用于直观解释参数变化方向，不直接调用 GPU 跑图；真正生成仍需你在 ComfyUI 中点击「运行」。
- 本地 core 工作流与 Partner / API 节点不同。后者可能上传素材并消耗积分，使用前请核对服务说明。
- JSON 只记录节点、参数、连线与文件名引用，不包含模型权重或输入图片文件。

资料核对与实机验证更新于 2026-10-23，来源见 [sources.md](docs/sources.md)。这是独立教学项目，不是 Comfy 官方产品。
