# 五份原生节点练习工作流

这是教学用的 ComfyUI UI 工作流 JSON，不是模型文件，也不是 API 调用脚本。全部只使用 ComfyUI 内置核心节点（native nodes），不需要额外安装任何第三方 custom nodes。节点标题均带有清晰的操作序号，连线已全部接好。

## 先准备什么

- 已安装且能启动的 ComfyUI Desktop。
- **练习 01 / 02 / 04 / 05（SD1.5 一体包基线）**：需要一个包含 CLIP 和 VAE 的 **SD1.5 系列完整 checkpoint**（放入 `checkpoints` 目录）。练习 02 / 04 还需准备一张非敏感 PNG/JPG 图片（可直接用练习 01 生成的 512 × 512 茶壶图）；练习 05 需在 `loras` 目录准备一个与 SD1.5 匹配的风格 LoRA。
- **练习 03（Z-Image Turbo 三件套分体式实战）**：需要分别放入三个对应子目录的组件文件：
  1. `diffusion_models/z_image_turbo_bf16.safetensors`（主生成大脑 UNET）
  2. `text_encoders/qwen_3_4b.safetensors`（文字翻译官，类型选 `lumina2`）
  3. `vae/ae.safetensors`（像素解码器 VAE）

练习 01 / 02 中的 `SELECT_YOUR_SD15_CHECKPOINT.safetensors` 和 `SELECT_YOUR_INPUT_IMAGE.png` 是醒目的教学占位符；导入后必须在节点下拉框中选择你自己电脑上已安装的真实文件。

第一次准备模型时，可先阅读课堂中的 [第 04 课：模型下载与识别](http://127.0.0.1:4173/#model-download) 与 [第 09 课：Z-Image 拆件式模型实战](http://127.0.0.1:4173/#z-image)。

## 01：文字生成图片（`01-text-to-image.json` · 7 节点）

1. 将 `01-text-to-image.json` 拖到 ComfyUI 画布中，或通过左侧「工作流」打开它。
2. 在 `① 选择 SD1.5 模型`（`CheckpointLoaderSimple`）节点的 `ckpt_name` 下拉框中选择实际安装的 SD1.5 checkpoint。
3. 阅读两个 `CLIP Text Encode`：正向是“小红茶壶，木桌，窗光，产品摄影”；负向是“模糊、水印、文字”。
4. 确认 `Empty Latent Image` 为 `512 × 512`、`batch_size = 1`；`KSampler` 为 `seed = 42`、`control_after_generate = fixed`、`steps = 20`、`cfg = 7`、`sampler_name = euler`、`scheduler = normal`、`denoise = 1`。
5. 点击右上角 `运行`（Run）。完成后在 `Save Image` 查看图片；文件保存在输出目录的 `ComfyClass` 子目录中，以 `text2img` 开头。
6. 保持 `seed = 42` 和 `fixed` 不变，只把正向提示词中的 `red` 改为 `blue` 再运行一次，观察单变量对比效果。

## 02：用图片继续改画（`02-image-to-image.json` · 9 节点）

1. 打开 `02-image-to-image.json`，在 `① 选择 SD1.5 模型` 中选择已安装的 SD1.5 checkpoint。
2. 在 `④ 上传原图 / Load Image` 中点击上传按钮选择图片（注意：不要把带工作流元数据的图片直接拖到空白画布，否则会替换当前工作流）。
3. `⑤ 统一尺寸 / ImageScale` 会用 `lanczos` + `center` 将输入图中心裁剪为 `512 × 512`，再由 `⑥ 像素转潜空间 / VAEEncode` 压缩为 `LATENT` 送入 `KSampler`。
4. 保持 `seed = 42`、`fixed`，先用 `denoise = 0.55` 运行；结果保存在输出目录 `ComfyClass` 子目录中，以 `img2img` 开头。
5. 固定其他参数不变，分别尝试 `denoise = 0.30`（微调光影纹理）和 `0.70`（大幅重绘），对比重绘幅度对原图结构保留的影响。

## 03：Z-Image Turbo 三加载器分体式实战（`03-z-image-turbo.json` · 10 节点）

现代新架构模型（如 Z-Image Turbo、Flux 等）通常不再把所有组件打包进单个 Checkpoint，而是拆成 3 个独立文件分别加载：

1. 将 `03-z-image-turbo.json` 导入画布，重点观察左侧**三个独立的加载器**：
   - `① 加载扩散模型 / UNETLoader`：选择 `z_image_turbo_bf16.safetensors`，只输出紫色 `MODEL` 线；
   - `③ 加载文本编码器 / CLIPLoader`：选择 `qwen_3_4b.safetensors`，并将 `type` 设为 `lumina2`，输出黄色 `CLIP` 线；
   - `⑧ 加载 VAE / VAELoader`：选择 `ae.safetensors`，输出红色 `VAE` 线。
2. 检查 Z-Image Turbo 专用配置节点：
   - `② AuraFlow 采样偏移 / ModelSamplingAuraFlow`：接在 `UNETLoader` 与 `KSampler` 之间，`shift = 3`；
   - `⑤ 条件零化 / ConditioningZeroOut`：因为 Turbo 蒸馏模型使用 `cfg = 1.0`（不依赖负向提示词引导），直接将正向条件零化后接入 `KSampler` 的 `negative` 槽；
   - `⑥ 1024 空潜空间 / EmptySD3LatentImage`：创建 `1024 × 1024` 的 16 通道潜空间画布。
3. 检查 `⑦ K采样器 / KSampler` 参数：`seed = 42`、`control_after_generate = fixed`、`steps = 8`、`cfg = 1.0`、`sampler_name = res_multistep`、`scheduler = simple`、`denoise = 1.0`。
4. 点击 `运行`。生成的 1024 × 1024 高清图片会保存在输出目录的 `ComfyClass/zimage_00001_.png`。

## 04：局部重绘与像素级遮罩合成（`04-inpaint.json` · 11 节点）

1. 打开 `04-inpaint.json`，在 `① 选择 SD1.5 模型` 中选择已安装的 SD1.5 checkpoint。
2. 在 `④ 上传 512 方图并画遮罩 / Load Image` 中上传 512 × 512 茶壶原图（不经过缩放节点，确保图片与遮罩坐标严格对齐），右键该节点选择「在遮罩编辑器中打开（Open in MaskEditor）」，涂出茶壶主体后点击保存。
3. 观察 `⑤ 遮罩转图像 / MaskToImage` → `⑥ 检查白(重绘)黑(保留) / PreviewImage` 支路：运行后可直观确认白色重绘区域与黑色保留区域是否符合预期。
4. `⑦ 局部重绘编码 / VAEEncodeForInpaint` 同时接收原图 `pixels`、`vae` 与 `mask`，送入 `⑧ KSampler` 重绘并经 `⑨ VAEDecode` 解码。
5. `⑩ 遮罩像素合成(保背景) / ImageCompositeMasked` 将原图接 `destination`、新生成图接 `source`、原遮罩接 `mask`，确保遮罩外的桌面木纹 100% 保留原始像素，结果保存在 `ComfyClass/inpaint`。

## 05：风格 LoRA 串联工作流（`05-lora-style.json` · 8 节点）

1. 打开 `05-lora-style.json`，在 `① 选择 SD1.5 主模型` 选择 SD1.5 checkpoint，在 `② 串联风格 LoRA / LoraLoader` 选择 `loras` 目录中配套的 SD1.5 LoRA。
2. 沿着紫色 `MODEL` 线与黄色 `CLIP` 线核对：`CheckpointLoaderSimple` 的输出先进入 `LoraLoader`，再从 `LoraLoader` 的输出分别送往 `KSampler` 和正/负两个 `CLIPTextEncode`。
3. 固定 `seed = 42` 与 `fixed`，单独调整 `strength_model`（如对比 `0.8` 与 `0.4`），观察风格强弱变化。

## 适用边界与隐私

- SD1.5 与 Z-Image Turbo 的节点结构和采样参数截然不同：切勿把 `steps = 8, cfg = 1.0` 照搬给普通 SD1.5，也不要把 `cfg = 7, steps = 20` 照搬给 Z-Image Turbo。
- JSON 只记录节点、参数、连接和文件名引用，不会把模型或输入图片打包进去。
- 运行会在 ComfyUI 输出目录新增 PNG 图片，默认带有完整工作流与提示词元数据；对外分享前请留意隐私。

## 验证与来源

- 运行结构自检：`node --test tests/workflows.test.cjs`（检查全部 5 份工作流的节点白名单、端口类型、双向连线、无悬空引用与参数基线）。
- `03-z-image-turbo.json` 已在本机 ComfyUI v0.42.4（RTX 5070 Ti）上实机执行通过，输出 `D:\Comfy-Desktop\ComfyUI-Shared\output\ComfyClass\zimage_00001_.png` 并留存教学样张 `assets/screenshots/zimage-teapot-output.png`。
