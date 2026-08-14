import React, { useState, useMemo } from 'react';
import { Copy, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

type FrameworkType = 'hf-llm' | 'pytorch' | 'tf-jax';
type PrecisionType = 'int4' | 'int8' | 'fp16';
type TargetType = 'npu' | 'gpu' | 'cpu' | 'webgpu';

export const Builder: React.FC = () => {
  const [framework, setFramework] = useState<FrameworkType>('hf-llm');
  const [precision, setPrecision] = useState<PrecisionType>('int4');
  const [target, setTarget] = useState<TargetType>('npu');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const generated = useMemo(() => {
    let raw = '';
    let html = '';

    if (framework === 'hf-llm') {
      raw = `# LiteRT-LM 大语言模型端侧转换与部署
from litert_lm import convert_hf_model, Engine

# 1. 转换并应用 ${precision.toUpperCase()} 量化
convert_hf_model(
    model_id_or_path="google/gemma-2-2b-it",
    output_path="gemma-2b-${precision}.litertlm",
    quantization="${precision}",
    kv_cache_quant="int8",
    target_backend="${target}"
)

# 2. 端侧加载 ${target.toUpperCase()} 加速执行
engine = Engine("gemma-2b-${precision}.litertlm")
for token in engine.generate_stream("请解释端侧 AI 的优势"):
    print(token, end="", flush=True)`;

      html = `<span class="cmt"># LiteRT-LM 大语言模型端侧转换与部署</span>
<span class="kwd">from</span> litert_lm <span class="kwd">import</span> convert_hf_model, Engine

<span class="cmt"># 1. 转换并应用 ${precision.toUpperCase()} 量化</span>
convert_hf_model(
    model_id_or_path=<span class="str">"google/gemma-2-2b-it"</span>,
    output_path=<span class="str">"gemma-2b-${precision}.litertlm"</span>,
    quantization=<span class="str">"${precision}"</span>,
    kv_cache_quant=<span class="str">"int8"</span>,
    target_backend=<span class="str">"${target}"</span>
)

<span class="cmt"># 2. 端侧加载 ${target.toUpperCase()} 加速执行</span>
engine = Engine(<span class="str">"gemma-2b-${precision}.litertlm"</span>)
<span class="kwd">for</span> token <span class="kwd">in</span> engine.generate_stream(<span class="str">"请解释端侧 AI 的优势"</span>):
    <span class="fn">print</span>(token, end=<span class="str">""</span>, flush=<span class="kwd">True</span>)`;
    } else if (framework === 'pytorch') {
      raw = `# PyTorch 原生模型至 LiteRT V2 编译执行
import torch
import ai_edge_torch
import litert

model = MyPyTorchVisionModel().eval()
dummy_input = (torch.randn(1, 3, 224, 224),)

# 1. 转换为 .tflite 格式
edge_model = ai_edge_torch.convert(model, dummy_input)
edge_model.export("model.tflite")

# 2. 编译并绑定 ${target.toUpperCase()} 加速后端
compiled = litert.CompiledModel.from_file(
    "model.tflite",
    options=litert.Options(compilation_target=litert.Target.${target.toUpperCase()})
)

# 3. 极速异步零拷贝推理
output = compiled.run(dummy_input[0].numpy())`;

      html = `<span class="cmt"># PyTorch 原生模型至 LiteRT V2 编译执行</span>
<span class="kwd">import</span> torch
<span class="kwd">import</span> ai_edge_torch
<span class="kwd">import</span> litert

model = MyPyTorchVisionModel().eval()
dummy_input = (torch.randn(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>),)

<span class="cmt"># 1. 转换为 .tflite 格式</span>
edge_model = ai_edge_torch.convert(model, dummy_input)
edge_model.export(<span class="str">"model.tflite"</span>)

<span class="cmt"># 2. 编译并绑定 ${target.toUpperCase()} 加速后端</span>
compiled = litert.CompiledModel.from_file(
    <span class="str">"model.tflite"</span>,
    options=litert.Options(compilation_target=litert.Target.<span class="num">${target.toUpperCase()}</span>)
)

<span class="cmt"># 3. 极速异步零拷贝推理</span>
output = compiled.run(dummy_input[<span class="num">0</span>].numpy())`;
    } else {
      // TensorFlow / JAX
      const quantCode =
        precision === 'int8'
          ? 'converter.optimizations = [tf.lite.Optimize.DEFAULT]\nconverter.representative_dataset = calib_gen'
          : 'converter.target_spec.supported_types = [tf.float16]';

      raw = `# TensorFlow / JAX 模型量化与 LiteRT 部署
import tensorflow as tf
import litert

converter = tf.lite.TFLiteConverter.from_saved_model("./saved_model")
${quantCode}
tflite_bytes = converter.convert()

with open("model.tflite", "wb") as f:
    f.write(tflite_bytes)

# 3. 部署至 ${target.toUpperCase()}
model = litert.CompiledModel.from_file("model.tflite", options=litert.Options(target="${target}"))
res = model.run(input_data)`;

      html = `<span class="cmt"># TensorFlow / JAX 模型量化与 LiteRT 部署</span>
<span class="kwd">import</span> tensorflow <span class="kwd">as</span> tf
<span class="kwd">import</span> litert

converter = tf.lite.TFLiteConverter.from_saved_model(<span class="str">"./saved_model"</span>)
${precision === 'int8' ? 'converter.optimizations = [tf.lite.Optimize.DEFAULT]\nconverter.representative_dataset = calib_gen' : 'converter.target_spec.supported_types = [tf.float16]'}
tflite_bytes = converter.convert()

<span class="kwd">with</span> <span class="fn">open</span>(<span class="str">"model.tflite"</span>, <span class="str">"wb"</span>) <span class="kwd">as</span> f:
    f.write(tflite_bytes)

<span class="cmt"># 3. 部署至 ${target.toUpperCase()}</span>
model = litert.CompiledModel.from_file(<span class="str">"model.tflite"</span>, options=litert.Options(target=<span class="str">"${target}"</span>))
res = model.run(input_data)`;
    }

    return { raw, html };
  }, [framework, precision, target]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generated.raw).then(() => {
      setCopied(true);
      showToast('配置与部署代码已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="builder" aria-label="模型转换工作台">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <SlidersHorizontal size={14} style={{ marginRight: 4 }} />
            模型转换工作台
          </div>
          <h2 className="section-title">交互式生成模型转换与端侧部署脚本</h2>
          <p className="section-description">
            自由勾选来源模型框架、量化策略与目标加速芯片，实时获取工程级 Python 转换与推理脚本。
          </p>
        </div>

        <div className="builder-layout">
          <div className="builder-controls">
            {/* Row 1: Framework */}
            <div>
              <div className="builder-group-title">1. 来源模型框架</div>
              <div className="builder-btn-matrix" role="radiogroup" aria-label="来源模型框架选择">
                <button
                  role="radio"
                  aria-checked={framework === 'hf-llm'}
                  className={`builder-select-pill ${framework === 'hf-llm' ? 'active' : ''}`}
                  onClick={() => setFramework('hf-llm')}
                >
                  Hugging Face (Gemma / Llama)
                </button>
                <button
                  role="radio"
                  aria-checked={framework === 'pytorch'}
                  className={`builder-select-pill ${framework === 'pytorch' ? 'active' : ''}`}
                  onClick={() => setFramework('pytorch')}
                >
                  PyTorch (FX Graph)
                </button>
                <button
                  role="radio"
                  aria-checked={framework === 'tf-jax'}
                  className={`builder-select-pill ${framework === 'tf-jax' ? 'active' : ''}`}
                  onClick={() => setFramework('tf-jax')}
                >
                  TensorFlow / JAX
                </button>
              </div>
            </div>

            {/* Row 2: Precision */}
            <div>
              <div className="builder-group-title">2. 量化与精度策略</div>
              <div className="builder-btn-matrix" role="radiogroup" aria-label="量化精度选择">
                <button
                  role="radio"
                  aria-checked={precision === 'int4'}
                  className={`builder-select-pill ${precision === 'int4' ? 'active' : ''}`}
                  onClick={() => setPrecision('int4')}
                >
                  INT4-AWQ + INT8 KV-Cache (推荐)
                </button>
                <button
                  role="radio"
                  aria-checked={precision === 'int8'}
                  className={`builder-select-pill ${precision === 'int8' ? 'active' : ''}`}
                  onClick={() => setPrecision('int8')}
                >
                  INT8 全整型 PTQ (CV / NLP)
                </button>
                <button
                  role="radio"
                  aria-checked={precision === 'fp16'}
                  className={`builder-select-pill ${precision === 'fp16' ? 'active' : ''}`}
                  onClick={() => setPrecision('fp16')}
                >
                  FP16 半精度浮点
                </button>
              </div>
            </div>

            {/* Row 3: Target */}
            <div>
              <div className="builder-group-title">3. 目标加速硬件</div>
              <div className="builder-btn-matrix" role="radiogroup" aria-label="目标硬件选择">
                <button
                  role="radio"
                  aria-checked={target === 'npu'}
                  className={`builder-select-pill ${target === 'npu' ? 'active' : ''}`}
                  onClick={() => setTarget('npu')}
                >
                  Snapdragon NPU (QNN)
                </button>
                <button
                  role="radio"
                  aria-checked={target === 'gpu'}
                  className={`builder-select-pill ${target === 'gpu' ? 'active' : ''}`}
                  onClick={() => setTarget('gpu')}
                >
                  ML Drift GPU (Vulkan / Metal)
                </button>
                <button
                  role="radio"
                  aria-checked={target === 'cpu'}
                  className={`builder-select-pill ${target === 'cpu' ? 'active' : ''}`}
                  onClick={() => setTarget('cpu')}
                >
                  XNNPack CPU
                </button>
                <button
                  role="radio"
                  aria-checked={target === 'webgpu'}
                  className={`builder-select-pill ${target === 'webgpu' ? 'active' : ''}`}
                  onClick={() => setTarget('webgpu')}
                >
                  LiteRT.js WebGPU
                </button>
              </div>
            </div>
          </div>

          {/* Code View */}
          <div className="code-editor-card">
            <div className="code-editor-head">
              <div className="traffic-dots">
                <div className="traffic-dot dot-1"></div>
                <div className="traffic-dot dot-2"></div>
                <div className="traffic-dot dot-3"></div>
              </div>
              <span className="editor-filename">build_and_deploy.py</span>
              <button
                className="btn-code-copy-flat"
                onClick={handleCopy}
                aria-label="复制代码"
                title="复制代码"
              >
                {copied ? <Check size={12} strokeWidth={2.5} color="#34d399" /> : <Copy size={12} />}
                <span>{copied ? '已复制' : '复制代码'}</span>
              </button>
            </div>
            <pre className="editor-pre" tabIndex={0} aria-label="转换与部署代码预览">
              <code dangerouslySetInnerHTML={{ __html: generated.html }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
