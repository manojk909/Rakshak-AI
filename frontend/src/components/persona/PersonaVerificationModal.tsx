'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Shield, X, Upload, Camera, CheckCircle, Loader2,
  AlertTriangle, Fingerprint, ScanFace, FileCheck,
} from 'lucide-react';

interface PersonaVerificationModalProps {
  referenceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type Step = 'intro' | 'id-upload' | 'selfie' | 'processing' | 'success' | 'error';

const STEP_CONFIG = {
  'intro': { title: 'Identity Verification', icon: Shield, color: '#ccff00' },
  'id-upload': { title: 'Upload Government ID', icon: Upload, color: '#3b82f6' },
  'selfie': { title: 'Selfie Verification', icon: ScanFace, color: '#8b5cf6' },
  'processing': { title: 'Verifying Identity', icon: Loader2, color: '#f59e0b' },
  'success': { title: 'Verification Complete', icon: CheckCircle, color: '#22c55e' },
  'error': { title: 'Verification Failed', icon: AlertTriangle, color: '#ef4444' },
};

export default function PersonaVerificationModal({
  referenceId,
  onSuccess,
  onCancel,
}: PersonaVerificationModalProps) {
  const [step, setStep] = useState<Step>('intro');
  const [inquiryId, setInquiryId] = useState<string>('');
  const [progress, setProgress] = useState(0);

  // Create inquiry on mount
  useEffect(() => {
    const createInquiry = async () => {
      try {
        const res = await fetch('/api/persona/create-inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference_id: referenceId, name: 'Officer' }),
        });
        const data = await res.json();
        setInquiryId(data.inquiry_id || '');
      } catch {
        // Silently continue — demo mode doesn't need the API
        setInquiryId(`inq_demo_${Date.now()}`);
      }
    };
    createInquiry();
  }, [referenceId]);

  // Processing animation
  useEffect(() => {
    if (step !== 'processing') return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [step]);

  // Auto-advance from processing to success
  useEffect(() => {
    if (step === 'processing' && progress >= 100) {
      const timer = setTimeout(async () => {
        // Mark verification complete in backend
        try {
          await fetch('/api/persona/demo-complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference_id: referenceId, inquiry_id: inquiryId }),
          });
        } catch {
          // Continue anyway — localStorage will persist state
        }
        localStorage.setItem('rakshak_officer_verified', 'true');
        localStorage.setItem('rakshak_officer_verified_at', new Date().toISOString());
        setStep('success');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, progress, referenceId, inquiryId]);

  const handleStartVerification = useCallback(() => setStep('id-upload'), []);
  const handleIdUploaded = useCallback(() => setStep('selfie'), []);
  const handleSelfieComplete = useCallback(() => setStep('processing'), []);
  const handleDone = useCallback(() => onSuccess(), [onSuccess]);

  const config = STEP_CONFIG[step];
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#0a0a0a] border border-white/20 rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}40` }}
            >
              <Icon
                className={`w-5 h-5 ${step === 'processing' ? 'animate-spin' : ''}`}
                style={{ color: config.color }}
              />
            </div>
            <div>
              <p className="font-bold text-sm">{config.title}</p>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                Persona IDV · Sandbox
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Step: Intro */}
          {step === 'intro' && (
            <div className="space-y-5">
              <p className="text-white/70 text-sm leading-relaxed">
                As part of the MHA Cyber Intelligence Unit security protocol, all operators
                must verify their identity before accessing classified intelligence systems.
              </p>
              <div className="space-y-3">
                {[
                  { icon: FileCheck, label: 'Government-issued Photo ID', desc: 'Aadhaar, PAN, Passport, or Driving License' },
                  { icon: ScanFace, label: 'Live Selfie Verification', desc: 'Real-time face match against your ID' },
                  { icon: Fingerprint, label: 'Biometric Confidence Score', desc: 'AI-powered liveness detection' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <item.icon className="w-5 h-5 text-[#ccff00] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs text-amber-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  Powered by Persona (withpersona.com) · Sandbox Mode · No real data is collected
                </p>
              </div>
              <button
                onClick={handleStartVerification}
                className="w-full bg-[#ccff00] text-black font-bold py-3 rounded-xl hover:bg-[#ccff00]/90 transition-colors text-sm"
              >
                Begin Verification
              </button>
            </div>
          )}

          {/* Step: ID Upload */}
          {step === 'id-upload' && (
            <div className="space-y-5">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-[#ccff00]/50 transition-colors cursor-pointer"
                onClick={handleIdUploaded}
              >
                <Upload className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Upload Government ID</p>
                <p className="text-xs text-white/40">Click to select or drag & drop</p>
                <p className="text-[10px] text-white/30 mt-2">Aadhaar · PAN · Passport · Driving License</p>
              </div>
              <p className="text-[10px] text-center text-white/30 font-mono">
                DEMO: Click the upload area to simulate ID capture
              </p>
            </div>
          )}

          {/* Step: Selfie */}
          {step === 'selfie' && (
            <div className="space-y-5">
              <div className="relative bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-8 text-center">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#ccff00]/30 flex items-center justify-center mb-4 relative">
                  <Camera className="w-12 h-12 text-white/40" />
                  <div className="absolute inset-0 rounded-full border-4 border-[#ccff00] animate-pulse" />
                </div>
                <p className="text-sm font-medium mb-1">Position your face in the circle</p>
                <p className="text-xs text-white/40">Ensure good lighting and a neutral expression</p>
              </div>
              <button
                onClick={handleSelfieComplete}
                className="w-full bg-[#ccff00] text-black font-bold py-3 rounded-xl hover:bg-[#ccff00]/90 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" /> Capture Selfie
              </button>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-[#ccff00] mx-auto animate-spin mb-4" />
                <p className="text-sm font-medium mb-1">Analyzing documents...</p>
                <p className="text-xs text-white/40">Cross-referencing with government databases</p>
              </div>
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ccff00] rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>Processing</span>
                  <span>{progress}%</span>
                </div>
              </div>
              {/* Processing steps */}
              <div className="space-y-2">
                {[
                  { label: 'Document authenticity', done: progress > 25 },
                  { label: 'Face matching', done: progress > 50 },
                  { label: 'Liveness detection', done: progress > 75 },
                  { label: 'Database verification', done: progress >= 100 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    )}
                    <span className={item.done ? 'text-white/80' : 'text-white/30'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-green-400 mb-1">Identity Verified</p>
                <p className="text-sm text-white/60">
                  Your identity has been verified successfully via Persona IDV.
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Reference ID</span>
                  <span className="font-mono text-[#ccff00]">{referenceId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Inquiry ID</span>
                  <span className="font-mono">{inquiryId.slice(0, 20)}...</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Verified At</span>
                  <span className="font-mono">{new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40">Provider</span>
                  <span className="font-mono">Persona · Sandbox</span>
                </div>
              </div>
              <button
                onClick={handleDone}
                className="w-full bg-[#ccff00] text-black font-bold py-3 rounded-xl hover:bg-[#ccff00]/90 transition-colors text-sm"
              >
                Continue to Dashboard
              </button>
            </div>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <div className="space-y-5 text-center py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-red-400 mb-1">Verification Failed</p>
                <p className="text-sm text-white/60">
                  Unable to verify your identity. Please try again or contact your supervisor.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('intro')}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 bg-red-600/80 hover:bg-red-600 font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step indicator */}
        {!['success', 'error'].includes(step) && (
          <div className="px-6 pb-4 flex justify-center gap-2">
            {['intro', 'id-upload', 'selfie', 'processing'].map((s, i) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all ${
                  s === step ? 'w-8 bg-[#ccff00]' :
                  ['intro', 'id-upload', 'selfie', 'processing'].indexOf(step) > i ? 'w-4 bg-[#ccff00]/40' :
                  'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
