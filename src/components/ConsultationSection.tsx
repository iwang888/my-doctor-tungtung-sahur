/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS, DOCTORS, MEDICATIONS } from '../data';
import { Department, Doctor, Prescription, Medication } from '../types';
import {
  Brain,
  Baby,
  Heart,
  Sparkles,
  Stethoscope,
  ChevronRight,
  User,
  Star,
  MessageSquare,
  Calendar,
  Send,
  Loader2,
  FileText,
  AlertCircle,
  ArrowRight,
  Check
} from 'lucide-react';

interface ConsultationSectionProps {
  onPrescribe: (prescription: Prescription) => void;
  onNavigateToMedication: () => void;
  activePrescription: Prescription | null;
}

interface ChatMessage {
  sender: 'user' | 'doctor';
  text: string;
  time: string;
}

export default function ConsultationSection({
  onPrescribe,
  onNavigateToMedication,
  activePrescription
}: ConsultationSectionProps) {
  const [selectedDept, setSelectedDept] = useState<Department>(DEPARTMENTS[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingMode, setBookingMode] = useState<'consult' | 'appointment' | null>(null);
  
  // Book Appointment States
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [appointmentSuccess, setAppointmentSuccess] = useState<boolean>(false);

  // Chat Simulation States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [prescriptionFormShow, setPrescriptionFormShow] = useState<boolean>(false);
  const [prescribedMed, setPrescribedMed] = useState<Medication | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Map icon strings to actual lucide components dynamically
  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Stethoscope className="w-5 h-5" />;
    }
  };

  // Filter doctors by selected department
  const filteredDoctors = DOCTORS.filter(d => d.departmentId === selectedDept.id);

  // Handle department change - reset selected doctor to first one in list
  useEffect(() => {
    setSelectedDoctor(filteredDoctors[0] || null);
    setBookingMode(null);
    setAppointmentSuccess(false);
  }, [selectedDept]);

  // Handle Chat Initial Trigger
  const startConsultation = () => {
    if (!selectedDoctor) return;
    setBookingMode('consult');
    setStep(1);
    setChatMessages([
      {
        sender: 'doctor',
        text: `สวัสดีค่ะ/ครับ ยินดีต้อนรับสู่บริการคลินิกออนไลน์ MyDoctor ผม/ดิฉัน ${selectedDoctor.name} จาก${selectedDept.name} ยินดีให้บริการค่ะ วันนี้คุณคนไข้มีอาการหรือไม่สบายตรงไหนบ้างคะ? เล่าอาการเบื้องต้นให้หมอฟังได้เลยครับ`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setPrescriptionFormShow(false);
    
    // Find possible med for this doctor
    if (selectedDoctor.recommendedMedicineIds && selectedDoctor.recommendedMedicineIds.length > 0) {
      const match = MEDICATIONS.find(m => m.id === selectedDoctor.recommendedMedicineIds![0]);
      setPrescribedMed(match || MEDICATIONS[0]);
    } else {
      setPrescribedMed(MEDICATIONS[0]);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !selectedDoctor) return;

    const userMsgText = userInput;
    const userMsg: ChatMessage = {
      sender: 'user',
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsTyping(true);

    // Simulate doctor thinking and automatic responsive followups
    setTimeout(() => {
      setIsTyping(false);
      let reply = '';
      let nextStep = step + 1;

      if (step === 1) {
        reply = `ขอบคุณสำหรับข้อมูลเบื้องต้นครับ หมอขอทราบรายละเอียดเพิ่มเติมอีกนิดหน่อย มีอาการนี้มานานกี่วันแล้วครับ? และมีโรคประจำตัว ยาที่ใช้ประจำ หรือมีอาการแพ้ยาใดๆ ที่ต้องระวังหรือไม่ครับ?`;
      } else if (step === 2) {
        reply = `เข้าใจแล้วครับ จากลักษณะอาการที่คุณเล่ามา หมอประเมินว่ามีความจำเป็นต้องใช้ยารักษาชั่วคราวเพื่อบรรเทาอาการ หากสะดวก หมอจะขออนุญาตทำการสั่งจ่ายยา "${prescribedMed?.name} (${prescribedMed?.thaiName})" เพื่อบรรเทาอาการเบื้องต้น และขอนัดติดตามผลด้วยดีไหมครับ?`;
        setPrescriptionFormShow(true);
      } else {
        reply = `สำหรับการประเมินเพิ่มเติม แนะนำให้ดื่มน้ำอุ่นๆ นอนหลับพักผ่อนประคองร่างกายอย่างน้อย 8 ชั่วโมง และหมอขอแนะนำให้รับประทานยาตามที่หมอระบุไว้ในใบสั่งยาระดับดิจิทัลอย่างเคร่งครัดนะครับ หากอาการยังไม่ดีขึ้นใน 3 วัน แนะนำให้เดินทางมาตรวจร่างกายที่คลินิกสาขาสยามหรือพญาไทเลยครับ`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'doctor',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setStep(nextStep);
    }, 1200);
  };

  const executePrescribe = () => {
    if (!selectedDoctor || !prescribedMed) return;

    const newPrescription: Prescription = {
      doctorName: selectedDoctor.name,
      departmentName: selectedDept.name,
      date: new Date().toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }),
      medications: [
        {
          medicationId: prescribedMed.id,
          name: prescribedMed.name,
          dosage: prescribedMed.dosage,
          quantity: 1
        }
      ],
      notes: 'รับประทานตามคำแนะนำแพทย์ข้างต้นร่วมกับการดื่มน้ำสะอาดในปริมาณเพียงพอต่อร่างกาย',
      status: 'pending'
    };

    onPrescribe(newPrescription);
    
    // Add positive doctor system chat confirmation
    setChatMessages(prev => [...prev, {
      sender: 'doctor',
      text: `✅ หมอได้ทำการออกใบสั่งยาอิเล็กทรอนิกส์ให้กับคุณเรียบร้อยแล้ว! รายละเอียดปรากฏอยู่ตรงแผงใบสั่งยาด้านล่าง คุณสามารถกดยืนยันเพื่อบันทึกและส่งข้อมูลยาตรงไปยังแผนก "เช็คยาและสั่งซื้อ" เพื่อทำรายการสั่งซื้อและจองรับยาได้ทันทีเลยครับ ขอให้หายไวๆ นะครับ`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setPrescriptionFormShow(false);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime) return;
    setAppointmentSuccess(true);
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600 shadow-sm">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">ติดต่อจองคิว & ปรึกษาหมอออนไลน์</h2>
            <p className="text-xs text-slate-500 font-sans">เลือกแผนก คุยกับคุณหมอทันที พร้อมระบบใบสั่งยาเชื่อมโยงร้านยาอัตโนมัติ</p>
          </div>
        </div>

        {/* Global Prescription Status Banner */}
        {activePrescription && (
          <div className="bg-teal-50/80 backdrop-blur-md border border-teal-200/50 rounded-xl p-3 flex items-center justify-between gap-4 max-w-sm shadow-xs animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse shrink-0"></span>
              <div className="text-xs">
                <p className="font-bold text-teal-800 font-sans">คุณมีใบสั่งยานำจ่ายที่รอซื้อ!</p>
                <p className="text-slate-500 font-mono text-[10px]">{activePrescription.medications[0].name}</p>
              </div>
            </div>
            <button
              onClick={onNavigateToMedication}
              className="text-xs bg-teal-600 text-white hover:bg-teal-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 font-sans transition-all cursor-pointer shadow-sm"
            >
              สั่งเลย <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Grid of choosing doctors */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Department & Doctor selector */}
        <div className="xl:col-span-5 space-y-5">
          {/* Dept Carousel/Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block font-sans">1. เลือกแผนกบริการคลินิก</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-2">
              {DEPARTMENTS.map(dept => {
                const isSelected = selectedDept.id === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-xs ${
                      isSelected
                        ? 'border-indigo-500 bg-white/80 shadow-md text-indigo-900 font-semibold ring-2 ring-indigo-200/50'
                        : 'border-white/40 bg-white/20 hover:border-indigo-200 hover:bg-white/45 text-slate-600'
                    }`}
                    id={`dept-tab-${dept.id}`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white/60 text-slate-500 border border-white/40'}`}>
                      {getDeptIcon(dept.icon)}
                    </div>
                    <div>
                      <p className="text-xs font-bold font-sans">{dept.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono leading-none">{dept.englishName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctors List in Selected Dept */}
          <div>
            <label className="text-xs font-bold text-slate-600 mb-2 block font-sans">2. เลือกเกียรติประวัติแพทย์</label>
            <div className="space-y-2">
              {filteredDoctors.map(doc => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setBookingMode(null);
                      setAppointmentSuccess(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 backdrop-blur-xs ${
                      isSelected
                        ? 'border-blue-400 bg-white/80 shadow-md ring-2 ring-blue-100/50 font-bold'
                        : 'border-white/40 bg-white/20 hover:border-blue-300 hover:bg-white/45'
                    }`}
                    id={`doc-card-${doc.id}`}
                  >
                    <div className="text-3xl bg-white/80 w-11 h-11 rounded-full flex items-center justify-center border border-white shrink-0 select-none shadow-xs">
                      {doc.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-xs text-slate-800 truncate font-sans leading-tight">{doc.name}</h4>
                        <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span className="text-[10px] font-bold font-mono">{doc.rating}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-teal-600 font-semibold truncate font-sans mt-0.5">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">ประวัติ: {doc.experience} ปี • คิวว่าง {doc.availability.join(', ')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction viewport */}
        <div className="xl:col-span-7 bg-white/25 backdrop-blur-md rounded-2xl border border-white/50 p-5 flex flex-col justify-between min-h-[460px] shadow-inner">
          {selectedDoctor ? (
            <>
              {/* Doctor Header Intro */}
              {!bookingMode && (
                <div className="h-full flex flex-col justify-between" id="doc-booking-choices">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl bg-indigo-50/70 border border-indigo-100 w-16 h-16 rounded-full flex items-center justify-center select-none shadow-sm">
                        {selectedDoctor.image}
                      </div>
                      <div>
                        <span className="text-[10px] bg-indigo-100 text-indigo-805 font-bold px-2 py-0.5 rounded-md font-sans">
                          {selectedDept.name}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 font-sans">{selectedDoctor.name}</h3>
                        <p className="text-xs text-slate-500 font-bold font-sans">{selectedDoctor.title}</p>
                      </div>
                    </div>

                    <div className="bg-white/65 backdrop-blur-md p-4 rounded-xl border border-white/80 space-y-3 shadow-xs mb-4">
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-400 font-sans uppercase">วุฒิการศึกษาและภูมิหลัง</h5>
                        <p className="text-xs text-slate-700 font-bold mt-1 font-sans leading-relaxed">{selectedDoctor.education}</p>
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-400 font-sans uppercase">ข้อมูลส่วนตัวแพทย์</h5>
                        <p className="text-xs text-slate-600 mt-1 font-sans leading-relaxed text-justify">{selectedDoctor.bio}</p>
                      </div>
                    </div>

                    {/* Integrated medication tip */}
                    {prescribedMed && (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-slate-700 backdrop-blur-md">
                        <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-800 font-sans">ตารางยาระบุแผนกเวชภัณฑ์</p>
                          <p className="text-slate-600 font-sans mt-0.5">
                            แพทย์มีสิทธิออกใบสั่งยาแก้ขัดตามแผนก: <strong>{prescribedMed.name}</strong> ({prescribedMed.thaiName}) ชนิดเติมสต็อกพร้อมสั่งซื้อทันที
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={startConsultation}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex justify-center items-center gap-2 shadow-md cursor-pointer transition-all active:scale-[0.98]"
                      id="btn-start-chat-consult"
                    >
                      <MessageSquare className="w-4 h-4" /> ปรึกษาคุณหมอผ่านแชททันที
                    </button>
                    <button
                      onClick={() => { setBookingMode('appointment'); setAppointmentSuccess(false); }}
                      className="flex-1 py-3 bg-white/85 hover:bg-white text-slate-705 border border-white/85 rounded-xl font-bold text-xs flex justify-center items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-[0.98] backdrop-blur-md"
                      id="btn-book-appointment-calendar"
                    >
                      <Calendar className="w-4 h-4" /> จองคิวนัดตรวจล่วงหน้า
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Consultation Mode */}
              {bookingMode === 'consult' && (
                <div className="flex flex-col h-full justify-between gap-4" id="consult-chat-board">
                  {/* Doctor Mini Widget */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/40 bg-white/65 backdrop-blur-md p-3 rounded-xl shadow-xs animate-fade-in">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl bg-blue-600/10 w-8 h-8 rounded-full flex items-center justify-center border border-white/40 select-none">
                        {selectedDoctor.image}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 font-sans">{selectedDoctor.name}</h4>
                        <p className="text-[9px] text-teal-600 font-semibold font-sans">กำลังปรึกษาออนไลน์ (ห้องแชทจำลอง)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingMode(null)}
                      className="text-[10px] bg-white/70 hover:bg-white text-slate-600 px-2 py-1 rounded font-bold border border-white/50 backdrop-blur-sm"
                    >
                      ย้อนกลับ
                    </button>
                  </div>

                  {/* Message Bubble Stream */}
                  <div className="flex-1 overflow-y-auto max-h-[240px] pr-2 space-y-3 py-1 bg-white/65 backdrop-blur-md p-3 rounded-xl border border-white/65 shadow-inner">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none shadow-xs'
                        }`}>
                          <p className="font-sans whitespace-pre-line">{msg.text}</p>
                          <span className={`text-[8px] block text-right mt-1 font-mono ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white/75 backdrop-blur-sm text-slate-500 rounded-xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1 border border-white/60">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                          <span>กำลังประเมินอาการ...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Prescription Prompt Overlay to demonstrate Feature Integration */}
                  {prescriptionFormShow && (
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-650 text-white rounded-xl shadow-lg space-y-2 animate-fade-in border border-white/20">
                      <div className="flex items-start gap-1.5 justify-between">
                        <div className="flex gap-2 items-center">
                          <FileText className="w-4 h-4 text-teal-100" />
                          <h5 className="text-xs font-bold font-sans">ส่งใบสั่งยาด่วน (Digital Prescription)</h5>
                        </div>
                        <span className="text-[9px] bg-indigo-700/80 backdrop-blur-sm font-bold px-1.5 py-0.5 rounded uppercase font-mono border border-white/10">Special Link</span>
                      </div>
                      <p className="text-[10px] text-teal-50 line-clamp-2">
                        ผู้ป่วยมีสิทธิ์รับ: <strong>{prescribedMed?.name}</strong> ราคา {prescribedMed?.price} บาท เพื่อช่วยบรรเทาอาการตรงตัว เชื่อมโยงเข้าหน้าระบบร้านค้าทันที
                      </p>
                      <button
                        onClick={executePrescribe}
                        className="w-full bg-white text-blue-700 hover:bg-white/95 font-bold text-xs py-1.5 rounded-lg text-center transition-all cursor-pointer font-sans shadow-sm"
                      >
                        อนุมัติและออกใบสั่งยาอัตโนมัติ 📝
                      </button>
                    </div>
                  )}

                  {/* Send Input Bar */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      placeholder="เล่าอาการของคุณ เช่น ปวดหัว, ตัวร้อน, มีผื่นคัน..."
                      className="flex-1 bg-white/80 backdrop-blur-sm border border-white/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-sans shadow-xs"
                    />
                    <button
                      type="submit"
                      disabled={!userInput.trim() || isTyping}
                      className="p-2.5 bg-blue-600 disabled:bg-slate-300 text-white hover:bg-blue-700 border border-white/20 rounded-xl flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* Book Appointment Mode */}
              {bookingMode === 'appointment' && (
                <div className="h-full flex flex-col justify-between" id="appointment-booking-form">
                  <div className="flex items-center justify-between pb-3 border-b border-white/40 bg-white/65 backdrop-blur-md p-3 rounded-xl shadow-xs mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl bg-indigo-50/70 w-8 h-8 rounded-full flex items-center justify-center border border-white/40 shadow-xs">
                        📅
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 font-sans">ลงทะเบียนนัดล่วงหน้า</h4>
                        <p className="text-[9px] text-indigo-600 font-semibold font-sans">{selectedDoctor.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingMode(null)}
                      className="text-[10px] bg-white/70 hover:bg-white border border-white/60 text-slate-600 px-2 py-1 rounded font-bold backdrop-blur-sm"
                    >
                      ย้อนกลับ
                    </button>
                  </div>

                  {appointmentSuccess ? (
                    <div className="bg-emerald-50/70 border border-emerald-200 text-slate-800 p-5 rounded-2xl text-center space-y-4 my-auto backdrop-blur-md shadow-xs animate-fade-in">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 font-sans">ลงทะเบียนนัดหมายเสร็จสมบูรณ์!</h4>
                        <p className="text-xs text-slate-600 mt-2 font-sans">
                          เจ้าหน้าที่จะโทรยืนยันเวลาจอง ณ {selectedDoctor.name} ภายใน 15 นาที
                        </p>
                      </div>
                      <div className="bg-white/70 backdrop-blur-sm border border-white/80 p-3 rounded-xl text-left text-xs max-w-sm mx-auto space-y-1.5 shadow-xs">
                        <p className="font-sans"><strong>แพทย์ผู้ควบคุม:</strong> {selectedDoctor.name}</p>
                        <p className="font-sans"><strong>วันนัดตรวจ:</strong> {appointmentDate}</p>
                        <p className="font-sans"><strong>เวลานัดพบ:</strong> {appointmentTime} น.</p>
                        <p className="font-sans font-medium text-slate-500"><strong>จุดตรวจพยาบาล:</strong> คลินิกหลักสยามพารากอน</p>
                      </div>
                      <button
                        onClick={() => setBookingMode(null)}
                        className="py-2 px-6 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-sm transition"
                      >
                        กลับสู่หน้าเดิม
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookAppointment} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">เลือกวันที่ตรวจ</label>
                          <input
                            type="date"
                            required
                            min="2026-06-06"
                            value={appointmentDate}
                            onChange={e => setAppointmentDate(e.target.value)}
                            className="w-full bg-white/80 backdrop-blur-xs border border-white/80 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 font-mono shadow-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">เลือกช่วงเวลาพบแพทย์</label>
                          <select
                            required
                            value={appointmentTime}
                            onChange={e => setAppointmentTime(e.target.value)}
                            className="w-full bg-white/80 backdrop-blur-xs border border-white/80 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 font-sans shadow-xs"
                          >
                            <option value="">-- เลือกเวลา --</option>
                            <option value="10:00 - 10:30">10:00 - 10:30 น.</option>
                            <option value="11:00 - 11:30">11:00 - 11:30 น.</option>
                            <option value="13:30 - 14:00">13:30 - 14:00 น.</option>
                            <option value="15:00 - 15:30">15:00 - 15:30 น.</option>
                            <option value="17:00 - 17:30">17:00 - 17:30 น.</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ระบุอาการ อาการแพ้ยา หรือประวัติรักษา</label>
                        <textarea
                          placeholder="อธิบายอาการอย่างสั้นเพื่อส่งเอกสารประวัติการรักษาส่งแพทย์"
                          rows={3}
                          value={appointmentReason}
                          onChange={e => setAppointmentReason(e.target.value)}
                          className="w-full bg-white/80 backdrop-blur-xs border border-white/80 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 font-sans resize-none shadow-xs"
                        />
                      </div>

                      <div className="p-3 bg-indigo-50/70 backdrop-blur-sm border border-indigo-100 text-indigo-900 rounded-xl text-[10px] leading-relaxed flex gap-2 shadow-xs">
                        <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold font-sans">การเตรียมตัวเข้าตรวจหลัก:</span>
                          <span className="block text-slate-600 font-sans mt-0.5">
                            กรุณาเตรียมบัตรประชาชนตัวจริงมาแสดงที่จุดทะเบียนล่วงหน้า 15 นาที และงดน้ำอาหาร 8-10 ชม. กรณีต้องตรวจค่าเลือด
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer font-sans active:scale-[0.99]"
                      >
                        ส่งใบคำขอจองคิวนัดตรวจล่วงหน้า
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <Stethoscope className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-xs font-sans mt-2">กรุณาเลือกแพทย์เพื่อเริ่มต้นการจองหรือคุยแชท</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
