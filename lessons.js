window.COMFY_LESSONS = [
  {
    id: 'orientation', group: '起步', title: '先认路：ComfyUI 究竟在做什么？', shortTitle: '先认路，再动手', duration: '约 8 分钟', diagram: 'pipeline',
    intro: '把 ComfyUI 想成一条能看见每个工位的创作生产线。它还支持视频、音频和 3D 等工作流；本课程先专注图像基础。你提供素材和要求，节点分工处理，连线决定数据交给谁。',
    outcome: '能说清 Desktop、模型、节点和工作流的区别，并找到自己的本地画布。',
    prerequisites: ['已安装 ComfyUI Desktop；没装的话先打开本课官方安装指南。', '准备一个个人练习文件夹，用来放工作流和结果图。'],
    concepts: [
      {term: 'Desktop / 桌面端', meaning: '安装、管理和启动 ComfyUI 的桌面应用。新版能管理多个实例；旧版可能直接进入画布。'},
      {term: 'Workflow / 工作流', meaning: '节点、连线和参数组成的操作配方；不是模型，也不是生成好的图片。'},
      {term: 'Model / 模型', meaning: '训练得到的权重文件，决定能生成什么以及擅长什么。软件装好不等于模型装好。'},
      {term: 'Node / 节点', meaning: '一个具体处理步骤，例如读模型、读图片、采样或保存。节点需要合适的输入才能工作。'}
    ],
    steps: [
      {title: '打开 Desktop，确认运行在哪里', action: '从 Windows 开始菜单打开 ComfyUI Desktop。如果看到实例卡片，打开你已有的本地 Standalone / Local 实例；如果直接进入节点画布，就继续下一步。', why: 'Desktop 也可能连接 Cloud 或远程实例。先分清位置，后面才能找到模型和输出。', expected: '进入一个能看到节点画布的 ComfyUI 工作区，而不是网页里的教程截图。', tip: '本课程不要求你迁移旧安装。不要为了和图示一致就卸载或重新建环境。'},
      {title: '给自己定一个小目标', action: '在练习文件夹里记下：我想生成“一把放在木桌上的红色陶瓷茶壶”。第一轮只做一张 512 × 512 图片，不加插件、不做视频。', why: '明确的小目标容易判断是否成功，也方便后续每次只改一个变量。', expected: '你能用一句话说明目标主体、颜色和背景。', tip: '第一张图的目标是跑通流程，不是立刻达到商业成片质量。'},
      {title: '找出输入、加工和输出', action: '如果画布已有工作流，先找 Checkpoint加载器（简易）（Load Checkpoint）、K采样器（KSampler）和 保存图像（Save Image）；没有也没关系，点开本课流程图，沿箭头说出“准备 → 采样 → 解码 → 保存”。', why: '节点再多，本质也只是数据逐步流动。先抓主干，再学细节。', expected: '能指出模型从哪里来，图片最终在哪里保存。', tip: '本网站的顶部概念图是教学示意；下方每步配有本机 ComfyUI v0.42.4 实机红框截图供你对照位置。'},
      {title: '分清本地生成与在线服务', action: '查看你准备使用的工作流节点名称和说明。基础课只使用本地 core 节点；看到 Partner / API、积分、登录或远程服务提示，先停下来核实费用和数据去向。', why: '应用运行在电脑上，并不代表每个节点都在本地计算。', expected: '知道本课程练习不用购买 API 积分，也不会自动下载模型。', tip: '含私人信息的照片，先确认流程没有上传节点，再使用。'}
    ],
    pitfalls: [{symptom: '装完 Desktop，却没有可选模型。', fix: '正常。先在“Desktop 与模型准备”确认目录，再跟着“模型下载与识别”准备文件；不要把工作流 JSON 当成模型。'}, {symptom: '我的界面和图不完全一样。', fix: '先看功能名。新版与 Legacy Desktop、前端版本、语言和布局设置都可能不同。'}],
    exercise: {task: '用自己的话解释“Desktop 是工具箱，工作流是配方，模型是能力，图片是结果”。', check: '能解释为什么朋友给你一个 JSON，不代表把他的模型和输入图片也给了你。'},
    quiz: {question: '下载了一个工作流 JSON，就一定可以立即生成图片吗？', options: ['可以，JSON 自带全部模型。', '不一定，还要有匹配模型、节点与输入素材。', '不可以，所有工作流都需要付费。'], answer: 1, explanation: 'JSON 记录操作结构和参数，通常不包含模型权重或输入素材；本地 core 工作流也不等于付费服务。'},
    sources: [{title: '官方：Desktop 概览与新旧版本', url: 'https://docs.comfy.org/installation/desktop/overview'}, {title: '官方：工作流概念', url: 'https://docs.comfy.org/basic-concepts/workflow'}, {title: '官方：Partner Nodes', url: 'https://docs.comfy.org/tutorials/partner-nodes/overview'}]
  },
  {
    id: 'desktop', group: '起步', title: '课前准备：找到模型，而不是到处重装', shortTitle: 'Desktop 与模型准备', duration: '约 12 分钟，不含下载', diagram: 'files',
    intro: '本课程用传统 SD1.5 工作流练基本功：结构简单，能把模型、文字、采样和图片的关系讲清楚。它不是最新画质榜单，也不能代表所有新模型的接法。',
    outcome: '确认当前实例、实际模型目录，并知道自己是否已有 SD1.5 checkpoint；完整下载操作在“模型下载与识别”课展开。',
    prerequisites: ['Desktop 能正常启动本地实例。', '模型下载可能是 GB 级；先确认磁盘空间、网络和模型许可。'],
    concepts: [
      {term: 'Checkpoint / 主模型', meaning: '本课使用包含扩散模型、CLIP 和 VAE 的 SD1.5 checkpoint。Load Checkpoint 会把三类输出分别交给后续节点。'},
      {term: 'checkpoints 分类', meaning: '它位于实际模型根目录内。Shared Models 已指向模型根时，直接使用其 checkpoints 子目录，不要再多套一层 models。'},
      {term: '模型家族', meaning: 'SD1.5、SDXL、FLUX 等不是随便互换的文件名；加载器、编码器、分辨率和参数可能不同。'}
    ],
    steps: [
      {title: '记下版本与当前实例', action: '在 Desktop 的设置 / About 或帮助信息中记下版本。新版额外记下当前实例名称与路径；旧版没有实例卡片时，记录安装时选择的数据目录。', why: '后面遇到教程差异或排错，需要知道自己在哪个环境工作。', expected: '你有一份“Desktop 版本 + 实例 / 数据位置”的小记录。', tip: '只记录，不做升级、迁移或卸载。新版入口可参考本课“实例管理”官方说明。'},
      {title: '通过 Desktop 找到真实目录', action: '新版打开 ☰ → Desktop Settings → Storage → Shared Models，点击目录路径打开；再核对当前实例 Manage → Storage 是否覆盖共享目录。旧版没有这些入口时，查其安装数据目录与对应版本文档。', why: '往另一个安装的目录放模型，是新手最常见的“下载了却找不到”。', expected: '在资源管理器中打开当前实例实际读取的模型根目录。', tip: '不要照抄网上 ComfyUI_windows_portable 的路径，也不要覆盖已有路径配置。'},
      {title: '优先复用已有的匹配模型', action: '查看 checkpoints 文件夹或侧栏 Model Library。若已有 SD1.5 checkpoint，记下完整文件名和作者标明的架构；若没有，就记下“尚未准备”，在“模型下载与识别”课按按钮一步步下载。', why: '先盘点现有文件，避免重复下载，也不用现在就弄懂所有模型分类。', expected: '知道自己已有哪一个模型，或明确需要准备本课基线模型。', tip: '只从可信发布者下载，先看许可与磁盘容量；本网站不分发权重。'},
      {title: '把权重放对分类并刷新', action: '已有完整 checkpoint 时，核对它位于实际模型根目录的 checkpoints 子目录，刷新模型列表；仍看不到就保存工作后重启当前实例。尚无文件时，先记录这个目标目录，稍后的下载课会完整带你操作。', why: '当前实例、分类和列表刷新状态都会影响文件是否可见。', expected: '已有模型能在 Load Checkpoint 的 ckpt_name 中找到；尚未下载时，你知道之后应放到哪里。', tip: '不要把 LoRA 放进 checkpoints，也不要把网页保存成 .safetensors 来凑文件名。'},
      {title: '确认第一轮保持轻量', action: '准备只跑单张、512 × 512 的 SD1.5 练习；关闭自己不需要的高显存应用。模型能否运行还取决于显存、内存和后端，先不要把批量或分辨率调大。', why: '先验证最小可用流程，后续才有稳定的对照基准。', expected: '你已确认实例与目录；接着熟悉界面，再进入“模型下载与识别”完成实操。', tip: '不要把本课的 512、CFG 7、20 steps 机械套到 SDXL、FLUX 或蒸馏模型。'}
    ],
    pitfalls: [{symptom: '下拉框里模型为空。', fix: '核对当前实例、模型分类、完整后缀和下载状态；刷新或重启。模型放在其他实例不一定自动可见。'}, {symptom: '只有 FLUX / SDXL，没有 SD1.5。', fix: '可以先学概念，但本项目两份练习以 SD1.5 为基线。要使用已有新模型，请打开对应官方模板并遵循它的配置。'}],
    exercise: {task: '记录当前实例和实际模型根目录；已有模型就补充名字、架构与来源，没有则标记待下载。', check: '能指出 checkpoints 应位于哪里，并知道接下来应复用已有模型还是跟下载课准备文件。'},
    quiz: {question: '模型文件已经在磁盘上，但当前工作流看不到它，先检查什么？', options: ['把所有 Python 包更新一遍。', '把文件随便改成模板要求的名字。', '当前实例读取的目录、模型类别和下拉框刷新状态。'], answer: 2, explanation: '先确认发现路径和分类。重命名不会把一种架构变成另一种，也不能修复未完成的下载。'},
    sources: [{title: '官方：Windows Desktop 安装', url: 'https://docs.comfy.org/installation/desktop/windows'}, {title: '官方：Desktop Storage 设置', url: 'https://docs.comfy.org/installation/desktop/usage/settings'}, {title: '官方：实例 Manage 设置', url: 'https://docs.comfy.org/installation/desktop/usage/manage'}, {title: '官方：模型与目录', url: 'https://docs.comfy.org/basic-concepts/models'}, {title: '官方：首次生成与示例模型', url: 'https://docs.comfy.org/get_started/first_generation'}]
  },
  {
    id: 'interface', group: '起步', title: '认识操作台：知道该点哪里', shortTitle: '界面与基本操作', duration: '约 10 分钟', diagram: 'desktop',
    intro: '先把界面当成一张地图：中间画布放流程，侧栏找资源，运行区提交任务，结果区看输出。按钮位置可能变，功能关系不会跟着乱跑。',
    outcome: '会缩放、移动节点、搜索节点、打开模板，并能找到运行、队列和错误信息。',
    prerequisites: ['已进入本地 ComfyUI 画布。', '先导出正在编辑的重要工作流，避免练习误改。'],
    concepts: [
      {term: 'Canvas / 画布', meaning: '摆放与连接节点的工作区域。移动节点只是整理布局，不改变模型含义。'},
      {term: 'Node / Model Library', meaning: '节点库找处理工具；模型库查看已识别权重。两种“库”装的东西不同。'},
      {term: 'Run / Queue', meaning: 'Run 把当前流程提交为任务；队列与历史用来检查等待、执行和结果。旧版可能叫 Queue Prompt。'},
      {term: '模板 / Template', meaning: '现成的工作流起点。加载模板后仍要核对模型、素材和是否使用在线节点。'}
    ],
    steps: [
      {title: '切换语言，保留英文对照', action: '打开 Settings / 设置，在 Comfy → Locale 选择中文；然后回到画布。课程同时保留英文节点名，找不到中文译名时搜索英文。', why: '降低阅读门槛，同时能与官方教程、报错和模型说明对应。', expected: '主要菜单显示中文，节点名称可能仍保留部分英文。', tip: '不同前端的分类位置可能有调整，可在设置内搜索 Locale。'},
      {title: '练习缩放与找回画布', action: '在画布空白处滚动鼠标滚轮缩放；用画布平移工具或中键拖动查看另一块区域，再点击 Fit / 适应画布找回全部节点。', why: '很多“节点不见了”只是缩放或平移到了别处。', expected: '能放大一个节点看参数，再恢复完整工作流视野。', tip: '触控板手势与快捷键可自定义；以底部 Shortcuts / 快捷键面板为准。'},
      {title: '搜索、放置并撤回一个节点', action: '在左侧 节点库（n）（Node Library）搜索 预览图像（Preview Image），把它加入画布；拖动标题栏移动位置。只选中这个练习节点后删除，再使用撤销恢复；最后撤销本次练习改动。', why: '先学可恢复的编辑，再动真正的工作流。', expected: '能辨认“选中节点”和“编辑文本”的区别，原有流程仍完整。', tip: '输入框有焦点时 Delete 可能删的是文字；先确认选中的是哪个对象。'},
      {title: '打开模板，但先不运行', action: '点击左侧栏的 模板（Templates）按钮，或在 工作流（Workflow）菜单找到 Browse Workflow Templates。浏览一个本地文生图模板，阅读所需模型，再返回自己的练习。', why: '模板帮你发现能力，但不是点进去就保证硬件和素材都齐。', expected: '知道模板入口在哪里，能看见模型与输入要求。', tip: '官方模板与第三方节点模板可能同时出现；初学先选 core 节点示例。'},
      {title: '定位运行和诊断区域', action: '找到右上角的 运行（Run）按钮、0 个活动任务 / 任务队列（Queue）、左侧 资产（Assets）结果，以及底部面板 / 错误报告入口。运行模式保持手动 运行，数量保持 1，不启用 On Change 或 Instant 自动循环。', why: '先认识停止与查错的位置，才不会误触后连续跑任务。', expected: '你能指出“开始、停止、看结果、看报错”四个位置。', tip: '运行条可以被移动；旧版结果或历史面板的位置与示意图不同很正常。'}
    ],
    pitfalls: [{symptom: '找不到某个图标。', fix: '按功能名在菜单或设置里找，参考本课官方界面图；不要因为图标不同就重装。'}, {symptom: '画布空了，但没有删节点。', fix: '先用 Fit / 适应画布或缩小视图，再确认是不是切换了工作流标签。'}],
    exercise: {task: '在不提交任务的情况下，完成缩放、移动、搜索节点、撤销，并打开模板列表。', check: '你能独立找回整个工作流，且知道下一步该在哪里点击 Run。'},
    quiz: {question: 'Node Library 和 Model Library 的区别是什么？', options: ['前者找处理节点，后者找模型权重。', '两者完全一样，只是中文翻译不同。', '前者只能显示结果图片。'], answer: 0, explanation: '节点是执行操作的工具，模型是工具读取的训练权重；缺哪一种，排查路径也不同。'},
    sources: [{title: '官方：界面地图', url: 'https://docs.comfy.org/interface/overview'}, {title: '官方：工作流模板', url: 'https://docs.comfy.org/interface/features/template'}, {title: '官方：节点与连接', url: 'https://docs.comfy.org/basic-concepts/nodes'}]
  },
  {
    id: 'model-download', group: '起步', title: '模型下载与识别：从文件页到真正跑起来', shortTitle: '模型下载与识别', duration: '约 20 分钟，不含下载', diagram: 'models',
    intro: '这一课解决最实际的问题：模型到底是哪一个文件，应该从哪里拿，放在哪里，又怎么知道装对了？先只准备一个 SD1.5 checkpoint，把完整链路走通；不需要把图里的所有模型类别都下载一遍。',
    outcome: '能读懂模型的四类信息，下载正确的单个权重文件，并在 Desktop 选中它完成一次生成验证。',
    prerequisites: ['已能进入 Desktop 本地实例，并找到设置和画布。', '准备稳定网络和足够磁盘空间；示例权重约 2.13 GB，保留下载临时文件、复制和运行所需的额外空间。', '已有可信且匹配的 SD1.5 checkpoint 时，可跳过重复下载，但仍完成目录、选择与运行验证。'],
    concepts: [
      {term: '家族：它属于哪套架构？', meaning: 'SD1.5、SDXL、FLUX 是不同模型家族。先匹配工作流和组件家族，再考虑画风；同一个文件后缀不代表能互换。'},
      {term: '用途：它在流程里做哪份工作？', meaning: '主模型负责生成，文字编码器理解文字，VAE 转换图片与潜空间，其他权重按任务补充。本课 checkpoint 已包含所需主模型、CLIP 和 VAE，不需要把每一类都单独装上。'},
      {term: '格式：文件怎么装这些数据？', meaning: '.safetensors 是权重存储格式，不是模型家族或精度。它避免 pickle 的执行机制，但仍应核对来源、许可与内容；不能仅凭扩展名认定文件可信。'},
      {term: '精度：权重数字如何表示？', meaning: 'FP16、BF16、FP8 描述数字表示方式；会影响体积、数值范围、兼容性与效果。本课使用指定 FP16 文件，不自行转换，也不照抄网页的 pip / Python 示例。'}
    ],
    steps: [
      {title: '只选这一份入门模型', action: '点击“打开 SD1.5 Model card”，确认发布组织是 Comfy-Org、仓库是 stable-diffusion-v1-5-archive。我们只需要 v1-5-pruned-emaonly-fp16.safetensors，不是整个仓库，也不是所有版本。', why: '工作流已经确定为普通 SD1.5；先锁定兼容目标，避免在一大堆文件里凭体积或名字猜。', expected: '浏览器显示该仓库的 Model card / 模型说明，介绍它是为 ComfyUI 整理的 SD1.5 文件。', tip: '这是 Comfy 官方组织的归档，来源可从官方基础文生图教程交叉确认；它不是“最新或最强模型”的推荐。', links: [{title: '打开 SD1.5 Model card', url: 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive'}, {title: '对照 Comfy 官方文生图教程', url: 'https://docs.comfy.org/tutorials/basic/text-to-image'}]},
      {title: '先看说明、许可和访问条件', action: '在 Model card 核对模型家族、用途与 License 标记，阅读适用限制，再确认磁盘有足够空间。此归档标注 creativeml-openrail-m；如其他模型出现登录、Agree 或 Request access，先按发布者页面申请并等待批准。', why: '能下载不代表允许任何用途；gated 模型要求授权，也不是换个文件名就能绕过。', expected: '你知道自己为什么选它、需要遵守什么，并确认没有把“请求访问”误当成下载失败。', tip: '不要向陌生镜像或代下载者交账号密码 / token；本课不替你接受许可，也不要求购买第三方服务。', links: [{title: '查看模型说明与许可标记', url: 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive'}, {title: '了解 gated 模型访问流程', url: 'https://huggingface.co/docs/hub/models-gated'}]},
      {title: '从 Files 进入指定文件页', action: '在仓库页点击 Files / Files and versions（当前可能显示 Files xet），找到并点击完整文件名 v1-5-pruned-emaonly-fp16.safetensors。确认文件页显示约 2.13 GB；也可用本步骤的直达按钮。', why: '仓库说明页、文件列表和真正权重文件是三个层级；先到文件详情页再下载，最不容易拿错。', expected: '页面标题是完整 .safetensors 文件名，能看到 Download file 2.13 GB 以及文件详情。', tip: '不要选同名但没有 fp16 的另一份，也不要下载所有目录。页面体积可能有舍入，以当时文件详情为准。', links: [{title: '打开指定 FP16 文件页', url: 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors'}]},
      {title: '用 Browser 的 Download 下载真实权重', action: '在文件页的 Download 区域选择 Browser，再点击 Download file；保存到你能找到的下载文件夹并等待完成。保留原始文件名，不点击 Raw pointer file，不使用浏览器“保存网页”。', why: 'Xet / LFS 的 pointer 是指向大文件的小文本，不是权重本身；几 KB 的文件不能代替约 2.13 GB 的模型。', expected: '浏览器下载列表出现一个 GB 级的 .safetensors 文件，进度持续到完成。', tip: '页面上的 hf、curl、pip 或 Python 示例不是本课必需步骤。Desktop 用户这里用浏览器即可，不克隆整个仓库。', links: [{title: '返回文件页，点击 Download file', url: 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors'}]},
      {title: '检查下载是否真的完整', action: '打开下载文件夹，在资源管理器启用“文件扩展名”，确认文件名以 .safetensors 结尾，不是 .html、.txt、.crdownload 或 .part。查看属性，体积应与网页约 2.13 GB 的量级一致；不要在下载未结束时移动它。', why: '网页另存、访问错误页面和未完成下载都可能长得像“有一个模型文件”，但无法被模型加载器读取。', expected: '有完整、单独的权重文件，浏览器没有继续下载提示；文件不是几 KB 的 pointer 或 HTML。', tip: '系统与网页可能用不同容量单位，显示数值不必逐字相同；体积相近也不是完整性保证，仍需后续加载。可进一步比对文件页 SHA-256。'},
      {title: '确认当前实例真正读取的模型根目录', action: '新版 Desktop 打开 ☰ → Desktop Settings → Storage → Shared Models，点击目录路径打开；再查看当前实例 Manage → Storage。若 Include Shared Directories 关闭，它不会读取共享模型根，要核对该实例自有模型目录或额外的 Model Directories。', why: '把文件放到另一个实例或未启用的共享目录，会出现“磁盘有文件，节点却没有”的情况。', expected: '你能指出一个当前实例确实会扫描的模型根目录，而不是凭教程猜 C 盘或 D 盘。', tip: 'Shared Models 上 DOWNLOADS 标记表示默认下载目标；旧版入口不同，按其实际数据目录与模型路径配置确认，不套 Portable 路径，也不盲改已有开关。', links: [{title: '查看 Desktop Storage 设置', url: 'https://docs.comfy.org/installation/desktop/usage/settings'}, {title: '查看实例 Storage 覆盖规则', url: 'https://docs.comfy.org/installation/desktop/usage/manage'}]},
      {title: '放入模型根目录的 checkpoints 子目录', action: '在刚确认的模型根目录内打开 checkpoints，把完整 .safetensors 文件复制进去。目录关系是“实际模型根 / checkpoints / v1-5-pruned-emaonly-fp16.safetensors”；若 checkpoints 不存在，再在这个根目录内新建。', why: 'Load Checkpoint 读取 checkpoint 分类。主模型、LoRA 和 VAE 不靠随意混放自动分工。', expected: '目标文件位于正确的 checkpoints 分类下；复制完成，原下载文件仍保留以便核对。', tip: 'Shared Models 已指向模型根时，不再额外套一层 models；无需解压 safetensors。遇到同名已有文件先核对，不盲目覆盖，也不改名假装兼容。'},
      {title: '刷新列表，必要时重启当前实例', action: '回到 Desktop，在模型面板执行刷新并重新打开加载器下拉框；若仍不可见，先保存正在编辑的工作流，再重启当前本地实例。路径配置变更后尤其要重启，别只关闭一个节点。', why: '模型发现结果可能仍是旧列表；文件刚复制到磁盘，不代表当前进程已经重新扫描。', expected: 'Model Library 或 Load Checkpoint 的候选列表中出现完整模型名。', tip: '若仍为空，先复查实例、目录、扩展名与文件完整性，不安装更多自定义节点，也不在系统 Python 里盲跑 pip。'},
      {title: '导入练习并替换占位模型名', action: '点击本节“文生图练习 JSON”下载按钮，保存 01-text-to-image.json；用工作流菜单 Open 打开，或拖到画布空白处。在 Load Checkpoint 的 ckpt_name 下拉框手动选择刚下载的 v1-5-pruned-emaonly-fp16.safetensors。', why: '模型准备好以后，还必须让这份工作流实际指向它；占位文本不会自动变成真实权重。', expected: 'ckpt_name 显示真实模型名，不再保留占位项；其他 core 节点与连线保持原样。', tip: '先保存原工作流。下载按钮给你的是配方，不是 2.13 GB 模型；也不用为这份练习安装额外节点包。'},
      {title: '用基线 Run，确认模型能真正工作', action: '保留练习中的茶壶提示词，确认 512 × 512、batch_size 1、seed 42 / fixed、steps 20、CFG 7、euler、normal、denoise 1。运行模式保持手动、数量 1，点 Run；等待 Save Image 出现图，再到当前实例 output 位置核实 PNG，并导出普通 JSON 保存选择。', why: '文件看得见只是发现成功；经过加载、文字编码、采样和解码且保存图片，才验证了这套模型链路能工作。', expected: '任务完成、Save Image 有结果、磁盘能找到 PNG；若只得到报错，尚不能标为运行成功。', tip: '第一次加载可能较慢，别重复点 Run。记录第一条错误；下一课“跟着做第一张图”会进一步讲提示词、参数与保存，已成功时不必再次下载模型。'}
    ],
    furtherReading: {title: '选读：FP16、BF16、FP8 和 GGUF 到底有何不同？', items: [
      {term: 'FP16 / float16', meaning: '16 位浮点表示。相对 FP32，每个同类权重的原始存储更小，但数值范围也更有限。本课直接使用发布好的 FP16 文件，不要求自行转换；文件大小不是运行所需显存的全部。'},
      {term: 'BF16 / bfloat16', meaning: '也是 16 位，单个数字占用与 FP16 相同，但用更少的小数精度换取更大的数值范围。它不是“比 FP16 再省一半”，是否合适取决于模型与硬件支持。'},
      {term: 'FP8', meaning: '8 位浮点家族，包含不同格式。可以缩小相应权重的表示，但加载器、计算支持与缩放策略必须匹配；不保证在每台显卡上更快，也不保证生成效果不变。'},
      {term: 'GGUF 与 Q4 / Q5 / Q8', meaning: 'GGUF 是文件容器，Q4、Q5、Q8 等标记常描述量化方案，并非模型家族。它也可存非量化类型。只用明确支持该 GGUF 模型的加载器与工作流，不能把它塞进普通 Load Checkpoint 期待自动通用。'},
      {term: '下载精度不等于全程计算精度', meaning: '模型可以用一种表示存盘、运行时再转换或混合计算。总资源还包括文本编码器、VAE、中间结果和批量；“2.13 GB 文件”不意味着“2.13 GB 显存一定够”。先按发布者与官方模板要求选，不靠精度数字盲猜。'}
    ]},
    pitfalls: [{symptom: '下载出来只有几 KB，或者加载时报 header / metadata 错误。', fix: '先确认没有保存 Raw pointer file、HTML 错误页或未完成下载。回到可信文件页用 Download file 重下，必要时比对 SHA-256；不能只改扩展名。'}, {symptom: '页面要求登录或出现 401 / 403。', fix: '先在模型页确认登录、访问申请与许可流程是否完成；不要把拒绝访问页面另存成模型，也不要找人绕过授权。'}, {symptom: '文件在磁盘上，但 ckpt_name 仍没有它。', fix: '核对当前实例是否包含共享目录，以及文件是否位于实际根目录 / checkpoints；刷新或保存后重启当前实例。'}, {symptom: '能选到文件，却报维度错误或 OOM。', fix: '确认确实是本课的 SD1.5 checkpoint 和原始 core 练习；维度错误查架构混用，OOM 查模型、分辨率、批量及资源。不要把文件体积当显存保证。'}],
    exercise: {task: '写下模型家族、用途、格式、精度、来源文件页和实际存放路径，再完成一次基线生成；已有匹配模型可复用，不必为练习重复下载。', check: '能解释为什么只装这一份 checkpoint 就够本课使用，并展示真实 ckpt_name、完成任务和可打开的 PNG，而不是只展示下载列表。'},
    quiz: {question: '你拿到一个叫 model.safetensors 的文件，单靠这个后缀能判断什么？', options: ['它一定是 SD1.5 主模型，而且能直接用于任何工作流。', '它一定采用 FP16，显存占用就等于文件大小。', '后缀表示一种存储格式；家族、用途、精度和兼容性还要看模型说明。'], answer: 2, explanation: '格式、架构、用途与精度是不同维度。先读模型说明并匹配工作流，再核对文件与加载器；同后缀不代表能通用。'},
    downloads: [{label: '文生图练习 JSON', path: 'workflows/01-text-to-image.json'}],
    sources: [{title: 'Comfy 官方组织：SD1.5 Model card', url: 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive'}, {title: '指定 FP16 文件与体积', url: 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors'}, {title: '官方：基础文生图', url: 'https://docs.comfy.org/tutorials/basic/text-to-image'}, {title: '官方：Desktop Storage', url: 'https://docs.comfy.org/installation/desktop/usage/settings'}, {title: '官方：实例 Storage', url: 'https://docs.comfy.org/installation/desktop/usage/manage'}, {title: '官方代码：模型目录分类', url: 'https://github.com/Comfy-Org/ComfyUI/blob/master/folder_paths.py'}, {title: '官方代码：Desktop 共享模型根目录', url: 'https://github.com/Comfy-Org/Comfy-Desktop/blob/main/src/main/lib/models.ts'}, {title: 'Hugging Face：gated 模型', url: 'https://huggingface.co/docs/hub/models-gated'}, {title: 'Hugging Face：Safetensors', url: 'https://huggingface.co/docs/safetensors/index'}, {title: 'Hugging Face：GGUF 与量化类型', url: 'https://huggingface.co/docs/hub/gguf'}, {title: '扩展作者：GGUF 加载说明（选读，非本课依赖）', url: 'https://github.com/city96/ComfyUI-GGUF'}, {title: 'PyTorch：FP16、BF16 与 FP8 数据类型', url: 'https://docs.pytorch.org/docs/2.14/tensor_attributes.html'}]
  },
  {
    id: 'first-image', group: '核心练习', title: '第一张图：从一句话到一张图片', shortTitle: '跟着做第一张图', duration: '约 15 分钟，不含模型加载', diagram: 'graph',
    intro: '这一次只跑通一条标准 SD1.5 文生图链路。参数先照着填，等成功后再解释为什么。别急着扭遍所有旋钮，先让机器稳稳跑一圈。',
    outcome: '亲手生成并找到一张图片，保存能再次打开的工作流。',
    prerequisites: ['完成“模型下载与识别”，已有可加载的 SD1.5 checkpoint；若已验证出图，本课继续讲清提示词与参数，不必重复下载。', '练习文件只含 core 节点和参数，不含模型，不会自动替你安装依赖。'],
    concepts: [{term: 'Positive / 正向提示词', meaning: '描述你想要的主体、场景、光线和风格。'}, {term: 'Negative / 负向提示词', meaning: '给模型一组需要尽量避开的方向，不是绝对禁止清单。'}, {term: 'VAE Decode / VAE 解码', meaning: '把采样后的 LATENT 转成能观看和保存的 IMAGE。'}],
    steps: [
      {title: '下载并导入练习工作流', action: '点击本节的“文生图练习 JSON”下载按钮，保存到练习文件夹；在 Desktop 用工作流菜单的 Open 打开，或把 JSON 拖到画布空白处。先保存自己之前的工作流。', why: '从已接好的最小流程起步，避免第一轮同时处理接线和生成问题。', expected: '看见 ① Checkpoint加载器（简易）（Load Checkpoint）、②③ 两个 CLIP文本编码（CLIP Text Encode）、④ 空Latent图像（Empty Latent Image）、⑤ K采样器（KSampler）、⑥ VAE解码（VAE Decode）和 ⑦ 保存图像（Save Image）。', tip: '导入只是载入配方；占位模型名需要你下一步手动替换。'},
      {title: '选中真实模型', action: '打开 ① 号节点 Checkpoint加载器（简易）（Load Checkpoint）的 Checkpoint名称（ckpt_name）下拉框，选择已安装的 SD1.5 checkpoint。即使文件名不同，只要架构与内容匹配即可，不要改权重文件名来假装匹配。', why: '模板里的模型名不会把权重凭空变出来。', expected: '加载节点显示你自己的完整文件名，不再保留教学占位值。', tip: '没有候选项就回“模型下载与识别”，复查目录与刷新步骤；不要继续反复点击 Run。'},
      {title: '填入简单提示词', action: '在接到 K采样器“正面条件（positive）”的 ② 号 CLIP文本编码 填：a red ceramic teapot on a wooden table, soft window light, product photography。在接到“负面条件（negative）”的 ③ 号节点填：blurry, text, watermark。', why: '主体清晰、要求少，容易判断模型是否理解，并方便后面只改茶壶颜色。', expected: '正向与负向分别接到正确端口；两项不是随便哪个框都能放。', tip: '这是原创练习提示词，不保证生成精确文字或固定构图。'},
      {title: '核对基线参数', action: '④ 号 空Latent图像（Empty Latent Image）设 宽度（width）512、高度（height）512、批量大小（batch_size）1。⑤ 号 K采样器（KSampler）设 种子（seed）42、生成后控制 fixed、步数（steps）20、cfg 7、采样器名称（sampler_name）euler、调度器（scheduler）normal、降噪（denoise）1。', why: '固定一套普通 SD1.5 基线，后面的参数实验才有可比较的起点。', expected: '分辨率和批量没有被误设成大图或多张，种子也不会运行后自动乱跳。', tip: '这是一套教学起点，不是所有模型通用的最优参数。'},
      {title: '手动运行一次，观察到结束', action: '确认运行模式是手动、数量是 1，再点右上角 运行（Run / 旧版 Queue Prompt），或 Ctrl + Enter。等待模型加载与采样完成；若失败，展开 查看详情 / Errors，读最先出现的具体错误。', why: '第一次模型载入可能较慢。反复点击只会增加队列，不会让同一张图变快。', expected: '⑦ 号 保存图像（Save Image）出现结果预览，任务完成；画面应大致包含茶壶和桌面，不必和别人的图完全一致。', tip: 'GPU、模型和版本影响速度；本课不承诺几秒出图。'},
      {title: '保留图片与配方', action: '在 Save Image 结果中打开或保存原始 PNG，并在当前实例 output 目录核实文件；再通过工作流菜单的 Export / 导出普通 JSON，命名为 teapot-baseline.json。', why: '图片是结果，JSON 是复做配方。两份都保留，后续练习才能稳定比较。', expected: '练习文件夹有自己的 JSON，且你能找到生成 PNG；不要只保留一张屏幕截图。', tip: '要导出普通 UI 工作流，不是开发者使用的 API 格式；“保存、复现与队列”课会继续讲区别。'}
    ],
    pitfalls: [{symptom: 'Missing Models / Value not in list。', fix: '打开 Load Checkpoint，下拉重新选真实 SD1.5 模型；核对当前实例目录。'}, {symptom: 'CUDA out of memory / 显存不足。', fix: '停止多余队列，确认 512 × 512、batch_size 1；关闭不需要的显存占用，再按“排错与结课练习”排查。'}, {symptom: '输出不像目标，或者细节有瑕疵。', fix: '先确认链路运行成功，再逐项优化；单纯增加步数不能修复模型本身的能力边界。'}],
    exercise: {task: '生成一张红色茶壶图，保存基线 JSON 和原始 PNG。', check: '能重新导入 JSON，确认模型、提示词和 seed 42 都还在。'},
    quiz: {question: 'KSampler 的输出为什么不能直接接 Save Image？', options: ['因为必须先购买许可证。', '因为输出是 LATENT，需要 VAE Decode 变成 IMAGE。', '因为 Save Image 只能接提示词。'], answer: 1, explanation: '端口的数据类型要匹配。LATENT 是模型处理的潜空间数据，不是可直接保存的像素图片。'},
    downloads: [{label: '文生图练习 JSON', path: 'workflows/01-text-to-image.json'}],
    sources: [{title: '官方：基础文生图', url: 'https://docs.comfy.org/tutorials/basic/text-to-image'}, {title: '官方：首次生成与导入导出', url: 'https://docs.comfy.org/get_started/first_generation'}, {title: '官方：KSampler', url: 'https://docs.comfy.org/built-in-nodes/KSampler'}]
  },
  {
    id: 'nodes', group: '核心练习', title: '看懂连线：每个节点到底负责什么', shortTitle: '节点与数据流', duration: '约 15 分钟', diagram: 'graph',
    intro: '刚才跑通的是七个节点、六种岗位。现在沿着数据找原因：模型、文字条件和起始潜图一起进入采样器，采样后再解码。它不是“从左到右按顺序点击”。',
    outcome: '能沿连线解释基础工作流，并完成一次安全的断线、重接与预览添加。',
    prerequisites: ['完成第一张图，先另存一份 teapot-nodes-practice.json。'],
    concepts: [
      {term: 'MODEL / CLIP / VAE', meaning: '分别负责去噪模型、文字编码、像素与潜空间转换。Checkpoint 节点将它们分成不同输出。'},
      {term: 'CONDITIONING / 条件', meaning: 'CLIP Text Encode 把文字编码成供采样器使用的条件，不是直接生成图片。'},
      {term: 'LATENT 与 IMAGE', meaning: 'LATENT 是模型内部处理的潜空间表示；IMAGE 是可观看的像素数据。两者需要 VAE 转换。'},
      {term: 'Empty Latent Image', meaning: '定义初始潜图的尺寸和批量；采样器再根据 seed 创建并注入噪声。它本身不是一张已经画好的白色 PNG。'}
    ],
    steps: [
      {title: '从主模型分三路追踪', action: '点击 Load Checkpoint，沿 MODEL 找到 KSampler，沿 CLIP 找到两个文字编码节点，沿 VAE 找到 VAE Decode。必要时把节点拉开一点，别删连线。', why: '同一个加载节点输出三类对象，不代表这三个端口可以互换。', expected: '你能分别指出模型、文字编码器和解码器的去向。', tip: '颜色可辅助辨认，但以端口名称和类型为准，主题可能改变颜色。'},
      {title: '解释两个文字编码节点', action: '查看两个 CLIP Text Encode 的内容，追踪 CONDITIONING 输出分别接 KSampler 的 positive 与 negative。把“想要什么”和“避开什么”各读一遍。', why: '两个节点类型相同，实际角色由它们接到的输入决定。', expected: '知道负向提示词不是一种特别的 CLIP 模型。', tip: '给节点改标题有助于阅读，但不能靠标题判断数据实际去了哪里。'},
      {title: '跟踪尺寸与采样', action: '从 Empty Latent Image 的 LATENT 输出追到 KSampler latent_image，再从 KSampler 输出追到 VAE Decode samples。确认本课尺寸来自 Empty Latent Image。', why: '文字不会设定真实分辨率；提示词写“4K”也不会把 512 的画布变成 4K。', expected: '能解释为什么修改 width / height 和修改提示词是两种不同操作。', tip: '节点摆在右边不代表最后执行，依赖连线才决定需要的数据。'},
      {title: '添加一个并行预览', action: '搜索并添加 Preview Image。从 VAE Decode 的 IMAGE 输出拖一根线到 Preview Image 的 images 输入，同时保留通向 Save Image 的原连线。', why: '一个输出可以供多个下游使用：同一份图片既能预览，也能保存。', expected: 'VAE Decode 同时连着 Preview Image 和 Save Image。', tip: '预览节点不等于正式归档；要保留文件仍使用 Save Image。'},
      {title: '练习修复一根断线', action: '只在副本上断开 Preview Image 的 images 输入，再从 VAE Decode 的 IMAGE 输出接回。确认其他连线不动；如果操作错了，立即撤销。', why: '练习端口操作，比盲目拖动一大团线更容易理解类型匹配。', expected: '能自己恢复预览连线，不需要重新导入全部工作流。', tip: '不要用 LATENT 去硬接 IMAGE；接不上往往是类型在保护你。'},
      {title: '运行并解释每一段', action: '把 seed 改为 43，保持其他参数不变，运行一次。观察两个结果节点，再指着图说出“文字编码 → 采样 → 解码 → 预览 / 保存”。', why: '改变 seed 触发新的采样，避免缓存让你误以为节点没执行。', expected: '预览与保存显示同一轮的结果，你能讲清每个节点为什么存在。', tip: '不变的输入可能被缓存复用，这是正常优化，不是软件漏算。'}
    ],
    pitfalls: [{symptom: '节点颜色看着一样，却接不上。', fix: '检查输出 / 输入方向和类型名，不要只看节点背景色；MODEL、CONDITIONING、LATENT、IMAGE 不通用。'}, {symptom: '拖动节点后生成没变化。', fix: '移动布局不改运算。只有数据、参数或依赖变化才可能影响结果。'}],
    exercise: {task: '把流程图当课堂黑板，用 60 秒讲清从 checkpoint 到 PNG 的路线。', check: '必须说出 CLIP 产生条件、KSampler 输出 LATENT、VAE Decode 输出 IMAGE。'},
    quiz: {question: '两个 CLIP Text Encode 谁是正向、谁是负向，主要由什么决定？', options: ['节点摆在上面还是下面。', '节点的标题颜色。', 'CONDITIONING 接到了 KSampler 的哪个输入。'], answer: 2, explanation: '连接关系决定用途。节点名称和位置是给人看的辅助信息，不会自动改变数据含义。'},
    sources: [{title: '官方：节点与类型', url: 'https://docs.comfy.org/basic-concepts/nodes'}, {title: '官方：基础文生图节点解释', url: 'https://docs.comfy.org/tutorials/basic/text-to-image'}, {title: '官方：工作流', url: 'https://docs.comfy.org/basic-concepts/workflow'}]
  },
  {
    id: 'parameters', group: '核心练习', title: '调参数有方法：一次只改一个旋钮', shortTitle: '提示词与参数实验', duration: '约 20 分钟', diagram: 'parameters',
    intro: '调参不是靠一串“神仙数值”。先固定模型、种子和尺寸，再问：我到底只改变了什么？这节做一个小实验，用证据替代玄学。',
    outcome: '分清 seed、steps、CFG、sampler、scheduler 和 denoise；能做有效的单变量比较。',
    prerequisites: ['已保存第一张图的 teapot-baseline.json。', '下列数值只针对普通 SD1.5 基线，不适用于所有模型。'],
    concepts: [
      {term: 'seed / 随机种子', meaning: '控制初始噪声。想做可比实验，还要固定模型、输入、其余参数和运行环境；跨硬件 / 版本不保证逐像素一致。'},
      {term: 'steps / 采样步数', meaning: '控制采样迭代数量，通常更多会更慢，但质量并不无限上升。'},
      {term: 'CFG / 条件引导强度', meaning: '影响正负条件的引导力度，不是“画质分数”；太高可能过饱和或产生伪影。'},
      {term: 'sampler / scheduler', meaning: '前者是采样算法，后者安排噪声强度变化。先保持模板组合，不要一次更换两项。'},
      {term: 'denoise / 降噪强度', meaning: '图生图中影响允许重绘的程度，通常越高越偏离原图。它不是把两张图片按百分比透明混合。'}
    ],
    steps: [
      {title: '重建基线，固定随机性', action: '重新打开 teapot-baseline.json；设 seed 42、生成后控制 fixed，确认 steps 20、CFG 7、euler、normal、denoise 1、512 × 512。记录所用 checkpoint 名称。', why: '如果每次运行都会随机 seed，就很难判断差异来自提示词还是噪声。', expected: '所有实验共享一个明确起点。', tip: '参数完全不变时可能直接复用缓存；这不代表 fixed 失效。'},
      {title: '只改主体的颜色', action: '把正向提示词中的 red 改成 blue，其他字词和参数不动，运行并保存结果；再恢复 red。', why: '颜色是可观察的小变量，比一次同时换画风、构图和模型更易分析。', expected: '茶壶颜色有机会改变；也可能带动其他细节，生成模型并非精确编辑器。', tip: '用“是否更接近蓝色茶壶”评价，不要要求所有背景像素一模一样。'},
      {title: '只比较步数', action: '在红色茶壶基线上分别用 steps 10 和 20 运行，记录大致耗时与细节；保留 CFG 7 和同一 seed。完成后恢复 steps 20。', why: '看清速度与效果的实际取舍，不把更多步数当作必然更好。', expected: '得到两张带参数记录的对比图，并能说出有没有值得等待的改进。', tip: '首轮模型加载时间会干扰比较，不要把加载耗时全算成采样差异。'},
      {title: '只比较引导强度', action: '在同一基线上分别用 CFG 5 和 7 运行，查看主体符合度、颜色和边缘；然后恢复 CFG 7。', why: 'CFG 需要和模型、提示词共同判断，过度追求“听话”可能损害自然感。', expected: '你能描述具体差别，而不是只说数值更大。', tip: 'FLUX、LCM、Turbo 等模型可能使用不同指导方式或推荐值，不照搬本实验。'},
      {title: '把实验变成自己的参考表', action: '保留三组“只改颜色 / 只改 steps / 只改 CFG”的 JSON 与图，文件名写明变化项。最后用一两句话记下你更喜欢哪种结果及原因。', why: '记录能让你复现成功，而不是下一次又从头猜。', expected: '能指出每组唯一改变的变量，其余参数可从工作流核实。', tip: '本页交互图只讲参数趋势，不是实际模型预览；最终结论以你的 Desktop 结果为准。'}
    ],
    pitfalls: [{symptom: 'seed 一样，图片还是不一样。', fix: '检查生成后控制是否 fixed，以及模型、尺寸、提示词、采样设置和环境是否也一致。'}, {symptom: '步数和 CFG 都拉满，效果却变差。', fix: '回到已验证基线，每次只改一项；更多计算和更强引导不等于更好。'}],
    exercise: {task: '在同一模型、尺寸和 seed 下，做一组 CFG 5 与 7 的对比，写出你观察到的两点。', check: '能展示两份工作流，证明除了 CFG 之外其余关键参数相同。'},
    quiz: {question: '要判断提示词里的 red → blue 是否有效，哪个实验最合理？', options: ['固定模型、seed 和其他参数，只改这一个词。', '同时随机 seed、换模型、提高 CFG。', '只看别人用不同模型生成的图。'], answer: 0, explanation: '单变量比较才让差异有解释力。即便如此，生成过程也不保证只改变你指定的像素。'},
    sources: [{title: '官方：KSampler 参数', url: 'https://docs.comfy.org/built-in-nodes/KSampler'}, {title: '官方：图生图与 denoise', url: 'https://docs.comfy.org/tutorials/basic/image-to-image'}, {title: '官方：模型兼容问题', url: 'https://docs.comfy.org/troubleshooting/model-issues'}]
  },
  {
    id: 'img2img', group: '核心练习', title: '图生图：让已有图片换一种表达', shortTitle: '图生图与重绘程度', duration: '约 18 分钟', diagram: 'img2img',
    intro: '文生图从空潜图出发，图生图先把你的图片编码成潜图。你给出一个起点，再用提示词和 denoise 决定要往哪里改。',
    outcome: '上传自己的练习图，完成 0.30 与 0.70 的重绘程度对比。',
    prerequisites: ['已有 SD1.5 checkpoint。', '准备自己有权使用的 PNG / JPG，优先使用“跟着做第一张图”中生成的 512 × 512 茶壶图。'],
    concepts: [{term: 'Load Image / 加载图像', meaning: '上传输入图片；这和把含工作流的 PNG 拖到空白画布恢复配方是两件事。'}, {term: 'VAE Encode / VAE 编码', meaning: '把输入 IMAGE 转成采样器使用的 LATENT。'}, {term: 'denoise', meaning: '较低值通常更保留原图布局，较高值通常有更大变化；它不是精确的相似度百分比。'}],
    steps: [
      {title: '导入图生图练习', action: '点击本节的下载按钮保存 02-image-to-image.json，用工作流菜单的 Open 打开；在 Load Checkpoint 选择文生图基线使用的同一个 SD1.5 模型。', why: '只改变起始图像路径，不同时换模型，便于理解新增部分。', expected: '看到 Load Image → ImageScale → VAE Encode → KSampler 的输入支路。', tip: '与文生图的核心区别在采样器前面；后面的解码和保存仍然保留。'},
      {title: '在节点里上传图片', action: '在 Load Image 点击 choose file / upload，选择之前的茶壶 PNG。确认预览出现；检查 ImageScale 的 width 和 height 为 512，先不要提高尺寸。', why: '图片经尺寸控制再编码，避免直接把很大的手机照片送入采样。', expected: '加载节点显示你的照片，而不是教学占位文件名。', tip: '本练习使用 center 居中裁剪为 512 × 512，非方图的边缘可能被裁掉；原文件不会被覆盖，初次练习用方图。'},
      {title: '描述修改后的目标', action: '在正向提示词写 a blue ceramic teapot on a wooden table, watercolor painting, soft light；保留主体和场景，只把颜色与表现方式作为本次变化。', why: '提示词描述目标结果，原图提供起点；两者应共同指向一个明确方向。', expected: '正向条件接到 positive，输入图片经 VAE Encode 接到 latent_image。', tip: '图生图不是严格的“只改某个物件”；局部修改要看下一课的遮罩。'},
      {title: '先跑中间强度', action: '把 KSampler 设 seed 42 / fixed、steps 20、CFG 7、euler、normal、denoise 0.55，运行一次。保留原图和结果并排查看主体、构图与风格。', why: '先建立中间值参考，再观察减弱或增强重绘会带来什么。', expected: '生成一张基于原图的新图，可能保留部分布局并改变颜色或笔触。', tip: '效果取决于模型能力，普通 SD1.5 不保证准确执行每一条编辑要求。'},
      {title: '只改 denoise 做对照', action: '固定其余设置，分别改 denoise 为 0.30 与 0.70 各运行一次，给两张图标注数值；最后保存更合适的那份工作流。', why: '你会直观看见“更像原图”和“更能改动”之间的取舍。', expected: '能指出哪张更保留原图、哪张变化更大，而非只看颜色像不像。', tip: '降低 denoise 不等于按比例减少 KSampler 的实际采样步数；不要拿它当通用加速开关。'}
    ],
    pitfalls: [{symptom: '几乎没有变化。', fix: '确认 KSampler 吃的是 VAE Encode 输出，再适度提高 denoise；检查是否真的改了正向提示词。'}, {symptom: '完全不像原图。', fix: '降低 denoise、减少矛盾描述，并确认输入图片没有被意外裁切；需要结构约束时再学 ControlNet。'}, {symptom: '拖图片后整个工作流被替换了。', fix: '含元数据的 PNG 拖到空白画布可能恢复工作流；要输入图片，请用 Load Image 节点的上传按钮。'}],
    exercise: {task: '用同一张茶壶图完成 denoise 0.30 / 0.70 对比，说明你希望保留和改变的各一个特征。', check: '两份工作流除 denoise 外关键参数一致，且都能找到原始输入文件。'},
    quiz: {question: '想让普通图生图更保留原图结构，通常先尝试什么？', options: ['把 denoise 直接拉到 1。', '在其他条件不变时适当降低 denoise。', '删除 VAE Encode。'], answer: 1, explanation: '较低 denoise 通常给原图更小的改动空间；它不是精确的保真百分比，也不能代替局部遮罩。'},
    downloads: [{label: '图生图练习 JSON', path: 'workflows/02-image-to-image.json'}],
    sources: [{title: '官方：图生图与 denoise', url: 'https://docs.comfy.org/tutorials/basic/image-to-image'}, {title: '官方：模型匹配问题', url: 'https://docs.comfy.org/troubleshooting/model-issues'}]
  },
  {
    id: 'z-image', group: '核心练习', title: '现代拆分模型实战：用 Z-Image Turbo 跑出 1024 高清茶壶', shortTitle: 'Z-Image 拆分模型实战', duration: '约 18 分钟', diagram: 'zimage',
    intro: '前面用 SD1.5 学会了“三合一礼盒（Checkpoint）”怎么跑。但现在的新模型（如 Z-Image Turbo、FLUX、Qwen-Image）因为体积大，常把扩散模型、文字编码器和 VAE 拆成三个独立文件放在不同文件夹里。这一课用你电脑里已安装的 Z-Image Turbo 实机跑出一张 1024 × 1024 茶壶图，彻底搞懂拆分模型怎么接、为什么参数不能照搬 SD1.5。',
    outcome: '能用 UNet加载器 + 加载CLIP + 加载VAE 组装拆分模型，理解蒸馏模型参数（8 步、cfg 1、shift 3、条件零化），并在本机真实生成 1024 × 1024 作品。',
    prerequisites: ['已理解前几课的 MODEL、CLIP、VAE、CONDITIONING 和 LATENT 数据流。', '当前实例的模型根目录已备好三件套：diffusion_models/z_image_turbo_bf16.safetensors、text_encoders/qwen_3_4b.safetensors、vae/ae.safetensors（你当前环境已安装齐全）。'],
    concepts: [
      {term: '三个独立加载器', meaning: 'UNet加载器（UNETLoader）读扩散模型，加载CLIP（CLIPLoader）读文字编码器，加载VAE（VAELoader）读图像解码器——合起来完成以前一个 Checkpoint加载器 做的事。'},
      {term: '采样算法（AuraFlow）与 shift', meaning: 'Flow 架构模型在进入 K采样器 前用 ModelSamplingAuraFlow 校准时间步偏移（Z-Image Turbo 设移位 shift = 3.00）。'},
      {term: '空Latent图像（SD3）', meaning: '新一代 16 通道潜空间画布，默认从 1024 × 1024 起步，不混用 SD1.5 的 512 画布。'},
      {term: '条件零化（ConditioningZeroOut）', meaning: 'Turbo 蒸馏模型在 cfg = 1.0 时负面条件不参与拉扯，直接把条件向量置零送入负面端口，无需再算一遍负向文本编码。'}
    ],
    steps: [
      {title: '下载并导入 Z-Image 练习工作流', action: '点击本节“Z-Image Turbo 练习 JSON”按钮下载 03-z-image-turbo.json，在 ComfyUI 中通过工作流菜单打开或拖入画布空白处，再点右下角“适应视图 (.)”看清全貌。', why: '直接对照排好序的 10 个原生节点，一眼看清“左边三合一拆成三路、右边采样解码照旧”的结构。', expected: '画布上出现带 ①～⑩ 编号的 10 个节点，没有任何第三方自定义节点报错。', tip: '导入前先保存你正在编辑的其他工作流标签。'},
      {title: '核对三个独立加载器的文件与目录', action: '依次检查左侧与下方的三个加载节点：① UNet加载器（UNETLoader）的 UNet名称 选 z_image_turbo_bf16.safetensors（数据类型 default）；③ 加载CLIP（CLIPLoader）的 CLIP名称 选 qwen_3_4b.safetensors，类型（type）必须选 lumina2；⑧ 加载VAE（VAELoader）选 ae.safetensors。', why: '拆分模型按职责分放三个文件夹（diffusion_models / text_encoders / vae），且 加载CLIP 必须指定 lumina2 架构才能正确解析文本向量。', expected: '三个下拉框均选中真实文件；MODEL、CLIP、VAE 三条线各就各位。', tip: '如果在 Checkpoint加载器 里找 z_image_turbo，会因为目录分类不同而找不到。'},
      {title: '追踪采样偏移与条件零化支路', action: '看 ① UNet加载器 的模型输出先经过 ② 采样算法（AuraFlow）（移位 shift = 3.00，sampling = flow）再进 ⑦ K采样器；④ CLIP文本编码 的条件输出一路进 K采样器“正面条件”，另一路经 ⑤ 条件零化（ConditioningZeroOut）进“负面条件”。', why: '理解为什么新模型比 SD1.5 多出两个小节点：一个给 Flow 模型校准采样节奏，一个在 cfg=1 时提供零向量占位。', expected: '能指着连线说出 ② 号和 ⑤ 号节点各自为什么存在、删掉或接反会发生什么。', tip: '不要把 条件零化 接反到“正面条件”上，否则你的茶壶提示词就被清空了。'},
      {title: '核对 1024 画幅与 Turbo 专用采样参数', action: '检查 ⑥ 空Latent图像（SD3）：宽度 1024、高度 1024、批量大小 1。检查 ⑦ K采样器：种子 42、生成后控制 fixed、步数 8、cfg 1.0、采样器名称 res_multistep、调度器 simple、降噪 1.00。', why: 'Z-Image Turbo 是经过步数与引导蒸馏的大图模型：8 步 + cfg 1.0 + 1024 分辨率才是它的主场，照搬 SD1.5 的 20 步、cfg 7 反而慢且失真。', expected: '确认没有把 SD1.5 的参数习惯硬套过来。', tip: '不同模型家族的推荐步数、CFG、采样器和分辨率各不相同，换模型先看官方模板。'},
      {title: '点击运行，验收 1024 × 1024 真实成片', action: '确认顶部运行数量为 1，点击“运行（Run）”。等待约十余秒模型加载与 8 步采样完成，在 ⑩ 保存图像（Save Image）查看生成的红色茶壶，并到 output/ComfyClass 目录找到 zimage_00001_.png。', why: '亲眼验证“看懂数据流后，换一套全新的现代拆分模型也能一次跑通”。', expected: '⑩ 号节点显示清晰的 1024 × 1024 木桌红茶壶照片，output/ComfyClass 下生成对应 PNG 文件。', tip: '跑通后可以试着只把提示词里的 red 改成 celadon（青瓷）再跑一次，感受 8 步出图的节奏。'}
    ],
    pitfalls: [
      {symptom: '在 Checkpoint加载器 里找不到 z_image_turbo_bf16.safetensors。', fix: '它是独立的扩散模型，位于 diffusion_models 目录，必须用 UNet加载器（Load Diffusion Model）读取。'},
      {symptom: '加载CLIP 报错或生成的画面完全不听提示词。', fix: '检查 ③ 号节点 加载CLIP 的“类型（type）”是否选成了 lumina2，不要留成默认的 stable_diffusion。'},
      {symptom: '照搬 SD1.5 设了 20 步、cfg 7，结果又慢画面又怪。', fix: '恢复 Turbo 官方基线：步数 8、cfg 1.0、res_multistep、simple，并确认经过了移位为 3 的 ModelSamplingAuraFlow。'}
    ],
    exercise: {task: '导入 03-z-image-turbo.json，核对三个加载器与 Turbo 参数，运行生成一张 1024 × 1024 茶壶图，并对比它与 SD1.5 工作流的异同。', check: '能说出哪三个节点替代了 Load Checkpoint，为什么步数是 8、cfg 是 1.0，并在 output/ComfyClass 找到生成的 PNG。'},
    quiz: {question: '你把 z_image_turbo_bf16.safetensors 放进 checkpoints，用 Checkpoint加载器（简易）(Load Checkpoint) 去读，运行失败。正确做法是？', options: ['把文件改名成 .ckpt，再用 Checkpoint加载器 读。', '放进 diffusion_models，用 UNet加载器 (UNETLoader) 读；文本编码器和 VAE 再分别用 加载CLIP (CLIPLoader)、加载VAE (VAELoader) 加载。', '用 加载LoRA (Load LoRA) 把它挂到 SD1.5 checkpoint 上。'], answer: 1, explanation: 'Z-Image Turbo 不是包含三件套的 checkpoint，而是拆成扩散模型、文本编码器、VAE 三个文件；改名不改变内容，它也不是 LoRA。'},
    downloads: [{label: 'Z-Image Turbo 练习 JSON', path: 'workflows/03-z-image-turbo.json'}],
    sources: [{title: '官方：Z-Image Turbo 教程与模板说明', url: 'https://docs.comfy.org/tutorials/image/z-image/z-image-turbo'}, {title: '官方：模型与目录分类', url: 'https://docs.comfy.org/basic-concepts/models'}]
  },
  {
    id: 'inpaint', group: '拓展与排错', title: '局部重绘：只让指定区域参与修改', shortTitle: '遮罩与局部重绘', duration: '约 20 分钟', diagram: 'mask',
    intro: '想改茶壶、不想重新抽整张图，就需要告诉模型“重点改哪里”。遮罩提供区域，提示词提供目标。注意：只靠潜空间遮罩，不能承诺区域外像素完全不变。',
    outcome: '画出局部遮罩，接好 inpaint 编码，并理解如何与原图合成保留区域外内容。',
    prerequisites: ['已完成图生图，另存副本。', '准备一张事先处理为 512 × 512 的方图；在这张最终尺寸图上画 mask，不先画再缩放。'],
    concepts: [{term: 'MASK / 遮罩', meaning: '本课的重绘遮罩中白色 / 1 表示允许重绘，黑色 / 0 表示保留方向。编辑器的彩色覆盖只是显示方式。'}, {term: 'VAE Encode (for Inpainting)', meaning: '同时接收图片、VAE 和遮罩，输出带重绘区域信息的 LATENT。'}, {term: 'ImageCompositeMasked', meaning: '把生成图的指定区域合成到原图上；需要严格保留区域外像素时，不应只依赖 VAE 编解码。'}],
    steps: [
      {title: '先固定图片与遮罩的坐标', action: '在图生图副本的 Load Image 上传 512 × 512 方图。后续 inpaint 支路直接使用这张原尺寸图片，不经过 ImageScale；先保留原图文件。', why: '图片缩放但 mask 没有同步处理，会让“要改的区域”和实际像素对不上。', expected: '你的输入就是最终工作尺寸，接下来画的遮罩与它一一对应。', tip: '第一次不要拿高分辨率长图练；先在小方图上把流程搞明白。'},
      {title: '打开遮罩编辑器', action: '右键 Load Image，选择 Open in MaskEditor / 在遮罩编辑器打开。只涂茶壶主体附近一小块，保留桌面和背景；完成后用编辑器的保存 / 应用按钮返回。', why: '一开始就涂满全图，等于失去局部编辑的意义。', expected: 'Load Image 的 MASK 输出对应你刚画的区域；可接 MaskToImage 再接 Preview Image 检查白黑分布。', tip: '不要把彩色覆盖的颜色直接当作数值含义；用遮罩预览确认待修改区域是白色。'},
      {title: '换成专用的编码节点', action: '搜索 VAE Encode (for Inpainting)，将 Load Image 的 IMAGE 直接接 pixels、MASK 接 mask，Load Checkpoint 的 VAE 接 vae；把它的 LATENT 接 KSampler 的 latent_image，替换普通 VAE Encode 的输入支路。', why: '普通 VAE Encode 不会自动理解你画的重绘区域。', expected: 'KSampler 收到带遮罩的潜图，图片与遮罩来自同一个 Load Image。', tip: '先保留 grow_mask_by 默认值；数值越大，实际影响范围可能越超出原遮罩。'},
      {title: '给局部一个明确目标', action: '正向提示词描述完整目标，例如 a blue ceramic teapot on a wooden table, soft window light。先用原 SD1.5 模型练习，seed 固定，denoise 设 1 试一次；若效果不理想，参考官方 inpaint 示例准备匹配的专用 inpainting checkpoint。', why: '专用编码会处理被遮罩内容，较强重绘能让该区域重新生成；模型与周围语境仍决定是否自然。', expected: '主要变化出现在遮罩附近，但边缘或区域外可能有编解码差异。', tip: '本步骤的 1 是局部重建练习起点，不代表所有修图都应使用相同强度。'},
      {title: '需要保留外部像素时再合成', action: '添加 ImageCompositeMasked：destination 接原 Load Image 的 IMAGE，source 接 VAE Decode 的 IMAGE，mask 接原 MASK；x 与 y 都设 0，同尺寸下关闭 resize_source。把合成后的 IMAGE 接 Save Image。', why: '采样遮罩约束潜空间，像素级合成才是“把改动贴回原图”的明确操作。', expected: '保存的是合成图；黑色遮罩覆盖的区域沿用原图，白色区域使用新图。', tip: '灰色边缘会混合两图；硬边可能有接缝。先验证坐标，再考虑羽化，别一上来叠复杂节点。'},
      {title: '验收边缘与未修改区域', action: '放大比较原图、原始生成图和合成图，检查茶壶边缘、桌面纹理及遮罩是否错位；导出这份工作流并单独保留输入图和遮罩。', why: '局部编辑是否成功，要看目标变化与原图保护两件事。', expected: '能指出哪些区域被替换、哪些保留，且知道残留接缝来自哪里。', tip: 'JSON 不一定打包遮罩素材；换电脑前要把相关输入文件一并备份。'}
    ],
    pitfalls: [{symptom: '改动区域反了。', fix: '预览 MASK 的白黑分布，确认本课节点白重绘、黑保留；不要猜透明通道或编辑器覆盖色。'}, {symptom: '遮罩明显错位。', fix: '检查是否只缩放了图片却没处理遮罩。回到已定尺寸的输入，重新画遮罩。'}, {symptom: '没涂的地方也有细微改变。', fix: 'VAE 编解码可能改变像素；用 ImageCompositeMasked 把修改区域贴回原图，并检查边缘混合。'}],
    exercise: {task: '只修改茶壶上的一小块颜色，保留背景，并画出“图片 + 遮罩 → inpaint → 合成”的数据路线。', check: '能展示遮罩预览和合成结果；说清为什么直接保存解码图不等于区域外绝对不变。'},
    quiz: {question: '在本课的 inpaint 遮罩约定中，白色代表什么？', options: ['允许重绘的区域。', '永远不能改动的区域。', '模型文件所在目录。'], answer: 0, explanation: '白色表示重绘区域。是否精确保留其他像素，还取决于 VAE、遮罩扩张、边缘和最终合成方式。'},
    downloads: [{label: '局部重绘与遮罩合成 JSON', path: 'workflows/04-inpaint.json'}],
    sources: [{title: '官方：局部重绘', url: 'https://docs.comfy.org/tutorials/basic/inpaint'}, {title: '官方：遮罩编辑器', url: 'https://docs.comfy.org/interface/maskeditor'}, {title: '官方：Inpaint 编码节点', url: 'https://docs.comfy.org/built-in-nodes/VAEEncodeForInpaint'}, {title: '官方：遮罩合成', url: 'https://docs.comfy.org/built-in-nodes/ImageCompositeMasked'}]
  },
  {
    id: 'lora-controlnet', group: '拓展与排错', title: '按目的选工具：LoRA 改倾向，ControlNet 控结构', shortTitle: 'LoRA 与 ControlNet', duration: '约 20 分钟，不含下载', diagram: 'extensions',
    intro: '先问自己想控制什么：希望模型更偏某种风格，用匹配的 LoRA；希望遵循姿态、轮廓或深度，用匹配的 ControlNet。它们都不是“装上就自动变好”的插件按钮。',
    outcome: '能选对工具，检查模型家族，并分别跑通一个官方示例。',
    prerequisites: ['文生图已经跑通，了解 MODEL / CLIP / CONDITIONING。', '拓展练习可能需要额外模型；只下载自己确实需要且许可允许的文件。'],
    concepts: [{term: 'LoRA', meaning: '给匹配基础模型施加训练得到的调整，常用于风格或概念；不能独立代替主模型。'}, {term: 'ControlNet', meaning: '使用边缘、姿态、深度等条件图约束生成结构；条件图类型要与模型相符。'}, {term: 'Preprocessor / 预处理器', meaning: '把普通照片转成条件图的工具。它和 ControlNet 权重不是同一个东西，也不一定全部内置。'}],
    steps: [
      {title: '先完成一个 LoRA 官方示例', action: '可先下载本节“LoRA 串联练习 JSON（05-lora-style.json）”观察 8 节点标准接法，或打开本课官方 LoRA 页面导入示例图；阅读模型清单。选作者标明兼容的 checkpoint 与 LoRA，将 LoRA 放入当前模型目录的 loras 分类并刷新。', why: '先用已知配套组合，避免从随机文件名推测兼容性。', expected: 'Load Checkpoint 与 Load LoRA 都能选到对应文件，不存在架构不明的混搭。', tip: '不要把 SDXL LoRA 套到 SD1.5 主模型；后缀同是 safetensors 也不代表兼容。'},
      {title: '看懂 LoRA 插在哪儿', action: '沿线检查：checkpoint 的 MODEL 和 CLIP 进入 Load LoRA；它输出的 MODEL 进入 KSampler，输出的 CLIP 进入正负文字编码。按作者推荐强度运行一次。', why: 'LoRA 通过调整模型 / 编码器路径生效，不是把图片接进去就能改风格。', expected: '你能找到 LoRA 前后的数据流，并得到一个基线结果。', tip: '部分 LoRA 需要特定触发词；按发布者说明，不凭空猜。'},
      {title: '只调整 LoRA 强度做比较', action: '固定 seed 与提示词，把 strength_model 从作者推荐值降低一点，再运行；保留 strength_clip 不变。比较风格强弱与细节损失。', why: '先拆开参数观察，不把两个强度同时乱改。', expected: '能判断当前 LoRA 是太强、太弱，还是目标本来就不匹配。', tip: '本课不规定统一强度，模型作者的训练方式会影响合适范围。'},
      {title: '另开 ControlNet 官方示例', action: '保存 LoRA 练习后，打开本课官方 ControlNet 页面，导入其 Scribble / 涂鸦示例，下载页面提供的已预处理条件图，并按清单准备匹配的 SD1.5 checkpoint、ControlNet 与 VAE。', why: '先用已处理好的条件图，避免初次练习还要安装预处理插件。', expected: 'Load ControlNet 指向 scribble 权重，Load Image 显示相应涂鸦条件图。', tip: '不要把普通彩照直接当作 OpenPose 骨架图；不同控制类型需要不同输入。'},
      {title: '追踪条件路径并运行', action: '确认条件图进入 Apply ControlNet 的 image，ControlNet 权重进入 control_net；处理后的 positive / negative 继续进入 KSampler。先保留官方示例强度与起止范围，运行一次。', why: 'ControlNet 在条件路径里加入结构约束，和 LoRA 修改模型路径的角色不同。', expected: '结果大体遵循条件图结构，但不会保证每个像素都一模一样。', tip: '之后只改 strength 做对比；别同时叠多个 LoRA 和多个 ControlNet。'}
    ],
    pitfalls: [{symptom: 'LoRA 装了却没有明显效果。', fix: '核对架构、是否真的接入修改后的 MODEL / CLIP、触发词和推荐强度。'}, {symptom: 'ControlNet 报维度错误或控制失效。', fix: '核对基础模型家族、ControlNet 家族和条件图类型；回到官方已知配套示例。'}],
    exercise: {task: '写下“换风格”和“跟姿势”分别先选什么工具，并跑通其中一个配套示例。', check: '能说出所用权重的模型家族，以及它接在 MODEL / CLIP 还是 CONDITIONING 路径。'},
    quiz: {question: '希望生成的人物遵循一张骨架姿态图，通常优先考虑什么？', options: ['只增加 Save Image 节点。', '随机换一个风格 LoRA。', '与主模型匹配的姿态 ControlNet 和正确条件图。'], answer: 2, explanation: '姿态属于结构约束；ControlNet、基础模型与输入条件图需要配套，不能只靠文件名或后缀判断。'},
    downloads: [{label: 'LoRA 串联练习 JSON', path: 'workflows/05-lora-style.json'}],
    sources: [{title: '官方：LoRA 示例', url: 'https://docs.comfy.org/tutorials/basic/lora'}, {title: '官方：ControlNet 示例', url: 'https://docs.comfy.org/tutorials/controlnet/controlnet'}, {title: '官方：架构不匹配排查', url: 'https://docs.comfy.org/troubleshooting/model-issues'}]
  },
  {
    id: 'save-queue', group: '拓展与排错', title: '会用也要会收好：保存、复现与队列', shortTitle: '保存、复现与队列', duration: '约 12 分钟', diagram: 'files',
    intro: '图片能发朋友圈，工作流能让你明天继续做。把两者分开保存，再学会看队列，才能避免“昨天还行，今天怎么啥都没了”。',
    outcome: '导出普通工作流、保留原始图片、管理单次队列，并知道分享前检查什么。',
    prerequisites: ['至少一份成功的文生图或图生图工作流。'],
    concepts: [{term: '工作流 JSON', meaning: '记录节点、连线、参数和布局；一般不打包模型、插件代码或输入图片。'}, {term: 'PNG 元数据', meaning: '内置保存节点在启用元数据时可把工作流 / 提示信息写入 PNG；截图、重编码或关闭元数据后不能依赖它恢复流程。'}, {term: '队列数量与 batch_size', meaning: '运行区数量代表提交多少次任务；潜图里的 batch_size 代表一次处理多少张。后者可能显著增加显存需求。'}],
    steps: [
      {title: '保存一份普通 UI 工作流', action: '在工作流菜单中选择 Export / 导出普通 JSON，命名为 teapot-final.json。若你的版本把入口放在结果卡片，可在 Assets 或完成的 Job History 条目菜单中找 Export workflow。', why: '普通 UI 格式保留可编辑结构；API 格式主要用于程序调用，不是初学者的备份首选。', expected: '练习文件夹出现 JSON，重新 Open 后可以继续编辑节点。', tip: 'Ctrl + S 常用于当前工作流保存；明确需要一个可搬走的文件时，执行导出并核实文件位置。'},
      {title: '找到真正的输出文件', action: '打开当前实例配置的 output 位置，或在结果卡片中保存原始 PNG。确认文件能独立打开，而不是只看见应用内缩略图。', why: '预览、历史记录和磁盘文件不是同一层；别把唯一副本留在临时视图里。', expected: '你知道 PNG 在哪个目录，并能在关闭工作流后打开它。', tip: '新版每个实例可有自己的 Input / Output 配置，不要认定所有实例共用一个 output。'},
      {title: '验证一次恢复', action: '先保存当前工作，再另开工作流导入 teapot-final.json，核对模型与输入图片。也可尝试把原始 PNG 拖到空白画布；若没恢复，回到 JSON 备份。', why: '备份是否有效要试一次，不能只看文件扩展名。', expected: '知道 JSON 能恢复什么，以及还缺哪些外部依赖。', tip: '社交平台压缩过的图不可靠；不要把“所有 PNG 都带工作流”当规则。'},
      {title: '练习一次可控队列', action: '运行模式保持手动，运行区数量和 batch_size 都设为 1。点 Run 后打开队列，观察等待 / 执行 / 完成；只在需要时使用 Cancel 停止当前任务，并检查是否还有等待项。', why: '取消当前任务不必然清掉所有排队任务，开启自动模式还可能继续提交。', expected: '能确认队列确实空闲，不会离开后继续连跑。', tip: '暂不启用 On Change / Instant；也不要拿付费 API 流程练批量提交。'},
      {title: '分享前做一个检查包', action: '把 JSON、必要输入图、模型文件名 / 来源、关键参数放到一个练习目录。公开前查看提示词、路径、照片内容与元数据，移除密钥和不该公开的信息。', why: '对方需要足够材料才能复现，但隐私不该随着配方一起发出去。', expected: '目录既能说明如何运行，也不夹带私人数据；模型权重按许可另行获取。', tip: '不同硬件、库版本和模型文件可能导致结果差异；相同 seed 不是跨环境逐像素保证。'}
    ],
    pitfalls: [{symptom: '朋友导入 JSON 后全是缺失项。', fix: '一起提供模型家族 / 文件来源、节点包说明和必要素材，不能只给配方不给依赖。'}, {symptom: '取消后还在继续生成。', fix: '确认自动队列模式关闭，再检查等待任务；取消当前执行与清空等待队列是不同动作。'}],
    exercise: {task: '建立一个能复做的茶壶练习包，重新导入验证，最后让队列处于空闲。', check: '包中至少有普通 JSON、原始结果 PNG、输入素材（若有）和模型来源记录。'},
    quiz: {question: '哪种文件最适合作为可编辑流程的明确备份？', options: ['聊天软件压缩后的图片。', '普通 UI 工作流 JSON，并单独保留依赖资料。', '画布截图。'], answer: 1, explanation: '截图不含连接数据，PNG 元数据可能丢失；普通 JSON 是清晰的流程备份，但模型和素材仍要另存。'},
    sources: [{title: '官方：工作流导入导出', url: 'https://docs.comfy.org/get_started/first_generation'}, {title: '官方：SaveImage 与元数据', url: 'https://docs.comfy.org/built-in-nodes/SaveImage'}, {title: '官方：界面与运行队列', url: 'https://docs.comfy.org/interface/overview'}, {title: '官方：Desktop 实例管理', url: 'https://docs.comfy.org/installation/desktop/usage/instance-management'}]
  },
  {
    id: 'custom-nodes', group: '拓展与排错', title: '扩展功能：先判断缺什么，再决定装什么', shortTitle: '自定义节点与安全', duration: '约 12 分钟', diagram: 'dependencies',
    intro: '自定义节点能扩展能力，也可能引入依赖冲突和运行代码。我们的原则很简单：基础流程先跑通，缺某项功能再装对应的一个包，不把环境堆成盲盒。',
    outcome: '分清缺模型与缺节点，知道如何用 Desktop 的 Manager 谨慎安装、重启与回退。',
    prerequisites: ['一份已验证能运行的 core 工作流副本。', '本课不要求安装任意示例插件；没有实际需求时，完成识别练习即可。'],
    concepts: [{term: 'Missing model', meaning: '工具在，但找不到权重。应该检查模型目录和加载器，不是安装节点包。'}, {term: 'Missing node', meaning: '流程引用的节点类型当前不可用；可能是缺第三方包，也可能是 core 版本不支持或包导入失败。'}, {term: 'Manager', meaning: '用于查看、安装、更新或禁用节点包。Desktop 实例通常已带管理能力，不要照 portable 教程再装一遍。'}, {term: '信任边界', meaning: '节点包不是单纯素材，可能执行 Python / 前端代码；可信注册信息不等于绝对安全。'}],
    steps: [
      {title: '先读缺失报告的类型', action: '导入你确实需要的工作流后，展开 Missing Nodes / Missing Models 或 Errors 详情，记下完整节点类型或模型文件名。遇到 core 节点缺失时，先核对教程所需 ComfyUI 版本。', why: '两个红色提示可能来自完全不同问题，不能看到红就一股脑安装。', expected: '能把问题分成“文件没找到”“节点没有”“节点加载失败”之一。', tip: '本项目文生图与图生图练习只用 core 节点；正常情况下不需要第三方节点包。'},
      {title: '确认作者与必要性', action: '打开工作流作者提供的节点包说明，核对维护者、用途、兼容版本、依赖与许可。确认它解决的功能无法由当前已有节点完成，再考虑安装。', why: '少一个不必要依赖，就少一类冲突与安全风险。', expected: '你能说清为什么需要这个包，而不是只因为别人装了。', tip: '不要运行来源不明的一键修复脚本，不要把账号密钥发到公开报错页面。'},
      {title: '只安装已经确认的那个包', action: '先导出当前可运行工作流并记录环境。若确有需要，在缺节点提示里点 Open Manager，或打开当前版本的 Manager，按准确包名查找并核对来源后安装。', why: '一次只改一个包，出问题才知道变化来自哪里。', expected: '安装任务明确结束，没有把错误日志当成成功。', tip: '新版 Manager 的可用来源受 registry 与安全策略限制；不要为了装陌生仓库随手降低安全设置。'},
      {title: '按提示重启当前实例并验证', action: '保存工作后按 Manager 提示重启当前实例。重新导入目标工作流，确认节点不再缺失；再运行原来的 core 基线，检查旧流程仍然正常。', why: '节点可见只说明注册成功，不代表依赖和实际执行都没有问题。', expected: '既能找到新节点，也能运行原有基线；如失败，保留第一条报错。', tip: '不要在系统 Python 里盲跑 pip 命令；Desktop 管理的实例可能使用独立环境。'},
      {title: '有问题先禁用，不删整个安装', action: '若新包导致异常，在 Manager 禁用刚安装的包并重启，再跑 core 基线；必要时用 Desktop 设置中的禁用全部自定义节点方式验证。', why: '可逆隔离比重装整个环境更容易确定原因，也更保护已有作品。', expected: '能判断异常是否随新包启用 / 禁用而变化。', tip: '删实例可能连数据一起删。备份前别把“卸载重装”当默认排错按钮。'}
    ],
    pitfalls: [{symptom: '节点包显示安装了，但节点还是缺失。', fix: '检查是否装在当前实例、是否需要重启，以及启动日志中的依赖或 import 错误。'}, {symptom: '更新一堆节点后不知道哪个坏了。', fix: '先备份状态，通过禁用并分批恢复定位；后续一次只更新有明确需要的包。'}],
    exercise: {task: '找一个你打算用的扩展，写出用途、作者、适用模型 / 版本和是否真的需要安装；没有需求就不装。', check: '能解释它是代码包还是权重，并知道失败时如何禁用恢复基线。'},
    quiz: {question: '缺少模型权重时，安装更多自定义节点通常能解决吗？', options: ['不能，应先检查模型文件、分类与搜索路径。', '能，节点越多就越不会缺模型。', '必须先删除 Desktop。'], answer: 0, explanation: '节点代码和模型权重是两类依赖。对症检查比盲目扩展环境更安全，也更快。'},
    sources: [{title: '官方：安装自定义节点', url: 'https://docs.comfy.org/installation/install_custom_node'}, {title: '官方：Manager 概览', url: 'https://docs.comfy.org/manager/overview'}, {title: '官方：自定义节点排错', url: 'https://docs.comfy.org/troubleshooting/custom-node-issues'}]
  },
  {
    id: 'troubleshooting', group: '拓展与排错', title: '遇到问题别乱修：按症状缩小范围', shortTitle: '排错与结课练习', duration: '约 15 分钟', diagram: 'diagnosis',
    intro: '报错不是考试不及格，是系统告诉你缺了哪一环。先保存现场，再找到第一个具体错误；一口气重装、升级、换模型，只会把线索一锅炖没。',
    outcome: '按“启动 → 文件 → 节点 → 兼容 → 资源 → 结果”定位问题，并提交有用的求助信息。',
    prerequisites: ['保留一份已跑通的 core 文生图基线。', '不要为了练习主动破坏真实环境；可以用本页症状卡做纸面判断。'],
    concepts: [{term: '第一条具体错误', meaning: 'Prompt execution failed 是结果摘要；需要继续找具体节点、缺失文件、维度不匹配或内存错误。'}, {term: '最小复现', meaning: '用最少节点、单张小图和匹配模型稳定重现问题，减少无关因素。'}, {term: 'OOM / 显存或内存不足', meaning: '资源不够与模型文件缺失不是同类问题；增加 CFG 或重新写提示词不能修复 OOM。'}],
    steps: [
      {title: '暂停并保留现场', action: '停止自动运行和多余排队任务，导出当前工作流。打开 Errors / Show report 或日志，记录第一条具体错误、出错节点和发生步骤。', why: '先保存线索，再做改动，避免每次尝试都把问题现场覆盖。', expected: '你得到一条能描述问题的句子，例如“Load Checkpoint 找不到某文件”，而不是“它坏了”。', tip: '公开日志前遮掉用户名、私人路径、token 和 API key。'},
      {title: '缺文件就查路径，缺节点就查版本', action: 'Missing Models / Value not in list：去对应加载器重新选择文件并核实当前实例目录。Missing Nodes：核对 core 版本或准确节点包；安装过仍缺失则看启动导入日志。', why: '分类正确，往往能少走一大圈重装弯路。', expected: '知道下一步要检查权重文件还是节点代码，而不是两边都改。', tip: '损坏或未下载完的权重需要重新获取；改名字不会修复文件内容。'},
      {title: '维度错误先查家族匹配', action: '遇到 shapes cannot be multiplied、channels 或 tensor dimension 相关错误，列出 checkpoint、VAE、CLIP、LoRA、ControlNet 的模型家族；先回到同一官方模板的配套组合。', why: 'SD1.5、SDXL、FLUX 等模型组件并非通用积木。', expected: '能发现不匹配组件，或把问题缩到一套已知兼容配置。', tip: '不要为了让连线接上而随便添加转换节点，数据类型相同也不代表模型架构兼容。'},
      {title: '资源不足就减负，不反复重试', action: '遇到 OOM，先取消多余任务，确认 SD1.5 基线是 512 × 512、batch_size 1；关闭不需要的显存程序，再重启当前实例试最小流程。仍失败则查看硬件与模型要求。', why: '分辨率、批量和模型体积都影响资源消耗，重复提交不会增加显存。', expected: '要么最小流程成功，要么有清晰的硬件 / 后端错误可继续求助。', tip: '不要直接删除模型或用不明启动参数碰运气；特别大的视频模型不属于本入门课范围。'},
      {title: '能运行但不好看，回到控制变量', action: '如果没有技术报错，只是偏色、构图差或不听话，核对模型与 VAE，回到基线 seed 和参数；每次只改提示词、CFG 或 denoise 中的一项，保存对照。', why: '结果质量问题和程序执行失败不同，不应一律归因于环境坏了。', expected: '能区分能力边界、参数选择与真正的配置错误。', tip: '黑图也可能涉及 VAE、精度或后端兼容；先用官方最小配套示例验证，不承诺一个万能开关。'},
      {title: '带着证据求助并完成结课任务', action: '整理 Desktop / 实例版本、系统与 GPU / 显存、模型全名、工作流 JSON、第一条错误和已尝试步骤。结课任务：生成一张茶壶图，做一次图生图对比，保存可复做练习包。', why: '具体信息让别人能复现问题，而课程成果让你知道自己已经掌握了哪些环节。', expected: '你能自己跑通基础链路，遇到问题能清楚描述，而不是只发一张红框截图。', tip: '求助材料先脱敏；不要上传不允许公开的照片、模型权重或凭据。'}
    ],
    pitfalls: [{symptom: '报错后同时改了模型、插件和参数。', fix: '恢复已保存基线，每次只改变一项并记录；没有基线时先复现官方 core 示例。'}, {symptom: '只发“不能用了”别人也不知道怎么帮。', fix: '补充版本、硬件、出错节点、原始错误文本和最小工作流，删去隐私信息。'}],
    exercise: {task: '完成“红色茶壶文生图 → 蓝色水彩图生图 → 单变量对比 → 保存练习包”，并模拟写一份缺模型的求助说明。', check: '能说明每一步的输入、输出、模型要求和成功标准；失败时能区分缺模型、缺节点、架构冲突与 OOM。'},
    quiz: {question: '出现 tensor shape / channel 不匹配时，首先检查哪一类问题？', options: ['把提示词写得更长。', '增加采样步数。', '主模型、编码器、VAE 和扩展权重是否架构匹配。'], answer: 2, explanation: '维度不匹配常与组件架构混用有关。先用官方配套组合缩小范围，而不是继续调整美术参数。'},
    sources: [{title: '官方：综合排错', url: 'https://docs.comfy.org/troubleshooting/overview'}, {title: '官方：模型问题', url: 'https://docs.comfy.org/troubleshooting/model-issues'}, {title: '官方：自定义节点排错', url: 'https://docs.comfy.org/troubleshooting/custom-node-issues'}]
  }
];
