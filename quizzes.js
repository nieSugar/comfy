window.COMFY_QUIZZES = {
  orientation: [
    { question: '下载了一个工作流 JSON，就一定可以立即生成图片吗？', options: ['可以，JSON 自带全部模型。', '不一定，还要有匹配模型、节点与输入素材。', '不可以，所有工作流都需要付费。'], answer: 1, explanation: 'JSON 记录操作结构和参数，通常不包含模型权重或输入素材；本地 core 工作流也不等于付费服务。' },
    { question: '打开 Desktop 后看到几张实例卡片，其中一张标着 Cloud。你想用自己电脑上的模型和显卡练习，应该怎么做？', options: ['随便点一张，进去都是同一个环境。', '打开本地 Standalone / Local 实例，确认能看到节点画布。', '先卸载 Desktop 重装，让界面和教程截图完全一致。'], answer: 1, explanation: 'Desktop 也可能连接 Cloud 或远程实例，位置不同，模型和输出也不同；本课程不要求为了和图示一致而重装。' },
    { question: '你要在画布上指出“模型从哪里来、图片最终在哪里保存”，应分别找哪两个节点？', options: ['K采样器 (KSampler) 和 预览图像 (Preview Image)。', 'CLIP文本编码 (CLIP Text Encode) 和 VAE解码 (VAE Decode)。', 'Checkpoint加载器（简易）(Load Checkpoint) 和 保存图像 (Save Image)。'], answer: 2, explanation: '加载器负责读模型，保存图像负责写出文件。K采样器负责采样，预览图像不是正式归档；CLIP文本编码处理文字，VAE解码把潜图变成像素。' },
    { question: '导入的工作流里有个节点提示需要登录并消耗积分。按本课原则，下一步怎么做？', options: ['先停下，核实它是不是在线 Partner / API 节点、费用多少、数据发往哪里。', '应用装在本机，所以每个节点都在本地计算，直接运行。', '先把含私人信息的照片接进去试试效果。'], answer: 0, explanation: '应用运行在电脑上，不代表每个节点都在本地计算；看到登录、积分或远程服务提示应先核实费用和数据去向，私人照片更要谨慎。' }
  ],
  desktop: [
    { question: '模型文件已经在磁盘上，但当前工作流看不到它，先检查什么？', options: ['把所有 Python 包更新一遍。', '把文件随便改成模板要求的名字。', '当前实例读取的目录、模型类别和下拉框刷新状态。'], answer: 2, explanation: '先确认发现路径和分类。重命名不会把一种架构变成另一种，也不能修复未完成的下载。' },
    { question: '网上教程让你把模型放进 ComfyUI_windows_portable 下的 models/checkpoints。你用的是新版 Desktop，正确做法是？', options: ['照抄这个路径，新建同名文件夹放进去。', '从 ☰ → Desktop Settings → Storage → Shared Models 打开真实模型根目录，再核对当前实例 Manage → Storage。', '把模型复制到电脑上所有叫 models 的文件夹里。'], answer: 1, explanation: '往另一个安装的目录放模型是最常见的“下载了却找不到”；应以当前实例实际读取的目录为准，乱复制只会制造混乱。' },
    { question: 'Shared Models 已经指向你的模型根目录。SD1.5 checkpoint 应该放在哪里？', options: ['模型根 / models / checkpoints（再套一层 models）。', '模型根 / loras。', '模型根 / checkpoints。'], answer: 2, explanation: 'Shared Models 已指向模型根时，直接使用其 checkpoints 子目录；多套一层 models 不会被扫描，loras 是 LoRA 的分类。' },
    { question: '你只有一个 FLUX 模型，没有 SD1.5，又想用本课程 512 × 512、cfg 7、20 步的基线练习。正确的判断是？', options: ['先学概念；要用 FLUX 就打开它的官方模板并按模板配置，不把 SD1.5 参数硬套上去。', '把 FLUX 文件改名成 SD1.5 的文件名，就能跑本课练习。', '直接用本课参数，模型家族不影响参数。'], answer: 0, explanation: 'SD1.5、SDXL、FLUX 的加载器、编码器、分辨率和参数可能不同；改名不会改变架构，本课参数也不能机械套用。' }
  ],
  interface: [
    { question: 'Node Library 和 Model Library 的区别是什么？', options: ['前者找处理节点，后者找模型权重。', '两者完全一样，只是中文翻译不同。', '前者只能显示结果图片。'], answer: 0, explanation: '节点是执行操作的工具，模型是工具读取的训练权重；缺哪一种，排查路径也不同。' },
    { question: '你缩放、拖动了一阵后画布变成一片空白，但你确定没删过节点。最先做什么？', options: ['重新安装 ComfyUI。', '点 Fit / 适应画布或缩小视图，再确认是不是切换了工作流标签。', '重新导入工作流，覆盖当前修改。'], answer: 1, explanation: '很多“节点不见了”只是缩放或平移到了别处；重装和重新导入都可能白费功夫，甚至丢掉当前修改。' },
    { question: '你正在 CLIP文本编码 (CLIP Text Encode) 的文本框里打字，随后按 Delete 想删掉一个练习节点，可能发生什么？', options: ['一定会删掉整个工作流。', '一定会删掉这个 CLIP文本编码 节点。', '可能删掉的是框里的文字而不是节点；应先点节点标题确认选中的对象。'], answer: 2, explanation: '输入框有焦点时 Delete 作用于文字；要先分清“选中节点”和“编辑文本”，删错了可以撤销。' },
    { question: '第一次练习前设置运行区，哪种做法最安全？', options: ['保持手动 运行，数量 1，不启用 On Change / Instant 自动模式。', '开启 Instant，改一下参数就自动出图，方便观察。', '数量设为 10，一次看够多张。'], answer: 0, explanation: '先认识开始、停止和查错的位置；自动模式和大数量容易在误触后连续提交任务。' }
  ],
  'model-download': [
    { question: '你拿到一个叫 model.safetensors 的文件，单靠这个后缀能判断什么？', options: ['它一定是 SD1.5 主模型，而且能直接用于任何工作流。', '它一定采用 FP16，显存占用就等于文件大小。', '后缀表示一种存储格式；家族、用途、精度和兼容性还要看模型说明。'], answer: 2, explanation: '格式、架构、用途与精度是不同维度。先读模型说明并匹配工作流，再核对文件与加载器；同后缀不代表能通用。' },
    { question: '下载结束后，v1-5-pruned-emaonly-fp16.safetensors 只有 3 KB。最可能是什么情况，怎么办？', options: ['正常，safetensors 压缩率很高。', '多半是 Raw pointer 或网页文本，不是权重；回到文件页用 Browser 的 Download file 重新下载约 2.13 GB 的文件。', '把扩展名改成 .ckpt 再试。'], answer: 1, explanation: 'pointer 只是指向大文件的小文本，几 KB 的文件不可能是 2.13 GB 的模型；改扩展名不会改变文件内容。' },
    { question: '模型已复制进 checkpoints，但 Checkpoint加载器（简易）(Load Checkpoint) 的 ckpt_name 里仍没有它。按课程顺序先做什么？', options: ['安装一个“能识别模型”的自定义节点包。', '在系统 Python 里运行 pip 升级依赖。', '刷新列表并重开下拉框；仍不可见就保存工作流后重启当前实例，并复查实例是否包含共享目录。'], answer: 2, explanation: '刚复制的文件不一定已被当前进程重新扫描，Include Shared Directories 关闭时也读不到共享根；装节点或跑 pip 都不对症。' },
    { question: '导入 01-text-to-image.json 后，ckpt_name 显示的是教学占位名。下一步正确操作是？', options: ['在 ckpt_name 下拉框手动选择你刚下载的真实模型文件。', '直接点 运行，ComfyUI 会按占位名自动下载模型。', '把你的模型文件重命名成占位名。'], answer: 0, explanation: '工作流只是配方，必须让它实际指向你的权重；本课程的工作流不会自动下载模型，改名假装匹配也不是正确做法。' }
  ],
  'first-image': [
    { question: 'KSampler 的输出为什么不能直接接 Save Image？', options: ['因为必须先购买许可证。', '因为输出是 LATENT，需要 VAE Decode 变成 IMAGE。', '因为 Save Image 只能接提示词。'], answer: 1, explanation: '端口的数据类型要匹配。LATENT 是模型处理的潜空间数据，不是可直接保存的像素图片。' },
    { question: '你点了 运行，错误报告指向 Checkpoint加载器（简易）(Load Checkpoint)：Value not in list。下一步先做什么？', options: ['打开它的 ckpt_name 下拉框，重新选择一个已安装的真实 SD1.5 模型。', '连续多点几次 运行，等它自己恢复。', '把 K采样器 的步数从 20 提高到 40。'], answer: 0, explanation: 'Value not in list 说明控件里的模型名在当前实例中不存在，需重新选择真实文件；反复运行或改步数都不解决缺模型。' },
    { question: '“blurry, text, watermark” 这组词应该填在哪里？', options: ['填进正向提示词框，句末再加一个 no。', '填在输出接到 K采样器 negative 输入的那个 CLIP文本编码 (CLIP Text Encode) 里。', '填进 空Latent图像 (Empty Latent Image) 节点。'], answer: 1, explanation: '想避开的方向写在负向条件里，而“哪个是负向”由它接到 K采样器 的 negative 决定；写进正向反而可能引入这些元素，空Latent图像 不读文字。' },
    { question: '第一次出图想求稳又担心显存，空Latent图像 (Empty Latent Image) 应该怎么填？', options: ['宽高 2048、batch_size 4，一次看够。', '宽高 1024、batch_size 1，大图更清晰。', '宽 512、高 512、batch_size 1。'], answer: 2, explanation: '本课的 SD1.5 基线是 512 × 512、单张；更大尺寸和批量会显著增加资源消耗，也不是 SD1.5 的常规起点。' }
  ],
  nodes: [
    { question: '两个 CLIP Text Encode 谁是正向、谁是负向，主要由什么决定？', options: ['节点摆在上面还是下面。', '节点的标题颜色。', 'CONDITIONING 接到了 KSampler 的哪个输入。'], answer: 2, explanation: '连接关系决定用途。节点名称和位置是给人看的辅助信息，不会自动改变数据含义。' },
    { question: '文生图里决定画布尺寸的那根 LATENT 线，应该从哪里接到哪里？', options: ['从 空Latent图像 (Empty Latent Image) 的 LATENT 输出接到 K采样器 (KSampler) 的 latent_image。', '从 VAE解码 (VAE Decode) 的输出接到 K采样器 的 latent_image。', '从 CLIP文本编码 (CLIP Text Encode) 的输出接到 K采样器 的 latent_image。'], answer: 0, explanation: '空Latent图像 定义初始潜图的尺寸与批量并交给采样器；VAE解码 输出的是 IMAGE，CLIP文本编码 输出的是 CONDITIONING，类型都不对。' },
    { question: '你想同时预览和保存同一张结果，正确的连线是？', options: ['把 K采样器 的 LATENT 输出直接接到 预览图像 (Preview Image)。', '从 VAE解码 (VAE Decode) 的 IMAGE 输出再拖一根线到 预览图像 (Preview Image)，保留通向 保存图像 的原连线。', '删掉 保存图像 换成 预览图像，一个输出只能接一个节点。'], answer: 1, explanation: '一个输出可以供多个下游使用；预览图像 需要 IMAGE 而不是 LATENT，且预览不等于正式保存。' },
    { question: '你在提示词里写了 4K, ultra high resolution，输出却仍是 512 × 512。要真正改变分辨率，应改哪里？', options: ['把提示词写得更长更具体。', 'K采样器 (KSampler) 的步数。', '空Latent图像 (Empty Latent Image) 的 width / height。'], answer: 2, explanation: '真实尺寸来自 空Latent图像；文字只影响内容倾向，步数影响采样迭代，都不会改变画布大小。' }
  ],
  parameters: [
    { question: '要判断提示词里的 red → blue 是否有效，哪个实验最合理？', options: ['固定模型、seed 和其他参数，只改这一个词。', '同时随机 seed、换模型、提高 CFG。', '只看别人用不同模型生成的图。'], answer: 0, explanation: '单变量比较才让差异有解释力。即便如此，生成过程也不保证只改变你指定的像素。' },
    { question: '你用 seed 42 跑了两次，图却不一样。最先检查哪里？', options: ['提示词是不是太短。', 'K采样器 (KSampler) 的“生成后控制”是否为 fixed，以及模型、尺寸、提示词和采样设置是否完全一致。', '先把 cfg 拉高再看。'], answer: 1, explanation: '生成后控制不是 fixed 时，运行后 seed 会自动变化；其余条件不一致也会改变结果。提示词长短和 cfg 与“能否复现”无关。' },
    { question: '你想比较 cfg 5 和 cfg 7 的差别，哪种做法正确？', options: ['cfg 改成 5，同时把种子改成随机看看。', 'cfg 改成 5，顺便把步数降到 10 省时间。', '只改 K采样器 的 cfg，种子、步数、采样器名称、调度器和尺寸都保持基线。'], answer: 2, explanation: '同时改了 seed 或步数，就无法确定差异来自 cfg；单变量对照才有解释力。' },
    { question: '你把步数改到 60、cfg 改到 15，图反而过饱和、边缘发硬。正确的思路是？', options: ['回到已验证基线（20 步、cfg 7），每次只改一项再观察。', '继续加到 100 步、cfg 20，直到变好。', '换一个模型，再同时调这两项。'], answer: 0, explanation: '更多计算和更强引导不等于更好，cfg 太高可能过饱和或产生伪影；同时改多个变量只会让原因更难找。' }
  ],
  img2img: [
    { question: '想让普通图生图更保留原图结构，通常先尝试什么？', options: ['把 denoise 直接拉到 1。', '在其他条件不变时适当降低 denoise。', '删除 VAE Encode。'], answer: 1, explanation: '较低 denoise 通常给原图更小的改动空间；它不是精确的保真百分比，也不能代替局部遮罩。' },
    { question: '图生图练习中，输入图片进入 K采样器 的支路应该是哪一条？', options: ['加载图像 → VAE解码 → K采样器 的 latent_image。', '加载图像 → CLIP文本编码 → K采样器 的 positive。', '加载图像 (Load Image) → 缩放图像 (ImageScale) → VAE编码 (VAE Encode) → K采样器 的 latent_image。'], answer: 2, explanation: '图片先控制尺寸，再由 VAE编码 把 IMAGE 转成 LATENT 送入采样器；VAE解码 方向相反，CLIP文本编码 只处理文字。' },
    { question: '你把茶壶 PNG 拖到画布空白处，结果整个工作流被替换了。想把它当作输入图片，应该？', options: ['在 加载图像 (Load Image) 节点点 choose file / upload 上传。', '再拖一次，拖得慢一点。', '把 PNG 拖到 K采样器 节点上。'], answer: 0, explanation: '含元数据的 PNG 拖到空白画布会恢复它记录的工作流；作为输入图片要用 加载图像 节点的上传功能。' },
    { question: '用 降噪 0.30 跑完，结果几乎和原图一样，看不出蓝色水彩效果。合理的下一步是？', options: ['删掉 VAE编码，把图片直接接到 K采样器。', '确认 K采样器 吃的是 VAE编码 的输出、正向提示词确实改了，再适度提高 降噪（如 0.55 或 0.70）。', '把种子改成随机，多跑几次碰运气。'], answer: 1, explanation: '低降噪本来就更保留原图，需要更大改动空间时适度提高；IMAGE 不能直接接 latent_image，换 seed 也不改变重绘程度。' }
  ],
  inpaint: [
    { question: '在本课的 inpaint 遮罩约定中，白色代表什么？', options: ['允许重绘的区域。', '永远不能改动的区域。', '模型文件所在目录。'], answer: 0, explanation: '白色表示重绘区域。是否精确保留其他像素，还取决于 VAE、遮罩扩张、边缘和最终合成方式。' },
    { question: '换用 VAE编码（局部重绘）(VAE Encode for Inpainting) 时，它的 pixels、mask、vae 应该怎么接？', options: ['pixels 接 缩放图像 后的图，mask 接另一张图上画的遮罩。', 'pixels 与 mask 分别接同一个 加载图像 (Load Image) 的 IMAGE 与 MASK，vae 接 Checkpoint加载器 的 VAE。', 'pixels 接 VAE解码 的输出，mask 留空。'], answer: 1, explanation: '图片与遮罩必须来自同一张最终尺寸的图，坐标才对得上；缩放后的图或空遮罩都会让局部重绘失去意义。' },
    { question: '你直接保存了 VAE解码 的结果，发现没涂遮罩的桌面纹理也有细微变化。怎样让区域外沿用原图像素？', options: ['把 cfg 降低一些。', '把遮罩涂满整张图。', '加 合成图像（遮罩）(ImageCompositeMasked)：destination 接原图、source 接 VAE解码 输出、mask 接原 MASK，再接 保存图像。'], answer: 2, explanation: 'VAE 编解码本身会改变像素，像素级合成才是把改动贴回原图的明确操作；调 cfg 无关，涂满全图则等于整图重绘。' },
    { question: '生成后发现重绘区域明显偏到了茶壶旁边。最可能的原因是？', options: ['图片经过缩放而遮罩没同步处理，坐标对不上；应在最终尺寸的方图上重新画遮罩。', '遮罩编辑器的覆盖色选错了颜色。', '降噪设为 1 会让遮罩区域自动平移。'], answer: 0, explanation: '只缩放图片不处理遮罩会导致错位；覆盖色只是显示方式，降噪影响重绘强度而不会移动遮罩位置。' }
  ],
  'lora-controlnet': [
    { question: '希望生成的人物遵循一张骨架姿态图，通常优先考虑什么？', options: ['只增加 Save Image 节点。', '随机换一个风格 LoRA。', '与主模型匹配的姿态 ControlNet 和正确条件图。'], answer: 2, explanation: '姿态属于结构约束；ControlNet、基础模型与输入条件图需要配套，不能只靠文件名或后缀判断。' },
    { question: '接好 加载LoRA (Load LoRA) 后，它输出的 MODEL 和 CLIP 应该去哪里？', options: ['MODEL 接 K采样器 的 model，CLIP 接正负两个 CLIP文本编码 (CLIP Text Encode)。', 'MODEL 接 VAE解码，CLIP 接 保存图像。', '输出不用接，只要 加载LoRA 节点在画布上就会生效。'], answer: 0, explanation: 'LoRA 通过调整模型与文字编码器路径生效，必须让下游真正使用它输出的 MODEL / CLIP；放在画布上不接线不会起作用。' },
    { question: '你把一个 SDXL 风格 LoRA 套在 SD1.5 主模型上，结果报错或毫无效果。正确的判断是？', options: ['后缀都是 safetensors，肯定兼容，把强度拉到最大。', 'LoRA 必须与基础模型家族匹配，应换用作者标明兼容 SD1.5 的 LoRA。', '多装几个自定义节点就能兼容。'], answer: 1, explanation: '同后缀不代表同架构；强度和额外节点都无法让 SDXL LoRA 适配 SD1.5。' },
    { question: '在 ControlNet 涂鸦示例里，已预处理的涂鸦条件图应接到哪里？', options: ['应用ControlNet (Apply ControlNet) 的 control_net 输入。', 'K采样器 的 latent_image。', '应用ControlNet (Apply ControlNet) 的 image 输入；权重由 加载ControlNet模型 接到 control_net。'], answer: 2, explanation: '条件图进 image、ControlNet 权重进 control_net，处理后的 positive / negative 再进 K采样器；把条件图当潜图接入并不是 ControlNet 的用法。' }
  ],
  'save-queue': [
    { question: '哪种文件最适合作为可编辑流程的明确备份？', options: ['聊天软件压缩后的图片。', '普通 UI 工作流 JSON，并单独保留依赖资料。', '画布截图。'], answer: 1, explanation: '截图不含连接数据，PNG 元数据可能丢失；普通 JSON 是清晰的流程备份，但模型和素材仍要另存。' },
    { question: '“运行区数量 4、batch_size 1”和“数量 1、batch_size 4”主要区别是什么？', options: ['前者提交 4 次任务、每次 1 张；后者一次任务处理 4 张，单次显存需求更高。', '完全一样，只是写法不同。', '前者更占显存，后者更省显存。'], answer: 0, explanation: '数量代表提交几次任务，batch_size 代表一次处理几张；后者把多张放进同一次计算，可能显著增加显存需求。' },
    { question: '你点了取消，过一会儿它又开始生成新图。最该检查什么？', options: ['显卡驱动是否过旧。', '模型文件是否损坏。', '是否开着 On Change / Instant 自动模式，以及 任务队列 里是否还有等待项。'], answer: 2, explanation: '取消当前执行不等于清空等待队列，自动模式还会继续提交；这与驱动或模型文件无关。' },
    { question: '要把茶壶练习发给朋友复现，练习包至少应包含什么？', options: ['一张画布截图就够了。', '普通 JSON、必要输入图、模型文件名与来源、关键参数，并先清除私人信息和密钥。', '整个 Desktop 安装目录，连同 API key 一起打包。'], answer: 1, explanation: '对方需要配方和依赖说明才能复现；截图没有连线数据，打包密钥和私人数据则有泄露风险，模型权重应按许可另行获取。' }
  ],
  'custom-nodes': [
    { question: '缺少模型权重时，安装更多自定义节点通常能解决吗？', options: ['不能，应先检查模型文件、分类与搜索路径。', '能，节点越多就越不会缺模型。', '必须先删除 Desktop。'], answer: 0, explanation: '节点代码和模型权重是两类依赖。对症检查比盲目扩展环境更安全，也更快。' },
    { question: '导入工作流后出现 Missing Nodes，缺的是某个第三方包里的节点类型。第一步做什么？', options: ['马上用 Manager 把搜索结果里相关的包全部装上。', '记下完整节点类型，核对作者说明、维护者与必要性，确认需要后只装那一个包。', '删除当前实例重新安装。'], answer: 1, explanation: '一次只装确认需要的一个包，出问题才知道原因；全部装上会引入冲突和安全风险，删实例可能连数据一起丢失。' },
    { question: 'Manager 显示节点包已安装，但工作流里节点仍然缺失。下一步？', options: ['再装三个功能类似的包试试。', '在系统 Python 里 pip install 一堆依赖。', '确认装在当前实例、按提示重启，再看启动日志里的 import / 依赖错误。'], answer: 2, explanation: '常见原因是装错实例、未重启或导入失败；Desktop 实例可能使用独立环境，在系统 Python 里盲跑 pip 不对症。' },
    { question: '新装一个节点包后，原本能跑的 core 基线也出错了。最稳妥的做法是？', options: ['在 Manager 里禁用刚装的包并重启，再跑 core 基线看是否恢复。', '删除整个实例重装。', '把所有节点包一起更新到最新版。'], answer: 0, explanation: '可逆隔离能确认异常是否随新包变化；重装可能丢数据，批量更新会引入更多变量。' }
  ],
  troubleshooting: [
    { question: '出现 tensor shape / channel 不匹配时，首先检查哪一类问题？', options: ['把提示词写得更长。', '增加采样步数。', '主模型、编码器、VAE 和扩展权重是否架构匹配。'], answer: 2, explanation: '维度不匹配常与组件架构混用有关。先用官方配套组合缩小范围，而不是继续调整美术参数。' },
    { question: '运行失败，提示只写着 Prompt execution failed。接下来应该？', options: ['直接重装 Desktop。', '展开 Errors / Show report 或日志，找到第一条具体错误和出错节点。', '换一段提示词再运行。'], answer: 1, explanation: 'Prompt execution failed 只是结果摘要，具体错误才指明缺文件、缺节点、维度还是内存问题；重装或改提示词会覆盖线索。' },
    { question: '运行时报 CUDA out of memory。哪一步最对症？', options: ['取消多余任务，确认 512 × 512、batch_size 1，关闭占显存的程序后重启实例跑最小流程。', '提高 cfg，让模型更快收敛。', '反复点 运行 直到成功。'], answer: 0, explanation: '分辨率、批量和模型体积决定资源消耗；cfg 不影响显存是否足够，重复提交也不会增加显存。' },
    { question: '流程能跑完、没有报错，但茶壶总是偏色、构图差。应该怎么处理？', options: ['认定环境坏了，重装 Python 依赖。', '多装几个自定义节点。', '核对模型与 VAE，回到基线 seed 和参数，每次只改提示词、cfg 或降噪中的一项。'], answer: 2, explanation: '没有报错说明执行链路正常，这是结果质量问题，应通过控制变量判断能力边界或参数选择，而不是改动环境。' }
  ],
  'z-image': [
    { question: '你把 z_image_turbo_bf16.safetensors 放进 checkpoints，用 Checkpoint加载器（简易）(Load Checkpoint) 去读，运行失败。正确做法是？', options: ['把文件改名成 .ckpt，再用 Checkpoint加载器 读。', '放进 diffusion_models，用 UNet加载器 (UNETLoader) 读；文本编码器和 VAE 再分别用 加载CLIP (CLIPLoader)、加载VAE (VAELoader) 加载。', '用 加载LoRA (Load LoRA) 把它挂到 SD1.5 checkpoint 上。'], answer: 1, explanation: 'Z-Image Turbo 不是包含三件套的 checkpoint，而是拆成扩散模型、文本编码器、VAE 三个文件；改名不改变内容，它也不是 LoRA。' },
    { question: '加载CLIP (CLIPLoader) 读取 text_encoders/qwen_3_4b.safetensors 时，“类型”应该选什么？', options: ['stable_diffusion，默认值不用改。', 'sd3，因为工作流用了 空Latent图像（SD3）。', 'lumina2。'], answer: 2, explanation: '类型决定加载器按哪种架构解释文本编码器，Z-Image 的 qwen_3_4b 必须选 lumina2；默认值或按 latent 节点名去猜都会选错。' },
    { question: '有人把 SD1.5 习惯照搬到 Z-Image Turbo：512 × 512、20 步、cfg 7。应该改成哪组？', options: ['空Latent图像（SD3）1024 × 1024；K采样器 步数 8、cfg 1、采样器名称 res_multistep、调度器 simple；采样算法（AuraFlow）移位 3。', '只把尺寸改为 1024，保留 20 步、cfg 7。', '步数 50、cfg 12，蒸馏模型需要更多步数和更强引导。'], answer: 0, explanation: 'Turbo 是少步蒸馏模型，按官方配置约 8 步、cfg 1 即可；SD1.5 的参数不能照搬，加大 cfg 和步数并不会更好。' },
    { question: '你在负向那一路写了一长串负向提示词，却发现几乎没影响；官方工作流里负向用的是 条件零化 (ConditioningZeroOut)。为什么？', options: ['因为 Z-Image 不支持中文提示词。', '条件零化 是个 bug，应换回 CLIP文本编码 并把 cfg 提到 7。', '蒸馏模型在 cfg 1 时负向提示词基本不起作用，所以用 条件零化 给 negative 一个空条件即可。'], answer: 2, explanation: 'cfg 为 1 时负向条件几乎不参与引导，用 条件零化 是有意为之；为了负向词把 cfg 拉到 7 会偏离该模型的推荐配置。' }
  ]
};
