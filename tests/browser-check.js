async (page) => {
  const checks = [];
  const errors = [];
  const context = await page.context().browser().newContext();
  const tab = await context.newPage();
  tab.on('pageerror', error => errors.push(error.message));
  const assert = (condition, label) => { if (!condition) throw new Error(label); checks.push(label); };
  const base = 'http://127.0.0.1:4173/';
  try {
    await tab.goto(base);
    await tab.locator('.lesson-link[href="#desktop"]').click();
    await tab.goBack();
    assert(await tab.locator('[aria-current="page"]').getAttribute('href') === '#orientation', 'Browser Back returns to the initial chapter');
    await tab.locator('.lesson-link[href="#first-image"]').click();
    await tab.locator('.skip-link').focus();
    await tab.keyboard.press('Enter');
    assert(await tab.locator('[aria-current="page"]').getAttribute('href') === '#first-image' && await tab.locator('#lesson').evaluate(element => element === document.activeElement), 'Skip link focuses content without changing chapter');
    const lessons = await tab.evaluate(() => window.COMFY_LESSONS.map(lesson => ({ id: lesson.id, steps: lesson.steps.length, answer: lesson.quiz.answer, diagram: lesson.diagram })));
    assert(lessons.length === 14, 'All 14 lessons loaded');
    assert(await tab.locator('.lesson-link').count() === 14, 'All lessons have navigation');
    const originalSteps = { orientation: 4, desktop: 5, interface: 5, 'first-image': 6, nodes: 6, parameters: 5, img2img: 5, inpaint: 6, 'lora-controlnet': 5, 'save-queue': 5, 'custom-nodes': 5, troubleshooting: 6 };
    const originalIds = Object.keys(originalSteps);
    assert(JSON.stringify(lessons.map(lesson => lesson.id)) === JSON.stringify([...originalIds.slice(0, 3), 'model-download', ...originalIds.slice(3, 7), 'z-image', ...originalIds.slice(7)]), 'Model and Z-Image lessons are inserted without changing the original lesson IDs or order');
    const legacyContext = await page.context().browser().newContext();
    try {
      const legacyState = {
        completed: originalIds,
        steps: Object.fromEntries(Object.entries(originalSteps).map(([id, count]) => [id, Array.from({ length: count }, (_, index) => index)])),
        answers: Object.fromEntries(originalIds.map(id => [id, 1])),
        lastLesson: 'save-queue'
      };
      await legacyContext.addInitScript(saved => localStorage.setItem('comfy-classroom.v1', JSON.stringify(saved)), legacyState);
      const legacy = await legacyContext.newPage();
      legacy.on('pageerror', error => errors.push(error.message));
      await legacy.goto(base);
      const migrated = await legacy.evaluate(() => JSON.parse(localStorage.getItem('comfy-classroom.v1')));
      assert(JSON.stringify(migrated.completed) === JSON.stringify(originalIds), 'The original 12 completed lessons survive adding new lessons');
      assert(originalIds.every(id => JSON.stringify(migrated.steps[id]) === JSON.stringify(legacyState.steps[id]) && migrated.answers[id] === 1), 'Original step completions and quiz answers remain attached to their IDs');
      assert((await legacy.locator('#progress-text').innerText()).includes('12 / 14'), 'Existing learners see 12 of 14 lessons completed');
      assert(await legacy.locator('[aria-current="page"]').getAttribute('href') === '#save-queue', 'The last original lesson is restored');
      await legacy.locator('.lesson-link[href="#model-download"]').click();
      assert(await legacy.locator('#complete-lesson').getAttribute('aria-pressed') === 'false' && !(await legacy.locator('#step-done').isChecked()), 'The new lesson and its steps are not automatically completed');
      assert(await legacy.locator('[data-answer][aria-pressed="true"]').count() === 0, 'The new lesson has no inherited quiz answer');
    } finally { await legacyContext.close(); }
    for (const lesson of lessons) {
      await tab.goto(base + '#' + lesson.id);
      assert(await tab.locator('.step-link').count() === lesson.steps, lesson.id + ': all operation steps rendered');
      for (let index = 0; index < lesson.steps; index++) {
        await tab.locator(`[data-step="${index}"]`).click();
        const content = await tab.locator('.step-action').innerText();
        assert(content.length > 12, lesson.id + ': step ' + (index + 1) + ' has action');
        assert(await tab.locator('.step-minimap').count() === 1, lesson.id + ': step ' + (index + 1) + ' has minimap');
        assert(await tab.locator('.step-shot img').count() === 1, lesson.id + ': step ' + (index + 1) + ' has real screenshot');
      }
      await tab.locator('#step-done').check();
      await tab.reload();
      const persisted = await tab.evaluate(id => JSON.parse(localStorage.getItem('comfy-classroom.v1')).steps[id], lesson.id);
      assert(persisted.includes(lesson.steps - 1), lesson.id + ': step completion persists');
      const diagramButtons = tab.locator('[data-diagram]');
      if (await diagramButtons.count()) {
        await diagramButtons.last().click();
        assert((await tab.locator('#diagram-detail').innerText()).length > 30, lesson.id + ': diagram shows explanation');
      }
      assert(await tab.locator('.quiz-tab').count() >= 3, lesson.id + ': has multi-question quiz tabs');
      await tab.locator(`[data-answer="${(lesson.answer + 1) % 3}"]`).click();
      assert(await tab.locator('.quiz-feedback.incorrect').count() === 1, lesson.id + ': incorrect answer explained');
      await tab.locator(`[data-answer="${lesson.answer}"]`).click();
      assert((await tab.locator('#quiz-feedback').innerText()).includes('答对'), lesson.id + ': correct answer acknowledged');
      await tab.locator('#complete-lesson').click();
    }
    assert((await tab.locator('#progress-text').innerText()).includes('14 / 14'), 'All lesson completion counted');
    await tab.reload();
    assert((await tab.locator('#progress-text').innerText()).includes('14 / 14'), 'Course progress survives reload');
    await tab.locator('#complete-lesson').click();
    assert((await tab.locator('#progress-text').innerText()).includes('13 / 14'), 'Completion can be undone');
    assert(await tab.locator('.node-manual-item').count() === 26, 'All 26 node manual cards rendered');
    await tab.locator('.shot-zoom-trigger').click();
    assert(!(await tab.locator('#lightbox').evaluate(el => el.hidden)), 'Clicking step screenshot opens lightbox zoom');
    await tab.keyboard.press('Escape');
    assert(await tab.locator('#lightbox').evaluate(el => el.hidden), 'Pressing Escape closes lightbox zoom');

    await tab.goto(base + '#model-download');
    const modelLesson = await tab.evaluate(() => window.COMFY_LESSONS.find(lesson => lesson.id === 'model-download'));
    const fileUrl = 'https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors';
    let foundModelFile = false;
    for (let index = 0; index < modelLesson.steps.length; index++) {
      const links = modelLesson.steps[index].links || [];
      if (!links.length) continue;
      await tab.locator(`[data-step="${index}"]`).click();
      const rendered = tab.locator('.step-links a');
      assert(await rendered.count() === links.length, `Model download step ${index + 1}: all resource links render`);
      for (let linkIndex = 0; linkIndex < links.length; linkIndex++) {
        const anchor = rendered.nth(linkIndex);
        const href = await anchor.getAttribute('href');
        assert(href === links[linkIndex].url && href.startsWith('https://') && await anchor.isVisible(), `Model download step ${index + 1}: resource ${linkIndex + 1} is a visible HTTPS link`);
        const rel = (await anchor.getAttribute('rel') || '').split(/\s+/);
        assert(await anchor.getAttribute('target') === '_blank' && rel.includes('noopener') && rel.includes('noreferrer'), `Model download step ${index + 1}: resource ${linkIndex + 1} opens safely in a new tab`);
        if (href === fileUrl) foundModelFile = true;
      }
    }
    assert(foundModelFile, 'The specified fp16 file page is directly reachable without downloading weights during the test');
    const furtherReading = tab.locator('details.further-reading');
    assert(await furtherReading.count() === 1 && !(await furtherReading.evaluate(element => element.open)), 'Advanced model reading is initially collapsed');
    await furtherReading.locator('summary').click();
    assert(await furtherReading.evaluate(element => element.open) && await furtherReading.locator('dt').count() === modelLesson.furtherReading.items.length, 'Advanced reading expands to show all terms');
    const modelItems = await tab.evaluate(() => window.COMFY_DIAGRAMS.models.items);
    assert(await tab.locator('[data-diagram]').count() === 9, 'All nine model categories are interactive');
    for (const item of modelItems) {
      await tab.locator(`[data-diagram="${item.id}"]`).click();
      const detail = await tab.locator('#diagram-detail').innerText();
      assert(detail.includes(item.title) && detail.includes(item.text), `Model category ${item.id}: directory and loading explanation is shown`);
    }
    await tab.setViewportSize({ width: 320, height: 900 });
    for (let index = 0; index < modelLesson.steps.length; index++) {
      await tab.locator(`[data-step="${index}"]`).click();
      const hasOverflow = await tab.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1 || [...document.querySelectorAll('main *')].some(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && (box.right > innerWidth + 2 || box.left < -2);
      }));
      assert(!hasOverflow, `Model download step ${index + 1}: long filenames and expanded advanced reading fit at 320px`);
    }
    await tab.setViewportSize({ width: 1440, height: 900 });

    await tab.goto(base + '#parameters');
    assert(await tab.locator('.lab-visual-matrix .lab-swatch').count() === 3, 'Parameter lab renders 3 visual comparison swatches');
    await tab.locator('#denoise-range').fill('0');
    assert((await tab.locator('#lab-result').innerText()).includes('零去噪'), 'Denoise zero edge case explained');
    await tab.locator('#cfg-range').fill('15');
    assert((await tab.locator('#lab-result').innerText()).includes('过饱和'), 'High CFG warning updates');
    await tab.locator('#steps-range').fill('4');
    assert((await tab.locator('#lab-result').innerText()).includes('来不及收敛'), 'Low steps explanation updates');

    await context.setOffline(true);
    await tab.locator('.lesson-link[href="#first-image"]').click();
    await tab.locator('[data-diagram="sampler"]').click();
    assert((await tab.locator('#diagram-detail').innerText()).includes('KSampler'), 'Loaded classroom navigation and illustrations work offline');
    await context.setOffline(false);

    await tab.goto(base + '#first-image');
    const downloadPromise = tab.waitForEvent('download');
    await tab.locator('a[download]').click();
    const download = await downloadPromise;
    assert(download.suggestedFilename() === '01-text-to-image.json', 'Workflow JSON downloads with correct name');

    const overflow = [];
    for (const width of [1440, 1024, 768, 390, 320]) {
      await tab.setViewportSize({ width, height: 900 });
      for (const lesson of lessons) {
        await tab.goto(base + '#' + lesson.id);
        const hasOverflow = await tab.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1 || [...document.querySelectorAll('main *')].some(element => {
          const box = element.getBoundingClientRect();
          return box.width > 0 && (box.right > innerWidth + 2 || box.left < -2);
        }));
        if (hasOverflow) overflow.push({ width, lesson: lesson.id });
      }
    }
    assert(!overflow.length, '70 lesson/viewport combinations have no horizontal overflow: ' + JSON.stringify(overflow));
    await tab.setViewportSize({ width: 390, height: 844 });
    await tab.goto(base + '#orientation');
    assert(await tab.locator('#sidebar').evaluate(element => element.inert), 'Mobile closed navigation is not keyboard-focusable');
    await tab.locator('#menu-toggle').click();
    assert(await tab.locator('#menu-toggle').getAttribute('aria-expanded') === 'true', 'Mobile menu opens');
    await tab.locator('.lesson-link[href="#first-image"]').click();
    assert(await tab.locator('#menu-toggle').getAttribute('aria-expanded') === 'false', 'Mobile menu closes after navigation');
    await tab.locator('#menu-toggle').click();
    await tab.keyboard.press('Escape');
    assert(await tab.locator('#menu-toggle').getAttribute('aria-expanded') === 'false', 'Escape closes mobile menu');

    await tab.goto(base + '#nonexistent');
    assert(await tab.locator('[aria-current="page"]').getAttribute('href') === '#orientation', 'Unknown chapter safely falls back');
    await tab.evaluate(() => localStorage.setItem('comfy-classroom.v1', '{broken'));
    await tab.reload();
    assert(await tab.locator('.lesson-link').count() === 14, 'Malformed saved progress does not crash classroom');
    await tab.evaluate(() => localStorage.setItem('comfy-classroom.v1', JSON.stringify({completed:['first-image','first-image','unknown'],steps:{'first-image':[-1,0,999]},answers:{'first-image':99}})));
    await tab.reload();
    assert((await tab.locator('#progress-text').innerText()).includes('1 / 14'), 'Invalid and duplicate progress is filtered');

    const blockedContext = await page.context().browser().newContext();
    try {
      await blockedContext.addInitScript(() => {
        Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
        Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
      });
      const blocked = await blockedContext.newPage();
      blocked.on('pageerror', error => errors.push(error.message));
      await blocked.goto(base);
      await blocked.locator('#complete-lesson').click();
      assert((await blocked.locator('.sidebar-bottom p').innerText()).includes('无法保存'), 'Blocked storage is explained without stopping learning');
      assert((await blocked.locator('#progress-text').innerText()).includes('1 / 14'), 'In-memory progress works with blocked storage');
    } finally { await blockedContext.close(); }
    assert(errors.length === 0, 'No browser JavaScript errors: ' + JSON.stringify(errors));
    return { passed: checks.length, checks, errors };
  } finally { await context.close(); }
}
