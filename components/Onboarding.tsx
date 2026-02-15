import React, { useState, useEffect } from 'react';

interface OnboardingProps {
  activeTab: 'chat' | 'visual' | 'library' | 'vault';
  setActiveTab: (tab: 'chat' | 'visual' | 'library' | 'vault') => void;
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to Purest Builder!",
    content: "Purest is a library for building expressive REST API clients. This agent-powered workbench helps you design, test, and export your API configurations in seconds.",
    target: "header",
    position: "center"
  },
  {
    title: "1. The AI Architect",
    content: "Our Gemini-powered agent understands natural language. Just say 'I need a client for the Stripe API' and watch it build the provider blocks for you automatically.",
    target: "tab-chat",
    position: "left"
  },
  {
    title: "2. The Visual Editor",
    content: "Need precision? Switch to the Editor to manually adjust origins, path templates, and auth headers. Every change updates the code in real-time.",
    target: "tab-visual",
    position: "left"
  },
  {
    title: "3. Shared Library",
    content: "Save your favorite builds here or start from a high-quality template. It's like a specialized Postman collection for Purest developers.",
    target: "tab-library",
    position: "left"
  },
  {
    title: "4. Live Code Preview",
    content: "This pane generates the exact JavaScript code you need. Copy-paste the 'Config JSON' or the 'Client Usage' directly into your Node.js or browser project.",
    target: "code-preview-area",
    position: "right"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ activeTab, setActiveTab, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightStyles, setSpotlightStyles] = useState<React.CSSProperties>({});

  const updateSpotlight = (stepIdx: number) => {
    const step = steps[stepIdx];
    const el = document.getElementById(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightStyles({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.85)',
        borderRadius: '8px',
        position: 'fixed',
        zIndex: 45,
        pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      });
    } else {
       setSpotlightStyles({
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.85)',
        position: 'fixed',
        zIndex: 45,
        pointerEvents: 'none'
      });
    }
  };

  useEffect(() => {
    updateSpotlight(currentStep);
    window.addEventListener('resize', () => updateSpotlight(currentStep));
    return () => window.removeEventListener('resize', () => updateSpotlight(currentStep));
  }, [currentStep, activeTab]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 1) setActiveTab('chat');
      if (next === 2) setActiveTab('visual');
      if (next === 3) setActiveTab('library');
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (prev === 1) setActiveTab('chat');
      if (prev === 2) setActiveTab('visual');
      if (prev === 3) setActiveTab('library');
    }
  };

  const step = steps[currentStep];

  return (
    <>
      {/* Spotlight Shadow Overlay */}
      <div style={spotlightStyles} className="ring-4 ring-indigo-500 ring-opacity-50" />

      {/* Floating Instruction Card */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none p-4">
        <div className="relative z-[70] w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300">
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <h4 className="text-white font-bold tracking-tight text-sm uppercase">{step.title}</h4>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStep ? 'bg-white' : 'bg-indigo-400/40'}`} 
                />
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-slate-200 text-sm leading-relaxed mb-8">
              {step.content}
            </p>

            <div className="flex items-center justify-between">
              <button 
                onClick={onComplete}
                className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Skip
              </button>
              
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <button 
                    onClick={handleBack}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
                >
                  {currentStep === steps.length - 1 ? "Start Building" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;