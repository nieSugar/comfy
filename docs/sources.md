# 课程来源与适用边界

查证日期：2026-10-23。以下为 Comfy、Hugging Face、PyTorch 及注明身份的扩展作者的一手来源，并结合本机运行中的 ComfyUI v0.42.4（前端 v1.55.18）`/object_info` 节点定义与实机界面核对；课程叙述、茶壶练习和教学顺序为本项目原创组织，不是官方文档的完整翻译。

## 使用范围

- 面向 Windows ComfyUI Desktop 用户，兼顾新版多实例 Desktop 与直接进入画布的 Legacy Desktop。
- 当前官方文档已区分 Desktop、ComfyUI 实例、前端及模板；它们的版本与发布节奏可能不同。每步实操卡片配有采自本机 ComfyUI v0.42.4（简体中文界面）的红框标注截图（`assets/screenshots/`），顶部配有原创交互式原理图解。
- 五份项目内 JSON 练习分为两条轨道：
  - `01-text-to-image.json`、`02-image-to-image.json`、`04-inpaint.json` 与 `05-lora-style.json` 以普通 SD1.5 一体包 checkpoint、内置节点、单张 512 × 512 为教学基线；
  - `03-z-image-turbo.json` 以本机已安装的 Z-Image Turbo 三件套分体式架构（`UNETLoader` + `CLIPLoader(lumina2)` + `VAELoader`，1024 × 1024，`steps=8, cfg=1.0, res_multistep`）为现代分体模型实战基线，并已在 RTX 5070 Ti 实机跑通。
- “模型下载与识别”课提供从 Model card、Files、指定文件页、浏览器 Download 到 Desktop 放置、选择与运行的 10 步路径；只让用户按需要下载指定单文件，不克隆仓库，不改系统 Python，不自动接受许可。
- 示例文件为 Comfy-Org 归档的 `v1-5-pruned-emaonly-fp16.safetensors`，文件页在查证时标注约 2.13 GB、`creativeml-openrail-m`。该体积是网页舍入显示，不等于运行显存要求；访问条件、许可与文件详情仍以下载时原页面为准。
- 茶壶提示词、练习数值和单变量实验是教学起点，不保证每台设备的生成结果、耗时或显存占用一致。
- 本地 core 练习不调用付费 API；其他 Partner / API / Cloud 节点的费用、联网和隐私政策另行确认。本项目不自动安装、下载、更新或卸载用户环境。

## 来源索引

| 范围 | 一手来源 | 本课程采用的要点 |
| --- | --- | --- |
| Desktop 定位 | [Desktop Overview](https://docs.comfy.org/installation/desktop/overview) | 新版管理多个实例，区分 Local 与 Cloud；存在 Legacy 迁移路径 |
| Windows 安装 | [Windows Desktop](https://docs.comfy.org/installation/desktop/windows) | Windows 安装与系统条件；不把 Portable 的路径当 Desktop 固定路径 |
| 实例管理 | [Instance Management](https://docs.comfy.org/installation/desktop/usage/instance-management) | 实例独立设置、本地 / 云 / 远程类型；卸载实例可能删除文件 |
| 共享模型目录 | [Desktop Settings](https://docs.comfy.org/installation/desktop/usage/settings) | Desktop Settings → Storage → Shared Models |
| 实例目录覆盖 | [Manage](https://docs.comfy.org/installation/desktop/usage/manage) | 当前实例 Storage 可能覆盖共享目录及 Input / Output |
| 模型分类 | [Models](https://docs.comfy.org/basic-concepts/models) | checkpoint、LoRA、VAE、ControlNet 分类及搜索路径；部分旧入口描述仍可见 |
| 工作流概念 | [Workflows](https://docs.comfy.org/basic-concepts/workflow) | 节点、连线、参数组成可复用的操作流程 |
| 节点概念 | [Nodes](https://docs.comfy.org/basic-concepts/nodes) | 输入输出类型、连接、状态、模式与自定义节点 |
| 界面与队列 | [Interface Overview](https://docs.comfy.org/interface/overview) | 画布、侧栏、参数 / 错误面板、运行模式与队列；位置可能可拖动 |
| 模板 | [Workflow Templates](https://docs.comfy.org/interface/features/template) | 模板载入与模型要求；新版缺模型可能显示在 Errors 面板，而非独立弹窗 |
| 第一张图 | [First Generation](https://docs.comfy.org/get_started/first_generation) | 示例模型来源、导入工作流、普通 JSON 导出 |
| 指定模型说明 | [Comfy-Org SD1.5 Archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive) | Comfy 官方组织归档、SD1.5 身份、文件用途与许可标记 |
| 指定下载文件 | [SD1.5 FP16 文件页](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors) | 完整文件名、约 2.13 GB、Download file、Xet pointer 与 SHA-256 区分 |
| 模型访问条件 | [Hugging Face Gated Models](https://huggingface.co/docs/hub/models-gated) | 登录、请求访问与批准流程；不绕过访问控制 |
| 权重格式 | [Safetensors](https://huggingface.co/docs/safetensors/index) | 存储格式与 pickle 的差别；不把格式当架构、用途或精度 |
| 量化容器 | [GGUF](https://huggingface.co/docs/hub/gguf) | GGUF 容器和量化类型；只用匹配的加载器与工作流 |
| 低精度含义 | [PyTorch Tensor Attributes](https://docs.pytorch.org/docs/2.14/tensor_attributes.html) | FP16 / BF16 的位数分配与多种 float8 类型；不把开发接口变成 Desktop 安装命令 |
| 模型目录代码 | [ComfyUI folder_paths.py](https://github.com/Comfy-Org/ComfyUI/blob/master/folder_paths.py) | 9 类模型的原生分类路径，兼容 text_encoders / clip 与 diffusion_models / unet |
| 共享目录代码 | [Comfy Desktop models.ts](https://github.com/Comfy-Org/Comfy-Desktop/blob/main/src/main/lib/models.ts) | 共享根目录直接拼接 checkpoints 等类别，不重复添加 models |
| GGUF 专用加载 | [扩展作者：ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF) | 需要匹配的专用节点；这是第三方扩展，不是本课依赖，不自动安装 |
| 文生图 | [Text to Image](https://docs.comfy.org/tutorials/basic/text-to-image) | SD1.5 基础链路与各节点职责 |
| 采样参数 | [KSampler](https://docs.comfy.org/built-in-nodes/KSampler) | 参数名和端口；课程不照搬其中过度概括的效果保证 |
| 图生图 | [Image to Image](https://docs.comfy.org/tutorials/basic/image-to-image) | 输入图编码、denoise 影响及采样步数语义 |
| 局部重绘 | [Inpaint](https://docs.comfy.org/tutorials/basic/inpaint) | 用遮罩与专用编码处理局部区域；专用模型可有不同效果 |
| 遮罩编辑 | [Mask Editor](https://docs.comfy.org/interface/maskeditor) | 打开编辑器并绘制、应用遮罩 |
| Inpaint 编码 | [VAEEncodeForInpaint](https://docs.comfy.org/built-in-nodes/VAEEncodeForInpaint) | 图片、VAE、mask 与遮罩扩张输入 |
| 像素合成 | [ImageCompositeMasked](https://docs.comfy.org/built-in-nodes/ImageCompositeMasked) | 原图、生成图、坐标及 mask 的合成角色 |
| LoRA | [LoRA](https://docs.comfy.org/tutorials/basic/lora) | 权重分类、MODEL / CLIP 接法与强度 |
| ControlNet | [ControlNet](https://docs.comfy.org/tutorials/controlnet/controlnet) | 条件图、对应权重、官方预处理素材和 CONDITIONING 路径 |
| 输出与元数据 | [SaveImage](https://docs.comfy.org/built-in-nodes/SaveImage) | PNG 输出及在启用时写入的工作流元数据 |
| 节点管理 | [Manager Overview](https://docs.comfy.org/manager/overview) | Desktop 已带管理能力，按需管理节点包 |
| 扩展安装 | [Install Custom Nodes](https://docs.comfy.org/installation/install_custom_node) | 节点包、依赖、安装与安全注意事项 |
| 总体排错 | [Troubleshooting](https://docs.comfy.org/troubleshooting/overview) | 先查看具体报告，再区分模型、扩展与硬件问题 |
| 模型排错 | [Model Issues](https://docs.comfy.org/troubleshooting/model-issues) | 架构、维度、文件缺失、加载与内存问题 |
| 自定义节点排错 | [Custom Node Issues](https://docs.comfy.org/troubleshooting/custom-node-issues) | Desktop 禁用扩展、隔离问题与提供有效报告 |
| 在线服务边界 | [Partner Nodes](https://docs.comfy.org/tutorials/partner-nodes/overview) | 本地应用也可能调用远程服务，需另核实费用与数据去向 |

## 特别处理的易误解点

1. 同 seed 不等于跨模型、参数、硬件和版本必然生成完全一样的图片。
2. 文生图的 Empty Latent Image 定义潜图尺寸与批量，随机噪声由采样流程按 seed 产生；它不是保存好的像素图片。
3. steps 与 CFG 不是“越高越好”。低 denoise 也不能简单解释成按比例减少标准 KSampler 的采样步数。
4. 工作流 JSON 不自动包含模型、插件代码和输入素材；PNG 元数据可能被禁用、删除或在再编码后丢失。
5. mask 的教学约定是白色允许重绘，黑色保留方向。VAE 重建本身可能改变区域外像素；需要像素级保护时，将生成区域合成回原图。
6. Shared Models 已经是模型根目录时，不额外套一层 models；实例设置可能覆盖共享目录。
7. 官方内置节点页面有部分自动生成内容。课程对语义采用基础教程、节点端口定义与明确限定，不继承“相同 seed 必然相同”“更多 steps 必然更准确”等无条件表述。
8. 模型家族、用途、文件格式和精度是四个不同维度；`.safetensors` 不能单独证明兼容性，FP16 也不是“只用该文件体积的显存”。本课 checkpoint 已含必要主模型、文字编码器与 VAE，其他类别不需全部安装。
9. 指定文件的 `Download file` 下载权重；`Raw pointer file` 下载的是大文件指针。GB 级权重若变成几 KB 文本、HTML 或未完成下载，不应靠改名让加载器强行读取。
10. 新课插入为第 4 课，已有 12 课的 ID、步骤数量和步骤顺序保留；跨课引用改用课程名称，避免显示序号变化导致旧进度或指引错位。

后续维护时先核对用户实际 Desktop / 实例版本，再更新界面入口与练习要求；不因新模型发布就直接替换入门基线。
