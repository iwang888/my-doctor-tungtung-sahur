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
import Logo from './components/Logo';
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
  ArrowUpRight,
  Settings,
  Check,
  Loader2,
  Eye,
  X,
  AlertCircle
} from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  thaiId: string;
  address: string;
  weight: number;
  height: number;
  bloodType: string;
  drugAllergy: string;
  chronicIllness: string;
  faceScanned: boolean;
  verified: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'สมชาย',
  lastName: 'รักดี',
  thaiId: '1-1201-99482-11-2',
  address: '991 ถ.พระรามที่ 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330',
  weight: 65,
  height: 170,
  bloodType: 'O+',
  drugAllergy: 'ไม่มีประวัติการแพ้ยา',
  chronicIllness: 'ไม่มีโรคประจำตัว',
  faceScanned: true,
  verified: true
};

const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  thaiId: '',
  address: '',
  weight: 0,
  height: 0,
  bloodType: 'O+',
  drugAllergy: '',
  chronicIllness: '',
  faceScanned: false,
  verified: false
};

export default function App() {
  const [activeSection, setActiveSection] = useState<'location' | 'consult' | 'hospitals' | 'meds' | 'nutrition' | 'homecare'>('consult');
  
  // Shared global States to support Integration rules
  const [activePrescription, setActivePrescription] = useState<Prescription | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Login & Session States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mydoctor_is_logged_in');
      return saved ? saved === 'true' : true; // Default to true for smooth first-time user experience
    } catch {
      return true;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTab, setLoginTab] = useState<'login' | 'register'>('login');

  // Login form fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form fields
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regThaiId, setRegThaiId] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regWeight, setRegWeight] = useState('65');
  const [regHeight, setRegHeight] = useState('170');
  const [regBloodType, setRegBloodType] = useState('O+');
  const [regDrugAllergy, setRegDrugAllergy] = useState('ไม่มีประวัติการแพ้ยา');
  const [regChronicIllness, setRegChronicIllness] = useState('ไม่มีโรคประจำตัว');

  // User Profile States
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const loggedIn = localStorage.getItem('mydoctor_is_logged_in') !== 'false';
      if (!loggedIn) {
        return EMPTY_PROFILE;
      }
      const saved = localStorage.getItem('mydoctor_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formFirstName, setFormFirstName] = useState(profile.firstName);
  const [formLastName, setFormLastName] = useState(profile.lastName);
  const [formThaiId, setFormThaiId] = useState(profile.thaiId);
  const [formAddress, setFormAddress] = useState(profile.address);
  const [formWeight, setFormWeight] = useState(profile.weight);
  const [formHeight, setFormHeight] = useState(profile.height);
  const [formBloodType, setFormBloodType] = useState(profile.bloodType);
  const [formDrugAllergy, setFormDrugAllergy] = useState(profile.drugAllergy);
  const [formChronicIllness, setFormChronicIllness] = useState(profile.chronicIllness);
  
  const [isSimulatingFaceScan, setIsSimulatingFaceScan] = useState(false);
  const [scanStatus, setScanStatus] = useState<'none' | 'scanning' | 'success'>('none');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync profile form when profile changes or when editing is toggled
  const startEditing = () => {
    setFormFirstName(profile.firstName);
    setFormLastName(profile.lastName);
    setFormThaiId(profile.thaiId);
    setFormAddress(profile.address);
    setFormWeight(profile.weight);
    setFormHeight(profile.height);
    setFormBloodType(profile.bloodType);
    setFormDrugAllergy(profile.drugAllergy);
    setFormChronicIllness(profile.chronicIllness);
    setScanStatus('none');
    setIsEditingProfile(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      setLoginError('กรุณากรอกข้อมูลเข้าสู่ระบบให้ครบถ้วน');
      return;
    }
    
    // Simulate successful login
    setIsLoggedIn(true);
    localStorage.setItem('mydoctor_is_logged_in', 'true');
    
    // Load existing user profile if saved, else default
    const saved = localStorage.getItem('mydoctor_user_profile');
    const userProfile = saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    setProfile(userProfile);
    
    // Reset login fields
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
    setShowLoginModal(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regPassword || !regFirstName || !regLastName) {
      setLoginError('กรุณากรอกข้อมูลส่วนตัวหลักให้ครบถ้วน');
      return;
    }

    const newProfile: UserProfile = {
      firstName: regFirstName,
      lastName: regLastName,
      thaiId: regThaiId,
      address: regAddress || 'ยังไม่ได้ระบุที่อยู่',
      weight: Number(regWeight) || 65,
      height: Number(regHeight) || 170,
      bloodType: regBloodType,
      drugAllergy: regDrugAllergy,
      chronicIllness: regChronicIllness,
      faceScanned: false,
      verified: regThaiId ? true : false
    };

    setProfile(newProfile);
    localStorage.setItem('mydoctor_user_profile', JSON.stringify(newProfile));
    
    setIsLoggedIn(true);
    localStorage.setItem('mydoctor_is_logged_in', 'true');

    // Reset register fields
    setRegUsername('');
    setRegPassword('');
    setRegFirstName('');
    setRegLastName('');
    setRegThaiId('');
    setRegAddress('');
    setRegWeight('65');
    setRegHeight('170');
    setRegBloodType('O+');
    setRegDrugAllergy('ไม่มีประวัติการแพ้ยา');
    setRegChronicIllness('ไม่มีโรคประจำตัว');
    setLoginError('');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('mydoctor_is_logged_in', 'false');
    setProfile(EMPTY_PROFILE);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      firstName: formFirstName,
      lastName: formLastName,
      thaiId: formThaiId,
      address: formAddress,
      weight: Number(formWeight) || 65,
      height: Number(formHeight) || 170,
      bloodType: formBloodType,
      drugAllergy: formDrugAllergy,
      chronicIllness: formChronicIllness,
      faceScanned: scanStatus === 'success' || profile.faceScanned,
      verified: true
    };
    setProfile(updated);
    localStorage.setItem('mydoctor_user_profile', JSON.stringify(updated));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingProfile(false);
    }, 1200);
  };

  const handleSimulateScan = () => {
    setIsSimulatingFaceScan(true);
    setScanStatus('scanning');
    setTimeout(() => {
      setScanStatus('success');
      setIsSimulatingFaceScan(false);
    }, 1800);
  };

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
      
      {(!profile.thaiId || profile.thaiId.trim() === '') && (
        <div className="bg-rose-600 text-white font-sans text-xs sm:text-sm font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 animate-pulse shadow-md relative z-50 shrink-0 border-b border-rose-700/30" id="thai-id-warning-banner">
          <AlertCircle className="w-4 h-4 shrink-0 animate-bounce text-white" />
          <span>กรุณาใส่ข้อมูลให้ครบ (ยังไม่ได้ระบุเลขบัตรประจำตัวประชาชนในประวัติเวชระเบียน)</span>
        </div>
      )}

      {/* Upper Navigation Header bar */}
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/20 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Logo />
            <span className="text-[9px] text-blue-600 font-semibold font-sans mt-0.5 ml-11 leading-none">ผู้ดูแลสุขภาพคุณ 24 ชั่วโมง</span>
          </div>

          {/* Quick status bar icons */}
          <div className="flex items-center gap-2.5">
            {/* Active prescription status notice */}
            {activePrescription && (
              <button
                onClick={handleNavigateToMedication}
                className="hidden lg:flex items-center gap-1.5 bg-rose-50/70 backdrop-blur-md text-rose-700 border border-rose-200/50 px-3 py-1 rounded-full text-[10px] font-bold font-sans animate-bounce cursor-pointer"
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

            {/* Session Management Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-white/70 border border-white/50 backdrop-blur-md rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800">
                <span className="hidden sm:inline text-slate-450 font-medium">สวัสดี</span>
                <span className="text-blue-700 font-extrabold max-w-[60px] sm:max-w-[100px] truncate">
                  คุณ{profile.firstName || 'ผู้ป่วย'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-slate-200/80 hover:bg-red-50 hover:text-red-600 px-1.5 py-0.5 rounded-md transition text-[10px] font-bold cursor-pointer"
                  id="btn-header-logout"
                >
                  ออก
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginTab('login');
                  setLoginError('');
                  setShowLoginModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-750 hover:to-indigo-750 text-white px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-md shrink-0 cursor-pointer"
                id="btn-header-login"
              >
                เข้าสู่ระบบ
              </button>
            )}

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

      {/* User Profile Banner as requested */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white pt-16 pb-6 px-6 sm:pt-20 sm:pb-8 sm:px-8 rounded-3xl mx-4 mt-6 border border-white/10 shadow-lg min-h-[300px]">
        {/* Glowing ambient background dots */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Settings/Gear Button on the Top Right */}
        {isLoggedIn && (
          <button
            onClick={() => {
              if (isEditingProfile) {
                setIsEditingProfile(false);
              } else {
                startEditing();
              }
            }}
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-200 text-white hover:text-cyan-300 shadow-md cursor-pointer text-xs font-bold"
            id="btn-edit-profile-settings"
          >
            {isEditingProfile ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4 animate-spin-slow" />}
            <span>{isEditingProfile ? 'ยกเลิก' : 'แก้ไขประวัติผู้ป่วย'}</span>
          </button>
        )}

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="relative z-10 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Settings className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-black text-white font-sans">แก้ไขประวัติเวชระเบียน & ประวัติข้อมูลผู้ป่วย</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Identity */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                  👤 ข้อมูลระบุตัวตนหลัก
                </h4>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">ชื่อจริง</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">นามสกุล</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">เลขบัตรประจำตัวประชาชน</label>
                  <input
                    type="text"
                    required
                    placeholder="x-xxxx-xxxxx-xx-x"
                    value={formThaiId}
                    onChange={(e) => setFormThaiId(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Column 2: Address */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                  🏠 ข้อมูลที่อยู่และการติดต่อ
                </h4>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">ที่อยู่อาศัยปัจจุบัน (พิกัดตรวจรพ. / นัดหมอ / สั่งยา)</label>
                  <textarea
                    required
                    rows={3}
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Face match simulated */}
                <div>
                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    disabled={isSimulatingFaceScan}
                    className="w-full py-2 px-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer text-cyan-200"
                  >
                    {isSimulatingFaceScan ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>กำลังสแกนใบหน้า...</span>
                      </>
                    ) : scanStatus === 'success' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">สแกนใบหน้าสำเร็จ!</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>สแกนใบหน้าจับคู่บัตรประชาชน</span>
                      </>
                    )}
                  </button>
                  {scanStatus === 'scanning' && (
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden relative">
                      <div className="h-full bg-cyan-400 animate-pulse w-2/3 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Health Metrics */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-1.5">
                  🩺 ข้อมูลสุขภาพและเวชศาสตร์
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-1">น้ำหนัก (kg)</label>
                    <input
                      type="number"
                      required
                      value={formWeight}
                      onChange={(e) => setFormWeight(Number(e.target.value))}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-1">ส่วนสูง (cm)</label>
                    <input
                      type="number"
                      required
                      value={formHeight}
                      onChange={(e) => setFormHeight(Number(e.target.value))}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold mb-1">กรุ๊ปเลือด</label>
                    <select
                      value={formBloodType}
                      onChange={(e) => setFormBloodType(e.target.value)}
                      className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 text-slate-200"
                    >
                      <option value="O+">O Rh+</option>
                      <option value="O-">O Rh-</option>
                      <option value="A+">A Rh+</option>
                      <option value="B+">B Rh+</option>
                      <option value="AB+">AB Rh+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">ประวัติการแพ้ยา</label>
                  <input
                    type="text"
                    value={formDrugAllergy}
                    onChange={(e) => setFormDrugAllergy(e.target.value)}
                    placeholder="เช่น ยาพาราเซตามอล ยาเพนิซิลลิน"
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1">โรคประจำตัว</label>
                  <input
                    type="text"
                    value={formChronicIllness}
                    onChange={(e) => setFormChronicIllness(e.target.value)}
                    placeholder="เช่น ความดันโลหิตสูง เบาหวาน"
                    className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saveSuccess}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>บันทึกข้อมูลและอัปเดตประวัติ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : !isLoggedIn ? (
          /* User Not Logged In View */
          <div className="relative z-10 max-w-md mx-auto flex flex-col items-center justify-center text-center py-8 px-4 space-y-6">
            <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-lg backdrop-blur-md">
              🔐
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white font-sans">กรุณาเข้าสู่ระบบเพื่อใช้งาน mydoctor</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                บันทึกและตรวจสอบประวัติการแพ้ยา ประวัติโรคประจำตัว ตำแหน่งการจัดส่งยา และการโภชนาการแบบเฉพาะบุคคล
              </p>
            </div>
            
            <div className="flex flex-col items-stretch justify-center gap-3 w-full max-w-xs mx-auto">
              <button
                onClick={() => {
                  setLoginTab('login');
                  setLoginError('');
                  setShowLoginModal(true);
                }}
                className="w-full px-6 py-2.5 bg-cyan-550 hover:bg-cyan-650 text-slate-950 rounded-xl text-xs font-black transition shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => {
                  setLoginTab('register');
                  setLoginError('');
                  setShowLoginModal(true);
                }}
                className="w-full px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                ลงทะเบียนใส่ข้อมูลส่วนตัวใหม่
              </button>
            </div>
          </div>
        ) : (
          /* Profile Display Dashboard View */
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Col: Digital Patient Card */}
            <div className="md:col-span-8 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              {/* Avatar Shield */}
              <div className="relative shrink-0 select-none">
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 rounded-2xl flex items-center justify-center text-4xl shadow-md backdrop-blur-md relative overflow-hidden">
                  👤
                  <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none"></div>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900 shadow-sm" title="ตรวจสอบความถูกต้องทางการแพทย์แล้ว">
                  ✓
                </div>
              </div>

              {/* Patient Identifications */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[9px] bg-cyan-500/30 text-cyan-200 font-extrabold uppercase border border-cyan-500/30 rounded px-2 py-0.5 font-mono tracking-wider">
                    MyDoctor Digital ID Card
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 rounded px-2 py-0.5 font-sans flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    ผ่านการยืนยันตัวตนด้วยใบหน้า (Face Scanned)
                  </span>
                </div>
                
                <div>
                  <h2 className="text-2xl font-black font-sans text-white leading-tight">
                    คุณ{profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-[11px] text-slate-300 font-mono mt-1">
                    HN: <span className="text-cyan-400 font-bold">MD-2026-9912</span> • เลขบัตรประชาชน: <span className="text-slate-200">{profile.thaiId}</span>
                  </p>
                </div>

                {/* Address block */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs leading-relaxed text-slate-300 max-w-2xl">
                  <p className="font-sans text-slate-400 font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-450" /> พิกัดจัดส่งยา & ข้อมูลที่อยู่ค้นหาโรงพยาบาล:
                  </p>
                  <p className="font-sans text-slate-100">{profile.address}</p>
                </div>
              </div>
            </div>

            {/* Right Col: Vital Health Stats & Badges */}
            <div className="md:col-span-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-cyan-300 font-sans flex items-center gap-1.5 border-b border-white/10 pb-2">
                🩺 ข้อมูลสุขภาพและระบบกายภาพ
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">น้ำหนัก</p>
                  <p className="text-sm font-black text-white font-mono mt-0.5">{profile.weight} <span className="text-[9px] font-normal text-slate-450">กก.</span></p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">ส่วนสูง</p>
                  <p className="text-sm font-black text-white font-mono mt-0.5">{profile.height} <span className="text-[9px] font-normal text-slate-450">ซม.</span></p>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">ดัชนี BMI</p>
                  <p className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                    {(profile.weight / ((profile.height / 100) ** 2)).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 space-y-2 font-sans">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">กรุ๊ปเลือด (Blood):</span>
                  <span className="font-bold text-white">{profile.bloodType}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-slate-400">ประวัติแพ้ยา (Allergies):</span>
                  <span className="font-bold text-pink-300 truncate max-w-[150px]" title={profile.drugAllergy}>{profile.drugAllergy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">โรคประจำตัว (Diseases):</span>
                  <span className="font-bold text-cyan-300 truncate max-w-[150px]" title={profile.chronicIllness}>{profile.chronicIllness}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Master 6 Features Bento/Tile Grid Selector */}
      {isLoggedIn && (
        <section className="max-w-7xl mx-auto px-4 py-8 w-full">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 font-mono">
            🎛️ บริการแผงควบคุมหลัก 6 ฟังก์ชั่น
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
      )}

      {/* Workspace Display Area for Selected Module */}
      {isLoggedIn && (
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
      )}

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

      {/* Login & Register Modal Dialog */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in" id="login-modal-overlay">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-950 to-slate-900 px-6 py-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white font-sans">
                  {loginTab === 'login' ? 'เข้าสู่ระบบเวชระเบียนหลัก' : 'ลงทะเบียนผู้ป่วยใหม่ (ประวัติเวชระเบียน)'}
                </h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="grid grid-cols-2 border-b border-white/15">
              <button
                type="button"
                onClick={() => {
                  setLoginTab('login');
                  setLoginError('');
                }}
                className={`py-3 text-center text-xs font-black transition-all cursor-pointer ${
                  loginTab === 'login'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 bg-white/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                🔑 เข้าสู่ระบบด้วยบัญชีเดิม
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginTab('register');
                  setLoginError('');
                }}
                className={`py-3 text-center text-xs font-black transition-all cursor-pointer ${
                  loginTab === 'register'
                    ? 'border-b-2 border-cyan-400 text-cyan-300 bg-white/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                📝 ลงทะเบียนใส่ข้อมูลส่วนตัวใหม่
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">ชื่อผู้ใช้งาน หรือ เบอร์โทรศัพท์</label>
                      <input
                        type="text"
                        required
                        placeholder="กรอกชื่อผู้ใช้ / เบอร์โทรศัพท์"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">รหัสผ่าน (Password)</label>
                      <input
                        type="password"
                        required
                        placeholder="กรอกรหัสผ่าน"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  </div>
                  
                  <div className="text-slate-400 text-[11px] font-sans text-center">
                    * สามารถกรอกข้อมูลจำลองใดก็ได้เพื่อทดสอบระบบล็อกอิน (เช่น ชื่อ: user, รหัสผ่าน: 1234)
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
                    >
                      เข้าสู่ระบบเวชระเบียน
                    </button>
                  </div>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="flex flex-col gap-4">
                    
                    {/* Account Info */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                        🔑 1. ข้อมูลรหัสผ่านผู้ใช้งาน
                      </h4>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">เบอร์โทรศัพท์ (ชื่อผู้ใช้)</label>
                          <input
                            type="text"
                            required
                            placeholder="08x-xxx-xxxx"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">รหัสผ่านสำหรับเข้าใช้งาน</label>
                          <input
                            type="password"
                            required
                            placeholder="อย่างน้อย 4 ตัวอักษร"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                        👤 2. ข้อมูลระบุตัวตนจริง
                      </h4>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">ชื่อจริง (ระบุเพื่อพิมพ์เอกสาร)</label>
                        <input
                          type="text"
                          required
                          placeholder="สมชาย"
                          value={regFirstName}
                          onChange={(e) => setRegFirstName(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">นามสกุล</label>
                        <input
                          type="text"
                          required
                          placeholder="รักดี"
                          value={regLastName}
                          onChange={(e) => setRegLastName(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] text-slate-400 font-bold">เลขบัตรประจำตัวประชาชน</label>
                          <span className="text-[9px] text-rose-400 font-bold">* สำคัญสำหรับการจ่ายยา</span>
                        </div>
                        <input
                          type="text"
                          placeholder="เว้นว่างได้ เพื่อจำลองสัญญานเตือน!"
                          value={regThaiId}
                          onChange={(e) => setRegThaiId(e.target.value)}
                          className="w-full bg-slate-950 border border-rose-500/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-mono placeholder-slate-600"
                        />
                        <p className="text-[9px] text-rose-300 mt-1">
                          (หากไม่ระบุ จะมีคำเตือนสีแดง "กรุณาใส่ข้อมูลให้ครบ" ปรากฏด้านบนสุดของแอปพลิเคชัน)
                        </p>
                      </div>
                    </div>

                    {/* Health Metrics & Care */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-pink-400 uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                        🩺 3. ข้อมูลสุขภาพและกายภาพ
                      </h4>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">น้ำหนัก (kg)</label>
                          <input
                            type="number"
                            value={regWeight}
                            onChange={(e) => setRegWeight(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">ส่วนสูง (cm)</label>
                          <input
                            type="number"
                            value={regHeight}
                            onChange={(e) => setRegHeight(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold mb-1">กรุ๊ปเลือด</label>
                          <select
                            value={regBloodType}
                            onChange={(e) => setRegBloodType(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 text-slate-200"
                          >
                            <option value="O+">O Rh+</option>
                            <option value="O-">O Rh-</option>
                            <option value="A+">A Rh+</option>
                            <option value="B+">B Rh+</option>
                            <option value="AB+">AB Rh+</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">ประวัติการแพ้ยา</label>
                        <input
                          type="text"
                          value={regDrugAllergy}
                          onChange={(e) => setRegDrugAllergy(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold mb-1">โรคประจำตัว</label>
                        <input
                          type="text"
                          value={regChronicIllness}
                          onChange={(e) => setRegChronicIllness(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Contact & Address info */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-sky-400 uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                        🏠 4. ที่อยู่สำหรับจัดส่งยาด่วน & ประสานงานห้องโรงพยาบาลฉุกเฉิน
                      </h4>
                      <div>
                        <textarea
                          rows={2}
                          placeholder="กรอกที่อยู่ปัจจุบันของคุณโดยละเอียด เช่น บ้านเลขที่ ซอย ถนน แขวง เขต จังหวัด..."
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
                    >
                      ลงทะเบียนและเข้าสู่ระบบ
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
