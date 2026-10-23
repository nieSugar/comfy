# 验证记录

日期：2026-10-23。环境：Windows、Node.js v24.14.1、Playwright Chromium、ComfyUI v0.42.4（前端 v1.55.18，NVIDIA GeForce RTX 5070 Ti）。

## 已通过的验证项目

| 检查项 | 结果 |
| --- | --- |
| `npm run check` | `app.js`、`diagrams.js`、`lessons.js`、`nodes.js`、`quizzes.js`、`media.js` 语法检查通过；15 项 Node 单元测试全部通过 |
| 课程与步骤完整性 | 14 课、78 个操作步骤；每步均有操作指引、原理解释、成功标志、教师提醒、流程位置迷你图（`media.js`）与可点击全屏放大的实机红框截图（共 24 张） |
| 核心节点百科 (`nodes.js`) | 覆盖 26 个核心内置节点，包含中英文标题、分类、一句话定义、通俗比喻、输入输出槽类型、全部核心参数（作用 / 调高 / 调低 / 建议）、常见踩坑与关联课程，对照实机 `/object_info` 核验 |
| 情境自测题库 (`quizzes.js`) | 14 课 × 4 题 = 56 道情境自测题，覆盖找入口、连线排错、参数判断与翻车诊断；每课第 1 题与旧 `lesson.quiz` 完全一致，保持本地进度向后兼容 |
| 五份练习工作流 (`workflows/*.json`) | `01-text-to-image.json`（7 节点）、`02-image-to-image.json`（9 节点）、`03-z-image-turbo.json`（10 节点）、`04-inpaint.json`（11 节点）、`05-lora-style.json`（8 节点）端口类型、双向连线、无悬空引用与参数校验全部通过 |
| 实机 ComfyUI 跑图与截图 (`127.0.0.1:8188`) | 在本机运行中的 ComfyUI v0.42.4 导入并执行 `03-z-image-turbo.json`，使用已安装的 `z_image_turbo_bf16.safetensors` + `qwen_3_4b.safetensors` + `ae.safetensors` 真实生成 1024 × 1024 红茶壶图片（`D:\Comfy-Desktop\ComfyUI-Shared\output\ComfyClass\zimage_00001_.png`），并生成与采集共 24 张真实中文界面红框标注截图与教学图解存入 `assets/screenshots/` |
| 本机静态服务 (`server.cjs`) | 仅监听 `127.0.0.1`；支持 `.html` / `.css` / `.js` / `.json` / `.png` 白名单，拒绝非 GET/HEAD、非法路径编码与目录越界 |
| 浏览器自动化回归 (`tests/browser-check.js`) | **394 项断言全部通过，0 页面错误**：涵盖 14 课切换、78 步流程迷你图与实机截图加载（`naturalWidth > 0`）、截图全屏放大灯箱（Lightbox）开关、参数实验室 3 卡视觉对比、行内节点抽屉、26 节点百科分类筛选与关键词搜索、56 道多题自测交互、进度持久化与旧进度迁移 |
| 全尺寸响应式检查 | `1440`、`1024`、`768`、`390`、`320` px × 14 课 = **70 个视口与课程组合零横向溢出** |

## 实机环境恢复

在采集完 `assets/screenshots/` 界面截图并完成 `03-z-image-turbo.json` 跑图验证后，已将用户原本打开的 ComfyUI 画布工作流完整恢复至实机前端。
