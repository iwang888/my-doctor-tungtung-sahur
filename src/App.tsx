/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Prescription, CartItem } from './types';
import LocationSection from './components/LocationSection';
import ConsultationSection from './components/ConsultationSection';
import HospitalsSection from './components/HospitalsSection';
import MedicationSection from './components/MedicationSection';
import NutritionSection from './components/NutritionSection';
import HomeCareSection from './components/HomeCareSection';
import {
  Heart,
  MapPin,
  Stethoscope,
  Compass,
  ShoppingCart,
  Calculator,
  Shield,
  LifeBuoy,
  HeartPulse,
  PhoneCall,
  UserCheck2,
  CalendarCheck2,
  ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<'location' | 'consult' | 'hospitals' | 'meds' | 'nutrition' | 'homecare'>('consult');
  
  // Shared global States to support Integration rules
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Callback to add prescription and clear/link
  const handlePrescribe = (prescription: Prescription) => {
    setActivePrescription(prescription);
  };

  const handleClearPrescription = () => {
    setActivePrescription(null);
  };

  // Switch tab and scroll to workspace
  const handleNavigateToMedication = () => {
    setActiveSection('meds');
    const el = document.getElementById('medical-workspace-heading');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Bento grids listing with quick summaries
  const SECTIONS_CONFIG = [
    {
      id: 'location',
      title: 'สถานที่ & สาขาผู้ติดต่อ',
      subtitle: 'Hospital Coordinates',
      description: 'แผนที่จำลองอัจฉริยะ สาขาสยาม สุขุมวิท พหลโยธิน และข้อมูลนำทาง',
      icon: <MapPin className="w-5 h-5" />,
      color: 'bg-emerald-500 text-white',
      hoverBorder: 'hover:border-emerald-200'
    },
    {
      id: 'consult',
      title: 'ปรึกษาและติดต่อห้องแพทย์',
      subtitle: 'Online Consultation',
      description: 'ระบบแชทแยกโรค วินิจฉัยกับกุมารแพทย์ หรือโรคทั่วไป ออกใบสั่งยาเชื่อมโยงร้านค้า',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'bg-indigo-500 text-white',
      hoverBorder: 'hover:border-indigo-200'
    },
    {
      id: 'hospitals',
      title: 'โรงพยาบาลฉุกเฉินใกล้ตัวคุณ',
      subtitle: 'Hospitals Near Me',
      description: 'เปิดใช้ตำแหน่งดาวเทียม ค้นหาพิกัดคำนวณระยะทาง และขอระบบเปิดเส้นทางจริง',
      icon: <Compass className="w-5 h-5 animate-pulse" />,
      color: 'bg-rose-500 text-white',
      hoverBorder: 'hover:border-rose-200'
    },
    {
      id: 'meds',
      title: 'เช็คยาเเละสั่งซื้อยาออนไลน์',
      subtitle: 'Medication Tracker',
      description: 'ค้นหาเวชภัณฑ์ ความต้านทานข้างเคียง ยาสามัญ คาร์บอน สัญญาณประมูลส่งด่วน 1 ชม.',
      icon: <ShoppingCart className="w-5 h-5" />,
      color: 'bg-teal-500 text-white',
      hoverBorder: 'hover:border-teal-200'
    },
    {
      id: 'nutrition',
      title: 'พยากรณ์โภชนาการตามน้ำหนัก',
      subtitle: 'Nutrition Diary',
      description: 'วิเคราะห์ดัชนี BMI พยากรณ์ TDEE การจิบน้ำที่จำเป็น พร้อมคอร์สตำรับคุมแร่ธาตุ',
      icon: <Calculator className="w-5 h-5" />,
      color: 'bg-sky-500 text-white',
      hoverBorder: 'hover:border-sky-200'
    },
    {
      id: 'homecare',
      title: 'บริบาลผู้ป่วยติดเตียงถึงบ้าน',
      subtitle: 'Bedside Caregivers',
      description: 'เชี่ยวชาญการดูแลแผลกดทับ ท่อฟีดอาหาร อัมพฤกษ์ โดยบุคลากรพยาบาลวิชาชีพ',
      icon: <Heart className="w-5 h-5 border-white" />,
      color: 'bg-slate-900 border-slate-700 text-white',
      hoverBorder: 'hover:border-slate-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-100 to-cyan-50 flex flex-col justify-between selection:bg-blue-200">
      
      {/* Upper Navigation Header bar */}
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/20 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md font-black select-none">
              🏥
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 font-sans leading-none">MyDoctor</h1>
              <span className="text-[10px] text-blue-600 font-bold font-sans">ผู้ดูแลสุขภาพคุณ 24 ชั่วโมง</span>
            </div>
          </div>

          {/* Quick status bar icons */}
          <div className="flex items-center gap-3">
            {/* Active prescription status notice */}
            {activePrescription && (
              <button
                onClick={handleNavigateToMedication}
                className="hidden sm:flex items-center gap-1.5 bg-rose-55/70 backdrop-blur-md text-rose-700 border border-rose-200/50 px-3 py-1 rounded-full text-[10px] font-bold font-sans animate-bounce cursor-pointer"
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                คุณหมอสั่งจ่ายยาให้แล้ว!
              </button>
            )}

            {/* Shopping Cart count */}
            <button
              onClick={handleNavigateToMedication}
              className="relative p-2 bg-white/60 backdrop-blur-md border border-white/55 rounded-xl hover:bg-white/85 text-slate-700 transition shadow-xs"
              id="header-cart-icon"
            >
              <ShoppingCart className="w-4 h-4 text-slate-600" />
              {cart.reduce((s, i) => s + i.quantity, 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white font-bold font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>

            {/* Direct Dial Emergency */}
            <a
              href="tel:1669"
              className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md font-sans shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" /> สายด่วน 1669
            </a>
          </div>
        </div>
      </header>

      {/* Hero Welcome banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-slate-950/90 text-white py-10 px-6 rounded-3xl mx-4 mt-6 border border-white/10 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <span className="text-[11px] bg-blue-500/30 text-blue-205 font-extrabold uppercase border border-white/10 rounded-md px-2.5 py-1 font-mono tracking-wider">
              🏥 มายด็อกเตอร์ (MyDoctor) คอนเน็กเพลส
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans leading-tight tracking-tight text-white">
              พอร์ทัลบริการด้านสุขภาพ <br className="hidden sm:inline" />
              และการแพทย์ไทยอัจฉริยะครบวงจร
            </h2>
            <p className="text-xs text-slate-300 max-w-xl font-sans leading-relaxed text-justify">
              เพื่อความสะดวกสูงสุดของคุณ เราเชื่อมโยงพฤติกรรมการอยู่อาศัย ตารางการปรึกษาร้านยาออฟฟิศ คุณหมอกุมารเวชกรรม 
              การตรวจวัดดัชนีโภชนศาสตร์ ไปจนถึงระบบจองบริบาลเพื่อผู้ป่วยติดเตียงที่ต้องการคนไปดูแลที่บ้านคุณเอง
            </p>
          </div>
          <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4 shadow-xl">
            <h4 className="text-xs font-bold text-cyan-300 font-sans flex items-center gap-1">
              🎖️ มาตรฐานการรับรองและพยาบาล
            </h4>
            <div className="text-[11px] text-slate-200 space-y-2.5 font-sans">
              <p className="flex items-start gap-1.5">
                <span className="text-cyan-400">✓</span> แหล่งรวมโรงพยาบาลชั้นนำพิกัดจริง รัฐบาลและเอกชนทั่วกรุงเทพฯ
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-cyan-400">✓</span> การจองคนดูแลและฟื้นทำกายภาพ มีการทำประวัติและการรับประกันคืนเงิน
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-cyan-400">✓</span> ดำเนินงานโดยเภสัชกรควบคุมและใบสั่งยากลุ่มพารากอนสยาม
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Master 6 Features Bento/Tile Grid Selector */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 font-mono">
          🎛️ บริการแผงควบคุมหลัก (6 ฟังก์ชั่นอัจฉริยะ)
        </h3>
        
        {/* Responsive Bento Grid representing the 6 features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="main-bento-grid">
          {SECTIONS_CONFIG.map(sec => {
            const isSelected = activeSection === sec.id;
            return (
              <div
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id as any);
                  const el = document.getElementById('medical-workspace-heading');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between backdrop-blur-md hover:-translate-y-1 ${
                  isSelected
                    ? 'bg-white/80 border-blue-400 ring-4 ring-blue-100 shadow-xl scale-[1.01]'
                    : 'bg-white/40 border-white/60 hover:bg-white/60 hover:border-blue-200 hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${sec.color} shadow-sm`}>
                      {sec.icon}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-65" />
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-slate-450 leading-none">
                      {sec.subtitle}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-850 mt-1 font-sans leading-tight">
                      {sec.title}
                    </h4>
                    <p className="text-xs text-slate-550 mt-2 font-sans leading-relaxed text-justify line-clamp-2">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/40 flex items-center justify-between text-[11px] font-bold">
                  <span className={`${isSelected ? 'text-blue-600' : 'text-slate-500'} font-sans`}>
                    {isSelected ? 'กำลังจัดแสดงในบอร์ด' : 'กดเข้าทำงานที่นี่'}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workspace Display Area for Selected Module */}
      <main className="max-w-7xl mx-auto px-4 py-4 w-full mb-12">
        <div className="mb-6 flex items-center gap-2" id="medical-workspace-heading">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          <h3 className="text-base font-extrabold text-slate-800 font-sans uppercase tracking-wide">
            แผงควบคุมงาน: {
              activeSection === 'location' ? 'สถานที่ตั้งคลินิก' :
              activeSection === 'consult' ? 'แชทประวัติและการตรวจแพทย์' :
              activeSection === 'hospitals' ? 'ตรวจพิกัดโรงพยาบาลใกล้ฉัน' :
              activeSection === 'meds' ? 'เช็คสต็อกและสปีดสั่งซื้อเวชภัณฑ์' :
              activeSection === 'nutrition' ? 'แคลอรี่ไดอารี่และเป้าจิบน้ำประจำตัว' :
              'บริบาลเพื่อผู้ป่วยติดเตียงถึงบ้าน'
            }
          </h3>
        </div>

        {/* Dynamic component routing based on selected tab */}
        <div className="animate-fade-in">
          {activeSection === 'location' && <LocationSection />}
          {activeSection === 'consult' && (
            <ConsultationSection
              onPrescribe={handlePrescribe}
              onNavigateToMedication={handleNavigateToMedication}
              activePrescription={activePrescription}
            />
          )}
          {activeSection === 'hospitals' && <HospitalsSection />}
          {activeSection === 'meds' && (
            <MedicationSection
              activePrescription={activePrescription}
              onClearPrescription={handleClearPrescription}
              cart={cart}
              setCart={setCart}
            />
          )}
          {activeSection === 'nutrition' && <NutritionSection />}
          {activeSection === 'homecare' && <HomeCareSection />}
        </div>
      </main>

      {/* Simple elegant medical Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-md text-slate-400 py-8 px-6 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-sans">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-white font-sans">© 2026 MyDoctor Inc.</h4>
            <p className="text-slate-500">บริการทางการแพทย์และการคุมโภชนาการสำหรับทุกคน มาตรฐานสาธารณสุขแห่งประเทศไทย</p>
          </div>
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <span className="text-slate-500">โทรติดต่อสำนักงานใหญ่ จันทร์ - อาทิตย์ ตลอด 24 ชม.</span>
            <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded text-cyan-400 font-mono font-bold">Hotline: 1669</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
