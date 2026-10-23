const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const { createServer } = require('../server.cjs');
const root = path.join(__dirname, '..');
const context = { window: {} };
for (const file of ['lessons.js', 'diagrams.js', 'nodes.js', 'quizzes.js', 'media.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const lessons = context.window.COMFY_LESSONS;
const diagrams = context.window.COMFY_DIAGRAMS;
const nodes = context.window.COMFY_NODES;
const quizzes = context.window.COMFY_QUIZZES;
const media = context.window.COMFY_MEDIA;
const originalSteps = { orientation: 4, desktop: 5, interface: 5, 'first-image': 6, nodes: 6, parameters: 5, img2img: 5, inpaint: 6, 'lora-controlnet': 5, 'save-queue': 5, 'custom-nodes': 5, troubleshooting: 6 };
const modelFileUrl = 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors';

function assertReference(reference, label) {
  assert.ok(reference.title?.trim(), `${label} has a title`);
  const url = new URL(reference.url);
  assert.equal(url.protocol, 'https:', `${label} uses HTTPS`);
  assert.ok(['docs.comfy.org', 'github.com', 'huggingface.co', 'docs.pytorch.org'].includes(url.hostname), `unexpected reference: ${reference.url}`);
}

test('14 complete lessons, valid diagrams, multi-question quizzes, step media and local downloads', () => {
  assert.equal(lessons.length, 14);
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
  const nodeIds = new Set(nodes.map(node => node.id));
  assert.equal(nodes.length, 26);
  for (const node of nodes) {
    for (const key of ['id', 'zh', 'en', 'group', 'oneLine', 'analogy']) assert.ok(node[key]?.trim(), `node.${node.id}.${key}`);
    assert.ok(Array.isArray(node.inputs) && Array.isArray(node.outputs) && Array.isArray(node.widgets));
    assert.ok(Array.isArray(node.mistakes) && node.mistakes.length > 0);
  }
  for (const lesson of lessons) {
    assert.match(lesson.id, /^[a-z][a-z0-9-]+$/);
    for (const key of ['group', 'title', 'shortTitle', 'duration', 'intro', 'outcome']) assert.ok(lesson[key]?.trim(), `${lesson.id}.${key}`);
    assert.ok(lesson.prerequisites.length > 0);
    assert.ok(lesson.concepts.length > 0);
    assert.ok(lesson.steps.length >= 4);
    const stepMedia = media.steps[lesson.id];
    assert.ok(Array.isArray(stepMedia) && stepMedia.length === lesson.steps.length, `${lesson.id} step media count`);
    for (let i = 0; i < lesson.steps.length; i++) {
      const step = lesson.steps[i];
      const sm = stepMedia[i];
      for (const key of ['title', 'action', 'why', 'expected', 'tip']) assert.ok(step[key]?.trim(), `${lesson.id} step.${key}`);
      assert.ok(media.tracks[sm.track], `${lesson.id} step ${i} track`);
      assert.ok(sm.active >= 0 && sm.active < media.tracks[sm.track].length);
      assert.ok(sm.where?.trim() && sm.caption?.trim());
      assert.ok(fs.existsSync(path.join(root, sm.shot)), `missing screenshot: ${sm.shot}`);
      for (const nid of sm.nodes) assert.ok(nodeIds.has(nid), `unknown node ${nid}`);
      if (step.links !== undefined) {
        assert.ok(Array.isArray(step.links) && step.links.length > 0, `${lesson.id} step links`);
        for (const link of step.links) assertReference(link, `${lesson.id} step link`);
      }
    }
    if (lesson.furtherReading !== undefined) {
      assert.ok(lesson.furtherReading.title?.trim(), `${lesson.id} further reading title`);
      assert.ok(Array.isArray(lesson.furtherReading.items) && lesson.furtherReading.items.length > 0);
      for (const item of lesson.furtherReading.items) assert.ok(item.term?.trim() && item.meaning?.trim(), `${lesson.id} further reading item`);
    }
    assert.ok(lesson.pitfalls.length > 0);
    assert.ok(lesson.exercise.task && lesson.exercise.check);
    assert.equal(lesson.quiz.options.length, 3);
    assert.ok(Number.isInteger(lesson.quiz.answer) && lesson.quiz.answer >= 0 && lesson.quiz.answer < 3);
    assert.ok(lesson.quiz.explanation?.trim());
    const qList = quizzes[lesson.id];
    assert.ok(Array.isArray(qList) && qList.length >= 3 && qList.length <= 5, `${lesson.id} has 3-5 quizzes`);
    assert.deepEqual(qList[0], lesson.quiz, `${lesson.id} first quiz matches legacy quiz`);
    for (const q of qList) {
      assert.ok(q.question?.trim() && q.explanation?.trim());
      assert.equal(q.options.length, 3);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 3);
    }
    assert.ok(diagrams[lesson.diagram], `${lesson.id} has matching diagram`);
    assert.ok(lesson.sources.length > 0);
    for (const source of lesson.sources) assertReference(source, `${lesson.id} source`);
    for (const download of lesson.downloads || []) {
      assert.match(download.path, /^workflows\/[\w-]+\.json$/);
      assert.ok(fs.existsSync(path.join(root, download.path)));
    }
  }
});

test('new model and z-image lessons preserve existing IDs, step counts and course order', () => {
  const ids = Object.keys(originalSteps);
  assert.deepEqual(Array.from(lessons, lesson => lesson.id), [...ids.slice(0, 3), 'model-download', ...ids.slice(3, 7), 'z-image', ...ids.slice(7)]);
  for (const [id, count] of Object.entries(originalSteps)) assert.equal(lessons.find(lesson => lesson.id === id).steps.length, count, `${id} saved step indices remain valid`);
});

test('model download lesson reaches from a specific file to a verified local generation', () => {
  const lesson = lessons.find(lesson => lesson.id === 'model-download');
  assert.ok(lesson, 'model-download lesson exists');
  assert.equal(lesson.diagram, 'models');
  assert.equal(lesson.steps.length, 10);
  const fileStep = lesson.steps.findIndex(step => step.links?.some(link => link.url === modelFileUrl));
  assert.ok(fileStep >= 0, 'a step links directly to the specified fp16 file page');
  const text = lesson.steps.map(step => [step.title, step.action, step.why, step.expected, step.tip].join(' '));
  assert.match(text.join(' '), /2\.13\s*GB/i, 'the file size is stated');
  const download = lesson.steps.findIndex((step, index) => index >= fileStep && /download|下载/i.test(step.action));
  const directory = lesson.steps.findIndex((step, index) => index > download && /Storage|存储|实际.*目录|真实.*目录/i.test(step.action));
  const checkpoint = lesson.steps.findIndex((step, index) => index > directory && /ckpt_name/.test(step.action));
  const verify = lesson.steps.findIndex((step, index) => index > checkpoint && /Run|运行/.test(step.action) && /预览|PNG|输出|图片/.test(step.expected));
  assert.ok(download >= 0 && directory > download && checkpoint > directory && verify > checkpoint, 'download, actual directory, checkpoint selection and successful run are taught in order');
  assert.match(text.join(' '), /checkpoints/, 'checkpoint category directory is explicit');
  assert.ok(lesson.furtherReading?.items.length > 0, 'advanced model terms are available separately');
});

test('model illustration has nine categories with usable directory explanations', () => {
  const directories = { checkpoint: 'checkpoints', diffusion: 'diffusion_models', text: 'text_encoders', vae: 'vae', lora: 'loras', controlnet: 'controlnet', upscale: 'upscale_models', vision: 'clip_vision', embedding: 'embeddings' };
  assert.ok(diagrams.models, 'models illustration exists');
  const hotspots = Array.from(diagrams.models.html.matchAll(/data-diagram="([^"]+)"/g), match => match[1]);
  assert.deepEqual(hotspots.sort(), Object.keys(directories).sort());
  assert.deepEqual(Array.from(diagrams.models.items, item => item.id).sort(), Object.keys(directories).sort());
  for (const item of diagrams.models.items) {
    assert.ok(item.text.includes(directories[item.id]), `${item.id} explains its model directory`);
    assert.match(item.text, /加载|Load|节点|提示词/i, `${item.id} explains how it is used`);
  }
});

test('every illustration hotspot resolves to an explanation', () => {
  for (const diagram of Object.values(diagrams)) {
    assert.ok(diagram.title && diagram.hint && diagram.html && diagram.items.length);
    assert.equal(new Set(diagram.items.map(item => item.id)).size, diagram.items.length);
    for (const match of diagram.html.matchAll(/data-diagram="([^"]+)"/g)) assert.ok(diagram.items.some(item => item.id === match[1]), `missing explanation for ${match[1]}`);
    for (const item of diagram.items) assert.ok(item.title && item.text);
  }
});

test('entry page works without external assets or a module server', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /lang="zh-CN"/);
  assert.doesNotMatch(html, /type="module"|https?:\/\/[^"']+\.(?:js|css)/);
  for (const match of html.matchAll(/<script src="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(root, match[1])));
  assert.ok(html.indexOf('src="lessons.js"') < html.indexOf('src="app.js"'));
});

test('loopback server serves assets and denies private paths, traversal and writes', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const request = (requestPath, method = 'GET') => new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: requestPath, method }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
  try {
    const page = await request('/');
    assert.equal(page.status, 200);
    assert.match(page.body, /Comfy 课堂/);
    assert.equal(page.headers['x-content-type-options'], 'nosniff');
    assert.equal((await request('/workflows/01-text-to-image.json')).status, 200);
    assert.equal((await request('/workflows/04-inpaint.json')).status, 200);
    assert.equal((await request('/workflows/05-lora-style.json')).status, 200);
    assert.equal((await request('/styles.css', 'HEAD')).body, '');
    for (const requestPath of ['/package.json', '/tests/classroom.test.cjs', '/../README.md', '/%2e%2e/README.md', '/%2e%2e%5cREADME.md', '//index.html']) assert.equal((await request(requestPath)).status, 404, requestPath);
    assert.equal((await request('/%ZZ')).status, 400);
    assert.equal((await request('/', 'POST')).status, 405);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
