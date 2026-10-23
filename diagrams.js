/* All illustrations are original teaching schematics, not Desktop screenshots or model output. */
(() => {
  const item = (id, title, text) => ({ id, title, text });
  const flow = (items, parallel = false) => `<div class="flow-strip${parallel ? ' parallel' : ''}">${items.map((entry, index) => `<button class="flow-item" type="button" data-diagram="${entry.id}" aria-pressed="${index === 0}"><span class="flow-number">${String(index + 1).padStart(2, '0')}</span><strong>${entry.title}</strong><small>${entry.label}</small></button>`).join('')}</div>`;
  const pipeline = [
    { ...item('idea', '说清你的想法', '先确定一个主体、一种画面风格。你提供文字、图片等输入；模型不会自动知道你脑子里的构图。第一课先用一个茶壶作为练习主体。'), label: '文字 / 图片 · 你提供的输入' },
    { ...item('recipe', '连好工作流', '工作流像一张加工配方：每个节点做一件事，连线传递指定类型的数据。JSON 保存这张配方，不会把模型权重一起打包。'), label: '节点 + 连线 · 可复用的配方' },
    { ...item('run', '交给模型计算', '点击 Run 把任务提交给当前实例。模型、输入和依赖都准备好后，本地工作流使用你的电脑计算；Partner API 节点则会调用外部服务。'), label: 'Run · 执行这一张配方' },
    { ...item('result', '收下结果和配方', '图片是成品，工作流是做法。图片和 JSON 分别保存；记录模型、参数和输入素材，下一次才有条件复现。'), label: '图片 + 工作流 · 不只存图片' }
  ];
  const graph = [
    item('checkpoint', 'Load Checkpoint · 载入基础模型', '这个 SD1.5 教学节点给出 MODEL、CLIP、VAE 三类输出：MODEL 送到采样器，CLIP 送到两个文本编码器，VAE 送到解码器。它们不是三张图片。'),
    item('positive', 'CLIP Text Encode · 正向提示词', '写你想要的画面。CLIP 将文字转成 CONDITIONING，连接 KSampler 的 positive 输入。正负两块通常是同一种节点，差别在连接到哪个端口。'),
    item('negative', 'CLIP Text Encode · 负向提示词', '写希望减少的特征，例如 blurry。输出连接 negative，不是把正向提示词自动取反，也不能保证写了就绝不出现。'),
    item('latent', 'Empty Latent Image · 设置画幅', '512 × 512 和 batch_size = 1 定义这次图像潜空间的尺寸与数量。它不是白色图片，噪声由采样过程按 seed 生成。'),
    item('sampler', 'KSampler · 真正开始采样', '同时接收 MODEL、正向和负向 CONDITIONING、初始 LATENT。它按 seed、steps、CFG、采样器、调度器和 denoise 计算，输出仍然是 LATENT。'),
    item('decode', 'VAE Decode · 变成可看的像素', '接收 KSampler 的 samples 和模型的 VAE，把 LATENT 解码为 IMAGE。漏了它，就不能把采样结果直接接给 Save Image。'),
    item('save', 'Save Image · 保存成品', '只接 IMAGE。运行成功后把图片保存到当前实例配置的输出目录；文件名前缀可用于归类。工作流 JSON 要另外保存。')
  ];
  const node = (id, title, sub, sockets, selected = false) => `<button class="graph-node node-${id}" type="button" data-diagram="${id}" aria-pressed="${selected}"><strong>${title}</strong><small>${sub}</small><span class="socket-label">${sockets}</span></button>`;
  const graphHTML = `<div class="node-graph" aria-label="SD1.5 文生图的七个节点；点击节点查看输入输出。">
    <svg class="graph-wires" viewBox="0 0 900 370" preserveAspectRatio="none" aria-hidden="true">
      <path d="M189 82 C212 82 215 60 234 60 M189 82 C215 82 215 182 234 182"/>
      <path d="M189 82 H213 V120 H452 V186 H477"/>
      <path d="M189 82 H213 V5 H700 V171 H711"/>
      <path class="condition" d="M423 60 C453 60 447 186 477 186 M423 182 H477"/>
      <path class="latent" d="M423 304 C455 304 449 186 477 186 M666 186 H690 V171 H711"/>
      <path d="M900 171 H909 V239 H693 V304 H711"/>
    </svg>
    ${node('checkpoint', '① 载入模型', 'Load Checkpoint', 'MODEL · CLIP · VAE', true)}
    ${node('positive', '② 正向提示词', 'CLIP Text Encode', 'CLIP → CONDITIONING')}
    ${node('negative', '③ 负向提示词', 'CLIP Text Encode', 'CLIP → CONDITIONING')}
    ${node('latent', '④ 设置画幅', 'Empty Latent Image', '512 × 512 → LATENT')}
    ${node('sampler', '⑤ 采样生成', 'KSampler', 'MODEL + 条件 + LATENT<br>↓ LATENT')}
    ${node('decode', '⑥ 解码图像', 'VAE Decode', 'LATENT + VAE → IMAGE')}
    ${node('save', '⑦ 保存图像', 'Save Image', 'IMAGE → PNG')}
  </div><div class="graph-mobile-note">连线读法：① 的 MODEL → ⑤；CLIP → ②③ → ⑤；④ → ⑤ → ⑥ → ⑦；① 的 VAE → ⑥。小屏改用节点卡片，编号与桌面图一致。</div>`;
  const desktop = [
    item('instance', '先分清 Desktop 外壳和画布', '新版 Desktop 管理本地实例、存储路径和启动环境；进入某个实例后，才是连接节点的 ComfyUI 画布。Legacy Desktop 可能直接进入画布。这张图只标功能区域，不保证与你的版本位置完全相同。'),
    item('library', '素材与资源入口', 'Node Library 找节点；Model Library 看模型；Workflows 找已保存的工作流。模板入口在版本间会变化，也可以找 Workflow 菜单中的 Browse Workflow Templates。'),
    item('canvas', '画布：你真正搭工作流的地方', '拖动节点标题移动节点，从输出圆点连到兼容的输入圆点。双击空白处通常可以搜索添加节点；触控板、缩放和拖动画布的方式可在设置里查看。'),
    item('properties', '参数、说明与错误', '选中节点查看参数和说明；新版右侧面板也会显示 Errors / Missing Models。先读报错节点和缺失项，不要见红就重装。旧版可能是弹窗或节点内提示。'),
    item('queue', 'Run：入队，不是存文件', '普通 Run 提交一次任务。Run bar 的数量是重复入队次数，不等于 Empty Latent Image 的 batch_size。先将两者都设为 1；别误开 On Change 或 Instant 自动运行。'),
    item('logs', '队列、取消与日志', '队列告诉你正在运行还是还在等待。Cancel 停止当前执行，Clear queue 清除等待项，两者分开看。底部 Logs / 日志用于找到完整错误；Job History 位置取决于版本和设置。')
  ];
  const desktopHTML = `<div class="desktop-map" aria-label="ComfyUI Desktop 功能分区教学示意">
    <div class="map-toolbar"><button type="button" class="hotspot" data-diagram="instance" aria-pressed="true"><b>01</b>Desktop / 本地实例</button><button type="button" class="hotspot" data-diagram="queue" aria-pressed="false"><b>05</b>▶ Run / 队列</button></div>
    <div class="map-body"><div class="map-sidebar"><button type="button" class="hotspot" data-diagram="library" aria-pressed="false"><b>02</b>资源入口<small>Nodes 节点<br>Models 模型<br>Workflows 工作流</small></button><button type="button" class="hotspot" data-diagram="instance" aria-pressed="false">设置 / 存储路径</button></div><button type="button" class="hotspot map-canvas" data-diagram="canvas" aria-pressed="false"><span aria-hidden="true">[ 输入 ] ── [ 处理 ] ── [ 输出 ]</span><b>03 · 节点画布 Canvas</b><small>摆节点，连线，读数据的方向</small></button><button type="button" class="hotspot map-properties" data-diagram="properties" aria-pressed="false"><b>04</b>属性面板<small>Parameters 参数<br>Info 说明<br>Errors 错误</small></button></div>
    <div class="map-bottom"><button type="button" class="hotspot" data-diagram="logs" aria-pressed="false"><b>06</b>日志 / 任务状态</button><button type="button" class="hotspot" data-diagram="canvas" aria-pressed="false">缩放 / Fit 适合画布</button></div>
  </div>`;
  const img2img = [
    { ...item('input', '读入并整理图片', 'Load Image 上传你有权使用的图片。本项目用 ImageScale 居中裁剪到 512 × 512，避免第一次就处理大图；非方图的边缘可能被裁掉，先检查缩放结果。'), label: 'Load Image → ImageScale' },
    { ...item('encode', '编码成潜空间', 'VAE Encode 将 IMAGE 编为 LATENT，替代文生图里的 Empty Latent Image。给 Encode 和 Decode 使用同一基础模型提供的 VAE。'), label: 'VAE Encode · IMAGE → LATENT' },
    { ...item('change', '决定改动幅度', 'KSampler 根据输入 latent 和提示词重新采样。denoise 较低通常更保留原图，较高通常变化更大；0.55 是本练习起点，不是 55% 的像素会改变。'), label: 'KSampler · 从 denoise 0.55 起步' },
    { ...item('decode', '解码并另存结果', 'VAE Decode 变回 IMAGE，然后 Save Image 输出新文件。保留原图，固定 seed，仅比较 denoise 0.30 / 0.55 / 0.70，观察结构与风格分别变化多少。'), label: 'VAE Decode → Save Image' }
  ];
  const extensionItems = [
    { ...item('lora', 'LoRA · 影响风格', 'LoRA 是附加权重，不是插件，也不是独立 checkpoint。原生 Load LoRA 接在基础模型和后续采样 / 文本编码之间。要匹配模型家族，并读作者要求的触发词与强度。'), label: '加一种风格 / 概念能力' },
    { ...item('controlnet', 'ControlNet · 约束结构', '通过边缘、深度、姿态等条件约束构图。控制模型要匹配基础模型家族，参考图片常需相应预处理；用官方对应模板，不要把普通图片随便当深度图。'), label: '让姿态 / 轮廓更可控' },
    { ...item('upscale', '放大 · 增加尺寸', '普通缩放只是改变像素尺寸；模型放大或分块重绘会增加计算和显存压力，也可能改变细节。先把小图构图调好，再按匹配的官方 Upscale 模板试验。'), label: '先构图，再考虑大图' }
  ];
  const files = [
    { ...item('weights', '模型权重', 'checkpoint、LoRA、VAE、ControlNet 各有自己的类别目录与兼容关系。目录以当前实例的实际 Storage 设置为准，不是本教学项目的 workflows 文件夹。'), label: 'models / 按类型存放' },
    { ...item('workflow', '工作流 JSON', '保存节点、连线、参数和部分布局。JSON 不是模型安装包，不能替你携带 checkpoint、输入图片和自定义节点的 Python 依赖。'), label: '配方 · 单独导出备份' },
    { ...item('media', '输入与输出图片', 'input / output 的位置由实例配置决定。原始 PNG 可能带工作流元数据，截图和社交平台转存图通常不能保证恢复；分享前检查提示词、文件名与图片隐私。'), label: '素材与成品 · 不等于配方' }
  ];
  const models = [
    { ...item('checkpoint', 'Checkpoint · 本课的一体模型包', '本课示例 v1-5-pruned-emaonly-fp16.safetensors 同时包含 MODEL、CLIP 和 VAE，放在模型根目录的 checkpoints 子目录，用 Load Checkpoint 选择。完整指本练习的推理组件齐全，不是所有训练状态都保留；也不是每个 .safetensors 都是这样的完整包。'), folder: 'checkpoints', label: '本课只下载这一份 SD1.5 文件' },
    { ...item('diffusion', 'Diffusion Model · 负责生成的核心', '扩散模型逐步去噪，得到潜在表示；UNet、DiT 是常见网络结构名称。独立权重通常放 diffusion_models，用 Load Diffusion Model 加载，再配匹配的文本编码器与 VAE。旧目录名 unet 仍有兼容支持。本课 checkpoint 已包含这一部分，不必再下载。'), folder: 'diffusion_models', label: '噪声 + 条件 → 潜在结果' },
    { ...item('text', 'Text Encoder · 理解提示词', 'CLIP、T5 等文本编码器把提示词转换为条件信息。独立文件放 text_encoders，按工作流使用 Load CLIP、DualCLIPLoader 等匹配节点；旧目录名 clip 仍有兼容支持。不同家族要求不同，不能只凭文件后缀互换。本课 checkpoint 已包含所需 CLIP。'), folder: 'text_encoders', label: '你的文字 → 模型能使用的条件' },
    { ...item('vae', 'VAE · 图片与潜空间之间的翻译', 'VAE 在像素图片与潜在表示之间编码、解码。独立文件放 vae，由 Load VAE 加载，再供 VAE Encode / VAE Decode 使用；编码和解码节点本身不是下载的权重。本课 checkpoint 已提供 VAE，无需另装。'), folder: 'vae', label: '潜在结果 → 可见图片' },
    { ...item('lora', 'LoRA · 风格或概念补丁', '轻量附加权重，常用于画风、角色、服装等，通常不能独立出图。放 loras，用 Load LoRA 接入基础模型，并按作者说明设置触发词和强度。必须匹配基础模型家族；SD1.5 的 LoRA 不能默认给 SDXL 或 FLUX 使用。'), folder: 'loras', label: '加风格 / 角色 · 需要匹配基础模型' },
    { ...item('controlnet', 'ControlNet · 约束结构', '根据边缘、姿态或深度等条件约束生成。放 controlnet，通过 Load ControlNet Model 和匹配的 Apply 节点接入；参考图可能需要预处理。权重、预处理器和参考图是三件不同的东西，要按对应家族的模板配套。'), folder: 'controlnet', label: '管姿态 / 轮廓 · 按参考条件生成' },
    { ...item('upscale', 'Upscale Model · 放大已有图片', '对已有图片进行学习型放大与细节处理。放 upscale_models，通过 Load Upscale Model 与 Upscale Image (using Model) 使用。不等于普通像素缩放，也不能保证还原真实细节；模型放大后的图可能需要继续检查。'), folder: 'upscale_models', label: '成图之后 · 放大和细节处理' },
    { ...item('vision', 'CLIP Vision · 理解参考图片', '把图片编码为视觉特征，供特定参考图工作流使用；不等于处理提示词的 CLIP 文本编码器。放 clip_vision，通过 Load CLIP Vision 加载，并按对应模板连接后续节点。单独放进目录不会自动获得参考图能力。'), folder: 'clip_vision', label: '参考图片 → 视觉特征' },
    { ...item('embedding', 'Embedding · 小型概念向量', '训练得到的概念向量，需匹配模型家族与文本编码器。放 embeddings，通常在兼容的提示词节点中按 embedding:文件名 引用，不是用 Load Checkpoint 加载。本课不需要；不要把所有小文件都当成 LoRA。'), folder: 'embeddings', label: '配合提示词 · 不是完整模型' }
  ];
  const modelButton = (entry, selected = false) => `<button class="flow-item model-button" type="button" data-diagram="${entry.id}" aria-pressed="${selected}"><strong>${entry.title.split(' · ')[0]}</strong><span>${entry.label}</span><code>${entry.folder}/</code></button>`;
  const modelsHTML = `<div class="model-map">
    <p class="model-map-label">① 先用一体包跑通 · 点击卡片看用途、目录和加载节点</p>
    ${modelButton(models[0], true)}
    <div class="model-components"><p>上面这一份文件，已经包含下面三部分 ↓</p><div class="model-component-grid">${[models[2], models[1], models[3]].map(entry => modelButton(entry)).join('')}</div><p class="model-map-note">卡片里的目录用于独立权重；本课不需要再把这三份各下载一次。</p></div>
    <p class="model-map-label">② 按需认识的配件 · 不是本次下载清单</p>
    <div class="model-extras">${models.slice(4).map(entry => modelButton(entry)).join('')}</div>
    <p class="model-map-label">③ 从下载到加载 · 功能定位示意，不是实机截图</p>
    <ol class="model-route"><li><strong>Hugging Face</strong><span>Model card → Files → 指定文件</span><b>Download file · 2.13 GB</b></li><li><strong>Desktop · Storage</strong><span>打开当前实例的模型根目录</span><b>放进 checkpoints 子目录</b></li><li><strong>Load Checkpoint</strong><span>刷新后，在 ckpt_name 选择文件</span><b>运行成功才算验证完成</b></li></ol>
    <div class="model-location"><span>本课文件位置示意（根目录以你的 Desktop 配置为准）</span><code>模型根目录 / checkpoints / v1-5-pruned-emaonly-fp16.safetensors</code></div>
  </div>`;
  const dependencies = [
    { ...item('missing-model', '缺模型 · 文件问题', '加载节点存在，但权重文件不在当前搜索路径里。先检查模型类别、实际 Storage 路径、下载是否完整，再刷新并重新选择文件；不是先装一个节点包。'), label: 'Missing Models / Value not in list' },
    { ...item('missing-node', '缺节点 · 工具问题', '工作流需要的节点类型不可用。先区分是新版 core 节点还是第三方包，再核对版本、作者和准确包名。不要一键安装陌生工作流要求的全部代码。'), label: 'Missing Nodes / 未知节点类型' },
    { ...item('import-failed', '加载失败 · 环境问题', '包存在不代表它成功启动。看当前实例的启动日志与第一条 import 错误，可能是依赖冲突或版本不兼容；先禁用最近加入的包验证，不重装整个环境。'), label: 'Import failed / 启动错误' }
  ];
  const diagnoses = [
    { ...item('read', '先读错误', '先记下失败节点、错误首行、工作流使用的模型家族。保存工作流副本与日志。不反复点击 Run，不先删除配置。'), label: '哪一步失败？缺什么？' },
    { ...item('classify', '再分种类', 'Value not in list 多与模型选项有关；missing node 是节点定义问题；CUDA out of memory 是显存问题；网络错误要先确认是否在调用 API。它们不是同一个故障。'), label: '模型 / 节点 / 显存 / 网络' },
    { ...item('minimal', '缩小到基线', '先尝试本项目 512 × 512、batch_size = 1 的原生文生图，并核对模型。一次仅改变一个因素。关闭占用 GPU 的其他程序，不对未知命令盲目回车。'), label: '一张小图，一个改动' },
    { ...item('verify', '复测并记录', '基线成功后，逐个恢复原工作流的分辨率、节点和参数。记录最后一次成功与第一次失败的差别；求助时附日志和版本，但遮住令牌与个人信息。'), label: '找到边界，再升级处理' }
  ];
  const pot = (color) => `<svg viewBox="0 0 200 135" role="img" aria-label="茶壶轮廓示意"><rect width="200" height="135" fill="#e8efe9"/><rect y="104" width="200" height="31" fill="#d4c6ae"/><path d="M124 58 C166 32 166 102 127 94" stroke="${color}" fill="none" stroke-width="10"/><path d="M69 66 L34 43 L46 87 L78 95" fill="${color}"/><ellipse cx="100" cy="82" rx="37" ry="29" fill="${color}"/><path d="M72 56 Q100 44 128 56" stroke="${color}" stroke-width="10" fill="none"/><circle cx="100" cy="43" r="6" fill="${color}"/></svg>`;
  const maskHTML = `<div class="mask-visual"><div class="mask-tile">${pot('#b7684f')}<p>① 原图 · 红色茶壶</p></div><div class="mask-tile"><svg viewBox="0 0 200 135" role="img" aria-label="黑底上白色椭圆遮罩，白色覆盖待修改茶壶区域"><rect width="200" height="135" fill="#161b17"/><ellipse cx="99" cy="75" rx="68" ry="44" fill="white"/></svg><p>② 遮罩 · 白色 = 要改</p></div><div class="mask-tile">${pot('#648aaf')}<p>③ 目标示意 · 不是生成结果</p></div></div>`;
  const parametersHTML = `<div class="lab-grid"><div class="lab-controls">
    <label class="range-label" for="steps-range">Steps · 采样步数 <output id="steps-value" for="steps-range">20</output></label><input id="steps-range" type="range" min="4" max="50" step="1" value="20" data-parameter="steps">
    <label class="range-label" for="cfg-range">CFG · 提示引导强度 <output id="cfg-value" for="cfg-range">7</output></label><input id="cfg-range" type="range" min="1" max="15" step="0.5" value="7" data-parameter="cfg">
    <label class="range-label" for="denoise-range">Denoise · 图生图去噪强度 <output id="denoise-value" for="denoise-range">0.55</output></label><input id="denoise-range" type="range" min="0" max="1" step="0.05" value="0.55" data-parameter="denoise">
  </div><div class="lab-result" id="lab-result" aria-live="polite"></div></div>`;
  const zimage = [
    item('unet', 'UNet加载器 · 读扩散模型', '从 diffusion_models 目录加载 z_image_turbo_bf16.safetensors。它只输出 MODEL（去噪大脑），不包含 CLIP 和 VAE。'),
    item('auraflow', '采样算法（AuraFlow） · 偏移校准', '接在 UNet加载器 与 K采样器 之间，将移位（shift）设为 3.00，为 Flow 架构校准采样时间步分布。'),
    item('clip', '加载CLIP · 读文字编码器', '从 text_encoders 目录加载 qwen_3_4b.safetensors，并将“类型（type）”设为 lumina2，输出 CLIP 给提示词编码节点。'),
    item('prompt', 'CLIP文本编码 · 正向提示词', '用 qwen_3_4b 将描述词编码为 CONDITIONING；一路送去 K采样器 正面条件，另一路送去条件零化。'),
    item('zero', '条件零化 · 负向置零', '蒸馏模型在 cfg = 1.0 时负面提示词基本不参与引导拉扯，直接把条件向量置零送入负面条件，省去多余编码。'),
    item('sd3latent', '空Latent图像（SD3） · 16 通道画布', '创建 1024 × 1024、batch_size = 1 的 16 通道空白潜图（不同于 SD1.5 的 4 通道 512 画布）。'),
    item('zsampler', 'K采样器 · 8 步快速采样', '接收校准后的 MODEL、正负条件与 1024 潜图；按步数 8、cfg 1.0、采样器 res_multistep、调度器 simple 生成结果 LATENT。'),
    item('vae', '加载VAE + VAE解码 + 保存图像', '用 加载VAE 读取 vae/ae.safetensors，交给 VAE解码 把 LATENT 还原成 1024×1024 像素图，再由 保存图像 存入 output/ComfyClass。')
  ];
  const zimageHTML = `<div class="flow-strip">${zimage.slice(0, 4).map((entry, index) => `<button class="flow-item" type="button" data-diagram="${entry.id}" aria-pressed="${index === 0}"><span class="flow-number">0${index + 1}</span><strong>${entry.title.split(' · ')[0]}</strong><small>${entry.title.split(' · ')[1]}</small></button>`).join('')}</div><div class="flow-strip">${zimage.slice(4).map((entry, index) => `<button class="flow-item" type="button" data-diagram="${entry.id}" aria-pressed="false"><span class="flow-number">0${index + 5}</span><strong>${entry.title.split(' · ')[0]}</strong><small>${entry.title.split(' · ')[1]}</small></button>`).join('')}</div>`;
  window.COMFY_DIAGRAMS = {
    pipeline: { title: '一张图，是怎样做出来的？', hint: '点击卡片，先建立一张心智地图', html: flow(pipeline), items: pipeline },
    desktop: { title: 'Desktop 功能地图', hint: '教学布局示意 · 点击区域查看用途', html: desktopHTML, items: desktop },
    graph: { title: '读懂这 7 个节点，就不再怕连线', hint: '简化端口示意 · 点击节点，查看数据流向', html: graphHTML, items: graph },
    parameters: { title: '拖动参数，理解变化方向', hint: 'SD1.5 概念练习 · 不运行模型，不预测图片', html: parametersHTML, items: [item('parameters', '比较时先锁定 Seed', '保持模型、输入、分辨率、采样器、调度器与 seed 不变，一次只调整一个参数。这里的三个滑块只解释概念；真实结果需在 Desktop 比较。不同模型家族不能套用同一组推荐值。')] },
    img2img: { title: '图生图：先把图片变成模型能处理的数据', hint: '点击步骤 · 不是把图片直接接到 KSampler', html: flow(img2img), items: img2img },
    zimage: { title: 'Z-Image Turbo：把“三合一礼盒”拆成三个独立加载器', hint: '点击卡片 · 对照 SD1.5 看哪些变了、哪些没变', html: zimageHTML, items: zimage },
    mask: { title: '遮罩回答“改哪里”，提示词回答“改成什么”', hint: '原理示意 · 不是实际模型生成对比', html: maskHTML, items: [item('mask', '白色重绘，黑色尽量保留', '本课指原生 inpainting 的遮罩约定。VAE 编解码可能让未遮罩区域也有细微变化；要求原像素不变时，把重绘结果按同一遮罩合成回原图。输入尺寸和遮罩尺寸必须匹配。')] },
    extensions: { title: '三种工具，解决三类不同的问题', hint: '并列能力 · 不是必须依次安装的插件', html: flow(extensionItems, true), items: extensionItems },
    models: { title: '先装一份能跑的模型，再认识其他配件', hint: '9 类模型分工 · 点击查看目录与用法', html: modelsHTML, items: models },
    dependencies: { title: '同样标红，缺的可能完全不同', hint: '点击症状 · 先分类，再决定是否安装', html: flow(dependencies, true), items: dependencies },
    files: { title: '别混在一起：权重、配方、素材', hint: '点击分类 · 真正路径以实例 Storage 设置为准', html: `<div class="file-tree"><div class="file-root">当前本地实例 / 配置的共享数据目录</div>${files.map((entry, index) => `<button class="flow-item" type="button" data-diagram="${entry.id}" aria-pressed="${index === 0}"><strong>${entry.title}</strong><small>${entry.label}</small></button>`).join('')}</div>`, items: files },
    diagnosis: { title: '出问题时，按这条路线走', hint: '先定位，再处理 · 不拿重装当第一步', html: flow(diagnoses), items: diagnoses }
  };
})();
