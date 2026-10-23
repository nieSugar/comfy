window.COMFY_NODES = [
  {
    id: 'CheckpointLoaderSimple',
    zh: 'Checkpoint加载器（简易）',
    en: 'Load Checkpoint',
    group: '加载模型',
    oneLine: '一次性从单个完整模型文件中读出扩散模型、文字编码器和图像编解码器。',
    analogy: '像拆开一套三合一礼盒：里面同时装着画师大脑、文字翻译官和显影器。',
    inputs: [],
    outputs: [
      { name: 'MODEL', zh: '模型', type: 'MODEL', to: '接到 K采样器（或 加载LoRA）的“模型”输入', what: '负责在潜空间里一步步去噪生成画面的主扩散模型。' },
      { name: 'CLIP', zh: 'CLIP', type: 'CLIP', to: '分别接到正、负两个 CLIP文本编码 的 clip 输入', what: '负责把英文提示词翻译成模型能听懂的数学向量。' },
      { name: 'VAE', zh: 'VAE', type: 'VAE', to: '接到 VAE解码（以及图生图的 VAE编码）的 vae 输入', what: '负责在可视像素图片（IMAGE）与内部潜空间（LATENT）之间做转换。' }
    ],
    widgets: [
      {
        name: 'ckpt_name',
        zh: 'Checkpoint名称',
        value: '下拉选择 checkpoints 目录中已识别的 .safetensors / .ckpt 文件',
        what: '指定当前工作流要使用哪一个三合一主模型文件（例如 SD1.5 或 SDXL 的完整 checkpoint）。',
        up: '换成另一个同架构 checkpoint 会改变整体画风、材质表现与擅长题材；若换成不同家族（如把 SDXL 塞进 SD1.5 流程且混用其他家族配件）可能报维度错误或出图异常。',
        down: '',
        when: '导入任何别人的工作流后第一步就要检查并选成自己电脑上真实存在的兼容模型；做单变量参数对比实验时保持不变。',
        course: 'SD1.5 主线课选 v1-5-pruned-emaonly-fp16.safetensors（或你已有的兼容 SD1.5 checkpoint），先把整条基础链路跑通。'
      }
    ],
    mistakes: [
      '保留模板里的占位名 SELECT_YOUR_SD15_CHECKPOINT.safetensors 直接点运行，导致报 Value not in list——必须点开下拉框选真实文件。',
      '把只有扩散权重的拆分模型（如 Z-Image Turbo、FLUX）或 LoRA 文件放进 checkpoints 目录并用本节点加载，导致缺少 CLIP/VAE 或报错。'
    ],
    lessons: ['orientation', 'desktop', 'model-download', 'first-image', 'nodes', 'img2img', 'troubleshooting']
  },
  {
    id: 'CLIPTextEncode',
    zh: 'CLIP文本编码',
    en: 'CLIP Text Encode (Prompt)',
    group: '文字条件',
    oneLine: '用 CLIP 把你写的提示词转换成采样器能使用的条件（CONDITIONING）。',
    analogy: '像把你用人类语言写的“画壶需求单”翻译成画师能直接照着施工的工程指令。',
    inputs: [
      { name: 'clip', zh: 'clip', type: 'CLIP', from: '来自 Checkpoint加载器（简易）、加载CLIP 或 加载LoRA 的 CLIP 输出', what: '提供文字编码器权重；没连这根线就无法理解输入框里的文字。' }
    ],
    outputs: [
      { name: 'CONDITIONING', zh: '条件', type: 'CONDITIONING', to: '接到 K采样器 的“正面条件”或“负面条件”（或经 ControlNet、条件零化再进采样器）', what: '编码后的文字引导条件；它接进采样器的哪个插孔，决定了这段话是“想要什么”还是“避开什么”。' }
    ],
    widgets: [
      {
        name: 'text',
        zh: '文本',
        value: '多行字符串（支持英文逗号分隔描述词）',
        what: '输入你想让画面出现的内容（接正面条件时）或希望尽量避开的瑕疵（接负面条件时）。',
        up: '写得更具体（主体、材质、光线、构图）能让引导方向更明确；但堆砌互相矛盾的词会互相打架，写“4K”也不会改变画布像素尺寸。',
        down: '留空或词太少时，画面细节更多由模型默认倾向和随机种子决定。',
        when: '换画面主体、颜色、风格、光线时修改；对比步数或 CFG 时保持一字不改。',
        course: '第一张图正向填 red ceramic teapot 等主体与光线描述，负向填 blurry, watermark, text；参数课只把 red 改成 blue 做单变量对比。'
      }
    ],
    mistakes: [
      '以为上面的框天生是正向、下面的框天生是负向——其实完全取决于它的“条件”输出线接到了 K采样器 的“正面条件”还是“负面条件”。',
      '在提示词里写 1024x1024 以为能放大分辨率——真实画布尺寸是由 空Latent图像 或输入图片决定的。'
    ],
    lessons: ['first-image', 'nodes', 'parameters', 'img2img', 'z-image', 'inpaint']
  },
  {
    id: 'EmptyLatentImage',
    zh: '空Latent图像',
    en: 'Empty Latent Image',
    group: '潜空间',
    oneLine: '创建一块指定宽高和张数的空白潜空间画布，作为文生图的起点。',
    analogy: '像在画架上绷好一张规定尺寸的空白底布，等采样器往上撒噪声再作画。',
    inputs: [],
    outputs: [
      { name: 'LATENT', zh: 'Latent', type: 'LATENT', to: '接到 K采样器 的“Latent图像”输入', what: '带有尺寸与批量信息的初始潜图（尚无具体画面内容）。' }
    ],
    widgets: [
      {
        name: 'width',
        zh: '宽度',
        value: '默认 1024；范围 16 ~ 16384，步进 8（像素）',
        what: '决定生成图片最终解码后的像素宽度。',
        up: '调大后画面更宽、可容纳像素更多，但显存占用和耗时明显上升；超出模型训练习惯尺寸过多（如 SD1.5 直接开 1536）容易出现双头、重复主体。',
        down: '调小会更快、更省显存，但过小会丢失细节、画面模糊。',
        when: '切换横图/方图/竖图或适配模型推荐分辨率时修改；初次跑通和排错时保持基线尺寸不动。',
        course: 'SD1.5 基线统一设为 512，既符合 SD1.5 训练尺寸，又能在主流显卡上快速跑通。'
      },
      {
        name: 'height',
        zh: '高度',
        value: '默认 1024；范围 16 ~ 16384，步进 8（像素）',
        what: '决定生成图片最终解码后的像素高度。',
        up: '调大后画面更高，显存占用和采样时间同步增加。',
        down: '调小后生成更快，但分辨率降低。',
        when: '与宽度一起按目标画幅比例调整。',
        course: 'SD1.5 基线统一设为 512（与宽度组成 512 × 512 方图）。'
      },
      {
        name: 'batch_size',
        zh: '批量大小',
        value: '默认 1；范围 1 ~ 4096',
        what: '一次任务同时在显存里并行生成多少张潜图。',
        up: '调大（如 2 或 4）会一次出多张图，但显存占用成倍增加，是新手触发 CUDA out of memory 的常见原因。',
        down: '设为 1 最省显存、最稳妥。',
        when: '基础练习和显存紧张时始终保持 1；想多跑几张优先用顶部运行栏的队列次数，而不是盲目拉高 batch_size。',
        course: '所有练习固定为 1。'
      }
    ],
    mistakes: [
      '把 SD1.5 直接设成 1024 × 1024 甚至更高，结果既慢又出现奇怪的多余肢体。',
      '把“批量大小”一下改成 8 想抽卡，结果直接爆显存（OOM）。'
    ],
    lessons: ['first-image', 'nodes', 'parameters', 'save-queue', 'troubleshooting']
  },
  {
    id: 'KSampler',
    zh: 'K采样器',
    en: 'KSampler',
    group: '采样',
    oneLine: '把模型、正负文字条件和初始潜图合在一起，按设定步数一步步去噪生成结果潜图。',
    analogy: '整条流水线的核心施工间：画师（模型）对照需求单（条件），在底布（Latent）上一遍遍修出画面。',
    inputs: [
      { name: 'model', zh: '模型', type: 'MODEL', from: '来自 Checkpoint加载器（简易）、UNet加载器、采样算法（AuraFlow）或 加载LoRA', what: '提供去噪所需的主模型权重。' },
      { name: 'positive', zh: '正面条件', type: 'CONDITIONING', from: '来自写着“想要什么”的 CLIP文本编码（或 Apply ControlNet 的正面输出）', what: '告诉采样器往哪个方向靠拢。' },
      { name: 'negative', zh: '负面条件', type: 'CONDITIONING', from: '来自写着“避开什么”的 CLIP文本编码（或 条件零化）', what: '告诉采样器在 CFG > 1 时尽量远离哪些特征。' },
      { name: 'latent_image', zh: 'Latent图像', type: 'LATENT', from: '文生图来自 空Latent图像 / 空Latent图像（SD3）；图生图来自 VAE编码 / VAE编码（局部重绘）', what: '提供去噪的起点画布与尺寸。' }
    ],
    outputs: [
      { name: 'LATENT', zh: 'Latent', type: 'LATENT', to: '接到 VAE解码 的 Latent 输入', what: '采样完成后的潜空间结果，还不是直接能看的 PNG，必须交给 VAE解码。' }
    ],
    widgets: [
      {
        name: 'seed',
        zh: '种子',
        value: '默认 0；范围 0 ~ 18446744073709552000',
        what: '决定初始随机噪声的编号。同一模型、同一环境和全部参数相同时，相同种子会产生一致的构图起点。',
        up: '换成任意另一个数字，初始噪声分布就完全不同，会抽到新的构图与细节（数值大小本身不代表画质高低）。',
        down: '',
        when: '想探索不同构图时换种子；想对比提示词、步数、CFG、降噪的效果时，必须锁死同一个种子。',
        course: '练习统一用 42，方便你验证每次改动到底带来了什么变化。'
      },
      {
        name: 'control_after_generate',
        zh: '生成后控制',
        value: '可选：fixed / increment / decrement / randomize（共 4 个）',
        what: '控制每次点“运行”之后，种子数字自动怎么变：fixed 保持不变，randomize 每次随机换新号。',
        up: '选 randomize 每次运行都会换构图，适合抽卡，但无法做单变量对比；选 increment/decrement 会每次加一或减一。',
        down: '选 fixed 会锁死当前种子；若所有输入都没变，ComfyUI 还会直接复用缓存秒出结果。',
        when: '做参数对比实验、复现教程结果时必选 fixed；平时自由抽卡时再改成 randomize。',
        course: '全课程对照实验均设为 fixed。'
      },
      {
        name: 'steps',
        zh: '步数',
        value: '默认 20；范围 1 ~ 10000',
        what: '采样器反复去噪迭代的次数。',
        up: '适度增加会让细节更完整，但耗时线性增加；超过模型合适区间后几乎不再提升画质，只是白等。',
        down: '步数太少（普通模型低于 10 步）画面可能还没收敛完，显得模糊或结构松散；但蒸馏模型（如 Z-Image Turbo）本身就只需约 8 步。',
        when: '做步数对照实验或换不同模型家族时按官方推荐调整；不要把拉高步数当成修崩坏图的万能药。',
        course: 'SD1.5 基线设 20 步（参数课对比 10 与 20）；Z-Image Turbo 设 8 步。'
      },
      {
        name: 'cfg',
        zh: 'cfg',
        value: '默认 8；范围 0 ~ 100，步进 0.1',
        what: '条件引导强度（Classifier-Free Guidance），控制采样器多大程度听从正负提示词的拉扯。',
        up: '调高会让画面更用力贴合提示词、对比更强；但过高（如 SD1.5 开到 15+）容易色彩过饱和、边缘发硬、出现焦糊伪影。',
        down: '调低后画面更柔和自然，但太低可能忽略提示词要求；而部分蒸馏模型（如 Z-Image Turbo）固定要求 cfg = 1.0。',
        when: '画面明显不听提示词或过饱和发焦时微调；切换模型家族时必须看清该模型要求的 CFG。',
        course: 'SD1.5 基线设 7（参数课对比 5 与 7）；Z-Image Turbo 设为 1.0。'
      },
      {
        name: 'sampler_name',
        zh: '采样器名称',
        value: '可选：euler / euler_ancestral / dpmpp_2m / dpmpp_2m_sde / res_multistep / uni_pc 等（共 45 个）',
        what: '决定每一步去噪所用的数学求解算法。',
        up: '换不同采样器会改变收敛速度、笔触质感以及每步是否注入新随机性（带 ancestral / sde 的采样器即使步数增加也会微改构图）。',
        down: '',
        when: '初学阶段保持模板推荐值不动；不要在对比其他参数时顺手换采样器。',
        course: 'SD1.5 练习用 euler；Z-Image Turbo 按官方模板用 res_multistep。'
      },
      {
        name: 'scheduler',
        zh: '调度器',
        value: '可选：normal / karras / simple / sgm_uniform / exponential / beta 等（共 9 个）',
        what: '安排从第 1 步到最后一步噪声强度如何递减的时间表，需要与采样器、模型配合。',
        up: '换成模型不匹配的调度器可能导致画面发灰、细节未收敛或噪点残留。',
        down: '',
        when: '遵循所用模型或官方模板的配套组合，不单独乱改。',
        course: 'SD1.5 练习用 normal；Z-Image Turbo 按官方模板用 simple。'
      },
      {
        name: 'denoise',
        zh: '降噪',
        value: '默认 1.00；范围 0 ~ 1，步进 0.01',
        what: '决定对输入潜图重绘的幅度（1.00 表示从完全噪声开始重画，小于 1 表示在原图基础上部分加噪再重绘）。',
        up: '越接近 1.00，改动越大、越偏离原图结构；文生图因为从空潜图出发，必须保持 1.00。',
        down: '在图生图中调低（如 0.30）会更多保留原图构图与配色；但设为 0 也不等于原像素无损复制（因为经过了 VAE 编解码）。',
        when: '文生图固定 1.00 不动；图生图时作为核心旋钮，在“像原图”和“改得动”之间找平衡。',
        course: '文生图与局部重绘起步设 1.00；图生图课先跑 0.55，再对比 0.30 与 0.70。'
      }
    ],
    mistakes: [
      '把 K采样器 的 Latent 输出直接拖去接 保存图像，发现接不上——必须先经过 VAE解码 转成图像。',
      '在 SD1.5 文生图里把降噪（denoise）调到 0.4，结果只得到一团灰蒙蒙的色块（空潜图必须用 1.00 完整去噪）。',
      '把 SD1.5 的 20 步、cfg 7 直接套到 Z-Image Turbo 上，既慢又让蒸馏模型画面失真。'
    ],
    lessons: ['orientation', 'first-image', 'nodes', 'parameters', 'img2img', 'z-image', 'inpaint']
  },
  {
    id: 'VAEDecode',
    zh: 'VAE解码',
    en: 'VAE Decode',
    group: '潜空间',
    oneLine: '用 VAE 把采样器输出的潜空间数据（LATENT）还原成肉眼可见的像素图像（IMAGE）。',
    analogy: '像暗房里的显影机：把采样器冲出来的底片（Latent）洗成真正能看、能存的彩色照片。',
    inputs: [
      { name: 'samples', zh: 'Latent', type: 'LATENT', from: '来自 K采样器 的 Latent 输出', what: '已经去噪完成的潜空间数据。' },
      { name: 'vae', zh: 'vae', type: 'VAE', from: '来自 Checkpoint加载器（简易）的 VAE 输出，或独立 加载VAE 节点', what: '提供解码所需的 VAE 权重；必须与主模型家族匹配。' }
    ],
    outputs: [
      { name: 'IMAGE', zh: '图像', type: 'IMAGE', to: '接到 保存图像、预览图像 或 合成图像（遮罩）', what: '解码后的标准像素图像，可以同时连给多个下游节点。' }
    ],
    widgets: [],
    mistakes: [
      '漏掉本节点，想直接把采样器连到保存节点。',
      '给 SD1.5、SDXL 或 Z-Image 混接了别的家族的 VAE，导致解码出来整张图发紫、发灰或全是彩色噪点。'
    ],
    lessons: ['orientation', 'first-image', 'nodes', 'img2img', 'z-image', 'inpaint']
  },
  {
    id: 'SaveImage',
    zh: '保存图像',
    en: 'Save Image',
    group: '图像输入输出',
    oneLine: '在节点内展示生成结果预览，并把 PNG 文件正式写入当前实例的 output 目录。',
    analogy: '成品打包台：既把刚洗好的照片挂出来给你看，又自动归档进硬盘文件夹。',
    inputs: [
      { name: 'images', zh: '图片', type: 'IMAGE', from: '来自 VAE解码 或 合成图像（遮罩）的图像输出', what: '要落盘保存的像素图像。' }
    ],
    outputs: [],
    widgets: [
      {
        name: 'filename_prefix',
        zh: '文件名前缀',
        value: '默认 ComfyUI（字符串，可带子目录如 ComfyClass/text2img）',
        what: '设置保存在 output 目录下的文件名前缀与子文件夹路径，系统会自动在后面追加序号如 _00001_.png。',
        up: '改成带斜杠的路径（如 ComfyClass/text2img）会自动在 output 下建子文件夹分類存放，方便区分不同实验。',
        down: '',
        when: '做不同课程练习或不同参数实验时修改前缀，避免所有图混成一团。',
        course: '文生图用 ComfyClass/text2img，图生图用 ComfyClass/img2img，Z-Image 课用 ComfyClass/zimage。'
      }
    ],
    mistakes: [
      '只在画布上看了一眼缩略图就关软件，不知道去 output 目录找原始 PNG。',
      '没留意默认保存的 PNG 内嵌了完整提示词和工作流元数据，直接把含私人提示或敏感路径的原图发到公开群。'
    ],
    lessons: ['orientation', 'first-image', 'nodes', 'img2img', 'z-image', 'inpaint', 'save-queue']
  },
  {
    id: 'PreviewImage',
    zh: '预览图像',
    en: 'Preview Image',
    group: '图像输入输出',
    oneLine: '只在画布上临时显示图像预览，不往 output 目录正式归档堆积文件。',
    analogy: '像工序中间的检查放大镜：随时看一眼半成品长啥样，看完不占仓库格子。',
    inputs: [
      { name: 'images', zh: '图像', type: 'IMAGE', from: '来自 VAE解码、遮罩转换为图像、缩放图像 等任何输出 IMAGE 的节点', what: '需要临时查看的像素图像。' }
    ],
    outputs: [],
    widgets: [],
    mistakes: [
      '用 预览图像 代替了 保存图像，关掉软件后去 output 文件夹找不到刚才满意的作品。'
    ],
    lessons: ['interface', 'nodes', 'inpaint']
  },
  {
    id: 'LoadImage',
    zh: '加载图像',
    en: 'Load Image',
    group: '图像输入输出',
    oneLine: '从电脑上传或选择一张图片，同时提供像素图像（IMAGE）和重绘遮罩（MASK）两路输出。',
    analogy: '原图进料口：把你手头的照片送进流水线，还能顺带在上面圈出要修改的区域。',
    inputs: [],
    outputs: [
      { name: 'IMAGE', zh: '图像', type: 'IMAGE', to: '接到 缩放图像、VAE编码、VAE编码（局部重绘）或 合成图像（遮罩）', what: '读入的原始像素图像。' },
      { name: 'MASK', zh: '遮罩', type: 'MASK', to: '局部重绘时接到 VAE编码（局部重绘）、合成图像（遮罩）或 遮罩转换为图像', what: '图片自带透明通道或在遮罩编辑器里手涂出来的重绘区域信息。' }
    ],
    widgets: [
      {
        name: 'image',
        zh: '图像',
        value: '下拉选择 input 目录已有图片，或点击下方“选择文件上传”按钮',
        what: '指定作为图生图、局部重绘或 ControlNet 起点的输入图片文件。',
        up: '换不同输入图会改变潜空间起点或结构约束；注意图片尺寸若很大，直接编码会消耗大量显存。',
        down: '',
        when: '图生图、局部重绘练习开始时，先把占位名换成你自己的 PNG/JPG。',
        course: '图生图与局部重绘课优先上传你在“第一张图”里生成的 512 × 512 红色茶壶 PNG。'
      },
      {
        name: 'upload',
        zh: '选择文件上传',
        value: '文件上传按钮',
        what: '打开系统文件选择框，把本地图片复制到当前实例的 input 目录并立即选中。',
        up: '',
        down: '',
        when: '要把电脑上的新图片放进此节点时点击它，而不是把图片直接拖到空白画布上。',
        course: '在 02-image-to-image.json 的 ④ 号节点点击此按钮上传茶壶原图。'
      }
    ],
    mistakes: [
      '想换输入图片时，直接把带有 ComfyUI 元数据的 PNG 拖到了画布空白处，结果把整个工作流给顶掉了——上传原图一定要点节点里的“选择文件上传”按钮。',
      '直接上传几千像素的手机原图且不经缩放就送去采样，导致显存爆掉。'
    ],
    lessons: ['img2img', 'inpaint', 'lora-controlnet', 'save-queue']
  },
  {
    id: 'ImageScale',
    zh: '缩放图像',
    en: 'Upscale Image',
    group: '图像输入输出',
    oneLine: '用传统插值算法把输入图片调整到指定宽高，可选择居中裁剪或直接拉伸。',
    analogy: '像进机器前的裁纸刀与尺寸规整器，先把各种大小的照片统一成标准画幅（不是 AI 超分重绘）。',
    inputs: [
      { name: 'image', zh: '图像', type: 'IMAGE', from: '来自 加载图像 的图像输出', what: '待调整尺寸的原始图像。' }
    ],
    outputs: [
      { name: 'IMAGE', zh: '图像', type: 'IMAGE', to: '接到 VAE编码 的像素输入', what: '统一好宽高后的图像，随后由 VAE编码 决定潜图尺寸。' }
    ],
    widgets: [
      {
        name: 'upscale_method',
        zh: '缩放算法',
        value: '可选：nearest-exact / bilinear / area / bicubic / lanczos（共 5 个）',
        what: '决定重采样像素时使用的数学插值方式。',
        up: 'lanczos / bicubic 在缩放自然照片时边缘较平滑清晰；nearest-exact 保留硬像素格（适合像素画）。',
        down: '',
        when: '一般照片和生成图保持 lanczos 即可，无需频繁改动。',
        course: '图生图练习固定为 lanczos。'
      },
      {
        name: 'width',
        zh: '宽度',
        value: '默认 512；范围 0 ~ 16384，步进 1',
        what: '缩放后的目标图像宽度（像素）。',
        up: '调大后送入 VAE编码 的潜图变大，显存消耗与耗时明显增加。',
        down: '调小会降低进入采样的分辨率。',
        when: '图生图时让输入尺寸对齐模型的舒适分辨率（如 SD1.5 用 512）。',
        course: '02-image-to-image.json 中设为 512。'
      },
      {
        name: 'height',
        zh: '高度',
        value: '默认 512；范围 0 ~ 16384，步进 1',
        what: '缩放后的目标图像高度（像素）。',
        up: '与宽度共同决定图生图的采样画布大小。',
        down: '',
        when: '与宽度同步调整。',
        course: '02-image-to-image.json 中设为 512。'
      },
      {
        name: 'crop',
        zh: '裁剪',
        value: '可选：disabled / center（共 2 个）',
        what: '当原图长宽比与目标宽高不一致时，是居中裁掉多余边缘（center），还是强行压扁/拉长（disabled）。',
        up: '选 center 不会把圆形茶壶压扁，但非方图的左右或上下边缘会被裁掉一部分。',
        down: '选 disabled 会保留全图内容，但长宽比不同时画面会变形。',
        when: '输入图比例与目标比例不一致时，优先选 center 或提前准备同比例原图。',
        course: '图生图练习设为 center，并建议直接用 512 × 512 的方图做输入。'
      }
    ],
    mistakes: [
      '看英文名叫 Upscale Image 就以为它是 AI 高清放大器——它只是普通像素缩放/裁剪，不会凭空脑补纹理。',
      '局部重绘时对图片做了缩放裁剪，却把未缩放的原始遮罩直接接给后续节点，导致重绘位置错位。'
    ],
    lessons: ['img2img', 'inpaint']
  },
  {
    id: 'VAEEncode',
    zh: 'VAE编码',
    en: 'VAE Encode',
    group: '潜空间',
    oneLine: '与 VAE解码 方向相反：把像素图像（IMAGE）压缩编码成采样器能处理的潜空间数据（LATENT）。',
    analogy: '像把洗好的照片重新翻拍成底片，好送回施工间（K采样器）继续改画。',
    inputs: [
      { name: 'pixels', zh: '像素', type: 'IMAGE', from: '来自 加载图像 或 缩放图像 的图像输出', what: '要作为图生图起点的像素图片。' },
      { name: 'vae', zh: 'vae', type: 'VAE', from: '来自 Checkpoint加载器（简易）或 加载VAE 的 VAE 输出', what: '负责把像素编码进潜空间的 VAE 模型。' }
    ],
    outputs: [
      { name: 'LATENT', zh: 'Latent', type: 'LATENT', to: '接到 K采样器 的“Latent图像”输入（替代文生图里的 空Latent图像）', what: '带有原图构图与色彩信息的初始潜图。' }
    ],
    widgets: [],
    mistakes: [
      '做局部重绘时还继续用这个普通 VAE编码，忘了它没有遮罩（mask）输入口——局部重绘需要换成 VAE编码（局部重绘）。'
    ],
    lessons: ['img2img', 'inpaint']
  },
  {
    id: 'UNETLoader',
    zh: 'UNet加载器',
    en: 'Load Diffusion Model',
    group: '加载模型',
    oneLine: '单独加载放在 diffusion_models 目录下的主扩散模型权重（不含 CLIP 和 VAE）。',
    analogy: '单请一位专职画师（扩散模型），翻译官（CLIP）和显影器（VAE）再由另外两个加载器分别请来。',
    inputs: [],
    outputs: [
      { name: 'MODEL', zh: '模型', type: 'MODEL', to: '接到 采样算法（AuraFlow）或 K采样器 的“模型”输入', what: '单独加载的扩散模型权重（只有 MODEL 一路输出，没有 CLIP 和 VAE）。' }
    ],
    widgets: [
      {
        name: 'unet_name',
        zh: 'UNet名称',
        value: '下拉选择 diffusion_models（或 unet）目录中的模型文件',
        what: '选择独立拆分的扩散主模型文件（如 Z-Image Turbo、FLUX、Qwen-Image 等现代模型）。',
        up: '换成不同模型家族时，必须同步更换与之配套的文字编码器（加载CLIP）、VAE 和采样参数。',
        down: '',
        when: '使用拆分权重发布的现代模型时，在这里选主模型文件。',
        course: 'Z-Image Turbo 课选择 z_image_turbo_bf16.safetensors（位于 diffusion_models 目录）。'
      },
      {
        name: 'weight_dtype',
        zh: '数据类型',
        value: '可选：default / fp8_e4m3fn / fp8_e4m3fn_fast / fp8_e5m2（共 4 个）',
        what: '控制加载该扩散模型时的数值精度策略，default 表示按文件本身类型（如 bf16）处理。',
        up: '部分大模型在硬件支持时选 fp8 可降低显存占用，但可能影响细节或在不匹配的硬件/模型上报错。',
        down: '',
        when: '初次运行和官方模板说 default 时保持 default 不动。',
        course: 'Z-Image Turbo 课保持 default。'
      }
    ],
    mistakes: [
      '去 Checkpoint加载器（简易）里找 z_image_turbo_bf16.safetensors，因为目录不同（diffusion_models vs checkpoints）根本找不到。',
      '只加了 UNet加载器，忘了它不带文字编码器和 VAE，还得配合 加载CLIP 和 加载VAE 一起用。'
    ],
    lessons: ['model-download', 'z-image']
  },
  {
    id: 'CLIPLoader',
    zh: '加载CLIP',
    en: 'Load CLIP',
    group: '加载模型',
    oneLine: '单独加载放在 text_encoders（或 clip）目录下的文字编码器，并按模型家族指定解析类型。',
    analogy: '专门聘请一位懂特定模型方言的文字翻译官，还得在“类型”里告诉他按哪本词典翻。',
    inputs: [],
    outputs: [
      { name: 'CLIP', zh: 'CLIP', type: 'CLIP', to: '接到 CLIP文本编码 的 clip 输入', what: '独立加载的文字编码器对象。' }
    ],
    widgets: [
      {
        name: 'clip_name',
        zh: 'CLIP名称',
        value: '下拉选择 text_encoders（或 clip）目录中的权重文件',
        what: '选择与主扩散模型配套的文字编码器文件（例如 Z-Image Turbo 配套的 qwen_3_4b.safetensors）。',
        up: '必须与主模型家族配套；随便换一个不匹配的编码器会导致维度冲突或完全听不懂提示词。',
        down: '',
        when: '使用拆分模型工作流时，按官方模板清单选择对应文件。',
        course: 'Z-Image Turbo 课选择 qwen_3_4b.safetensors。'
      },
      {
        name: 'type',
        zh: '类型',
        value: '可选：stable_diffusion / sd3 / lumina2 / qwen_image / flux2 / wan 等（共 31 个）',
        what: '告诉 ComfyUI 按哪一套模型架构的方式来组织和解析该文字编码器的输出。',
        up: '选错类型（比如给 Z-Image 选了默认的 stable_diffusion 而不是 lumina2）即使文件选对了，运行也会报张量维度错误或出乱码图。',
        down: '',
        when: '每次设置 加载CLIP 时，必须核对官方模板指定的 type。',
        course: 'Z-Image Turbo 课必须选 lumina2（与官方模板一致）。'
      },
      {
        name: 'device',
        zh: '设备',
        value: '可选：default / cpu（共 2 个）',
        what: '决定文字编码器优先放在默认加速设备（GPU）还是强制放在系统内存（CPU）上运行。',
        up: '选 cpu 可在显存极度紧张时腾出一点显存，但文字编码会变慢。',
        down: '保持 default 让系统自动管理最快。',
        when: '正常情况保持 default 不动。',
        course: 'Z-Image Turbo 课保持 default。'
      }
    ],
    mistakes: [
      '选对了 qwen_3_4b.safetensors，但“类型（type）”忘了改成 lumina2，结果一跑就报错。'
    ],
    lessons: ['model-download', 'z-image']
  },
  {
    id: 'VAELoader',
    zh: '加载VAE',
    en: 'Load VAE',
    group: '加载模型',
    oneLine: '单独加载放在 vae 目录下的图像编解码器，供 VAE解码 或 VAE编码 使用。',
    analogy: '单独配置一台跟新画师配套的专用显影机。',
    inputs: [],
    outputs: [
      { name: 'VAE', zh: 'VAE', type: 'VAE', to: '接到 VAE解码（或 VAE编码）的 vae 输入', what: '独立加载的 VAE 模型。' }
    ],
    widgets: [
      {
        name: 'vae_name',
        zh: 'vae名称',
        value: '下拉选择 vae 目录中的文件（如 ae.safetensors）',
        what: '选择与当前主模型潜空间通道数匹配的 VAE 权重文件。',
        up: '换成不兼容家族的 VAE（例如把 SD1.5 的 4 通道 VAE 拿去解 16 通道潜图）会直接报通道数不匹配错误。',
        down: '',
        when: '拆分模型工作流或主模型需要外挂特定 VAE 时按模板选择。',
        course: 'Z-Image Turbo 课选择 ae.safetensors。'
      }
    ],
    mistakes: [
      '把不同家族的 VAE 混用（比如拿视频 VAE 去解静态图模型），导致报 channels mismatch 或画面花屏。'
    ],
    lessons: ['model-download', 'z-image']
  },
  {
    id: 'ModelSamplingAuraFlow',
    zh: '采样算法（AuraFlow）',
    en: 'ModelSamplingAuraFlow',
    group: '采样',
    oneLine: '在主模型进入 K采样器 前，按 Flow 模型要求调整其噪声采样偏移（shift）。',
    analogy: '在画师进施工间前，先帮他把调色节奏表校准到新流派（Flow 架构）的档位。',
    inputs: [
      { name: 'model', zh: '模型', type: 'MODEL', from: '来自 UNet加载器 的“模型”输出', what: '刚加载出来的原始扩散模型。' }
    ],
    outputs: [
      { name: 'MODEL', zh: '模型', type: 'MODEL', to: '接到 K采样器 的“模型”输入', what: '打好采样偏移补丁后的模型。' }
    ],
    widgets: [
      {
        name: 'shift',
        zh: '移位',
        value: '默认 1.73；范围 0 ~ 100，步进 0.01',
        what: '调整 Flow 类模型在去噪过程中的时间步偏移量，影响整体结构与细节分布的平衡。',
        up: '偏离模型推荐值过多会让画面结构松散、过曝或细节涂抹。',
        down: '',
        when: '按所用模型的官方模板数值设置，新手不要凭感觉乱拉。',
        course: 'Z-Image Turbo 官方模板将移位（shift）设为 3（即 3.00）。'
      },
      {
        name: 'sampling',
        zh: 'sampling',
        value: '可选：flow / img_to_img_velocity（默认 flow）',
        what: '选择底层的流采样模式。',
        up: '',
        down: '',
        when: '保持默认 flow 即可。',
        course: '保持 flow。'
      }
    ],
    mistakes: [
      '接了本节点，却还是把 UNet加载器 直接连给了 K采样器，导致 shift=3 根本没生效。'
    ],
    lessons: ['z-image']
  },
  {
    id: 'EmptySD3LatentImage',
    zh: '空Latent图像（SD3）',
    en: 'EmptySD3LatentImage',
    group: '潜空间',
    oneLine: '创建适用于 SD3 / FLUX / Z-Image 等 16 通道潜空间架构的空白起始画布。',
    analogy: '给新一代 16 通道画师准备的专用高密底布（普通 SD1.5 的 4 通道底布规格不同）。',
    inputs: [],
    outputs: [
      { name: 'LATENT', zh: 'Latent', type: 'LATENT', to: '接到 K采样器 的“Latent图像”输入', what: '16 通道规格的空白潜图。' }
    ],
    widgets: [
      {
        name: 'width',
        zh: '宽度',
        value: '默认 1024；范围 16 ~ 16384，步进 16',
        what: '目标图像的像素宽度（步进为 16）。',
        up: '调大后清晰度与画幅增加，显存占用上升。',
        down: '过小不符合现代大图模型的训练分布。',
        when: '使用 Z-Image、SD3 等现代模型时，从 1024 起步。',
        course: 'Z-Image Turbo 课设为 1024。'
      },
      {
        name: 'height',
        zh: '高度',
        value: '默认 1024；范围 16 ~ 16384，步进 16',
        what: '目标图像的像素高度（步进为 16）。',
        up: '与宽度共同决定画幅尺寸。',
        down: '',
        when: '与宽度配合调整。',
        course: 'Z-Image Turbo 课设为 1024（组成 1024 × 1024）。'
      },
      {
        name: 'batch_size',
        zh: '批量大小',
        value: '默认 1；范围 1 ~ 4096',
        what: '单次并行生成的张数。',
        up: '1024 分辨率下调高 batch_size 会非常吃显存。',
        down: '',
        when: '保持 1 最稳妥。',
        course: '固定为 1。'
      }
    ],
    mistakes: [
      '在 Z-Image / SD3 工作流里误用了老的 空Latent图像（4 通道），或者把尺寸设成了 SD1.5 的 512 × 512。'
    ],
    lessons: ['z-image']
  },
  {
    id: 'ConditioningZeroOut',
    zh: '条件零化',
    en: 'Conditioning Zero Out',
    group: '文字条件',
    oneLine: '把传入的文字条件向量全部置零，生成一份空的占位条件送入采样器。',
    analogy: '既然蒸馏模型（cfg=1）不看“避开什么”的负面清单，就直接递一张盖了零章的空白单过去，省得再算一遍负向编码。',
    inputs: [
      { name: 'conditioning', zh: '条件', type: 'CONDITIONING', from: '来自正向 CLIP文本编码 的“条件”输出', what: '借用正向条件的数据形状，直接把里面的数值清零。' }
    ],
    outputs: [
      { name: 'CONDITIONING', zh: '条件', type: 'CONDITIONING', to: '接到 K采样器 的“负面条件”输入', what: '数值全为 0 的条件，满足 K采样器 必须插满负面条件插孔的要求。' }
    ],
    widgets: [],
    mistakes: [
      '把 条件零化 的输出接反到了 K采样器 的“正面条件”上，导致正向提示词也被清空了。'
    ],
    lessons: ['z-image']
  },
  {
    id: 'VAEEncodeForInpaint',
    zh: 'VAE编码（局部重绘）',
    en: 'VAE Encode (for Inpainting)',
    group: '局部重绘',
    oneLine: '同时接收原图、VAE 和遮罩（MASK），把“允许重绘哪个区域”的信息一起编码进潜图。',
    analogy: '带美纹纸胶带的翻拍机：先把不改的地方贴上保护标记，再把画布送进施工间重画涂白的那一块。',
    inputs: [
      { name: 'pixels', zh: '像素', type: 'IMAGE', from: '来自 加载图像 的“图像”输出（保持与遮罩同尺寸）', what: '要局部修改的原始图片。' },
      { name: 'vae', zh: 'vae', type: 'VAE', from: '来自 Checkpoint加载器（简易）或 加载VAE', what: '用于编码的 VAE。' },
      { name: 'mask', zh: '遮罩', type: 'MASK', from: '来自同一个 加载图像 的“遮罩”输出', what: '指定哪里允许重绘（白色/1）、哪里保留（黑色/0）。' }
    ],
    outputs: [
      { name: 'LATENT', zh: 'Latent', type: 'LATENT', to: '接到 K采样器 的“Latent图像”输入', what: '包含重绘遮罩信息的潜空间数据。' }
    ],
    widgets: [
      {
        name: 'grow_mask_by',
        zh: '扩展遮罩',
        value: '默认 6；范围 0 ~ 64，步进 1',
        what: '在编码前把你涂的遮罩往外扩充几个像素，帮新生成的内容与周围原图过渡。',
        up: '调大后实际允许重绘的范围会比你手涂的更大，可能会改到旁边原本不想动的东西。',
        down: '调到 0 则严格按遮罩边界编码，有时边缘衔接会显得生硬。',
        when: '初次练习先保留默认 6；只有发现重绘范围外扩太多时再适当调小。',
        course: '局部重绘课先保留默认值 6。'
      }
    ],
    mistakes: [
      '图片经过了 缩放图像 节点，但遮罩还直接从 加载图像 拉过来，导致图片和遮罩尺寸/位置对不上。',
      '以为只要用了这个节点，遮罩外的原图像素就 100% 绝对不变——因为整张图还会经历 VAE 解码，严格保留外部像素需要再配合 合成图像（遮罩）。'
    ],
    lessons: ['inpaint']
  },
  {
    id: 'MaskToImage',
    zh: '遮罩转换为图像',
    en: 'Convert Mask to Image',
    group: '局部重绘',
    oneLine: '把看不见数值的遮罩（MASK）转成黑白灰度图像（IMAGE），方便接 预览图像 检查哪里是白、哪里是黑。',
    analogy: '像显影液：把透明的保护膜照成黑白分明的检查图，一眼看清刚才涂没涂反。',
    inputs: [
      { name: 'mask', zh: '遮罩', type: 'MASK', from: '来自 加载图像 的“遮罩”输出', what: '待检查的遮罩数据。' }
    ],
    outputs: [
      { name: 'IMAGE', zh: '图像', type: 'IMAGE', to: '接到 预览图像 的“图像”输入', what: '可视化的黑白图像（白色表示数值 1，黑色表示数值 0）。' }
    ],
    widgets: [],
    mistakes: [
      '把遮罩编辑器里的半透明彩色覆盖直接当成遮罩真值，没用本节点 + 预览图像 确认黑白分布就盲目排错。'
    ],
    lessons: ['inpaint']
  },
  {
    id: 'ImageCompositeMasked',
    zh: '合成图像（遮罩）',
    en: 'Image Composite Masked',
    group: '局部重绘',
    oneLine: '按遮罩把新生成图的修改区域贴回原图上，确保遮罩外的原始像素不被 VAE 编解码改动。',
    analogy: '精准拼贴刀：只把新画好的那块茶壶剪下来，严丝合缝贴回原来的老照片上，背景一根木纹都不动。',
    inputs: [
      { name: 'destination', zh: '目标图像', type: 'IMAGE', from: '来自 加载图像 的原始“图像”输出', what: '作为底板的原始图片（遮罩黑色区域保留它的像素）。' },
      { name: 'source', zh: '来源图像', type: 'IMAGE', from: '来自 VAE解码 的新生成“图像”输出', what: '提供新内容的生成图（遮罩白色区域取自它的像素）。' },
      { name: 'mask', zh: '遮罩', type: 'MASK', from: '来自 加载图像 的“遮罩”输出', what: '决定哪些像素取自来源图像（白）、哪些保留目标图像（黑）。' }
    ],
    outputs: [
      { name: 'IMAGE', zh: '图像', type: 'IMAGE', to: '接到 保存图像 或 预览图像', what: '最终合成好的完整图像。' }
    ],
    widgets: [
      {
        name: 'x',
        zh: 'x',
        value: '默认 0；范围 0 ~ 16384，步进 1',
        what: '来源图像贴到目标图像上的横向偏移像素坐标。',
        up: '非 0 时会把新图往右挪动，原尺寸局部重绘贴回时会导致错位。',
        down: '',
        when: '同尺寸原图与生成图合成时，必须保持 0。',
        course: '局部重绘课设为 0。'
      },
      {
        name: 'y',
        zh: 'y',
        value: '默认 0；范围 0 ~ 16384，步进 1',
        what: '来源图像贴到目标图像上的纵向偏移像素坐标。',
        up: '非 0 时会把新图往下挪动。',
        down: '',
        when: '同尺寸原图与生成图合成时，必须保持 0。',
        course: '局部重绘课设为 0。'
      },
      {
        name: 'resize_source',
        zh: '缩放来源图像',
        value: '布尔开关，默认 false（关闭）',
        what: '是否在合成前把来源图像强行缩放到目标图像尺寸。',
        up: '',
        down: '',
        when: '两张图本来就是同一尺寸（如都是 512 × 512）时保持关闭（false）。',
        course: '局部重绘课保持关闭（false）。'
      }
    ],
    mistakes: [
      '把“目标图像（destination）”和“来源图像（source）”接反了，结果变成把原图的茶壶贴回到了新图上，改了个寂寞。'
    ],
    lessons: ['inpaint']
  },
  {
    id: 'LoraLoader',
    zh: '加载LoRA',
    en: 'Load LoRA (Model and CLIP)',
    group: '扩展控制',
    oneLine: '串在主模型和文字编码器路径中间，给基础模型叠加训练好的风格或概念微调权重。',
    analogy: '给画师和翻译官同时戴上一副特定画风滤镜眼镜，不换人，但下笔倾向变了。',
    inputs: [
      { name: 'model', zh: '模型', type: 'MODEL', from: '来自 Checkpoint加载器（简易）或 UNet加载器 的“模型”输出', what: '要被施加 LoRA 调整的基础扩散模型。' },
      { name: 'clip', zh: 'CLIP', type: 'CLIP', from: '来自 Checkpoint加载器（简易）或 加载CLIP 的 CLIP 输出', what: '要被施加 LoRA 调整的文字编码器。' }
    ],
    outputs: [
      { name: 'MODEL', zh: '模型', type: 'MODEL', to: '接到 K采样器 的“模型”输入（替代原本直连的主模型线）', what: '叠加了 LoRA 后的扩散模型。' },
      { name: 'CLIP', zh: 'CLIP', type: 'CLIP', to: '接到正、负 CLIP文本编码 的 clip 输入', what: '叠加了 LoRA 后的文字编码器。' }
    ],
    widgets: [
      {
        name: 'lora_name',
        zh: 'LoRA名称',
        value: '下拉选择 loras 目录中的 .safetensors 文件',
        what: '选择要应用的 LoRA 权重文件，必须与当前主模型属同一模型家族（如 SD1.5 主模型配 SD1.5 LoRA）。',
        up: '换成不同 LoRA 会带来不同画风、角色或特定视觉概念；若家族不匹配会报错或毫无效果。',
        down: '',
        when: '需要特定画风或概念微调时选择，并阅读作者说明是否需要配合触发词（trigger word）。',
        course: '拓展课在官方 LoRA 示例中选配套的 SD1.5 LoRA。'
      },
      {
        name: 'strength_model',
        zh: '模型强度',
        value: '默认 1.00；范围 -100 ~ 100，步进 0.01',
        what: '控制 LoRA 对主扩散模型（画面生成）的影响强弱。',
        up: '调高会让 LoRA 的风格更浓烈，但超过作者推荐范围（常见 0.5 ~ 1.0）容易导致画面崩坏、过饱和或构图僵硬。',
        down: '调低（如 0.4 ~ 0.7）会让风格更克制自然；设为 0 则相当于不修改模型。',
        when: '跑通官方推荐值后，固定种子只微调这一项来观察风格浓淡。',
        course: '拓展课先按作者推荐值跑一次，再单独调低 strength_model 做对比。'
      },
      {
        name: 'strength_clip',
        zh: 'CLIP强度',
        value: '默认 1.00；范围 -100 ~ 100，步进 0.01',
        what: '控制 LoRA 对文字编码器（触发词与概念理解）的影响强弱。',
        up: '通常与模型强度配合使用；不要在比较模型强度时同时乱改它。',
        down: '设为 0 时只改扩散模型不改 CLIP。',
        when: '初学做单变量对比时保持作者推荐值不动，只动“模型强度”。',
        course: '拓展课对比实验时保持 strength_clip 不变。'
      }
    ],
    mistakes: [
      '把 加载LoRA 摆在画布上选好了文件，但 K采样器 和 CLIP文本编码 还是直接连在原来的 Checkpoint 上，根本没走 LoRA 的输出口。',
      '把 SDXL 或视频模型的 LoRA 硬套在 SD1.5 主模型上。'
    ],
    lessons: ['model-download', 'lora-controlnet']
  },
  {
    id: 'ControlNetLoader',
    zh: '加载ControlNet模型',
    en: 'Load ControlNet Model',
    group: '扩展控制',
    oneLine: '加载放在 controlnet 目录下的结构控制权重（如涂鸦、线稿、姿态、深度等）。',
    analogy: '请来一位专管构图骨架的监理模型，负责盯着画师按参考图的结构落笔。',
    inputs: [],
    outputs: [
      { name: 'CONTROL_NET', zh: 'ControlNet', type: 'CONTROL_NET', to: '接到 应用ControlNet（旧版高级）的 ControlNet 输入', what: '加载好的 ControlNet 模型对象。' }
    ],
    widgets: [
      {
        name: 'control_net_name',
        zh: 'ControlNet名称',
        value: '下拉选择 controlnet（或 t2i_adapter）目录中的权重文件',
        what: '选择与主模型家族、且与输入条件图类型（如 scribble 涂鸦、openpose 姿态、canny 边缘）一致的 ControlNet 权重。',
        up: '换用不同类型的 ControlNet 时，输入图片也必须换成对应类型的预处理条件图。',
        down: '',
        when: '需要严格约束画面轮廓、姿势或景深时按官方示例配套选择。',
        course: '拓展课按官方 Scribble 示例选择匹配的 SD1.5 scribble ControlNet。'
      }
    ],
    mistakes: [
      '选了 OpenPose（姿态骨架）的 ControlNet 权重，却直接喂了一张未预处理的普通彩色风景照进去。'
    ],
    lessons: ['model-download', 'lora-controlnet']
  },
  {
    id: 'ControlNetApplyAdvanced',
    zh: '应用ControlNet（旧版高级）',
    en: 'Apply ControlNet',
    group: '扩展控制',
    oneLine: '把 ControlNet 权重和条件参考图合进正负面条件路径里，再送给 K采样器。',
    analogy: '把构图参考图订在需求单（条件）上再交给施工间，并规定从第几步盯到第几步。',
    inputs: [
      { name: 'positive', zh: '正面条件', type: 'CONDITIONING', from: '来自正向 CLIP文本编码 的“条件”输出', what: '原本的正面文字条件。' },
      { name: 'negative', zh: '负面条件', type: 'CONDITIONING', from: '来自负向 CLIP文本编码 的“条件”输出', what: '原本的负面文字条件。' },
      { name: 'control_net', zh: 'ControlNet', type: 'CONTROL_NET', from: '来自 加载ControlNet模型 的输出', what: '决定按哪种规则约束结构。' },
      { name: 'image', zh: '图像', type: 'IMAGE', from: '来自 加载图像（已预处理的条件图，如涂鸦/线稿/姿态图）', what: '提供具体构图形状的参考图。' },
      { name: 'vae', zh: 'vae', type: 'VAE', from: '可选：部分新型 ControlNet 需要接入 VAE，按所用官方示例决定是否连接', what: '辅助部分需要潜空间编码的 ControlNet。' }
    ],
    outputs: [
      { name: 'positive', zh: '正面条件', type: 'CONDITIONING', to: '接到 K采样器 的“正面条件”输入', what: '附带了结构约束的正面条件。' },
      { name: 'negative', zh: '负面条件', type: 'CONDITIONING', to: '接到 K采样器 的“负面条件”输入', what: '附带了结构约束的负面条件。' }
    ],
    widgets: [
      {
        name: 'strength',
        zh: '强度',
        value: '默认 1.00；范围 0 ~ 10，步进 0.01',
        what: '控制采样过程多大程度服从条件参考图的线条或姿态。',
        up: '调高会让构图咬得更死，但过高会让画面僵硬、失去细节自然感。',
        down: '适当调低（如 0.6 ~ 0.85）会给模型留出更多自由发挥空间；设为 0 则不生效。',
        when: '先跑通官方示例默认强度，再单独微调 strength 对比“严格跟线”与“自然发挥”。',
        course: '拓展课先保持官方示例强度运行，再只改 strength 做对比。'
      },
      {
        name: 'start_percent',
        zh: '开始百分比',
        value: '默认 0.000；范围 0 ~ 1，步进 0.001',
        what: '从整个采样进度的百分之几开始启用 ControlNet（0 表示从第 1 步就开始管）。',
        up: '调高会让前几步先自由决定大构图，后面再介入（较少用）。',
        down: '',
        when: '初学保持 0 不动。',
        course: '保持官方示例默认值。'
      },
      {
        name: 'end_percent',
        zh: '结束百分比',
        value: '默认 1.000；范围 0 ~ 1，步进 0.001',
        what: '在采样进度的百分之几停止 ControlNet 约束（例如 0.8 表示最后 20% 步数松开绳子让模型自己修细节）。',
        up: '设为 1.000 表示全程约束到最后一步。',
        down: '适当调低（如 0.7 ~ 0.9）常用于前期定大轮廓、后期让细节更自然。',
        when: '发现边缘过于死板时，可按教程尝试微调结束百分比。',
        course: '初次运行先保持官方示例默认值（注：当前前端将其译名标为“应用ControlNet（旧版高级）”，导入官方模板时以模板自带节点为准）。'
      }
    ],
    mistakes: [
      '把 ControlNet 当成 LoRA 去接 MODEL 线——ControlNet 走的是橙色“条件（CONDITIONING）”路径，不是紫色“模型（MODEL）”路径。'
    ],
    lessons: ['lora-controlnet']
  },
  {
    id: 'UpscaleModelLoader',
    zh: '加载放大模型',
    en: 'Load Upscale Model',
    group: '扩展控制',
    oneLine: '加载放在 upscale_models 目录下的超分辨率神经网络权重（如 RealESRGAN 等）。',
    analogy: '请来一位专门负责把小照片高清翻新、补足纹理的细节修复师。',
    inputs: [],
    outputs: [
      { name: 'UPSCALE_MODEL', zh: '放大模型', type: 'UPSCALE_MODEL', to: '接到 使用模型放大图像 的“放大模型”输入', what: '加载好的超分放大模型对象（不能当成扩散主模型接进 K采样器）。' }
    ],
    widgets: [
      {
        name: 'model_name',
        zh: '模型名称',
        value: '下拉选择 upscale_models 目录中的权重文件',
        what: '指定用于像素级超分辨率放大的专用模型（常见如 4x-UltraSharp、RealESRGAN_x4plus 等）。',
        up: '换成不同超分模型会改变放大后的锐化程度、颗粒感或插画平滑度。',
        down: '',
        when: '在小尺寸（如 512 或 1024）已经抽到满意构图、需要后处理放大像素尺寸时使用。',
        course: '第 04 课模型地图与第 11 课拓展能力中介绍其目录与分工，不混入基础文生图主线。'
      }
    ],
    mistakes: [
      '把超分放大模型放进 checkpoints 目录，或者试图直接连给 K采样器。',
      '在小图构图还一团糟时就先接超分放大，白白浪费显存和时间。'
    ],
    lessons: ['model-download', 'lora-controlnet']
  },
  {
    id: 'ImageUpscaleWithModel',
    zh: '使用模型放大图像',
    en: 'Upscale Image (using Model)',
    group: '扩展控制',
    oneLine: '用 加载放大模型 提供的超分权重，将解码后的像素图像（IMAGE）放大为高分辨率图像。',
    analogy: '高清翻新工位：把刚洗出来的成片交给细节修复师，按倍率放大并修补边缘锯齿。',
    inputs: [
      { name: 'upscale_model', zh: '放大模型', type: 'UPSCALE_MODEL', from: '来自 加载放大模型 的输出', what: '提供超分放大算法与权重。' },
      { name: 'image', zh: '图像', type: 'IMAGE', from: '来自 VAE解码 的图像输出', what: '已经解码完成的原始像素图像。' }
    ],
    outputs: [
      { name: 'IMAGE', zh: '图像', type: 'IMAGE', to: '接到 保存图像 或 缩放图像', what: '按模型倍率（常见 2x 或 4x）放大后的像素图像。' }
    ],
    widgets: [],
    mistakes: [
      '与普通“缩放图像（ImageScale / Upscale Image）”混淆：本节点用神经网络做超分放大，而 ImageScale 只是传统插值缩放。',
      '对已经很大的图连续多次做 4x 模型放大，瞬间撑爆显存。'
    ],
    lessons: ['lora-controlnet']
  },
  {
    id: 'FeatherMask',
    zh: '羽化遮罩',
    en: 'Feather Mask',
    group: '局部重绘',
    oneLine: '把遮罩四边的生硬黑白边界柔化成平滑灰阶过渡，减少局部重绘贴回原图时的硬接缝。',
    analogy: '像给美纹纸边缘打磨一层柔和渐变，让新画上去的油彩和周围老画布自然融在一起。',
    inputs: [
      { name: 'mask', zh: '遮罩', type: 'MASK', from: '来自 加载图像 的“遮罩”输出', what: '边缘较为生硬的原始遮罩。' }
    ],
    outputs: [
      { name: 'MASK', zh: '遮罩', type: 'MASK', to: '接到 合成图像（遮罩）或 VAE编码（局部重绘）的“遮罩”输入', what: '边缘带有平滑灰阶过渡（0 到 1 渐变）的遮罩。' }
    ],
    widgets: [
      {
        name: 'left',
        zh: '左 / 上 / 右 / 下 (left / top / right / bottom)',
        value: '默认 0；范围 0 ~ 16384，步进 1（像素）',
        what: '分别控制遮罩左、上、右、下四个方向向内柔化过渡的像素宽度。',
        up: '适当设为 8 ~ 24 像素可让 合成图像（遮罩）的接缝更柔和；但设得太大（超过遮罩本身大小）会把核心重绘区也洗成半透明。',
        down: '设为 0 表示该方向保持硬边不羽化。',
        when: '在第 10 课用 合成图像（遮罩）贴回原图后，若发现边界有明显刀切痕迹，可串入本节点微调。',
        course: '先用硬边遮罩验证坐标无误，再按需串入 8 ~ 16 像素羽化修边缘。'
      }
    ],
    mistakes: [
      '一开始就把四个方向羽化设到几百像素，结果整个茶壶遮罩都被柔化没了，重绘完全显不出来。'
    ],
    lessons: ['inpaint']
  },
  {
    id: 'DualCLIPLoader',
    zh: '双CLIP加载器',
    en: 'Load CLIP (Dual)',
    group: '加载模型',
    oneLine: '同时加载两个独立的文字编码器文件（如 CLIP-L + T5XXL 或 CLIP-L + CLIP-G），合并输出一路 CLIP。',
    analogy: '同时请来“关键词速记员”和“长句精读翻译官”两位搭档，合写一份更懂复杂提示词的需求单。',
    inputs: [],
    outputs: [
      { name: 'CLIP', zh: 'CLIP', type: 'CLIP', to: '接到 CLIP文本编码 的 clip 输入', what: '合并后的双编码器对象，下游照常接普通 CLIP文本编码 即可。' }
    ],
    widgets: [
      {
        name: 'clip_name1',
        zh: 'CLIP名称1 / CLIP名称2 (clip_name1 / clip_name2)',
        value: '下拉选择 text_encoders 目录中的两个配套编码器文件',
        what: '按模型架构配方分别指定两份文字编码器权重（例如 FLUX 常用 clip_l + t5xxl；SDXL/SD3 常用 clip_l + clip_g）。',
        up: '必须按官方模板配对选择两份不同的配套编码器；两个下拉框选同一个文件或跨家族乱搭都会报错。',
        down: '',
        when: '使用 FLUX、SD3、HiDream 等需要双编码器的拆分模型工作流时使用（Z-Image Turbo 只用一个 qwen_3_4b，因此用单口 加载CLIP）。',
        course: '在第 04 课与第 09 课对比理解：单编码器拆分模型用 加载CLIP（CLIPLoader），双编码器拆分模型用 双CLIP加载器（DualCLIPLoader）。'
      },
      {
        name: 'type',
        zh: '类型',
        value: '可选：sdxl / sd3 / flux / hunyuan_video / hidream 等（共 12 个）',
        what: '指定按哪个双编码器模型家族的规则组合这两份权重。',
        up: '选错架构类型会导致张量维度不匹配。',
        down: '',
        when: '严格按所用主模型的官方模板指定（如 FLUX 选 flux，SD3 选 sd3）。',
        course: '跑对应家族官方模板时必须核对此项。'
      }
    ],
    mistakes: [
      '在两个下拉框里选了同一个文件，或者把只用单编码器的 Z-Image 塞进双加载器里。'
    ],
    lessons: ['model-download', 'z-image', 'troubleshooting']
  }
];
