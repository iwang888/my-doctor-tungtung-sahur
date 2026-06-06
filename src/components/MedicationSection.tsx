/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MEDICATIONS } from '../data';
import { Medication, CartItem, Prescription } from '../types';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  FileText,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Truck,
  HeartPulse,
  Info,
  X,
  CreditCard
} from 'lucide-react';

interface MedicationSectionProps {
  activePrescription: Prescription | null;
  onClearPrescription: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function MedicationSection({
  activePrescription,
  onClearPrescription,
  cart,
  setCart
}: MedicationSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [selectedMedDetail, setSelectedMedDetail] = useState<Medication | null>(null);

  // Checkout form state
  const [isCheckoutMode, setIsCheckoutMode] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  // List unique categories for filter
  const categories = ['ทั้งหมด', 'ยาสามัญประจำบ้าน (Pain Reliever)', 'ยาปฏิชีวนะ (Antibiotics)', 'ยาแก้แพ้ (Antihistamines)', 'อาหารเสริมสมุนไพรบำบัด (Vitamins & Supplements)', 'สกินแคร์เวชสำอาง (Dermatology / Skin Care)'];

  // Handle auto-linking prescription from Feature 2
  const applyPrescriptionToCart = () => {
    if (!activePrescription) return;

    // Loop through medications in prescription and add them to cart
    let updatedCart = [...cart];
    activePrescription.medications.forEach(prescMed => {
      const matchMed = MEDICATIONS.find(m => m.id === prescMed.medicationId);
      if (matchMed) {
        const existingIdx = updatedCart.findIndex(item => item.medication.id === matchMed.id);
        if (existingIdx > -1) {
          updatedCart[existingIdx].quantity += prescMed.quantity;
        } else {
          updatedCart.push({ medication: matchMed, quantity: prescMed.quantity });
        }
      }
    });

    setCart(updatedCart);
    onClearPrescription(); // Cleared from global bar with state indicator that it was order linked
    alert('✅ เพิ่มตัวยาจากใบสั่งยาคุณหมอเข้าสู่ตะกร้าเรียบร้อยแล้ว!');
  };

  const addToCart = (med: Medication) => {
    if (med.stock === 'out_of_stock') {
      alert('ขออภัยค่ะ ยานี้หมดสต็อกชั่วคราว ไม่สามารถสั่งซื้อได้');
      return;
    }

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.medication.id === med.id);
      if (existingIdx > -1) {
        return prev.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { medication: med, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (medId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.medication.id === medId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (medId: string) => {
    setCart(prev => prev.filter(item => item.medication.id !== medId));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.medication.price * item.quantity), 0);
  const shippingFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCheckoutSuccess(true);
  };

  const resetAllOrder = () => {
    setCart([]);
    setIsCheckoutMode(false);
    setCheckoutSuccess(false);
    setRecipientName('');
    setRecipientPhone('');
    setDeliveryAddress('');
  };

  // Filter items
  const filteredMeds = MEDICATIONS.filter(med => {
    const matchesKeyword = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           med.thaiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           med.indication.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || med.category === selectedCategory;
    return matchesKeyword && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">เช็คยาคงคลัง & สั่งซื้อยาออนไลน์</h2>
            <p className="text-xs text-slate-500 font-sans">ค้นหากลุ่มยาทางการแพทย์ ตรวจเช็คปริมาณสต็อก และจัดส่งเวชภัณฑ์ตรงถึงบ้าน</p>
          </div>
        </div>
      </div>

      {/* Integration Banner: Displays when Doctor issues a fresh prescription in Section 2 */}
      {activePrescription && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl p-4 shadow-md mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-xl shrink-0">
              📝
            </div>
            <div>
              <h4 className="font-bold text-sm font-sans">มีใบสั่งยาอิเล็กทรอนิกส์คงเหลือจากบริการคุณหมอ</h4>
              <p className="text-xs text-emerald-50/90 font-sans mt-0.5">
                ออกใบสั่งโดย <strong>{activePrescription.doctorName}</strong> เพื่อบรรเทาผดผื่น ไข้หวัด หรือปวดเกร็ง
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={applyPrescriptionToCart}
              className="flex-1 md:flex-none px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs rounded-lg shadow-sm transition font-sans cursor-pointer whitespace-nowrap"
            >
              ดึงยาทั้งหมดเข้าตะกร้า 🛒
            </button>
            <button
              onClick={onClearPrescription}
              className="px-2.5 py-2 bg-emerald-700/50 text-white hover:bg-emerald-800/40 text-xs rounded-lg font-bold transition"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Aspect: Store Browser */}
        <div className="lg:col-span-8 space-y-5">
          {/* Categories and Search bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อตัวยา เช่น Paracetamol, Amoxicillin, ยาแก้แพ้..."
                className="w-full bg-slate-50/50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white font-sans transition-all"
              />
            </div>

            {/* Responsive Categories flex-row */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-sans font-bold border whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/60'
                  }`}
                >
                  {cat === 'ทั้งหมด' ? 'ยาเวชภัณฑ์ทั้งหมด' : cat.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Core Drugs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMeds.map(med => {
              const stockColors = {
                in_stock: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100/50', text: 'มียาพร้อมส่ง' },
                low_stock: { bg: 'bg-amber-50 text-amber-700 border-amber-100/50', text: 'ยาใกล้หมดคลัง' },
                out_of_stock: { bg: 'bg-rose-50 text-rose-700 border-rose-100/50', text: 'ยาหมดสต็อก' }
              };
              const activeStock = stockColors[med.stock];

              return (
                <div
                  key={med.id}
                  className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col justify-between hover:shadow-md transition-all border-l-4 hover:border-l-teal-500"
                  id={`med-card-${med.id}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1 mb-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-sans font-bold leading-none ${activeStock.bg}`}>
                        {activeStock.text}
                      </span>
                      <span className="text-xs font-bold text-teal-600 font-mono">฿{med.price} <span className="text-[10px] text-slate-400 font-sans font-normal">/ {med.unit}</span></span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 leading-tight font-sans">{med.name}</h3>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5 font-medium">{med.thaiName}</p>
                    
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-sans text-justify">{med.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2">
                    <button
                      onClick={() => setSelectedMedDetail(med)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50 rounded-lg text-xs"
                      title="ดูรายละเอียดสรรพคุณข้อควรระวัง"
                    >
                      <Info className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() => addToCart(med)}
                      disabled={med.stock === 'out_of_stock'}
                      className="flex-1 py-1.5 bg-teal-600 disabled:bg-slate-100 disabled:text-slate-400 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex justify-center items-center gap-1.5 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> หยิบใส่ตะกร้า
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Aspect: Shopping Cart Box */}
        <div className="lg:col-span-4 block">
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 sticky top-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-xs text-slate-800 font-sans uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-teal-600" /> ตะกร้าเวชภัณฑ์ของคุณ ({cart.length})
              </h3>
            </div>

            {checkoutSuccess ? (
              <div className="text-center py-6 space-y-4" id="med-checkout-success-banner">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-sans">สั่งซื้อด่วนเรียบร้อย!</h4>
                  <p className="text-[11px] text-slate-500 mt-1 font-sans">
                    เภสัชกรกำลังจัดเตรียมและยาจะถูกจัดจัดส่งด่วนใน 1 ชั่วโมง
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-left text-xs space-y-1">
                  <p className="font-sans"><strong>ผู้รับ:</strong> {recipientName || 'ไม่ระบุ'}</p>
                  <p className="font-sans"><strong>ยอดรวมจ่ายสุทธิ:</strong> <span className="font-mono text-teal-600 font-extrabold">฿{grandTotal}</span></p>
                  <p className="font-sans text-[10px] text-slate-500"><strong>ประเภทชำระ:</strong> {paymentMethod === 'cod' ? 'เก็บเงินปลายทาง (COD)' : 'โอนผ่านบัญชีพร้อมเพย์'}</p>
                </div>
                <button
                  onClick={resetAllOrder}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition"
                >
                  กลับไปเลือกยาอื่น
                </button>
              </div>
            ) : isCheckoutMode ? (
              /* Checkout Form Panel */
              <form onSubmit={handleCheckout} className="space-y-3" id="med-checkout-form">
                <div className="pb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">กรอกข้อมูลผู้รับยา</p>
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-500 block mb-1 font-sans">ชื่อ-นามสกุลจริงผู้รับ</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="เช่น นาย สมศรี ใจงาม"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-sans"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-500 block mb-1 font-sans">เบอร์ติดต่อด่วน</label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={e => setRecipientPhone(e.target.value)}
                    placeholder="เช่น 0891234567"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-500 block mb-1 font-sans">ที่อยู่จัดส่งด่วน</label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="ระบุบ้านเลขที่ ซอย ถนน แขวง เขต คอนโด หรือห้องพัก"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-teal-500 font-sans resize-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-slate-500 block mb-1 font-sans">วิธีการจ่ายเงิน</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`py-1.5 text-center text-xs font-bold border rounded-lg transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-teal-500 bg-teal-50 text-teal-800'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      เก็บปลายทาง (COD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`py-1.5 text-center text-xs font-bold border rounded-lg transition-all ${
                        paymentMethod === 'transfer'
                          ? 'border-teal-500 bg-teal-50 text-teal-800'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      สแกนจ่ายพร้อมเพย์
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold font-sans">ยอมรวมสุทธิ:</span>
                  <span className="font-extrabold text-sm text-teal-600 font-mono">฿{grandTotal}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutMode(false)}
                    className="py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-xs"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="submit"
                    className="py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex justify-center items-center gap-1 cursor-pointer shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> ยืนยันการสั่งยา
                  </button>
                </div>
              </form>
            ) : (
              /* Regular Cart Item Panel */
              <>
                {cart.length > 0 ? (
                  <div className="space-y-3">
                    <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2">
                      {cart.map(item => (
                        <div key={item.medication.id} className="bg-white p-2.5 rounded-lg border border-slate-100 flex gap-2 items-center justify-between shadow-sm">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-[11px] text-slate-800 font-sans truncate">{item.medication.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono">฿{item.medication.price} / {item.medication.unit}</p>
                          </div>
                          
                          {/* Stepper controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.medication.id, -1)}
                              className="w-5 h-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-xs"
                            >
                              <Minus className="w-3 h-3 text-slate-500" />
                            </button>
                            <span className="text-xs font-bold font-mono px-1.5 w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.medication.id, 1)}
                              className="w-5 h-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-xs"
                            >
                              <Plus className="w-3 h-3 text-slate-500" />
                            </button>
                            
                            <button
                              onClick={() => removeFromCart(item.medication.id)}
                              className="w-5 h-5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded flex items-center justify-center ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Overview receipt details */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="font-sans">ค่ารักษาพยาบาลยารวม</span>
                        <span className="font-mono font-medium">฿{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans">ค่าบริการขนส่งด่วน (1 ชั่วโมง)</span>
                        <span className="font-mono font-medium">{shippingFee === 0 ? 'ฟรี (โปรโมชั่น)' : `฿${shippingFee}`}</span>
                      </div>
                      {subtotal < 500 && (
                        <p className="text-[9px] text-teal-600 font-sans bg-teal-50 p-1.5 rounded">
                          💡 ซื้อยาครบ ฿500 จัดจัดส่งฟรีทั่วกรุงเทพฯ! (ขาดอีก ฿{500 - subtotal})
                        </p>
                      )}
                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="font-bold font-sans text-slate-800">ยอดเงินที่ต้องชำระ</span>
                        <span className="font-extrabold text-sm text-teal-600 font-mono">฿{grandTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCheckoutMode(true)}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex justify-center items-center gap-1.5 cursor-pointer shadow-sm transition"
                    >
                      <CreditCard className="w-4 h-4" /> ดำเนินการชำระเงินด่วน
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <Truck className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
                    <p className="text-xs font-sans mt-2">ยังไม่มีสินค้าในหมวดตรวจเวชภัณฑ์ของคุณ</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Medication Details Lightbox Modal overlay info */}
      {selectedMedDetail && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-xl overflow-hidden animate-zoom-in">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-sm text-slate-800 font-sans">รายละเอียดสรรพคุณเวชภัณฑ์</h4>
              <button
                onClick={() => setSelectedMedDetail(null)}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-sans">
              <div>
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-teal-600" />
                  {selectedMedDetail.name}
                </h5>
                <p className="text-slate-500 font-semibold">{selectedMedDetail.thaiName}</p>
                <p className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-1">{selectedMedDetail.category}</p>
              </div>

              <div>
                <strong className="text-slate-800 block mb-0.5">สรรพคุณและการบำบัดรักษา:</strong>
                <p className="text-slate-600 leading-relaxed text-justify">{selectedMedDetail.indication}</p>
              </div>

              <div>
                <strong className="text-slate-800 block mb-0.5">วิธีการรับประทานเเละขนาดยา:</strong>
                <p className="text-teal-800 bg-teal-50/50 p-2 border border-teal-100/50 rounded-lg font-medium leading-relaxed">{selectedMedDetail.dosage}</p>
              </div>

              <div>
                <strong className="text-slate-800 block mb-0.5">คำเตือนและผลข้างเคียงที่เป็นไปได้:</strong>
                <p className="text-rose-700 bg-rose-50/50 p-2 border border-rose-100/40 rounded-lg leading-relaxed font-sans">{selectedMedDetail.sideEffects}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-extrabold text-teal-600 font-mono">฿{selectedMedDetail.price} บาท / แผง</span>
                <button
                  onClick={() => { addToCart(selectedMedDetail); setSelectedMedDetail(null); }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold font-sans"
                >
                  เลือกยานี้ลงตะกร้า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
