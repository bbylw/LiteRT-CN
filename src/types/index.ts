export type Theme = 'dark' | 'light';

export interface TelemetryMetric {
  latency: string;
  latencyUnit: string;
  memory: string;
  memoryUnit: string;
  speedup: string;
  speedupUnit: string;
  code: string;
}

export interface PipelineStep {
  id: string;
  stepNum: string;
  title: string;
  sub: string;
  detailTitle: string;
  desc: string;
  chips: string[];
  filename: string;
  codeHtml: string;
  rawCode: string;
}

export interface BenchmarkItem {
  hw: string;
  latency: string;
  val: number;
  speedup: string;
  fillClass: 'fill-npu' | 'fill-gpu' | 'fill-cpu';
}

export interface SdkSnippet {
  id: string;
  filename: string;
  language: string;
  codeHtml: string;
  rawCode: string;
}

export interface HardwareRow {
  vendor: string;
  driver: string;
  precision: string;
  platform: string;
  status: string;
  statusType: 'ok' | 'dev';
}

export interface BuildRow {
  category: string;
  platform: string;
  distribution: string;
  cycle: string;
  ciStatus: string;
}

export interface AdventureItem {
  title: string;
  description: string;
  tag: string;
  linkText: string;
  linkUrl: string;
  iconName: 'arrow' | 'play' | 'box' | 'message' | 'chip' | 'globe';
}

export interface CliCommand {
  cmd: string;
  output: string;
}
