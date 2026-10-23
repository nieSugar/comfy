(() => {
  'use strict';
  const lessons = window.COMFY_LESSONS;
  const diagrams = window.COMFY_DIAGRAMS;
  const nodes = window.COMFY_NODES || [];
  const quizzes = window.COMFY_QUIZZES || {};
  const media = window.COMFY_MEDIA || { tracks: {}, steps: {} };
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const storageKey = 'comfy-classroom.v1';
  const lessonIds = new Set(lessons.map(lesson => lesson.id));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  let storageAvailable = true;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { storageAvailable = false; }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  const state = { completed: [], steps: {}, answers: {}, quizAnswers: {}, lastLesson: 'orientation' };
  state.completed = [...new Set(Array.isArray(saved.completed) ? saved.completed.filter(id => lessonIds.has(id)) : [])];
  for (const lesson of lessons) {
    const oldSteps = saved.steps?.[lesson.id];
    state.steps[lesson.id] = [...new Set(Array.isArray(oldSteps) ? oldSteps.filter(index => Number.isInteger(index) && index >= 0 && index < lesson.steps.length) : [])];
    const answer = saved.answers?.[lesson.id];
    if (Number.isInteger(answer) && answer >= 0 && answer < lesson.quiz.options.length) state.answers[lesson.id] = answer;
    const qList = quizzes[lesson.id] || [lesson.quiz];
    const savedMulti = saved.quizAnswers?.[lesson.id];
    state.quizAnswers[lesson.id] = {};
    if (savedMulti && typeof savedMulti === 'object' && !Array.isArray(savedMulti)) {
      for (let qi = 0; qi < qList.length; qi++) {
        const val = savedMulti[qi];
        if (Number.isInteger(val) && val >= 0 && val < qList[qi].options.length) state.quizAnswers[lesson.id][qi] = val;
      }
    }
    if (state.answers[lesson.id] !== undefined && state.quizAnswers[lesson.id][0] === undefined) {
      state.quizAnswers[lesson.id][0] = state.answers[lesson.id];
    }
  }
  if (lessonIds.has(saved.lastLesson)) state.lastLesson = saved.lastLesson;
  let currentLesson;
  let currentStep = 0;
  let currentQuizIndex = 0;
  let currentNodeGroup = '全部';
  let currentNodeSearch = '';
  let toastTimer;

  function notify(message) {
    clearTimeout(toastTimer);
    document.getElementById('status').textContent = message;
    toastTimer = setTimeout(() => { document.getElementById('status').textContent = ''; }, 4500);
  }

  function storageNotice() {
    document.querySelector('.sidebar-bottom p').textContent = storageAvailable ? '进度只保存在这个浏览器里' : '无法保存到浏览器：进度仅保留到页面关闭';
  }

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); storageAvailable = true; }
    catch { storageAvailable = false; }
    storageNotice();
  }

  function renderNav() {
    let group = '';
    document.getElementById('course-nav').innerHTML = lessons.map((lesson, index) => {
      const heading = group === lesson.group ? '' : `<div class="nav-group">${escape(lesson.group)}</div>`;
      group = lesson.group;
      return `${heading}<a href="#${lesson.id}" class="lesson-link" ${lesson.id === currentLesson.id ? 'aria-current="page"' : ''}><span class="nav-number">${String(index + 1).padStart(2, '0')}</span><span>${escape(lesson.shortTitle)}</span>${state.completed.includes(lesson.id) ? '<span class="nav-done" aria-label="已完成">✓</span>' : ''}</a>`;
    }).join('');
    const completed = state.completed.length;
    document.getElementById('progress-text').textContent = `${completed} / ${lessons.length} 课`;
    document.getElementById('progress-percent').textContent = `${Math.round(completed / lessons.length * 100)}%`;
    document.getElementById('course-progress').value = completed;
    document.getElementById('course-progress').max = lessons.length;
    document.getElementById('lesson-count').textContent = `${lessons.length} 课`;
    storageNotice();
  }

  const hero = `<section class="hero" aria-label="欢迎来到 Comfy 课堂"><div><div class="intro-label"><i aria-hidden="true"></i>COMFYUI DESKTOP · 零基础实机图解课</div><h1>从第一根连线，<br>到<em>第一张作品。</em></h1><p class="hero-copy">每一步都有本机实机红框截图、流程位置小地图和节点参数说明书。<br>把“这个按钮干啥的”变成“我完全懂每一步在干嘛”。</p><div class="button-row"><a class="button primary" href="#desktop">从准备工作开始 <span aria-hidden="true">→</span></a><a class="button" href="#z-image">Z-Image Turbo 实机课 ↗</a><a class="button subtle" href="#node-manual" data-scroll="node-manual">查 26 个节点说明书 ↓</a></div></div><figure class="hero-art"><svg viewBox="0 0 420 280" role="img" aria-label="文字输入通过模型采样和图像解码得到输出的简化流程；教学示意。"><path class="art-wire" d="M167 65 C235 65 140 146 203 146 M279 171 C279 226 180 185 180 231"/><rect class="hero-node" x="22" y="26" width="155" height="77" rx="11"/><circle cx="177" cy="65" r="4" fill="#88ac58"/><text x="38" y="51" class="small">01 / 你的想法</text><text x="38" y="79">一把窗边的红色茶壶</text><rect class="hero-node" x="203" y="104" width="179" height="77" rx="11"/><circle cx="203" cy="146" r="4" fill="#88ac58"/><text x="220" y="130" class="small">02 / 模型采样 + 解码</text><text x="220" y="157">把文字，变成画面</text><rect x="78" y="204" width="185" height="51" rx="10" fill="#b9eb56"/><circle cx="180" cy="204" r="4" fill="#88ac58"/><text x="96" y="235">✓ 第一张作品，完成</text><text x="43" y="159" class="small">小步骤，连成大可能。</text></svg><figcaption>概念流程示意 · 下方步骤均附 ComfyUI v0.42.4 实机截图</figcaption></figure></section>
    <div class="learning-path"><a class="path-card" href="#model-download"><span>01—04</span><div><strong>先熟悉工具与模型</strong><p>定位 · 界面 · 下载模型</p></div></a><a class="path-card" href="#first-image"><span>05—09</span><div><strong>亲手跑通 SD1.5 与 Z-Image</strong><p>出图 · 节点 · 参数 · 图生图 · 拆分模型</p></div></a><a class="path-card" href="#inpaint"><span>10—14</span><div><strong>从会用到会判断</strong><p>重绘 · 拓展 · 保存 · 排错</p></div></a></div>`;

  function renderDiagramDetail(entry) {
    document.getElementById('diagram-detail').innerHTML = `<strong>${escape(entry.title)}</strong><p>${escape(entry.text)}</p>`;
  }

  function renderNodeManualCard(node, open = false) {
    return `<details class="node-manual-item" id="manual-${escape(node.id)}" ${open ? 'open' : ''}>
      <summary><span class="node-badge">${escape(node.group)}</span><strong>${escape(node.zh)}</strong><code>${escape(node.en)} · ${escape(node.id)}</code><span class="node-summary-line">${escape(node.oneLine)}</span></summary>
      <div class="node-manual-body">
        <p class="node-analogy"><b>一句话比喻：</b>${escape(node.analogy)}</p>
        <div class="node-io-grid">
          <div><h4>← 左侧输入端口（${node.inputs.length}）</h4>${node.inputs.length ? `<ul>${node.inputs.map(inp => `<li><code>${escape(inp.zh)} (${escape(inp.name)}: ${escape(inp.type)})</code> — ${escape(inp.from)}。${escape(inp.what)}</li>`).join('')}</ul>` : '<p class="muted-note">无左侧连线输入（作为起点节点直接读取文件或参数）。</p>'}</div>
          <div><h4>→ 右侧输出端口（${node.outputs.length}）</h4>${node.outputs.length ? `<ul>${node.outputs.map(out => `<li><code>${escape(out.zh)} (${escape(out.name)}: ${escape(out.type)})</code> — ${escape(out.to)}。${escape(out.what)}</li>`).join('')}</ul>` : '<p class="muted-note">无右侧连线输出（作为终点节点直接保存或展示图像）。</p>'}</div>
        </div>
        ${node.widgets.length ? `<h4>◎ 节点内每个参数控件详解（${node.widgets.length} 项）</h4><div class="widget-table">${node.widgets.map(w => `<div class="widget-row"><div class="widget-head"><strong>${escape(w.zh)}</strong><code>${escape(w.name)}</code><span>${escape(w.value)}</span></div><p><b>它是干嘛的：</b>${escape(w.what)}</p>${w.up ? `<p><b>调大 / 换选项会怎样：</b>${escape(w.up)}</p>` : ''}${w.down ? `<p><b>调小会怎样：</b>${escape(w.down)}</p>` : ''}<p><b>什么时候该动它：</b>${escape(w.when)}</p>${w.course ? `<p class="widget-course"><b>本课程怎么填：</b>${escape(w.course)}</p>` : ''}</div>`).join('')}</div>` : '<p class="muted-note">本节点没有需要手动填写的参数控件，只要把输入输出线连对即可自动工作。</p>'}
        <div class="node-mistakes"><strong>⚠ 新手最常踩的坑：</strong><ul>${node.mistakes.map(m => `<li>${escape(m)}</li>`).join('')}</ul></div>
      </div>
    </details>`;
  }

  function renderNodeManualList() {
    const container = document.getElementById('node-manual-list');
    if (!container) return;
    const q = currentNodeSearch.trim().toLowerCase();
    const filtered = nodes.filter(node => {
      if (currentNodeGroup !== '全部' && node.group !== currentNodeGroup) return false;
      if (!q) return true;
      return [node.id, node.zh, node.en, node.oneLine, node.group, ...node.widgets.map(w => `${w.name} ${w.zh}`)].join(' ').toLowerCase().includes(q);
    });
    container.innerHTML = filtered.length
      ? filtered.map((node, idx) => renderNodeManualCard(node, idx === 0 && Boolean(q))).join('')
      : '<p class="muted-note">没有匹配的节点，请清空搜索词或切换分类。</p>';
  }

  function renderLesson() {
    const requested = location.hash.slice(1);
    currentLesson = lessons.find(lesson => lesson.id === requested) || lessons[0];
    if (location.hash !== `#${currentLesson.id}`) history.replaceState(null, '', `#${currentLesson.id}`);
    state.lastLesson = currentLesson.id;
    const firstUnfinished = currentLesson.steps.findIndex((_, index) => !state.steps[currentLesson.id].includes(index));
    currentStep = firstUnfinished < 0 ? 0 : firstUnfinished;
    currentQuizIndex = 0;
    persist();
    const lesson = currentLesson;
    const index = lessons.indexOf(lesson);
    const diagram = diagrams[lesson.diagram];
    const lessonNodes = nodes.filter(node => node.lessons?.includes(lesson.id));
    const groups = ['全部', ...new Set(nodes.map(node => node.group))];
    const qList = quizzes[lesson.id] || [lesson.quiz];
    document.title = `${lesson.shortTitle} · Comfy 课堂`;
    document.getElementById('breadcrumb-current').textContent = lesson.shortTitle;
    document.getElementById('lesson').innerHTML = `${index === 0 ? hero : ''}
      <section class="lesson-heading"><div class="lesson-meta"><span class="chapter-tag">LESSON ${String(index + 1).padStart(2, '0')}</span><span>${escape(lesson.group)}</span><span>·</span><span>${escape(lesson.duration)}</span></div><h1 ${index === 0 ? 'class="orientation-title"' : ''}>${escape(lesson.title)}</h1><p>${escape(lesson.intro)}</p><div class="section-links"><a href="#diagram" data-scroll="diagram"><span>01</span> 看图理解</a><a href="#practice-steps" data-scroll="practice-steps"><span>02</span> 实机步骤</a><a href="#practice" data-scroll="practice"><span>03</span> 动手与自测（${qList.length}题）</a><a href="#node-manual" data-scroll="node-manual"><span>04</span> 节点说明书</a></div></section>
      <div class="objective"><span aria-hidden="true">◎</span><div><strong>学完这一课，你就能</strong><p>${escape(lesson.outcome)}</p></div></div>
      <section class="section" id="diagram" aria-labelledby="diagram-heading"><div class="section-head"><h2 id="diagram-heading">先看懂，再动手</h2><span class="section-kicker">LEARN BY SEEING</span></div><div class="visual-panel"><div class="visual-topline"><strong>${escape(diagram.title)}</strong><span>${escape(diagram.hint)}</span></div><div class="diagram-stage">${diagram.html}</div><div class="diagram-detail" id="diagram-detail" aria-live="polite"></div></div><dl class="concepts">${lesson.concepts.map(concept => `<div class="concept"><dt>${escape(concept.term)}</dt><dd>${escape(concept.meaning)}</dd></div>`).join('')}</dl></section>
      <section class="section" id="practice-steps" aria-labelledby="steps-heading"><div class="section-head"><h2 id="steps-heading">跟着老师，一步一步来（配实机截图 + 位置地图）</h2><span class="section-kicker">${lesson.steps.length} 个操作步骤</span></div><details class="prerequisites" open><summary>开始前，确认这些准备好了</summary><ul>${lesson.prerequisites.map(value => `<li>${escape(value)}</li>`).join('')}</ul></details>${lesson.downloads?.length ? `<div class="download-list">${lesson.downloads.map(download => `<a class="button" href="${escape(download.path)}" download>↓ ${escape(download.label)}</a>`).join('')}</div>` : ''}<div class="step-layout"><div class="step-nav" id="step-nav" aria-label="本课操作步骤"></div><article class="step-card" id="step-card"></article></div></section>
      <section class="section" aria-labelledby="pitfalls-heading"><div class="section-head"><h2 id="pitfalls-heading">卡住了？先看这里</h2><span class="section-kicker">常见问题</span></div><div class="pitfalls">${lesson.pitfalls.map(pitfall => `<details class="pitfall"><summary>${escape(pitfall.symptom)}</summary><p>${escape(pitfall.fix)}</p></details>`).join('')}</div></section>
      <section class="section" id="practice" aria-labelledby="practice-heading"><div class="section-head"><h2 id="practice-heading">做一次，比看十次更有用</h2><span class="section-kicker">YOUR TURN · ${qList.length} 道情景自测</span></div><div class="practice-grid"><article class="practice-card"><span class="eyebrow">动手练习</span><h3>这次，换你来操作</h3><p>${escape(lesson.exercise.task)}</p><p class="acceptance"><strong>怎样算完成？</strong>${escape(lesson.exercise.check)}</p></article><article class="practice-card"><div class="quiz-header"><span class="eyebrow" id="quiz-progress-label">情景自测</span><div class="quiz-tabs" id="quiz-tabs" role="tablist" aria-label="本课自测题切换"></div></div><h3 id="quiz-question">${escape(lesson.quiz.question)}</h3><div id="quiz-options">${lesson.quiz.options.map((option, optionIndex) => `<button class="quiz-option" type="button" data-answer="${optionIndex}" aria-pressed="false"><span>${String.fromCharCode(65 + optionIndex)}</span><span>${escape(option)}</span></button>`).join('')}</div><div id="quiz-feedback" aria-live="polite"></div></article></div></section>
      <section class="section" id="node-manual" tabindex="-1" aria-labelledby="manual-heading"><div class="section-head"><h2 id="manual-heading">节点与参数说明书（知道每个参数干嘛、怎么调）</h2><span class="section-kicker">26 CORE NODES MANUAL</span></div>${lessonNodes.length ? `<div class="lesson-nodes-callout"><strong>本课重点用到的节点（点击直接展开参数说明）：</strong><div class="node-chip-row">${lessonNodes.map(n => `<button type="button" class="node-chip" data-open-node="${escape(n.id)}">${escape(n.zh)} <span>${escape(n.en)}</span></button>`).join('')}</div></div>` : ''}<div class="manual-controls"><div class="manual-groups" role="toolbar" aria-label="节点分类筛选">${groups.map(g => `<button type="button" class="group-pill" data-node-group="${escape(g)}" aria-pressed="${g === currentNodeGroup}">${escape(g)}</button>`).join('')}</div><input type="search" id="node-search" class="node-search" placeholder="搜索节点或参数（如 K采样器 / denoise / lumina2 / shift）" value="${escape(currentNodeSearch)}" aria-label="搜索节点说明书"></div><div id="node-manual-list" class="node-manual-list"></div></section>
      ${lesson.furtherReading ? `<details class="further-reading"><summary>${escape(lesson.furtherReading.title)}</summary><dl class="concepts">${lesson.furtherReading.items.map(entry => `<div class="concept"><dt>${escape(entry.term)}</dt><dd>${escape(entry.meaning)}</dd></div>`).join('')}</dl></details>` : ''}
      <div class="lesson-bottom"><div><button class="button dark" type="button" id="complete-lesson" aria-pressed="false"></button><div class="completion-note">完成标记是你的自评，不代表 Desktop 已执行成功。</div></div><div class="button-row">${index > 0 ? `<a class="button" href="#${lessons[index - 1].id}">← 上一课</a>` : ''}${index < lessons.length - 1 ? `<a class="button primary" href="#${lessons[index + 1].id}">下一课：${escape(lessons[index + 1].shortTitle)} →</a>` : '<a class="button primary" href="#first-image">回到第一张图，独立做一次 ↗</a>'}</div></div>
      <details class="sources"><summary>本课一手参考与适用范围</summary><ul>${lesson.sources.map(source => `<li><a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗</a></li>`).join('')}</ul><p>核对日期：2026-10-23。步骤截图来自本机 ComfyUI v0.42.4（前端 1.55.18，中文界面），Z-Image Turbo 工作流已在本机 RTX 5070 Ti 真实出图验收；顶部 SVG 为概念示意。</p></details>`;
    renderNav();
    renderStep();
    renderDiagramDetail(diagram.items[0]);
    if (lesson.diagram === 'parameters') renderLab();
    renderQuiz();
    renderNodeManualList();
    updateComplete();
    closeMenu();
  }

  function renderStepNav() {
    document.getElementById('step-nav').innerHTML = currentLesson.steps.map((step, index) => `<button type="button" class="step-link" data-step="${index}" ${index === currentStep ? 'aria-current="step"' : ''}><span class="step-index">${state.steps[currentLesson.id].includes(index) ? '✓' : index + 1}</span><span class="step-copy">${escape(step.title)}<small>${state.steps[currentLesson.id].includes(index) ? '已勾选完成' : `步骤 ${index + 1}`}</small></span></button>`).join('');
  }

  function renderStep() {
    const step = currentLesson.steps[currentStep];
    const stepMedia = media.steps?.[currentLesson.id]?.[currentStep];
    const trackStages = stepMedia ? (media.tracks?.[stepMedia.track] || []) : [];
    const stepNodes = (stepMedia?.nodes || []).map(id => nodeMap.get(id)).filter(Boolean);
    renderStepNav();
    const minimapHTML = stepMedia && trackStages.length ? `<div class="step-minimap" aria-label="当前步骤在整体流程中的位置"><div class="minimap-head"><span class="minimap-tag">流程位置小地图</span><strong>${escape(stepMedia.where)}</strong></div><ol class="minimap-track">${trackStages.map((stage, idx) => `<li class="${idx === stepMedia.active ? 'active' : idx < stepMedia.active ? 'done' : ''}"><span>${idx + 1}</span>${escape(stage)}</li>`).join('')}</ol></div>` : '';
    const shotHTML = stepMedia?.shot ? `<figure class="step-shot"><button type="button" class="shot-zoom-trigger" data-zoom-src="${escape(stepMedia.shot)}" data-zoom-caption="${escape(stepMedia.caption)}" aria-label="点击放大查看本步截图"><img src="${escape(stepMedia.shot)}" alt="${escape(stepMedia.caption)}" loading="lazy"><span class="zoom-badge">🔍 点击放大看红框细节</span></button><figcaption>${escape(stepMedia.caption)}</figcaption></figure>` : '';
    const nodesHTML = stepNodes.length ? `<div class="step-nodes-drawer"><div class="step-nodes-title">本步操作的节点与参数速查（知道每个旋钮是干嘛的）：</div>${stepNodes.map(node => `<details class="inline-node-card"><summary><strong>${escape(node.zh)}</strong><code>${escape(node.en)}</code><span>— ${escape(node.oneLine)}</span></summary><div class="inline-node-body"><p>${escape(node.analogy)}</p>${node.widgets.length ? `<ul class="inline-widget-list">${node.widgets.map(w => `<li><b>${escape(w.zh)}（${escape(w.name)}）：</b>${escape(w.what)}${w.course ? ` <em>【本课设置：${escape(w.course)}】</em>` : ''}</li>`).join('')}</ul>` : '<p class="muted-note">无手动参数控件，按步骤连接输入/输出端口即可。</p>'}<button type="button" class="button subtle jump-manual" data-open-node="${escape(node.id)}">查看完整端口与调大/调小对比 ↓</button></div></details>`).join('')}</div>` : '';
    document.getElementById('step-card').innerHTML = `<span class="eyebrow">STEP ${String(currentStep + 1).padStart(2, '0')} / ${String(currentLesson.steps.length).padStart(2, '0')}</span><h3 id="step-title" tabindex="-1">${escape(step.title)}</h3>${minimapHTML}<p class="step-action">${escape(step.action)}</p>${step.links?.length ? `<div class="step-links">${step.links.map(link => `<a class="button" href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.title)} ↗</a>`).join('')}</div>` : ''}${shotHTML}<div class="step-explanation"><div><strong>为什么要这样做？</strong><p>${escape(step.why)}</p></div><div><strong>做对了，会看到什么？</strong><p>${escape(step.expected)}</p></div></div>${nodesHTML}${step.tip ? `<div class="teacher-tip"><strong>老师提醒</strong>${escape(step.tip)}</div>` : ''}<label class="step-check"><input type="checkbox" id="step-done" ${state.steps[currentLesson.id].includes(currentStep) ? 'checked' : ''}>这一步，我已经实际操作完成了</label><div class="step-buttons"><button class="button" type="button" data-move="-1" ${currentStep === 0 ? 'disabled' : ''}>← 上一步</button><span>${currentStep + 1} / ${currentLesson.steps.length}</span><button class="button primary" type="button" data-move="1" ${currentStep === currentLesson.steps.length - 1 ? 'disabled' : ''}>下一步 →</button></div>`;
  }

  function updateComplete() {
    const completed = state.completed.includes(currentLesson.id);
    const button = document.getElementById('complete-lesson');
    button.textContent = completed ? '✓ 本课已完成 · 点击撤销' : '我理解了，标记本课完成 ✓';
    button.setAttribute('aria-pressed', String(completed));
  }

  function renderQuiz() {
    const qList = quizzes[currentLesson.id] || [currentLesson.quiz];
    if (currentQuizIndex >= qList.length) currentQuizIndex = 0;
    const quiz = qList[currentQuizIndex];
    const lessonAnswers = state.quizAnswers[currentLesson.id] || {};
    const answer = currentQuizIndex === 0 && lessonAnswers[0] === undefined ? state.answers[currentLesson.id] : lessonAnswers[currentQuizIndex];
    const solvedCount = qList.filter((q, idx) => {
      const a = idx === 0 && lessonAnswers[0] === undefined ? state.answers[currentLesson.id] : lessonAnswers[idx];
      return a === q.answer;
    }).length;
    document.getElementById('quiz-progress-label').textContent = `情景自测 · 已答对 ${solvedCount} / ${qList.length} 题`;
    document.getElementById('quiz-tabs').innerHTML = qList.map((q, idx) => {
      const a = idx === 0 && lessonAnswers[0] === undefined ? state.answers[currentLesson.id] : lessonAnswers[idx];
      const status = a === undefined ? '' : a === q.answer ? ' ✓' : ' ·';
      return `<button type="button" class="quiz-tab" data-quiz-index="${idx}" aria-selected="${idx === currentQuizIndex}">第 ${idx + 1} 题${status}</button>`;
    }).join('');
    document.getElementById('quiz-question').textContent = quiz.question;
    document.getElementById('quiz-options').innerHTML = quiz.options.map((option, optionIndex) => `<button class="quiz-option" type="button" data-answer="${optionIndex}" aria-pressed="${Number(optionIndex) === answer}"><span>${String.fromCharCode(65 + optionIndex)}</span><span>${escape(option)}</span></button>`).join('');
    const correct = answer === quiz.answer;
    const nextBtn = correct && currentQuizIndex < qList.length - 1 ? `<button type="button" class="button subtle quiz-next" data-quiz-index="${currentQuizIndex + 1}">下一题（${currentQuizIndex + 2}/${qList.length}）→</button>` : '';
    document.getElementById('quiz-feedback').innerHTML = answer === undefined ? '' : `<div class="quiz-feedback ${correct ? '' : 'incorrect'}"><strong>${correct ? '✓ 答对了。' : '再想一想，可以重新选择。'}</strong><p>${escape(quiz.explanation)}</p>${nextBtn}</div>`;
  }

  function renderLab() {
    const values = {};
    document.querySelectorAll('[data-parameter]').forEach(input => {
      values[input.dataset.parameter] = Number(input.value);
      document.getElementById(`${input.dataset.parameter}-value`).value = input.value;
    });
    const steps = values.steps < 12 ? '步数偏少，可能来不及收敛。观察细节，不只看速度。' : values.steps <= 30 ? '适合做本课对照实验的区间。更多步数并不保证更好。' : '步数较多，通常更耗时；先比较是否真的增加了有效细节。';
    const cfg = values.cfg < 4 ? '引导较弱，可能更自由，也可能偏离描述。' : values.cfg <= 9 ? '可作为本课 SD1.5 对照区间。看主体、对比度与自然程度。' : '引导较强，可能出现过饱和、发硬或不自然的细节。';
    const denoise = values.denoise === 0 ? '零去噪不等于原像素无损复制：VAE 编解码仍可能带来变化。' : values.denoise <= .35 ? '通常较多保留输入结构，适合观察轻度变化。' : values.denoise <= .7 ? '在原图约束与重新生成之间尝试；具体改动依赖模型和输入。' : '原图约束通常更弱，可能大幅改变构图；不是“质量更高”。';
    const stepState = values.steps < 12 ? { tag: '欠收敛（噪点残留）', blur: 2.5, opacity: 0.72 } : values.steps <= 30 ? { tag: '已收敛（细节清晰）', blur: 0, opacity: 1 } : { tag: '步数偏多（边际收益递减）', blur: 0, opacity: 1 };
    const cfgState = values.cfg < 4 ? { tag: '弱引导（发灰偏淡）', color: '#9e8279', stroke: '#8c756c' } : values.cfg <= 9 ? { tag: '均衡引导（色彩自然）', color: '#b7523e', stroke: '#7a2e21' } : { tag: '过强引导（过饱和硬边）', color: '#ff1e00', stroke: '#ffd000' };
    const denoiseState = values.denoise <= .35 ? { tag: '保留原图红壶构图', color: '#b7523e', rx: 32 } : values.denoise <= .7 ? { tag: '保留轮廓 + 改蓝水彩', color: '#4a7ab5', rx: 32 } : { tag: '打破原构图大幅重画', color: '#2e6b9e', rx: 22 };
    const visualPreview = `<div class="lab-visual-matrix" aria-label="参数变化趋势视觉对照">
      <div class="lab-swatch"><span>Steps = ${values.steps} · ${stepState.tag}</span><svg viewBox="0 0 140 90" role="img" aria-label="步数效果示意"><rect width="140" height="90" fill="#e9efe8"/><rect y="68" width="140" height="22" fill="#d3c4ab"/><g style="opacity:${stepState.opacity};filter:blur(${stepState.blur}px)"><ellipse cx="70" cy="54" rx="28" ry="21" fill="#b7523e"/><path d="M44 45 L22 30 L30 58 L50 64" fill="#b7523e"/><path d="M92 38 C118 22 118 68 93 62" stroke="#b7523e" stroke-width="6" fill="none"/><circle cx="70" cy="29" r="5" fill="#b7523e"/></g></svg></div>
      <div class="lab-swatch"><span>CFG = ${values.cfg} · ${cfgState.tag}</span><svg viewBox="0 0 140 90" role="img" aria-label="CFG引导强度示意"><rect width="140" height="90" fill="${values.cfg > 9 ? '#ffe8d6' : '#e9efe8'}"/><rect y="68" width="140" height="22" fill="#d3c4ab"/><ellipse cx="70" cy="54" rx="28" ry="21" fill="${cfgState.color}" stroke="${cfgState.stroke}" stroke-width="${values.cfg > 9 ? 3 : 1}"/><path d="M44 45 L22 30 L30 58 L50 64" fill="${cfgState.color}"/><path d="M92 38 C118 22 118 68 93 62" stroke="${cfgState.color}" stroke-width="6" fill="none"/><circle cx="70" cy="29" r="5" fill="${cfgState.color}"/></svg></div>
      <div class="lab-swatch"><span>Denoise = ${values.denoise} · ${denoiseState.tag}</span><svg viewBox="0 0 140 90" role="img" aria-label="图生图降噪幅度示意"><rect width="140" height="90" fill="#e9efe8"/><rect y="68" width="140" height="22" fill="#d3c4ab"/><ellipse cx="70" cy="54" rx="${denoiseState.rx}" ry="21" fill="${denoiseState.color}"/><path d="M44 45 L22 30 L30 58 L50 64" fill="${denoiseState.color}"/><path d="M92 38 C118 22 118 68 93 62" stroke="${denoiseState.color}" stroke-width="6" fill="none"/><circle cx="70" cy="29" r="5" fill="${denoiseState.color}"/></svg></div>
    </div>`;
    document.getElementById('lab-result').innerHTML = `<strong>你改变的，不只是一个数字</strong><p><b>Steps ${values.steps}</b> · ${steps}</p><p><b>CFG ${values.cfg}</b> · ${cfg}</p><p><b>Denoise ${values.denoise}</b> · ${denoise}</p>${visualPreview}<small>仅为概念解释，不是 GPU 速度预测或图像预览。文生图基线保持 denoise = 1；上面的 denoise 用于图生图实验。</small>`;
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
    if (matchMedia('(max-width: 720px)').matches) document.getElementById('sidebar').inert = true;
  }

  function syncSidebar() {
    document.getElementById('sidebar').inert = matchMedia('(max-width: 720px)').matches && !document.body.classList.contains('menu-open');
  }

  function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.hidden = true;
  }

  document.addEventListener('click', event => {
    if (event.target.id === 'lightbox' || event.target.id === 'lightbox-close') {
      closeLightbox();
      return;
    }
    const button = event.target.closest('button, a');
    if (!button) return;
    if (button.dataset.zoomSrc) {
      const lb = document.getElementById('lightbox');
      document.getElementById('lightbox-img').src = button.dataset.zoomSrc;
      document.getElementById('lightbox-img').alt = button.dataset.zoomCaption || '';
      document.getElementById('lightbox-caption').textContent = button.dataset.zoomCaption || '';
      lb.hidden = false;
      document.getElementById('lightbox-close').focus();
      return;
    }
    if (button.id === 'menu-toggle') {
      const open = document.body.classList.toggle('menu-open');
      button.setAttribute('aria-expanded', String(open));
      syncSidebar();
    } else if (button.closest('#course-nav')) {
      closeMenu();
    } else if (button.dataset.scroll) {
      event.preventDefault();
      const target = document.getElementById(button.dataset.scroll);
      if (!target) return;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    } else if (button.dataset.openNode) {
      currentNodeGroup = '全部';
      currentNodeSearch = '';
      const searchEl = document.getElementById('node-search');
      if (searchEl) searchEl.value = '';
      document.querySelectorAll('[data-node-group]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.nodeGroup === '全部')));
      renderNodeManualList();
      const detail = document.getElementById(`manual-${button.dataset.openNode}`);
      if (detail) {
        detail.open = true;
        detail.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    } else if (button.dataset.nodeGroup !== undefined) {
      currentNodeGroup = button.dataset.nodeGroup;
      document.querySelectorAll('[data-node-group]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.nodeGroup === currentNodeGroup)));
      renderNodeManualList();
    } else if (button.dataset.quizIndex !== undefined) {
      currentQuizIndex = Number(button.dataset.quizIndex);
      renderQuiz();
    } else if (button.dataset.step !== undefined || button.dataset.move) {
      const index = button.dataset.step !== undefined ? Number(button.dataset.step) : currentStep + Number(button.dataset.move);
      if (index < 0 || index >= currentLesson.steps.length) return;
      currentStep = index;
      renderStep();
      document.getElementById('step-title').focus({ preventScroll: true });
    } else if (button.dataset.diagram) {
      const entry = diagrams[currentLesson.diagram].items.find(item => item.id === button.dataset.diagram);
      if (!entry) return;
      document.querySelectorAll('[data-diagram]').forEach(node => { node.setAttribute('aria-pressed', String(node.dataset.diagram === entry.id)); });
      renderDiagramDetail(entry);
    } else if (button.dataset.answer !== undefined) {
      const chosen = Number(button.dataset.answer);
      if (!state.quizAnswers[currentLesson.id]) state.quizAnswers[currentLesson.id] = {};
      state.quizAnswers[currentLesson.id][currentQuizIndex] = chosen;
      if (currentQuizIndex === 0) state.answers[currentLesson.id] = chosen;
      persist();
      renderQuiz();
    } else if (button.id === 'complete-lesson') {
      if (state.completed.includes(currentLesson.id)) state.completed = state.completed.filter(id => id !== currentLesson.id);
      else state.completed.push(currentLesson.id);
      persist();
      renderNav();
      updateComplete();
      notify(storageAvailable ? '学习进度已保存在这个浏览器里。' : '进度暂存在当前页面，浏览器不允许持久保存。');
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id !== 'step-done') return;
    const steps = new Set(state.steps[currentLesson.id]);
    if (event.target.checked) steps.add(currentStep); else steps.delete(currentStep);
    state.steps[currentLesson.id] = [...steps];
    persist();
    renderStepNav();
  });
  document.addEventListener('input', event => {
    if (event.target.dataset.parameter) renderLab();
    if (event.target.id === 'node-search') {
      currentNodeSearch = event.target.value;
      renderNodeManualList();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const lb = document.getElementById('lightbox');
      if (lb && !lb.hidden) {
        closeLightbox();
        return;
      }
      if (document.body.classList.contains('menu-open')) {
        closeMenu();
        document.getElementById('menu-toggle').focus();
      }
    }
  });
  document.addEventListener('click', event => {
    if (document.body.classList.contains('menu-open') && !event.target.closest('#sidebar, #menu-toggle')) closeMenu();
  });
  function onRouteChange() {
    if (currentLesson && location.hash === `#${currentLesson.id}`) return;
    renderLesson();
    window.scrollTo(0, 0);
    document.getElementById('lesson').focus({ preventScroll: true });
  }
  window.addEventListener('resize', syncSidebar);
  window.addEventListener('popstate', onRouteChange);
  window.addEventListener('hashchange', onRouteChange);
  if (!location.hash) history.replaceState(null, '', `#${state.lastLesson}`);
  renderLesson();
  syncSidebar();
})();
