import React from 'react';
import { Award, ShieldCheck, Heart, TrendingUp, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="w-12 h-12 bg-teal-500 text-slate-950 rounded-2xl mx-auto flex items-center justify-center font-bold shadow-md">
          <Award className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About VETEREN</h1>
        <p className="text-lg text-teal-700 font-semibold">Experience Never Retires.</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          VETEREN is a dedicated online marketplace designed to connect retired professionals, senior consultants, and experienced educators with individuals, startups, and organizations seeking domain wisdom.
        </p>
      </div>

      {/* Mission & Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Social Opportunity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Retirement should not mean the end of purpose or active engagement. VETEREN empowers experienced professionals to remain financially independent, share decades of learning, and stay socially connected.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 bg-sky-50 text-sky-700 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">Economic Opportunity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Startups and SMEs often cannot afford full-time C-suite executives or senior architects. VETEREN provides affordable access to fractional senior expertise on an hourly or advisory project basis.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6">
        <h3 className="text-xl font-extrabold text-center text-teal-300">VETEREN Brand Principles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
            <h4 className="font-bold text-sm text-white">Trustworthy</h4>
            <p className="text-[11px] text-slate-400 mt-1">Verified credentials</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
            <h4 className="font-bold text-sm text-white">Professional</h4>
            <p className="text-[11px] text-slate-400 mt-1">High service standards</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
            <h4 className="font-bold text-sm text-white">Welcoming</h4>
            <p className="text-[11px] text-slate-400 mt-1">Senior-friendly UI</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
            <h4 className="font-bold text-sm text-white">Accessible</h4>
            <p className="text-[11px] text-slate-400 mt-1">Simple transparent flows</p>
          </div>
        </div>
      </div>

    </div>
  );
};
