import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { QuantizationLab } from './components/QuantizationLab';
import { Pipeline } from './components/Pipeline';
import { Builder } from './components/Builder';
import { Benchmarks } from './components/Benchmarks';
import { SdkWorkbench } from './components/SdkWorkbench';
import { HardwareMatrix } from './components/HardwareMatrix';
import { Adventures } from './components/Adventures';
import { CliSimulator } from './components/CliSimulator';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="portal-app">
          <Navbar />
          <main>
            <Hero />
            <Features />
            <QuantizationLab />
            <Pipeline />
            <Builder />
            <Benchmarks />
            <SdkWorkbench />
            <HardwareMatrix />
            <Adventures />
            <CliSimulator />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
