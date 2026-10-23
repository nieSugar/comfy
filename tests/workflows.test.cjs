const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// The port contract is checked independently of the JSON's self-described types.
const ports = {
  CheckpointLoaderSimple: { inputs: [], outputs: ['MODEL', 'CLIP', 'VAE'], widgets: 1 },
  CLIPTextEncode: { inputs: [['clip', 'CLIP']], outputs: ['CONDITIONING'], widgets: 1 },
  EmptyLatentImage: { inputs: [], outputs: ['LATENT'], widgets: 3 },
  KSampler: {
    inputs: [['model', 'MODEL'], ['positive', 'CONDITIONING'], ['negative', 'CONDITIONING'], ['latent_image', 'LATENT']],
    outputs: ['LATENT'], widgets: 7
  },
  VAEDecode: { inputs: [['samples', 'LATENT'], ['vae', 'VAE']], outputs: ['IMAGE'], widgets: 0 },
  SaveImage: { inputs: [['images', 'IMAGE']], outputs: [], widgets: 1 },
  LoadImage: { inputs: [], outputs: ['IMAGE', 'MASK'], widgets: 2 },
  ImageScale: { inputs: [['image', 'IMAGE']], outputs: ['IMAGE'], widgets: 4 },
  VAEEncode: { inputs: [['pixels', 'IMAGE'], ['vae', 'VAE']], outputs: ['LATENT'], widgets: 0 },
  UNETLoader: { inputs: [], outputs: ['MODEL'], widgets: 2 },
  ModelSamplingAuraFlow: { inputs: [['model', 'MODEL']], outputs: ['MODEL'], widgets: 2 },
  CLIPLoader: { inputs: [], outputs: ['CLIP'], widgets: 3 },
  ConditioningZeroOut: { inputs: [['conditioning', 'CONDITIONING']], outputs: ['CONDITIONING'], widgets: 0 },
  EmptySD3LatentImage: { inputs: [], outputs: ['LATENT'], widgets: 3 },
  VAELoader: { inputs: [], outputs: ['VAE'], widgets: 1 },
  VAEEncodeForInpaint: { inputs: [['pixels', 'IMAGE'], ['vae', 'VAE'], ['mask', 'MASK']], outputs: ['LATENT'], widgets: 1 },
  MaskToImage: { inputs: [['mask', 'MASK']], outputs: ['IMAGE'], widgets: 0 },
  PreviewImage: { inputs: [['images', 'IMAGE']], outputs: [], widgets: 0 },
  ImageCompositeMasked: { inputs: [['destination', 'IMAGE'], ['source', 'IMAGE'], ['mask', 'MASK']], outputs: ['IMAGE'], widgets: 3 },
  LoraLoader: { inputs: [['model', 'MODEL'], ['clip', 'CLIP']], outputs: ['MODEL', 'CLIP'], widgets: 3 }
};

function readWorkflow(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'workflows', name), 'utf8'));
}

function validateGraph(graph) {
  assert.equal(graph.version, 0.4);
  const nodes = new Map(graph.nodes.map(node => [node.id, node]));
  const links = new Map(graph.links.map(link => [link[0], link]));
  assert.equal(nodes.size, graph.nodes.length, 'duplicate node id');
  assert.equal(links.size, graph.links.length, 'duplicate link id');
  assert.equal(graph.last_node_id, Math.max(...nodes.keys()));
  assert.equal(graph.last_link_id, Math.max(...links.keys()));
  assert.equal(new Set(graph.nodes.map(node => node.order)).size, nodes.size, 'duplicate execution order');

  for (const node of nodes.values()) {
    const contract = ports[node.type];
    assert.ok(contract, `unexpected/custom/API node: ${node.type}`);
    assert.equal(node.mode, 0, 'all teaching nodes must execute normally');
    assert.equal(node.properties['Node name for S&R'], node.type);
    assert.equal(node.widgets_values.length, contract.widgets, `${node.type} widget count`);
    assert.equal(node.pos.length, 2);
    assert.equal(node.size.length, 2);
    assert.ok([...node.pos, ...node.size].every(Number.isFinite));
    assert.ok(node.size.every(value => value > 0));
    assert.deepEqual(node.inputs.map(input => [input.name, input.type]), contract.inputs, `${node.type} input contract`);
    assert.deepEqual(node.outputs.map(output => output.type), contract.outputs, `${node.type} output contract`);

    node.inputs.forEach((input, slot) => {
      assert.ok(links.has(input.link), `${node.type}.${input.name} is not connected`);
      const link = links.get(input.link);
      assert.equal(link[3], node.id, 'wrong target node');
      assert.equal(link[4], slot, 'wrong target slot');
    });
    node.outputs.forEach((output, slot) => {
      assert.equal(output.slot_index, slot);
      const referenced = output.links || [];
      assert.equal(new Set(referenced).size, referenced.length, 'duplicate output link');
      for (const id of referenced) {
        assert.ok(links.has(id), 'dangling output reference');
        assert.equal(links.get(id)[1], node.id, 'wrong source node');
        assert.equal(links.get(id)[2], slot, 'wrong source slot');
      }
    });
  }

  for (const link of links.values()) {
    assert.equal(link.length, 6);
    const [id, sourceId, sourceSlot, targetId, targetSlot, type] = link;
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);
    assert.ok(source && target, 'dangling node reference');
    const output = source.outputs[sourceSlot];
    const input = target.inputs[targetSlot];
    assert.ok(output && input, 'nonexistent slot');
    assert.equal(type, output.type, 'source type mismatch');
    assert.equal(type, input.type, 'target type mismatch');
    assert.ok(output.links.includes(id), 'missing source backlink');
    assert.equal(input.link, id, 'missing target backlink');
    assert.ok(source.order < target.order, 'dependency cycle or invalid execution order');
  }
}

for (const [name, denoise, count, prefix] of [
  ['01-text-to-image.json', 1, 7, 'ComfyClass/text2img'],
  ['02-image-to-image.json', 0.55, 9, 'ComfyClass/img2img']
]) {
  test(`${name}: complete core graph and teaching parameters`, () => {
    const graph = readWorkflow(name);
    validateGraph(graph);
    assert.equal(graph.nodes.length, count);
    const ofType = type => graph.nodes.filter(node => node.type === type);
    assert.equal(ofType('CheckpointLoaderSimple').length, 1);
    assert.equal(ofType('CLIPTextEncode').length, 2);
    assert.equal(ofType('KSampler').length, 1);
    assert.equal(ofType('VAEDecode').length, 1);
    assert.equal(ofType('SaveImage').length, 1);
    assert.deepEqual(ofType('CheckpointLoaderSimple')[0].widgets_values, ['SELECT_YOUR_SD15_CHECKPOINT.safetensors']);
    assert.ok(ofType('CLIPTextEncode').every(node => node.widgets_values[0].trim().length > 0));
    assert.deepEqual(ofType('KSampler')[0].widgets_values, [42, 'fixed', 20, 7, 'euler', 'normal', denoise]);
    assert.deepEqual(ofType('SaveImage')[0].widgets_values, [prefix]);
    if (denoise === 1) {
      assert.equal(ofType('EmptyLatentImage').length, 1);
      assert.deepEqual(ofType('EmptyLatentImage')[0].widgets_values, [512, 512, 1]);
    } else {
      assert.equal(ofType('EmptyLatentImage').length, 0);
      assert.equal(ofType('LoadImage').length, 1);
      assert.equal(ofType('ImageScale').length, 1);
      assert.equal(ofType('VAEEncode').length, 1);
      assert.deepEqual(ofType('LoadImage')[0].widgets_values, ['SELECT_YOUR_INPUT_IMAGE.png', 'image']);
      assert.deepEqual(ofType('ImageScale')[0].widgets_values, ['lanczos', 512, 512, 'center']);
    }
  });
}

test('03-z-image-turbo.json: split-model core graph and verified Z-Image Turbo parameters', () => {
  const graph = readWorkflow('03-z-image-turbo.json');
  validateGraph(graph);
  assert.equal(graph.nodes.length, 10);
  const ofType = type => graph.nodes.filter(node => node.type === type);
  assert.deepEqual(ofType('UNETLoader')[0].widgets_values, ['z_image_turbo_bf16.safetensors', 'default']);
  assert.deepEqual(ofType('ModelSamplingAuraFlow')[0].widgets_values, [3, 'flow']);
  assert.deepEqual(ofType('CLIPLoader')[0].widgets_values, ['qwen_3_4b.safetensors', 'lumina2', 'default']);
  assert.equal(ofType('ConditioningZeroOut').length, 1);
  assert.deepEqual(ofType('EmptySD3LatentImage')[0].widgets_values, [1024, 1024, 1]);
  assert.deepEqual(ofType('KSampler')[0].widgets_values, [42, 'fixed', 8, 1, 'res_multistep', 'simple', 1]);
  assert.deepEqual(ofType('VAELoader')[0].widgets_values, ['ae.safetensors']);
  assert.deepEqual(ofType('SaveImage')[0].widgets_values, ['ComfyClass/zimage']);
});

test('04-inpaint.json: complete native inpaint + mask preview + pixel composite graph', () => {
  const graph = readWorkflow('04-inpaint.json');
  validateGraph(graph);
  assert.equal(graph.nodes.length, 11);
  const ofType = type => graph.nodes.filter(node => node.type === type);
  assert.equal(ofType('CheckpointLoaderSimple').length, 1);
  assert.equal(ofType('LoadImage').length, 1);
  assert.equal(ofType('MaskToImage').length, 1);
  assert.equal(ofType('PreviewImage').length, 1);
  assert.equal(ofType('VAEEncodeForInpaint').length, 1);
  assert.equal(ofType('ImageCompositeMasked').length, 1);
  assert.deepEqual(ofType('VAEEncodeForInpaint')[0].widgets_values, [6]);
  assert.deepEqual(ofType('ImageCompositeMasked')[0].widgets_values, [0, 0, false]);
  assert.deepEqual(ofType('SaveImage')[0].widgets_values, ['ComfyClass/inpaint']);
});

test('05-lora-style.json: complete native LoRA model+CLIP chaining graph', () => {
  const graph = readWorkflow('05-lora-style.json');
  validateGraph(graph);
  assert.equal(graph.nodes.length, 8);
  const ofType = type => graph.nodes.filter(node => node.type === type);
  assert.equal(ofType('CheckpointLoaderSimple').length, 1);
  assert.equal(ofType('LoraLoader').length, 1);
  assert.deepEqual(ofType('LoraLoader')[0].widgets_values, ['SELECT_YOUR_SD15_LORA.safetensors', 0.8, 0.8]);
  assert.deepEqual(ofType('SaveImage')[0].widgets_values, ['ComfyClass/lora']);
});

test('validator rejects a broken backlink', () => {
  const graph = readWorkflow('01-text-to-image.json');
  graph.nodes[0].outputs[0].links = [];
  assert.throws(() => validateGraph(graph), /missing source backlink/);
});

test('validator rejects forged but internally consistent port types', () => {
  const graph = readWorkflow('01-text-to-image.json');
  graph.nodes[0].outputs[0].type = 'IMAGE';
  graph.nodes.find(node => node.type === 'KSampler').inputs[0].type = 'IMAGE';
  graph.links[0][5] = 'IMAGE';
  assert.throws(() => validateGraph(graph), /output contract/);
});

test('validator rejects a missing required input', () => {
  const graph = readWorkflow('02-image-to-image.json');
  graph.nodes.find(node => node.type === 'VAEEncode').inputs[1].link = null;
  assert.throws(() => validateGraph(graph), /not connected/);
});
