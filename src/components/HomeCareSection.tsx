/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CAREGIVERS } from '../data';
import { Caregiver, HomeCareBooking } from '../types';
import { saveStorage, getStorage } from '../utils';
import {
  Users,
  ShieldAlert,
  Calendar,
  CheckCircle,
  FileCheck,
  Award,
  DollarSign,
  Heart,
  PlusCircle,
  Trash2,
  Lock,
  Stethoscope
} from 'lucide-react';

export default function HomeCareSection() {
  const [caregiversList, setCaregiversList] = useState<Caregiver[]>(CAREGIVERS);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver>(CAREGIVERS[0]);
  const [bookings, setBookings] = useState<HomeCareBooking[]>([]);

  // Booking states
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [duration, setDuration] = useState<string>('7');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Load existing caregiver bookings
  useEffect(() => {
    const activeBookings = getStorage<HomeCareBooking[]>('mydoctor_caregiver_bookings', []);
    setBookings(activeBookings);
  }, []);

  const toggleCondition = (cond: string) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const calculateTotalFee = () => {
    const days = parseInt(duration) || 1;
    return selectedCaregiver.pricePerDay * days;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(patientAge);
    const durationNum = parseInt(duration);

    if (!patientName || isNaN(ageNum) || !startDate || isNaN(durationNum) || durationNum <= 0) {
      alert('กรุณากรอกข้อมูลชื่อผู้ป่วย อายุ วันที่เริ่มต้น และระยะวันบริบาลที่ถูกต้องด้วยนะคะ');
      return;
    }

    const newBooking: HomeCareBooking = {
      id: `booking-${Date.now()}`,
      patientName,
      patientAge: ageNum,
      caregiverId: selectedCaregiver.id,
      caregiverName: selectedCaregiver.name,
      startDate,
      durationDays: durationNum,
      conditions: selectedConditions,
      notes: specialNotes,
      bookingTime: new Date().toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    saveStorage('mydoctor_caregiver_bookings', updatedBookings);

    // Toggle caregiver as occupied
    setCaregiversList(prev =>
      prev.map(cg => cg.id === selectedCaregiver.id ? { ...cg, available: false } : cg)
    );

    setBookingSuccess(true);
  };

  const cancelBooking = (bookingId: string, cgId: string) => {
    if (window.confirm('คุณต้องการยกเลิกตารางคนจองผู้ดูแลรายนี้ใช่หรือไม่? การคืนมัดจำเต็มจำนวนจะโอนกลับใน 24 ชม.')) {
      const updated = bookings.filter(b => b.id !== bookingId);
      setBookings(updated);
      saveStorage('mydoctor_caregiver_bookings', updated);

      // Make caregiver available again
      setCaregiversList(prev =>
        prev.map(cg => cg.id === cgId ? { ...cg, available: true } : cg)
      );
    }
  };

  const resetForm = () => {
    setBookingSuccess(false);
    setPatientName('');
    setPatientAge('');
    setStartDate('');
    setDuration('7');
    setSelectedConditions([]);
    setSpecialNotes('');
    // Switch to first available
    const avail = caregiversList.find(c => c.available);
    if (avail) setSelectedCaregiver(avail);
  };

  const conditionPresets = [
    'แผลกดทับรุนแรง (Bedsores)',
    'ท่อให้อาหารสายยาง (Feeding tubes)',
    'ถุงท่อหน้าท้องสายปัสสาวะ (Urinary catheters)',
    'ต้องการฝึกกายภาพบำบัดกล้ามเนื้อ (Rehabilitation)',
    'ความจำเสื่อม/สมองเสื่อมขั้นที่ 2 (Alzheimer)',
    'ต้องการคนช่วยพยุง พลิกตัว เช็ดร่างกาย'
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
          <Heart className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">บริการจ้างผู้ช่วย & พยาบาลดูแลผู้ป่วยติดเตียงถึงบ้าน (Home Care Services)</h2>
          <p className="text-xs text-slate-500 font-sans">จองผู้บริบาลชำนาญการ พยาบาลวิชาชีพดูแลสายยาง อัมพาต และแผลกดทับ ครบวงจรความปลอดภัย</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Aspect: Caregivers Profiles Deck */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-sm font-bold text-slate-700 font-sans">1. เลือกผู้ดูแลคุณหรือพยาบาลชำนาญการ</p>
          <div className="space-y-3">
            {caregiversList.map(cg => {
              const isSelected = selectedCaregiver.id === cg.id;
              return (
                <div
                  key={cg.id}
                  onClick={() => {
                    if (cg.available) {
                      setSelectedCaregiver(cg);
                      setBookingSuccess(false);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    !cg.available ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200' :
                    isSelected
                      ? 'border-teal-500 bg-teal-50/20 ring-1 ring-teal-500/20 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                  id={`cg-card-${cg.id}`}
                >
                  <div className="flex gap-3">
                    <div className="text-3xl bg-slate-100 w-12 h-12 rounded-full border border-slate-200/50 flex items-center justify-center shrink-0 shadow-inner select-none">
                      {cg.image}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xs text-slate-800 leading-tight font-sans truncate">{cg.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-sans ${
                          cg.role === 'nurse' ? 'bg-cyan-100 text-cyan-800' :
                          cg.role === 'therapist' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {cg.roleThai}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1 font-mono">ประสบการณ์ทำงาน: {cg.experienceYears} ปี • รีวิว {cg.rating}⭐</p>
                      
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 flex-wrap gap-1">
                        <span className="text-xs font-bold text-teal-600 font-mono">฿{cg.pricePerDay} <span className="text-[9px] text-slate-400 font-sans font-normal">/ วัน</span></span>
                        <span className={`text-[9px] font-bold font-sans ${cg.available ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {cg.available ? '● ว่างดูแลทันที' : '❌ คิวเต็มแล้ว'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Aspect: Detailed Profiler and Booking Form wizard */}
        <div className="lg:col-span-8 bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex flex-col justify-between min-h-[440px]">
          {bookingSuccess ? (
            <div className="text-center py-12 space-y-5 my-auto" id="booking-success-wizard">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow">
                <FileCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 font-sans">จองคนดูแลผู้ป่วยติดเตียงเสร็จสมบูรณ์!</h3>
                <p className="text-xs text-slate-500 mt-1.5 font-sans leading-relaxed max-w-md mx-auto">
                  ระบบได้บันทึกสัญญาดูแลร่วมกับ {selectedCaregiver.name} เรียบร้อยแล้ว ทีมงานวิชาชีพพยาบาลจะโทรติดต่อญาติเพื่อรับประวัติสุขภาพแบบฟอร์มเชิงลึกก่อนเดินทางไปบ้านคุณ
                </p>
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-xl text-left text-xs max-w-sm mx-auto space-y-1.5 shadow-sm">
                <p className="font-sans"><strong>ผู้รับบริบาล:</strong> {selectedCaregiver.name} ({selectedCaregiver.roleThai})</p>
                <p className="font-sans"><strong>ผู้ป่วย:</strong> {patientName} (อายุ {patientAge} ปี)</p>
                <p className="font-sans"><strong>เริ่มงาน:</strong> {startDate} ({duration} วัน)</p>
                <p className="font-sans"><strong>ค่าบริการโภชนาการรวม:</strong> <span className="font-mono text-teal-600 font-bold">฿{calculateTotalFee()}</span></p>
              </div>
              <button
                onClick={resetForm}
                className="py-2 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition font-sans"
              >
                จองบริการหรือจ้างเพื่ม
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between" id="booking-caregiver-input-container">
              <div>
                {/* Profile Overview Card */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="text-4xl bg-teal-50 w-16 h-16 rounded-full border border-teal-100 flex items-center justify-center shrink-0 self-center select-none shadow-sm">
                    {selectedCaregiver.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-1 flex-wrap">
                      <div>
                        <h4 className="font-bold text-sm text-slate-950 font-sans">{selectedCaregiver.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-teal-600 font-bold mt-0.5">
                          <Award className="w-3.5 h-3.5 text-teal-600" />
                          <span>{selectedCaregiver.roleThai} (ผู้เชี่ยวชาญ)</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-teal-700 font-mono bg-teal-50 px-2 py-0.5 rounded-md">
                        ราคาดูแล: ฿{selectedCaregiver.pricePerDay} / วัน
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-sans text-justify leading-relaxed">{selectedCaregiver.bio}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {selectedCaregiver.skills.map((sk, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Elements */}
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <p className="text-xs font-bold text-slate-600 font-sans border-b border-slate-100 pb-1.5">
                    2. ข้อมูลผู้ป่วยและระบุอาการโรคติดเตียง
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ชื่อนามสกุลผู้ป่วย</label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        placeholder="เช่น นาย สมัย รักสงบ"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">อายุผู้ป่วย (ปี)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="130"
                        value={patientAge}
                        onChange={e => setPatientAge(e.target.value)}
                        placeholder="อายุ"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ความยาวบริการ (วัน)</label>
                      <select
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-sans"
                      >
                        <option value="3">จ้างด่วน 3 วัน</option>
                        <option value="5">จ้างย่อย 5 วัน</option>
                        <option value="7">สัปดาห์ 7 วัน (มาตรฐาน)</option>
                        <option value="15">ครึ่งเดือน 15 วัน (รับประกัน)</option>
                        <option value="30">เหมาเดือน 30 วัน (ประหยัด 10%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">วันที่ผู้ป่วยต้องการเริ่มรับบริบาล</label>
                      <input
                        type="date"
                        required
                        min="2026-06-06"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ความประสงค์หรืออาการเฝ้าระวังพิเศษ</label>
                      <input
                        type="text"
                        value={specialNotes}
                        onChange={e => setSpecialNotes(e.target.value)}
                        placeholder="เช่น ปวดเกร็งหัวไหล่, ระวังการไอสำลักแร่ธาตุ"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-sans"
                      />
                    </div>
                  </div>

                  {/* Conditions checkboxes list */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 mb-1.5 block font-sans">
                      ติ๊กเลือกสภาวะทางการแพทย์ที่ต้องดูแล (ติ๊กได้หลายข้อเพื่อคัดคู่มือพยาบาล)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {conditionPresets.map((cond, idx) => {
                        const isChecked = selectedConditions.includes(cond);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCondition(cond)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition ${
                              isChecked
                                ? 'bg-teal-50 border-teal-400 text-teal-900 font-semibold'
                                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="accent-teal-600"
                            />
                            <span className="font-sans text-[10px] leading-tight truncate">{cond}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing transparency list */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex justify-between items-center flex-wrap gap-2 shadow-inner">
                    <div className="text-xs">
                      <p className="text-slate-400 font-sans font-medium">ประมาณการราคาค่าจ้างรวมสุทธิ</p>
                      <p className="text-lg font-extrabold text-teal-600 font-mono mt-0.5">
                        ฿{calculateTotalFee().toLocaleString()} <span className="text-[10px] text-slate-400 font-sans font-normal">บาท (ไม่มีชาร์จเพิ่ม)</span>
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> ลงทะเบียนจองตัวผู้ดูแล 🏥
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Active Bookings Tracker block with local cancellation support */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mt-5">
            <h3 className="font-bold text-xs text-slate-700 font-sans uppercase mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" /> ตารางการจองดูแลที่บ้านของฉัน ({bookings.length})
            </h3>

            {bookings.length > 0 ? (
              <div className="space-y-2">
                {bookings.map(book => (
                  <div key={book.id} className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg flex items-center justify-between flex-wrap gap-4 text-xs font-sans">
                    <div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <strong className="text-slate-800">{book.caregiverName}</strong>
                        <span className="text-[9px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded">ยืนยันแล้ว</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans mt-1">
                        ผู้ป่วย: <strong>{book.patientName}</strong> (อายุ {book.patientAge}) • มีกำหนดเริ่ม {book.startDate} ({book.durationDays} วัน)
                      </p>
                      {book.conditions.length > 0 && (
                        <p className="text-[10px] text-slate-400 truncate mt-1">เครื่องเตรียมพร้อม: {book.conditions.join(', ')}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => cancelBooking(book.id, book.caregiverId)}
                      className="py-1.5 px-3 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ยกเลิกบริการ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-slate-100 border-dashed text-xs">
                คุณยังไม่ได้เริ่มระบบจองตารางสำหรับผู้บริบาลผู้ป่วยติดเตียงคนใด
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
