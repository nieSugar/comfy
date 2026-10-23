window.COMFY_MEDIA = {
  tracks: {
    start: ['确认实例', '找准目录', '认识界面', '下载与验证'],
    t2i: ['① 载入模型', '②③ 提示词', '④ 画幅尺寸', '⑤ K采样器', '⑥ VAE解码', '⑦ 保存图像'],
    i2i: ['① 载入模型', '②③ 提示词', '④⑤ 加载+缩放', '⑥ VAE编码', '⑦ K采样器(降噪)', '⑧⑨ 解码+保存'],
    zimage: ['①③⑧ 三加载器', '② AuraFlow偏移', '④⑤ 正向+零化', '⑥ 1024潜图', '⑦ 8步采样', '⑨⑩ 解码保存'],
    inpaint: ['① 原尺寸方图', '② 涂局部遮罩', '③ 局部重绘编码', '④ K采样器重绘', '⑤ 遮罩像素合成', '⑥ 验收保存'],
    ext: ['选对工具家族', '模型路径(LoRA)', '条件路径(ControlNet)', '单变量调强度'],
    ops: ['导出JSON备份', '核实output原图', '管理任务队列', '谨慎扩展与排错']
  },
  steps: {
    orientation: [
      { track: 'start', active: 0, where: '进入本地 ComfyUI 画布，分清桌面端与工作区', shot: 'assets/screenshots/ui-canvas-overview.png', caption: '实机截图：本地 ComfyUI v0.42.4 节点画布全貌（已导入基础文生图练习）', nodes: [] },
      { track: 'start', active: 0, where: '在动手连线前先定好单张 512×512 小目标', shot: 'assets/screenshots/zimage-teapot-output.png', caption: '目标参考：在本机用“木桌上的红色陶瓷茶壶”提示词真实生成的茶壶作品', nodes: ['EmptyLatentImage'] },
      { track: 't2i', active: 0, where: '沿着“加载模型 → 采样 → 解码 → 保存”认出主干三段', shot: 'assets/screenshots/ui-canvas-overview.png', caption: '实机截图：从左到右依次为 ① 模型加载 → ②③④ 准备条件与画幅 → ⑤ K采样器 → ⑥ 解码 → ⑦ 保存', nodes: ['CheckpointLoaderSimple', 'KSampler', 'SaveImage'] },
      { track: 'start', active: 2, where: '确认只使用免费本地 core 节点，不误触付费在线节点', shot: 'assets/screenshots/ui-node-library.png', caption: '实机截图：左侧“节点库”中搜索本地内置核心节点', nodes: [] }
    ],
    desktop: [
      { track: 'start', active: 0, where: '记录当前 Desktop 实例名称、版本与运行状态', shot: 'assets/screenshots/ui-locale-settings.png', caption: '实机截图：通过左下角设置（Ctrl + ,）查看当前 ComfyUI 版本与界面配置', nodes: [] },
      { track: 'start', active: 1, where: '在 Desktop Storage 设置中打开当前实例真正扫描的模型根目录', shot: 'assets/screenshots/ui-model-library.png', caption: '实机截图：左侧“模型库 (m)”展示当前实例从共享模型根目录扫描到的权重分类', nodes: ['CheckpointLoaderSimple'] },
      { track: 'start', active: 1, where: '盘点已有模型，分清一体式 checkpoint 与拆分式模型', shot: 'assets/screenshots/ui-model-library.png', caption: '实机截图：在模型库中查看已识别的模型文件', nodes: ['CheckpointLoaderSimple', 'UNETLoader'] },
      { track: 'start', active: 1, where: '把权重放进正确的分类子目录（如 checkpoints）并刷新列表', shot: 'assets/screenshots/t2i-checkpoint.png', caption: '实机截图：① 号 Checkpoint加载器（简易）读取 checkpoints 子目录中的模型', nodes: ['CheckpointLoaderSimple'] },
      { track: 'start', active: 3, where: '保持单张 512×512 轻量基线，准备进入界面与下载实操', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：④ 空Latent图像 保持 512×512、批量大小 1 的轻量起步设置', nodes: ['EmptyLatentImage', 'KSampler'] }
    ],
    interface: [
      { track: 'start', active: 2, where: '在设置（Ctrl + ,）中切换中文界面，同时保留英文对照能力', shot: 'assets/screenshots/ui-locale-settings.png', caption: '实机截图：红框处为设置面板（Ctrl + ,），可设置语言与画布交互项', nodes: [] },
      { track: 'start', active: 2, where: '练习滚轮缩放与平移，用右下角“适应视图 (.)”一键找回全部节点', shot: 'assets/screenshots/ui-fit-view.png', caption: '实机截图：红框处为右下角视图控制条，点“适应视图 (.)”即可把走丢的节点拉回视野中央', nodes: [] },
      { track: 'start', active: 2, where: '在左侧“节点库 (n)”搜索 预览图像（Preview Image）并练习添加与撤销', shot: 'assets/screenshots/ui-node-library.png', caption: '实机截图：红框处为左侧“节点库 (n)”，输入 Preview Image 即可找到“预览图像”节点', nodes: ['PreviewImage'] },
      { track: 'start', active: 2, where: '打开左侧“模板”浏览官方预置工作流，了解不同模型的配套要求', shot: 'assets/screenshots/ui-templates.png', caption: '实机截图：红框处为内置官方工作流模板库（含 SD1.5、SDXL、FLUX、Z-Image 等）', nodes: [] },
      { track: 'start', active: 2, where: '定位右上角“运行”按钮、任务队列、取消按钮与错误提示位置', shot: 'assets/screenshots/ui-run-queue.png', caption: '实机截图：红框处为顶部运行栏——数量保持 1，点“运行”提交任务，旁边的 × 可取消当前任务', nodes: [] }
    ],
    'model-download': [
      { track: 'start', active: 3, where: '步骤 1/10：锁定 Comfy-Org 官方归档的单个 SD1.5 FP16 文件', shot: 'assets/screenshots/hf-download-guide.png', caption: '图解对照：锁定 Comfy-Org/stable-diffusion-v1-5-archive 下的 v1-5-pruned-emaonly-fp16.safetensors', nodes: ['CheckpointLoaderSimple'] },
      { track: 'start', active: 3, where: '步骤 2/10：核对模型说明、creativeml-openrail-m 许可与磁盘空间', shot: 'assets/screenshots/ui-model-library.png', caption: '实机对照：在模型库中按分类管理可信来源的模型权重', nodes: ['CheckpointLoaderSimple'] },
      { track: 'start', active: 3, where: '步骤 3/10：进入 Hugging Face 的 Files 页面定位 2.13 GB 权重文件', shot: 'assets/screenshots/hf-download-guide.png', caption: '红框指引：认准 2.13 GB 真实权重文件页，区分一体式与拆分式模型', nodes: ['CheckpointLoaderSimple', 'UNETLoader', 'CLIPLoader', 'DualCLIPLoader', 'VAELoader'] },
      { track: 'start', active: 3, where: '步骤 4/10：使用 Browser 的 Download file 下载真实权重（非 pointer）', shot: 'assets/screenshots/hf-download-guide.png', caption: '红框指引：必点 Download file (2.13 GB)，切勿点击 134 Bytes 的 Raw pointer file', nodes: ['CheckpointLoaderSimple'] },
      { track: 'start', active: 3, where: '步骤 5/10：检查下载完成后的扩展名（.safetensors）与约 2.13 GB 体积', shot: 'assets/screenshots/hf-download-guide.png', caption: '红框指引：在 Windows 资源管理器开启文件扩展名，确认 .safetensors 后缀与 2.13 GB 体积', nodes: ['CheckpointLoaderSimple'] },
      { track: 'start', active: 1, where: '步骤 6/10：确认当前 Desktop 实例实际读取的 Shared Models 根目录', shot: 'assets/screenshots/models-folder-tree.png', caption: '红框指引：核对 Shared Models 根目录结构，切勿再多套一层 models 文件夹', nodes: [] },
      { track: 'start', active: 1, where: '步骤 7/10：将文件复制到 模型根目录/checkpoints/ 子目录中', shot: 'assets/screenshots/models-folder-tree.png', caption: '红框指引：SD1.5 一体包放进 checkpoints/；Z-Image 三件套分别放进 diffusion_models / text_encoders / vae', nodes: ['CheckpointLoaderSimple', 'UNETLoader', 'CLIPLoader', 'VAELoader'] },
      { track: 'start', active: 3, where: '步骤 8/10：在 Desktop 模型面板刷新列表（必要时重启当前实例）', shot: 'assets/screenshots/ui-model-library.png', caption: '实机截图：点击模型库刷新按钮让新放入的 .safetensors 立即可见', nodes: ['CheckpointLoaderSimple'] },
      { track: 't2i', active: 0, where: '步骤 9/10：导入 01-text-to-image.json 并在 ① 号节点下拉框选定真实模型', shot: 'assets/screenshots/t2i-checkpoint.png', caption: '实机截图：红框处为 ① Checkpoint加载器（简易），将占位名换成真实模型', nodes: ['CheckpointLoaderSimple'] },
      { track: 't2i', active: 5, where: '步骤 10/10：点击右上角“运行”，走完加载→编码→采样→解码→保存全链路', shot: 'assets/screenshots/ui-run-queue.png', caption: '实机截图：点击顶部“运行”按钮执行首次出图验证', nodes: ['KSampler', 'VAEDecode', 'SaveImage'] }
    ],
    'first-image': [
      { track: 't2i', active: 0, where: '导入 7 节点文生图工作流，纵览从模型到保存的完整生产线', shot: 'assets/screenshots/ui-canvas-overview.png', caption: '实机截图：01-text-to-image.json 导入后的 7 个核心节点全貌', nodes: ['CheckpointLoaderSimple', 'CLIPTextEncode', 'EmptyLatentImage', 'KSampler', 'VAEDecode', 'SaveImage'] },
      { track: 't2i', active: 0, where: '在 ① 号节点 Checkpoint加载器（简易）中选择真实 SD1.5 模型', shot: 'assets/screenshots/t2i-checkpoint.png', caption: '实机截图：红框标出 ① Checkpoint加载器（简易）的“Checkpoint名称”下拉框位置', nodes: ['CheckpointLoaderSimple'] },
      { track: 't2i', active: 1, where: '在 ② 正向提示词写想要的主体，在 ③ 负向提示词写想避开的瑕疵', shot: 'assets/screenshots/t2i-prompts.png', caption: '实机截图：红框标出 ② 正向 CLIP文本编码 与 ③ 负向 CLIP文本编码，注意右侧橙色“条件”连线去向', nodes: ['CLIPTextEncode'] },
      { track: 't2i', active: 3, where: '核对 ④ 空Latent图像（512×512）与 ⑤ K采样器（seed 42 · fixed · 20步 · cfg 7）', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：红框标出 ④ 空Latent图像 与 ⑤ K采样器 的 7 个中文参数控件', nodes: ['EmptyLatentImage', 'KSampler'] },
      { track: 't2i', active: 4, where: '点击顶部“运行”，等待采样完成并经 ⑥ VAE解码 送入 ⑦ 保存图像', shot: 'assets/screenshots/ui-run-queue.png', caption: '实机截图：红框标出顶部“运行”按钮（数量设为 1），点击后按顺序执行采样与解码', nodes: ['KSampler', 'VAEDecode'] },
      { track: 't2i', active: 5, where: '在 ⑦ 保存图像 查看成品，去 output/ComfyClass 核实 PNG 并导出 JSON 备份', shot: 'assets/screenshots/t2i-decode-save.png', caption: '实机截图：红框标出 ⑥ VAE解码 与 ⑦ 保存图像（文件名前缀 ComfyClass/text2img）', nodes: ['VAEDecode', 'SaveImage'] }
    ],
    nodes: [
      { track: 't2i', active: 0, where: '从 ① Checkpoint加载器 追踪 MODEL（紫）、CLIP（黄）、VAE（红）三路输出', shot: 'assets/screenshots/t2i-checkpoint.png', caption: '实机截图：① 号节点右侧三个输出圆点分别连向 K采样器、两个 CLIP文本编码 和 VAE解码', nodes: ['CheckpointLoaderSimple'] },
      { track: 't2i', active: 1, where: '看清两个 CLIP文本编码 完全一样，只因连到 K采样器 的正/负插孔不同而分工不同', shot: 'assets/screenshots/t2i-prompts.png', caption: '实机截图：上面节点的“条件”连入 K采样器“正面条件”，下面连入“负面条件”', nodes: ['CLIPTextEncode', 'KSampler'] },
      { track: 't2i', active: 2, where: '追踪画布尺寸路线：④ 空Latent图像（LATENT）→ ⑤ K采样器 → ⑥ VAE解码（IMAGE）', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：粉色 Latent 连线把 512×512 空潜图送入 K采样器 的“Latent图像”端口', nodes: ['EmptyLatentImage', 'KSampler', 'VAEDecode'] },
      { track: 't2i', active: 5, where: '从 ⑥ VAE解码 的“图像”输出多拉一根线到 预览图像（Preview Image）实现一对多输出', shot: 'assets/screenshots/ui-node-library.png', caption: '实机截图：从左侧节点库搜出“预览图像”，与“保存图像”并列接收 VAE解码 的图像输出', nodes: ['VAEDecode', 'PreviewImage', 'SaveImage'] },
      { track: 't2i', active: 4, where: '在副本上练习断开并重接 预览图像 的蓝线，体会端口类型匹配保护', shot: 'assets/screenshots/t2i-decode-save.png', caption: '实机截图：蓝色“图像（IMAGE）”端口只能接图像类输入，不能拿粉色“Latent”硬插', nodes: ['VAEDecode', 'PreviewImage'] },
      { track: 't2i', active: 3, where: '把种子改为 43 运行一次，边看结果边用自己的话串起整条数据流', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：在 ⑤ K采样器 中把“种子”从 42 改为 43，触发新一轮去噪计算', nodes: ['KSampler', 'VAEDecode', 'SaveImage'] }
    ],
    parameters: [
      { track: 't2i', active: 3, where: '实验起点：锁死 ⑤ K采样器 的 种子=42、生成后控制=fixed，建立单变量基线', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：确认“种子 = 42”且“生成后控制 = fixed”，防止每次运行自动换随机号', nodes: ['KSampler', 'EmptyLatentImage'] },
      { track: 't2i', active: 1, where: '实验一（只改提示词）：在 ② 正向提示词中只把 red 改为 blue，其余一字不动', shot: 'assets/screenshots/t2i-prompts.png', caption: '实机截图：只在 ② 号正向文本框内修改颜色词，观察单变量变化', nodes: ['CLIPTextEncode'] },
      { track: 't2i', active: 3, where: '实验二（只改步数）：在 ⑤ K采样器 中对比 步数 10 与 20 的细节和耗时', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：在 ⑤ K采样器 中只改第 3 项“步数（steps）”，保持 cfg 7 与种子 42 不变', nodes: ['KSampler'] },
      { track: 't2i', active: 3, where: '实验三（只改引导强度）：在 ⑤ K采样器 中对比 cfg 5.0 与 7.0 的贴合度和自然感', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：在 ⑤ K采样器 中只改第 4 项“cfg”，体会引导拉扯力度', nodes: ['KSampler'] },
      { track: 'ops', active: 0, where: '将三组对比实验的 JSON 与输出图片按变量名分类保存，形成自己的调参参考表', shot: 'assets/screenshots/t2i-decode-save.png', caption: '实机截图：可在 ⑦ 保存图像 的“文件名前缀”中注明实验项（如 ComfyClass/cfg5）', nodes: ['SaveImage'] }
    ],
    img2img: [
      { track: 'i2i', active: 0, where: '导入 02-image-to-image.json，观察采样器前方新增的“加载→缩放→VAE编码”支路', shot: 'assets/screenshots/img2img-overview.png', caption: '实机截图：红框标出图生图新增支路 ④ 加载图像 → ⑤ 缩放图像 → ⑥ VAE编码', nodes: ['LoadImage', 'ImageScale', 'VAEEncode'] },
      { track: 'i2i', active: 2, where: '点击 ④ 加载图像 节点内的“选择文件上传”按钮上传原图，经 ⑤ 缩放图像 规整为 512×512', shot: 'assets/screenshots/img2img-overview.png', caption: '实机截图：一定要点 ④ 号节点里的“选择文件上传”，不要把带元数据的 PNG 拖到空白画布', nodes: ['LoadImage', 'ImageScale'] },
      { track: 'i2i', active: 1, where: '在 ② 正向提示词写修改后的目标（如蓝色水彩茶壶），与原图起点配合', shot: 'assets/screenshots/img2img-overview.png', caption: '实机截图：② 号正向提示词描述目标画面，⑥ 号 VAE编码 提供原图潜空间起点', nodes: ['CLIPTextEncode', 'VAEEncode'] },
      { track: 'i2i', active: 4, where: '在 ⑦ K采样器 中以 降噪（denoise）= 0.55 运行中间强度基线', shot: 'assets/screenshots/img2img-denoise.png', caption: '实机截图：红框标出 ⑦ K采样器，最底下一行“降噪（denoise）”设为 0.55', nodes: ['KSampler'] },
      { track: 'i2i', active: 4, where: '固定种子 42，分别改 降噪 为 0.30（更像原图）与 0.70（改动更大）跑图对比', shot: 'assets/screenshots/img2img-denoise.png', caption: '实机截图：只调 ⑦ K采样器 底部的“降噪”数值，直观对比保留结构与重绘幅度', nodes: ['KSampler', 'VAEDecode', 'SaveImage'] }
    ],
    'z-image': [
      { track: 'zimage', active: 0, where: '导入 03-z-image-turbo.json，认识现代拆分模型的 10 节点完整布局', shot: 'assets/screenshots/zimage-overview.png', caption: '实机截图：03-z-image-turbo.json 在本机 ComfyUI 画布上的完整布局', nodes: ['UNETLoader', 'CLIPLoader', 'VAELoader'] },
      { track: 'zimage', active: 0, where: '核对 ① UNet加载器（z_image_turbo_bf16）、③ 加载CLIP（qwen_3_4b + lumina2）与 ⑧ 加载VAE', shot: 'assets/screenshots/zimage-loaders.png', caption: '实机截图：红框标出 ① UNet加载器 与 ③ 加载CLIP（注意“类型”必须选 lumina2）', nodes: ['UNETLoader', 'CLIPLoader', 'VAELoader'] },
      { track: 'zimage', active: 1, where: '追踪 ② 采样算法（AuraFlow，移位 3.00）与 ⑤ 条件零化（ConditioningZeroOut）的作用', shot: 'assets/screenshots/zimage-sampling.png', caption: '实机截图：红框包含 ② AuraFlow(shift=3.00)、⑤ 条件零化、⑥ 1024潜图 与 ⑦ K采样器', nodes: ['ModelSamplingAuraFlow', 'CLIPTextEncode', 'ConditioningZeroOut'] },
      { track: 'zimage', active: 4, where: '核对 ⑥ 空Latent图像（SD3）1024×1024 与 ⑦ K采样器（8 步 · cfg 1.0 · res_multistep · simple）', shot: 'assets/screenshots/zimage-sampling.png', caption: '实机截图：Z-Image Turbo 使用 1024×1024 画幅与 8 步、cfg 1.0、res_multistep、simple 参数', nodes: ['EmptySD3LatentImage', 'KSampler'] },
      { track: 'zimage', active: 5, where: '点击“运行”，在本机真实生成 1024×1024 红色陶瓷茶壶并核实 output/ComfyClass 文件', shot: 'assets/screenshots/zimage-result.png', caption: '实机出图验收：本机 RTX 5070 Ti 真实运行 03-z-image-turbo.json 生成 1024×1024 茶壶全过程', nodes: ['VAEDecode', 'SaveImage'] }
    ],
    inpaint: [
      { track: 'inpaint', active: 0, where: '导入 04-inpaint.json 并上传 512×512 方图，局部重绘支路不经过缩放节点', shot: 'assets/screenshots/inpaint-nodes.png', caption: '实机截图：① 加载图像 同时输出“图像”与“遮罩”，保持同尺寸避免坐标错位', nodes: ['LoadImage'] },
      { track: 'inpaint', active: 1, where: '右键 加载图像 打开 MaskEditor 涂出茶壶局部区域，并用 遮罩转换为图像 检查白黑分布', shot: 'assets/screenshots/inpaint-maskeditor.png', caption: '红框指引：右键点“在遮罩编辑器中打开”，只涂茶壶主体（白色 = 允许重绘，黑色 = 保留桌面）', nodes: ['LoadImage', 'MaskToImage', 'PreviewImage'] },
      { track: 'inpaint', active: 2, where: '换用 ③ VAE编码（局部重绘），同时接入图像、VAE 和遮罩（mask）三根线', shot: 'assets/screenshots/inpaint-nodes.png', caption: '实机截图：红框左侧 ③ VAE编码（局部重绘）接收像素、vae、遮罩三路输入，输出带遮罩的 Latent', nodes: ['VAEEncodeForInpaint'] },
      { track: 'inpaint', active: 3, where: '写明局部修改目标提示词，送入 K采样器 对遮罩区域进行重绘采样', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机对照：带遮罩的 Latent 送入 K采样器“Latent图像”端口进行采样', nodes: ['CLIPTextEncode', 'KSampler'] },
      { track: 'inpaint', active: 4, where: '添加 ④ 合成图像（遮罩），把新生成区域精准贴回原图，严格保护遮罩外像素', shot: 'assets/screenshots/inpaint-nodes.png', caption: '实机截图：红框右侧 ④ 合成图像（遮罩）——目标图像接原图、来源图像接新图、遮罩接原 MASK', nodes: ['ImageCompositeMasked', 'FeatherMask', 'VAEDecode', 'SaveImage'] },
      { track: 'inpaint', active: 5, where: '放大验收茶壶边缘过渡与背景木纹保护情况，备份工作流与原图素材', shot: 'assets/screenshots/inpaint-nodes.png', caption: '实机截图：完整核对“加载原图+遮罩 → 局部重绘编码 → 采样解码 → 遮罩合成”链路', nodes: ['ImageCompositeMasked', 'FeatherMask', 'SaveImage'] }
    ],
    'lora-controlnet': [
      { track: 'ext', active: 0, where: '第一步先核对主模型、LoRA、ControlNet、放大模型是否同属对应家族与阶段', shot: 'assets/screenshots/ext-lora-controlnet.png', caption: '实机截图：在画布上对比 加载LoRA（改模型/CLIP 路径）与 ControlNet（改条件路径）', nodes: ['LoraLoader', 'ControlNetLoader', 'UpscaleModelLoader', 'ImageUpscaleWithModel'] },
      { track: 'ext', active: 1, where: '追踪 加载LoRA 接线：串在 MODEL 与 CLIP 路径中间，输出再进采样器和文本框', shot: 'assets/screenshots/ext-lora-controlnet.png', caption: '实机截图：红框处为 加载LoRA——进出都是紫色“模型”与黄色“CLIP”，用于微调画风倾向', nodes: ['LoraLoader', 'CheckpointLoaderSimple', 'CLIPTextEncode', 'KSampler'] },
      { track: 'ext', active: 3, where: '固定种子与提示词，单独微调 加载LoRA 的“模型强度（strength_model）”做对比', shot: 'assets/screenshots/ext-lora-controlnet.png', caption: '实机截图：只调 加载LoRA 中的“模型强度”，保持“CLIP强度”与种子不变', nodes: ['LoraLoader'] },
      { track: 'ext', active: 2, where: '打开官方 ControlNet 涂鸦示例，准备匹配的 ControlNet 权重与已预处理条件图', shot: 'assets/screenshots/ext-lora-controlnet.png', caption: '实机截图：右侧上方为 加载ControlNet模型，读取 controlnet 目录下的对应权重', nodes: ['ControlNetLoader', 'LoadImage'] },
      { track: 'ext', active: 2, where: '追踪 应用ControlNet 接线：条件图进“图像”、权重进 ControlNet，串在正/负面条件路径上', shot: 'assets/screenshots/ext-lora-controlnet.png', caption: '实机截图：右侧下方为 应用ControlNet——串在橙色“正面条件 / 负面条件”路径上约束构图', nodes: ['ControlNetApplyAdvanced', 'KSampler'] }
    ],
    'save-queue': [
      { track: 'ops', active: 0, where: '在工作流菜单中导出普通 UI 工作流 JSON，作为可二次编辑的配方备份', shot: 'assets/screenshots/ui-canvas-overview.png', caption: '实机截图：通过左上角 Comfy 菜单导出普通工作流 JSON（非 API 格式）', nodes: [] },
      { track: 'ops', active: 1, where: '到当前实例的 output/ComfyClass 目录核实独立 PNG 原图文件', shot: 'assets/screenshots/zimage-result.png', caption: '实机截图：右侧任务队列与底部保存图像节点均对应磁盘 output/ComfyClass 下的真实 PNG', nodes: ['SaveImage'] },
      { track: 'ops', active: 0, where: '新开标签页重新导入刚保存的 JSON（或拖入原始 PNG），验证备份确实可恢复', shot: 'assets/screenshots/ui-canvas-overview.png', caption: '实机截图：验证重新导入后节点、连线与参数完整恢复', nodes: ['CheckpointLoaderSimple', 'LoadImage'] },
      { track: 'ops', active: 2, where: '保持手动运行、数量 1、批量大小 1；学会用顶部 × 取消当前任务并检查任务队列空闲', shot: 'assets/screenshots/ui-run-queue.png', caption: '实机截图：红框处看清“运行次数 1”、“取消当前任务 ×”与“0 个活动任务”队列按钮', nodes: ['EmptyLatentImage'] },
      { track: 'ops', active: 1, where: '整理可复现练习包（JSON + 素材 + 模型清单），对外分享前检查 PNG 元数据隐私', shot: 'assets/screenshots/t2i-decode-save.png', caption: '实机截图：SaveImage 保存的原始 PNG 默认带有提示词与工作流元数据，分享前注意检查', nodes: ['SaveImage'] }
    ],
    'custom-nodes': [
      { track: 'ops', active: 3, where: '先读清缺失报告：分清是 Missing Models（缺权重文件）还是 Missing Nodes（缺节点代码）', shot: 'assets/screenshots/t2i-checkpoint.png', caption: '实机截图：右上角弹窗明确提示“缺少所需的模型文件”——这属于缺权重，应去管模型目录而非装插件', nodes: ['CheckpointLoaderSimple'] },
      { track: 'ops', active: 3, where: '确需第三方节点时，先核对作者、用途、兼容版本与是否有内置核心节点可替代', shot: 'assets/screenshots/ui-node-library.png', caption: '实机截图：装插件前先在左侧“节点库”搜一下内置 core 节点是否已经支持该功能', nodes: [] },
      { track: 'ops', active: 3, where: '备份当前工作流后，点击顶部“管理扩展功能（Manager）”只安装确认需要的那一个包', shot: 'assets/screenshots/ui-manager-btn.png', caption: '实机截图：红框处为顶部“管理扩展功能（Manager）”入口，按准确包名查找并管理扩展', nodes: [] },
      { track: 'ops', active: 3, where: '按提示重启当前实例，既验证新工作流节点不再标红，也重跑一次基础文生图确认未破坏旧环境', shot: 'assets/screenshots/ui-canvas-overview.png', caption: '实机截图：重启后先跑一遍基础 core 工作流，确认原有环境依然健康', nodes: [] },
      { track: 'ops', active: 3, where: '若新包引起异常，第一时间在“管理扩展功能”中禁用（Disable）该包并重启回退，不盲目重装整个软件', shot: 'assets/screenshots/ui-manager-btn.png', caption: '实机截图：通过“管理扩展功能”可随时禁用刚安装的扩展包，快速隔离冲突', nodes: [] }
    ],
    troubleshooting: [
      { track: 'ops', active: 3, where: '排错第 1 步：停掉自动队列，导出当前工作流保留现场，展开“查看详情”记录第一条具体报错', shot: 'assets/screenshots/t2i-checkpoint.png', caption: '实机截图：出错时先点右上角弹窗的“查看详情”，记下报错节点名与第一行具体错误原因', nodes: [] },
      { track: 'ops', active: 3, where: '排错第 2 步：Value not in list / 缺模型就查目录和下拉框；Missing Nodes 就查版本与扩展包', shot: 'assets/screenshots/ui-model-library.png', caption: '实机截图：缺模型时对照“模型库”与加载器下拉框，不要去乱装自定义节点', nodes: ['CheckpointLoaderSimple', 'UNETLoader'] },
      { track: 'ops', active: 3, where: '排错第 3 步：报 tensor shape / channels 维度冲突时，检查主模型、CLIP、VAE、LoRA 是否跨家族混插', shot: 'assets/screenshots/zimage-loaders.png', caption: '实机截图：拆分模型必须保证 UNet、CLIP（及 type）、VAE 三者属于配套家族', nodes: ['CheckpointLoaderSimple', 'UNETLoader', 'CLIPLoader', 'VAELoader', 'LoraLoader'] },
      { track: 'ops', active: 3, where: '排错第 4 步：报 CUDA out of memory（显存不足）时，清空队列、降回小尺寸、batch_size 设 1 并重启实例', shot: 'assets/screenshots/t2i-latent-ksampler.png', caption: '实机截图：显存不足时重点检查画布宽高与“批量大小（batch_size = 1）”，改提示词不会省显存', nodes: ['EmptyLatentImage', 'EmptySD3LatentImage'] },
      { track: 'ops', active: 3, where: '排错第 5 步：能出图但偏色或不好看时，核对 VAE 并回到固定种子的基线做单变量排查', shot: 'assets/screenshots/zimage-result.png', caption: '实机截图：先用验证过的基线参数跑出干净参考图，再每次只改一个旋钮', nodes: ['KSampler', 'VAEDecode'] },
      { track: 'ops', active: 3, where: '排错第 6 步：带着脱敏后的五件套（版本、显卡、模型名、第一条报错、最小 JSON）高效求助，并完成结课作品', shot: 'assets/screenshots/zimage-teapot-output.png', caption: '实机结课成果：在本机独立跑通并归档的高清红色陶瓷茶壶作品', nodes: ['SaveImage'] }
    ]
  }
};
