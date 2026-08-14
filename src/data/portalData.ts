import { TelemetryMetric, PipelineStep, BenchmarkItem, SdkSnippet, HardwareRow, BuildRow, AdventureItem, CliCommand } from '../types';

export const telemetryData: Record<string, TelemetryMetric> = {
  gemma: {
    latency: '42.8',
    latencyUnit: 'ms/tok',
    memory: '1.24',
    memoryUnit: 'GB',
    speedup: '7.8x',
    speedupUnit: 'NPU加速',
    code: `[LiteRT-LM Execution Trace]
Target Backend : Qualcomm Hexagon NPU (QNN)
Quantization   : INT4-AWQ (Weights) + INT8 (KV-Cache)
TTFT Latency   : 48.2 ms | Gen Rate: 23.4 tok/sec
Memory Buffer  : Zero-Copy Unified Buffer [Active]`
  },
  mobilenet: {
    latency: '2.14',
    latencyUnit: 'ms',
    memory: '18.6',
    memoryUnit: 'MB',
    speedup: '8.8x',
    speedupUnit: 'vs CPU',
    code: `[LiteRT CompiledModel Trace]
Target Backend : MediaTek Neuron NPU APU-990
Model Layout   : .tflite Static INT8 PTQ
Execution Mode : Async Non-Blocking Multi-Thread
Throughput     : 467 FPS @ 224x224 RGB [Active]`
  },
  webgpu: {
    latency: '6.30',
    latencyUnit: 'ms',
    memory: '45.2',
    memoryUnit: 'MB',
    speedup: '5.2x',
    speedupUnit: 'vs WASM',
    code: `[LiteRT.js WebEngine Trace]
Target Backend : WebGPU Direct Compute (Chrome 128+)
Memory Interop : Shared Array Buffer + GPUBuffer
Security Sand  : 100% Client-Side Private [Active]`
  }
};

export const archNodes: Record<string, PipelineStep> = {
  node1: {
    id: 'node1',
    stepNum: 'Step 01',
    title: '模型输入与定义',
    sub: 'PyTorch / HF / TF / JAX',
    detailTitle: '阶段 01: 模型定义与输入 (Input & Definition)',
    desc: '直接导入 PyTorch 原生 nn.Module、Hugging Face Transformers 的 safetensors 权重，或 TensorFlow SavedModel 与 JAX 计算图，保留原始计算拓扑。',
    chips: ['PyTorch 2.x', 'Hugging Face SafeTensors', 'TensorFlow', 'JAX FX Graph'],
    filename: '01_input_export.py',
    rawCode: `# 1. 导入 PyTorch / HuggingFace 模型定义
import torch
import ai_edge_torch

model = torch.hub.load('pytorch/vision:v0.10.0', 'mobilenet_v2', pretrained=True)
model.eval()
sample_input = (torch.randn(1, 3, 224, 224),)

edge_model = ai_edge_torch.convert(model, sample_input)
edge_model.export("mobilenet_v2.tflite")`,
    codeHtml: `<span class="cmt"># 1. 导入 PyTorch / HuggingFace 模型定义</span>
<span class="kwd">import</span> torch
<span class="kwd">import</span> ai_edge_torch

model = torch.hub.load(<span class="str">'pytorch/vision:v0.10.0'</span>, <span class="str">'mobilenet_v2'</span>, pretrained=<span class="kwd">True</span>)
model.eval()
sample_input = (torch.randn(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>),)

edge_model = ai_edge_torch.convert(model, sample_input)
edge_model.export(<span class="str">"mobilenet_v2.tflite"</span>)`
  },
  node2: {
    id: 'node2',
    stepNum: 'Step 02',
    title: '方言与格式转换',
    sub: '.tflite / .litertlm',
    detailTitle: '阶段 02: 格式与方言转换 (Dialect Converter)',
    desc: '将深度学习计算图分解并映射为 LiteRT 高性能中间方言：生成经典 CV/NLP 的紧凑 .tflite 格式，或大模型专属的 .litertlm 架构包。',
    chips: ['.tflite (经典)', '.litertlm (GenAI)', '算子方言分解', '张量重排优化'],
    filename: '02_litert_converter.py',
    rawCode: `# 2. 转换大语言模型为 .litertlm 格式
from litert_lm import convert_hf_model

convert_hf_model(
    model_id_or_path="google/gemma-2-2b-it",
    output_path="gemma-2b.litertlm",
    quantization="int4",
    kv_cache_quant="int8"
)`,
    codeHtml: `<span class="cmt"># 2. 转换大语言模型为 .litertlm 格式</span>
<span class="kwd">from</span> litert_lm <span class="kwd">import</span> convert_hf_model

convert_hf_model(
    model_id_or_path=<span class="str">"google/gemma-2-2b-it"</span>,
    output_path=<span class="str">"gemma-2b.litertlm"</span>,
    quantization=<span class="str">"int4"</span>,
    kv_cache_quant=<span class="str">"int8"</span>
)`
  },
  node3: {
    id: 'node3',
    stepNum: 'Step 03',
    title: '边缘量化优化',
    sub: 'AI-Edge Quantizer',
    detailTitle: '阶段 03: 边缘极致量化 (AI-Edge Quantizer)',
    desc: '利用 AI-Edge Quantizer 执行训练后量化 (PTQ)，支持全整型 INT8 / INT4 权重量化与动态范围压缩，体积缩减 70%+ 且保持高精度。',
    chips: ['INT8 PTQ', 'INT4 权重压缩', '动态范围量化', '精度校准验证'],
    filename: '03_quantize_ptq.py',
    rawCode: `# 3. 执行 AI-Edge 全整型 INT8 量化
import ai_edge_quantizer as quantizer

recipe = quantizer.Recipe(
    algorithm=quantizer.Algorithm.STATIC_RANGE,
    target_precision=quantizer.Precision.INT8,
    representative_dataset=calib_gen
)
quant_model = quantizer.optimize("model.tflite", recipe)
quant_model.save("model_quantized.tflite")`,
    codeHtml: `<span class="cmt"># 3. 执行 AI-Edge 全整型 INT8 量化</span>
<span class="kwd">import</span> ai_edge_quantizer <span class="kwd">as</span> quantizer

recipe = quantizer.Recipe(
    algorithm=quantizer.Algorithm.STATIC_RANGE,
    target_precision=quantizer.Precision.INT8,
    representative_dataset=calib_gen
)
quant_model = quantizer.optimize(<span class="str">"model.tflite"</span>, recipe)
quant_model.save(<span class="str">"model_quantized.tflite"</span>)`
  },
  node4: {
    id: 'node4',
    stepNum: 'Step 04',
    title: 'CompiledModel 编译',
    sub: '自动加速器选择',
    detailTitle: '阶段 04: CompiledModel 编译运行时',
    desc: '全新的 Compiled Model API 重塑执行管线：自动选择最佳加速器（NPU > GPU > CPU），免除手工 Delegate 配置，提供零拷贝 I/O 缓冲区与真异步执行。',
    chips: ['CompiledModel', '自动加速器选择', '真异步推理', '零拷贝 I/O'],
    filename: '04_compiled_runtime.py',
    rawCode: `# 4. LiteRT V2 Compiled Model 异步推理
import litert

model = litert.CompiledModel.from_file(
    "model_quantized.tflite",
    options=litert.Options(compilation_target=litert.Target.AUTO)
)

future = model.run_async(input_tensor)
result = future.get()`,
    codeHtml: `<span class="cmt"># 4. LiteRT V2 Compiled Model 异步推理</span>
<span class="kwd">import</span> litert

model = litert.CompiledModel.from_file(
    <span class="str">"model_quantized.tflite"</span>,
    options=litert.Options(compilation_target=litert.Target.AUTO)
)

future = model.run_async(input_tensor)
result = future.get()`
  },
  node5: {
    id: 'node5',
    stepNum: 'Step 05',
    title: '硬件原生执行',
    sub: 'NPU / GPU / CPU / Web',
    detailTitle: '阶段 05: 异构硬件原生执行 (Hardware Execution)',
    desc: '统一接入高通 QNN、联发科 Neuron、三星 ENN、Apple Metal、Vulkan 1.3 GPU 与 CPU XNNPack，在毫秒级延迟下释放端侧极限算力。',
    chips: ['Qualcomm QNN', 'MediaTek Neuron', 'Samsung ENN', 'ML Drift GPU', 'XNNPack CPU'],
    filename: '05_hardware_npu.cpp',
    rawCode: `// 5. C++ Native: 调用统一 NPU API 原生执行
#include "litert/c/litert_compiled_model.h"

LiteRtCompiledModel model;
LiteRtOptions opts;
LiteRtCreateOptions(&opts);
LiteRtSetTarget(opts, LITERT_TARGET_NPU);

LiteRtLoadModelFromFile("model.tflite", opts, &model);
LiteRtRunCompiledModel(model, in_buffer, out_buffer);`,
    codeHtml: `<span class="cmt">// 5. C++ Native: 调用统一 NPU API 原生执行</span>
<span class="kwd">#include</span> <span class="str">"litert/c/litert_compiled_model.h"</span>

LiteRtCompiledModel model;
LiteRtOptions opts;
LiteRtCreateOptions(&amp;opts);
LiteRtSetTarget(opts, LITERT_TARGET_NPU);

LiteRtLoadModelFromFile(<span class="str">"model.tflite"</span>, opts, &amp;model);
LiteRtRunCompiledModel(model, in_buffer, out_buffer);`
  }
};

export const benchmarkData: Record<string, BenchmarkItem[]> = {
  mobile: [
    { hw: 'Qualcomm Snapdragon 8 Gen 3 NPU (QNN)', latency: '2.14 ms', val: 95, speedup: '8.8x', fillClass: 'fill-npu' },
    { hw: 'Adreno 750 GPU (ML Drift Vulkan)', latency: '4.80 ms', val: 72, speedup: '3.9x', fillClass: 'fill-gpu' },
    { hw: 'Kryo CPU (XNNPack ARM NEON SIMD)', latency: '18.9 ms', val: 24, speedup: '1.0x (基准)', fillClass: 'fill-cpu' }
  ],
  pc: [
    { hw: 'Intel Core Ultra NPU (OpenVINO / LiteRT)', latency: '3.10 ms', val: 92, speedup: '7.2x', fillClass: 'fill-npu' },
    { hw: 'Intel Arc GPU (ML Drift DirectCompute)', latency: '5.20 ms', val: 68, speedup: '4.3x', fillClass: 'fill-gpu' },
    { hw: 'Intel x86_64 CPU (AVX-512 XNNPack)', latency: '22.4 ms', val: 20, speedup: '1.0x (基准)', fillClass: 'fill-cpu' }
  ],
  web: [
    { hw: 'LiteRT.js WebGPU Engine (Chrome 128+)', latency: '6.30 ms', val: 88, speedup: '5.4x', fillClass: 'fill-npu' },
    { hw: 'WebAssembly SIMD (WASM Multi-thread)', latency: '19.2 ms', val: 42, speedup: '1.8x', fillClass: 'fill-gpu' },
    { hw: 'Standard WebAssembly (Single thread)', latency: '34.5 ms', val: 18, speedup: '1.0x (基准)', fillClass: 'fill-cpu' }
  ]
};

export const sdkSnippets: SdkSnippet[] = [
  {
    id: 'py',
    filename: 'inference.py',
    language: 'Python',
    rawCode: `# 1. 安装 LiteRT 运行时
# uv pip install litert-nightly

import numpy as np
import litert

# 2. 编译并加载模型（Target.AUTO 自动匹配 NPU > GPU > CPU）
model = litert.CompiledModel.from_file(
    "model.tflite",
    options=litert.Options(compilation_target=litert.Target.AUTO)
)

# 3. 准备输入张量与异步执行
input_tensor = np.random.randn(1, 3, 224, 224).astype(np.float32)
future = model.run_async({"input": input_tensor})
output = future.get()

print("LiteRT 推理成功，输出维度:", output["output"].shape)`,
    codeHtml: `<span class="cmt"># 1. 安装 LiteRT 运行时</span>
<span class="cmt"># uv pip install litert-nightly</span>

<span class="kwd">import</span> numpy <span class="kwd">as</span> np
<span class="kwd">import</span> litert

<span class="cmt"># 2. 编译并加载模型（Target.AUTO 自动匹配 NPU > GPU > CPU）</span>
model = litert.CompiledModel.from_file(
    <span class="str">"model.tflite"</span>,
    options=litert.Options(compilation_target=litert.Target.AUTO)
)

<span class="cmt"># 3. 准备输入张量与异步执行</span>
input_tensor = np.random.randn(<span class="num">1</span>, <span class="num">3</span>, <span class="num">224</span>, <span class="num">224</span>).astype(np.float32)
future = model.run_async({<span class="str">"input"</span>: input_tensor})
output = future.get()

<span class="fn">print</span>(<span class="str">"LiteRT 推理成功，输出维度:"</span>, output[<span class="str">"output"</span>].shape)`
  },
  {
    id: 'cpp',
    filename: 'runtime.cpp',
    language: 'C++',
    rawCode: `// LiteRT C++ 原生 Compiled Model 与 Tensor API
#include "litert/c/litert_compiled_model.h"
#include "litert/c/litert_tensor.h"
#include <iostream>

int main() {
  LiteRtCompiledModel model;
  LiteRtOptions options;
  LiteRtCreateOptions(&options);
  
  // 启用统一 NPU 硬件加速器
  LiteRtSetTarget(options, LITERT_TARGET_NPU);
  
  if (LiteRtLoadModelFromFile("model.tflite", options, &model) == kLiteRtStatusOk) {
    std::cout << "LiteRT 模型成功编译至 NPU 引擎！" << std::endl;
    // 零拷贝缓冲区绑定与执行
    LiteRtRunCompiledModel(model, in_buffer, out_buffer);
  }
  return 0;
}`,
    codeHtml: `<span class="cmt">// LiteRT C++ 原生 Compiled Model 与 Tensor API</span>
<span class="kwd">#include</span> <span class="str">"litert/c/litert_compiled_model.h"</span>
<span class="kwd">#include</span> <span class="str">"litert/c/litert_tensor.h"</span>
<span class="kwd">#include</span> <span class="str">&lt;iostream&gt;</span>

<span class="kwd">int</span> <span class="fn">main</span>() {
  LiteRtCompiledModel model;
  LiteRtOptions options;
  LiteRtCreateOptions(&amp;options);
  
  <span class="cmt">// 启用统一 NPU 硬件加速器</span>
  LiteRtSetTarget(options, LITERT_TARGET_NPU);
  
  <span class="kwd">if</span> (LiteRtLoadModelFromFile(<span class="str">"model.tflite"</span>, options, &amp;model) == kLiteRtStatusOk) {
    std::cout &lt;&lt; <span class="str">"LiteRT 模型成功编译至 NPU 引擎！"</span> &lt;&lt; std::endl;
    <span class="cmt">// 零拷贝缓冲区绑定与执行</span>
    LiteRtRunCompiledModel(model, in_buffer, out_buffer);
  }
  <span class="kwd">return</span> <span class="num">0</span>;
}`
  },
  {
    id: 'android',
    filename: 'Classifier.kt',
    language: 'Android Kotlin',
    rawCode: `// Android Kotlin: 使用 LiteRT CompiledModel 调度 NPU/GPU 算力
import com.google.ai.edge.litert.CompiledModel
import com.google.ai.edge.litert.LiteRtOptions
import com.google.ai.edge.litert.Target

class ImageClassifier(context: Context) {
    private val options = LiteRtOptions.Builder()
        .setTarget(Target.NPU) // 优先接入高通/联发科/三星 NPU
        .build()

    private val model = CompiledModel.fromAsset(context, "mobilenet_v2.tflite", options)

    fun classify(bitmap: Bitmap): FloatArray {
        val inputBuffer = preprocess(bitmap)
        return model.run(inputBuffer)
    }
}`,
    codeHtml: `<span class="cmt">// Android Kotlin: 使用 LiteRT CompiledModel 调度 NPU/GPU 算力</span>
<span class="kwd">import</span> com.google.ai.edge.litert.CompiledModel
<span class="kwd">import</span> com.google.ai.edge.litert.LiteRtOptions
<span class="kwd">import</span> com.google.ai.edge.litert.Target

<span class="kwd">class</span> ImageClassifier(context: Context) {
    <span class="kwd">private val</span> options = LiteRtOptions.Builder()
        .setTarget(Target.NPU) <span class="cmt">// 优先接入高通/联发科/三星 NPU</span>
        .build()

    <span class="kwd">private val</span> model = CompiledModel.fromAsset(context, <span class="str">"mobilenet_v2.tflite"</span>, options)

    <span class="kwd">fun</span> classify(bitmap: Bitmap): FloatArray {
        <span class="kwd">val</span> inputBuffer = preprocess(bitmap)
        <span class="kwd">return</span> model.run(inputBuffer)
    }
}`
  },
  {
    id: 'ios',
    filename: 'InferenceEngine.swift',
    language: 'iOS Swift',
    rawCode: `// iOS Swift: 使用 LiteRT Swift 原生加速接口
import LiteRTRuntime

class EdgeInferenceEngine {
    var model: LiteRTCompiledModel?

    init() {
        guard let modelPath = Bundle.main.path(forResource: "model", ofType: "tflite") else { return }
        
        let options = LiteRTOptions()
        options.accelerator = .metalGPU // 开启 Metal ML Drift 硬件加速
        
        self.model = try? LiteRTCompiledModel(filePath: modelPath, options: options)
    }

    func infer(inputData: Data) -> Data? {
        return try? model?.run(inputData)
    }
}`,
    codeHtml: `<span class="cmt">// iOS Swift: 使用 LiteRT Swift 原生加速接口</span>
<span class="kwd">import</span> LiteRTRuntime

<span class="kwd">class</span> EdgeInferenceEngine {
    <span class="kwd">var</span> model: LiteRTCompiledModel?

    <span class="kwd">init</span>() {
        <span class="kwd">guard let</span> modelPath = Bundle.main.path(forResource: <span class="str">"model"</span>, ofType: <span class="str">"tflite"</span>) <span class="kwd">else</span> { <span class="kwd">return</span> }
        
        <span class="kwd">let</span> options = LiteRTOptions()
        options.accelerator = .metalGPU <span class="cmt">// 开启 Metal ML Drift 硬件加速</span>
        
        <span class="kwd">self</span>.model = <span class="kwd">try</span>? LiteRTCompiledModel(filePath: modelPath, options: options)
    }

    <span class="kwd">func</span> infer(inputData: Data) -&gt; Data? {
        <span class="kwd">return try</span>? model?.run(inputData)
    }
}`
  },
  {
    id: 'web',
    filename: 'webgpu.js',
    language: 'Web JS',
    rawCode: `// Web 前端: 利用 LiteRT.js 与 WebGPU 在浏览器运行端侧模型
import { LiteRtWebEngine } from "@google-ai-edge/litert";

async function runWebAI() {
  // 1. 初始化 WebGPU 硬件直连引擎
  const engine = await LiteRtWebEngine.create({
    backend: "webgpu",
    powerPreference: "high-performance"
  });

  // 2. 加载 .tflite 模型文件
  const model = await engine.loadModel("./mobilenet.tflite");

  // 3. 直接传入 HTMLVideoElement 像素数据进行实时推理
  const results = await model.predict(videoElement);
  console.log("端侧推理耗时:", results.latencyMs, "ms");
}`,
    codeHtml: `<span class="cmt">// Web 前端: 利用 LiteRT.js 与 WebGPU 在浏览器运行端侧模型</span>
<span class="kwd">import</span> { LiteRtWebEngine } <span class="kwd">from</span> <span class="str">"@google-ai-edge/litert"</span>;

<span class="kwd">async function</span> runWebAI() {
  <span class="cmt">// 1. 初始化 WebGPU 硬件直连引擎</span>
  <span class="kwd">const</span> engine = <span class="kwd">await</span> LiteRtWebEngine.create({
    backend: <span class="str">"webgpu"</span>,
    powerPreference: <span class="str">"high-performance"</span>
  });

  <span class="cmt">// 2. 加载 .tflite 模型文件</span>
  <span class="kwd">const</span> model = <span class="kwd">await</span> engine.loadModel(<span class="str">"./mobilenet.tflite"</span>);

  <span class="cmt">// 3. 直接传入 HTMLVideoElement 像素数据进行实时推理</span>
  <span class="kwd">const</span> results = <span class="kwd">await</span> model.predict(videoElement);
  console.log(<span class="str">"端侧推理耗时:"</span>, results.latencyMs, <span class="str">"ms"</span>);
}`
  }
];

export const hardwareMatrix: HardwareRow[] = [
  { vendor: 'Qualcomm Snapdragon', driver: 'Qualcomm QNN (Hexagon NPU)', precision: 'INT8 / INT4', platform: 'Android / Windows on ARM', status: '✓ 深度合作官方直连', statusType: 'ok' },
  { vendor: 'MediaTek Dimensity', driver: 'MediaTek Neuron SDK (APU)', precision: 'INT8 / INT4', platform: 'Android', status: '✓ 深度合作官方直连', statusType: 'ok' },
  { vendor: 'Samsung Exynos', driver: 'Samsung ENN Driver', precision: 'INT8 / FP16', platform: 'Android', status: '✓ 深度合作官方直连', statusType: 'ok' },
  { vendor: 'Google Tensor / Intel NPU', driver: 'Edge TPU / OpenVINO NPU', precision: 'INT8 / FP16', platform: 'Android / Linux / Windows', status: '✓ 原生支持', statusType: 'ok' },
  { vendor: 'GPU (Adreno / Mali / Apple)', driver: 'ML Drift (Vulkan 1.3 / OpenCL / Metal)', precision: 'FP16 / INT8', platform: 'Android / iOS / macOS / Linux', status: '✓ 零拷贝原生加速', statusType: 'ok' },
  { vendor: 'CPU (ARM / x86_64 / RISC-V)', driver: 'XNNPack SIMD (NEON / AVX-512)', precision: 'FP32 / FP16 / INT8', platform: '全平台跨平台支持', status: '✓ 深度算子优化', statusType: 'ok' },
  { vendor: 'Web 浏览器客户端', driver: 'LiteRT.js (WebGPU / WASM)', precision: 'FP16 / INT8', platform: 'Chrome / Edge / Safari / Firefox', status: '✓ 持续演进', statusType: 'dev' }
];

export const buildMatrix: BuildRow[] = [
  { category: 'Nightly Wheels', platform: 'Linux x86_64 / macOS arm64 / Windows x86_64', distribution: 'PyPI / uv package', cycle: '每日自动持续构建', ciStatus: '✓ Passing' },
  { category: 'CI Continuous Builds', platform: 'macOS arm64 / Linux x86_64 / Windows x86_64', distribution: 'C++ Binaries & Tests', cycle: '每次代码提交触发', ciStatus: '✓ Passing' },
  { category: 'Android 交叉编译', platform: 'CMake Android Linux x86_64 / AAR', distribution: 'Android Archive (.aar)', cycle: '每 6-8 周稳定发布', ciStatus: '✓ Passing' }
];

export const adventures: AdventureItem[] = [
  {
    title: '从 TensorFlow Lite / V1 迁移',
    description: '已有基于 TFLite 或 LiteRT V1 的存量项目？阅读官方迁移指南，平滑过渡至 V2 并享受全新 Compiled Model 性能收益。',
    tag: '迁移指南',
    linkText: '查看文档 →',
    linkUrl: 'https://ai.google.dev/edge/litert/migration',
    iconName: 'arrow'
  },
  {
    title: '开箱即用预训练模型',
    description: '在移动端快速运行图像分割、目标检测、语音识别或手势跟踪应用，获取官方示例库代码工程。',
    tag: '示例库',
    linkText: '查看 Samples →',
    linkUrl: 'https://github.com/google-ai-edge/litert-samples',
    iconName: 'play'
  },
  {
    title: 'PyTorch / HF 模型转换',
    description: '利用 LiteRT Torch (ai_edge_torch) 工具包将 PyTorch 与 Hugging Face 权重一键转换为标准 .tflite 格式。',
    tag: '转换工具',
    linkText: '查看 Torch 工具 →',
    linkUrl: 'https://github.com/google-ai-edge/litert-torch',
    iconName: 'box'
  },
  {
    title: '部署端侧大语言模型 (LLMs)',
    description: '借助 LiteRT-LM 对 Gemma、Llama、Qwen 进行 INT4 权重量化与 KV-Cache 压缩，在手机端实现流畅的生成式交互。',
    tag: 'GenAI 大模型',
    linkText: 'LiteRT-LM 仓库 →',
    linkUrl: 'https://github.com/google-ai-edge/LiteRT-LM',
    iconName: 'message'
  },
  {
    title: '深入 Compiled Model 与 NPU',
    description: '学习底层 C++ / Java / Swift 硬件加速 API，直接调动移动端 NPU 与 GPU 进行毫秒级超低延迟推理。',
    tag: '硬件加速',
    linkText: '查看 NPU 指南 →',
    linkUrl: 'https://ai.google.dev/edge/litert/next/npu',
    iconName: 'chip'
  },
  {
    title: 'Web 浏览器端侧部署',
    description: '基于 LiteRT.js 与 WebGPU 在前端浏览器中本地运行机器学习模型，实现用户隐私数据零出端的安全 AI 应用。',
    tag: 'Web 前端',
    linkText: 'LiteRT.js 文档 →',
    linkUrl: 'https://ai.google.dev/edge/litert/web',
    iconName: 'globe'
  }
];

export const cliCommands: Record<string, CliCommand> = {
  help: {
    cmd: 'litert --help',
    output: `Usage: litert [OPTIONS] COMMAND [ARGS]...

  Google AI Edge LiteRT Command-Line Interface (CLI) Toolkit.

Commands:
  convert    Convert PyTorch/TF/JAX/HF models to .tflite or .litertlm.
  quantize   Apply PTQ / INT4 / INT8 quantization recipes.
  benchmark  Profile inference latency and memory on CPU/GPU/NPU.
  info       Inspect model metadata, tensors, inputs, and outputs.
  devices    List available on-device acceleration backends.`
  },
  convert: {
    cmd: 'litert convert --input=./model.pt --output=./model.tflite --target=npu',
    output: `[LiteRT Converter] Starting conversion pipeline...
✓ Loading model definition [PyTorch FX Graph]
✓ Decomposing custom ops into LiteRT dialects
✓ Optimizing tensor layout for NPU alignment
✓ Output saved: ./model.tflite (14.2 MB)
Status: Conversion SUCCESS`
  },
  benchmark: {
    cmd: 'litert benchmark --model=./model.tflite --accelerator=npu',
    output: `[LiteRT Benchmark] Device: Qualcomm Hexagon NPU
======================================================
  Warmup Runs       : 10
  Benchmark Runs    : 100
  Inference Latency :
    - Min Latency   : 2.14 ms
    - Avg Latency   : 2.21 ms (452 FPS)
  Memory Footprint  : 28.6 MB (Zero-copy I/O enabled)
======================================================
Status: PASSED (8.8x faster vs CPU)`
  },
  devices: {
    cmd: 'litert devices',
    output: `Detected On-Device Acceleration Backends:
  [1] NPU   : Qualcomm QNN / MediaTek Neuron Backend [Ready]
  [2] GPU   : ML Drift GPU Engine (Vulkan / Metal)   [Ready]
  [3] CPU   : XNNPack SIMD Backend (NEON/AVX-512)    [Active]
  [4] Web   : LiteRT.js WebGPU / WASM Engine         [Standby]`
  }
};
