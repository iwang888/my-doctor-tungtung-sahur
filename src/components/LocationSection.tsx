/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MY_CLINICS } from '../data';
import { MyClinic } from '../types';
import { MapPin, Phone, Clock, Landmark, Navigation, CheckCircle, ExternalLink } from 'lucide-react';

export default function LocationSection() {
  const [selectedClinic, setSelectedClinic] = useState<MyClinic>(MY_CLINICS[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyPhone = (phone: string, index: number) => {
    navigator.clipboard.writeText(phone);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600 shadow-sm">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">สถานที่ตั้งคลินิก MyDoctor & ติดต่อสอบถาม</h2>
          <p className="text-xs text-slate-500 font-sans">พร้อมแผนที่จำลองอัจฉริยะ สาขาที่เปิดให้บริการ และการนำทางด่วน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Branch Selection List */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700 mb-2 font-sans">เลือกสาขาใกล้คุณ</p>
          {MY_CLINICS.map((clinic, index) => {
            const isSelected = selectedClinic.id === clinic.id;
            return (
              <div
                key={clinic.id}
                onClick={() => setSelectedClinic(clinic)}
                className={`p-4 rounded-xl border transition-all cursor-pointer backdrop-blur-xs ${
                  isSelected
                    ? 'border-blue-400 bg-white/80 shadow-md ring-2 ring-blue-100/50'
                    : 'border-white/40 bg-white/20 hover:border-blue-200 hover:bg-white/40'
                }`}
                id={`clinic-card-${clinic.id}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-slate-800 leading-tight flex items-center gap-1.5 font-sans">
                    <Landmark className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-450'}`} />
                    {clinic.name}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${
                    isSelected ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-white/50 text-slate-650'
                  }`}>
                    {isSelected ? 'เลือกแล้ว' : 'ดูข้อมูล'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-sans">{clinic.address}</p>

                <div className="mt-3 pt-3 border-t border-white/30 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {clinic.id === 'clinic-3' ? 'วันธรรมดา 08:00 - 20:00' : 'เปิดทุกวัน 10:00 - 20:00'}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-white/25 backdrop-blur-md rounded-xl border border-white/50 mt-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 font-sans mb-1">ศูนย์รับเรื่องฉุกเฉินและประสานงานหลัก</h4>
            <p className="text-xs text-slate-500 font-sans mb-3">ต้องการบริการทางการแพทย์ด่วน ติดต่อเราได้ตลอด 24 ชม.</p>
            <div className="flex gap-2">
              <a
                href="tel:1669"
                className="flex-1 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/50 rounded-lg text-center font-bold text-xs flex justify-center items-center gap-1 font-sans shadow-xs transition-all"
              >
                สายด่วนฉุกเฉิน 1669
              </a>
              <button
                onClick={() => copyPhone('02-123-4567', 99)}
                className="flex-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-center font-bold text-xs flex justify-center items-center gap-1 font-sans cursor-pointer shadow-md transition-all"
                id="btn-copy-main-call"
              >
                {copiedIndex === 99 ? 'คัดลอกแล้ว!' : 'โทรหลัก 02-123-4567'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Map mockup & Info */}
        <div className="lg:col-span-7 flex flex-col justify-between border border-white/50 rounded-2xl p-4 bg-white/25 backdrop-blur-md shadow-xs">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 font-mono">MyDoctor Branch Spot</span>
                <h3 className="text-base font-bold text-slate-800 font-sans">{selectedClinic.name}</h3>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedClinic.latitude},${selectedClinic.longitude}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-2.5 py-1.5 bg-white/80 hover:bg-white border border-white/80 rounded-lg text-xs text-blue-605 font-bold flex items-center gap-1 transition-all shadow-sm font-sans backdrop-blur-md"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                นำทางด้วยพิกัดจริง
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-600 font-sans mb-3 bg-white/60 backdrop-blur-md p-2.5 rounded-lg border border-white/80 leading-relaxed">
              <strong>ที่อยู่:</strong> {selectedClinic.address}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div className="bg-white/60 backdrop-blur-md p-2.5 rounded-lg border border-white/80">
                <p className="text-slate-400 font-sans mb-0.5">เบอร์โทรศัพท์สาขา</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 font-mono">{selectedClinic.phone}</span>
                  <button
                    onClick={() => copyPhone(selectedClinic.phone, 1)}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    {copiedIndex === 1 ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </button>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-2.5 rounded-lg border border-white/80">
                <p className="text-slate-400 font-sans mb-0.5">เวลาทำงาน</p>
                <span className="font-bold text-slate-700 font-sans">{selectedClinic.hours}</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG map rendering based on selected branch */}
          <div className="relative h-48 bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-inner flex flex-col justify-between p-3">
            {/* Ambient Background Grid for Map Feel */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_14px]"></div>
            
            {/* Custom Interactive SVG Art Map */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width="100%" height="100%" className="w-full h-full opacity-30">
                <path d="M 0 50 Q 80 50, 160 120 T 320 180 T 480 80" fill="none" stroke="#3b82f6" strokeWidth="6" />
                <path d="M 120 0 Q 150 100, 240 120 T 360 240" fill="none" stroke="#3b82f6" strokeWidth="4" />
                <path d="M 0 160 Q 200 120, 480 160" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="160" cy="120" r="10" fill="#3b82f6" opacity="0.4" />
                <circle cx="240" cy="120" r="10" fill="#3b82f6" opacity="0.4" />
              </svg>
            </div>

            {/* Glowing Map pin positioning based on active clinic */}
            <div 
              className="absolute transition-all duration-500 ease-out flex flex-col items-center"
              style={{
                top: selectedClinic.id === 'clinic-1' ? '40%' : selectedClinic.id === 'clinic-2' ? '65%' : '15%',
                left: selectedClinic.id === 'clinic-1' ? '35%' : selectedClinic.id === 'clinic-2' ? '55%' : '45%',
              }}
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
                <div className="relative w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs">
                  🏥
                </div>
              </div>
              <div className="mt-1 bg-slate-800/90 text-[10px] text-blue-200 font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-sm font-sans text-center whitespace-nowrap">
                {selectedClinic.name.split(' ').pop()}
              </div>
            </div>

            {/* Simulated GPS Navigation bar overlay */}
            <div className="relative z-10 self-start bg-slate-900/80 backdrop-blur-md border border-white/10 text-blue-300 rounded-md px-2 py-1 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              GPS: {selectedClinic.latitude.toFixed(4)}°, {selectedClinic.longitude.toFixed(4)}°
            </div>

            <div className="relative z-10 self-end text-[10px] text-blue-300 font-mono bg-slate-950/80 backdrop-blur-sm p-1.5 rounded border border-white/10">
              📍 ศูนย์กลางกรุงเทพมหานคร ชั้นใน (รัศมีบริการ 20 กิโลเมตร)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
