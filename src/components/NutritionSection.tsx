/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { calculateBMI, calculateTDEE, saveStorage, getStorage } from '../utils';
import { NutritionLog } from '../types';
import {
  Activity,
  Calculator,
  Utensils,
  Flame,
  Droplet,
  History,
  Trash2,
  AlertCircle,
  TrendingDown,
  Check,
  TrendingUp,
  Apple
} from 'lucide-react';

export default function NutritionSection() {
  // Calculator inputs
  const [weight, setWeight] = useState<string>('65');
  const [height, setHeight] = useState<string>('170');
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('moderate');

  // Logs list loaded from localStorage
  const [logs, setLogs] = useState<NutritionLog[]>([]);

  // Active results display states
  const [bmiResult, setBmiResult] = useState<any>(null);
  const [tdeeResult, setTdeeResult] = useState<any>(null);
  const [waterGoal, setWaterGoal] = useState<number>(0);

  // Initialize and load historical evaluates
  useEffect(() => {
    const historicalLogs = getStorage<NutritionLog[]>('mydoctor_nutrition_logs', []);
    setLogs(historicalLogs);

    // Initial trigger calculation
    triggerCalculation(65, 170, 28, 'female', 'moderate');
  }, []);

  const triggerCalculation = (wValue: number, hValue: number, aValue: number, gValue: 'male' | 'female', actValue: any) => {
    const bmiData = calculateBMI(wValue, hValue);
    const tdeeData = calculateTDEE(wValue, hValue, aValue, gValue, actValue);
    
    // Water requirement calculation: weight in kg * 35 ml
    const calculatedWater = Math.round(wValue * 35);

    setBmiResult(bmiData);
    setTdeeResult(tdeeData);
    setWaterGoal(calculatedWater);
  };

  const handleCalculateAndLog = (e: React.FormEvent) => {
    e.preventDefault();
    const wNum = parseFloat(weight);
    const hNum = parseFloat(height);
    const aNum = parseInt(age);

    if (isNaN(wNum) || isNaN(hNum) || isNaN(aNum) || wNum <= 0 || hNum <= 0 || aNum <= 0) {
      alert('กรุณาระบุข้อมูลความสูง น้ำหนักตัว และอายุที่ถูกต้องเป็นตัวเลขจำนวนเต็มบวกนะคะ');
      return;
    }

    triggerCalculation(wNum, hNum, aNum, gender, activityLevel);

    const bmiData = calculateBMI(wNum, hNum);
    const tdeeData = calculateTDEE(wNum, hNum, aNum, gender, activityLevel);
    const calculatedWater = Math.round(wNum * 35);

    // Build log
    const newLog: NutritionLog = {
      id: `nut-log-${Date.now()}`,
      date: new Date().toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      weight: wNum,
      height: hNum,
      bmi: bmiData.bmi,
      bmiStatus: bmiData.status.split(' (')[0],
      tdee: tdeeData.tdee,
      waterGoal: calculatedWater,
      caloriesGoal: Math.round(bmiData.bmi >= 23 ? tdeeData.tdee - 450 : bmiData.bmi < 18.5 ? tdeeData.tdee + 300 : tdeeData.tdee)
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    saveStorage('mydoctor_nutrition_logs', updatedLogs);
  };

  const deleteLog = (logId: string) => {
    const updated = logs.filter(l => l.id !== logId);
    setLogs(updated);
    saveStorage('mydoctor_nutrition_logs', updated);
  };

  // Generate diet plans depending on calculated BMI tier
  const getDietAdvicePlan = () => {
    if (!bmiResult) return null;

    const bmi = bmiResult.bmi;
    if (bmi < 18.5) {
      return {
        title: 'เซ็ตเมนูเพิ่มมวลกล้ามเนื้อและน้ำหนักตัว (Weight Gain & Muscle Up)',
        carb: 'ข้าวกล้องสุก/ขนมปังโฮลวีต',
        protein: 'อกไก่ ไข่ต้ม เนื้อปลาแซลมอน นมถั่วเหลืองไม่คัดไขมัน',
        fat: 'อะโวคาโด เม็ดมะม่วงหิมพานต์ อัลมอนด์',
        meals: [
          { time: 'มื้อเช้า', food: 'แซนด์วิชทูน่าโฮลวีตแผ่นคู่ + นมถั่วเหลืองสูตรออร์แกนิก 1 แก้ว + กล้วยหอม 1 ใบคู่ไข่ต้ม', cal: 480 },
          { time: 'มื้อกลางวัน', food: 'ข้าวกล้อง 2 ทัพพี + อกไก่ผัดขิงเห็ดหูหนู + ลาบปลาทูน่าเนื้อสับไขมันต่ำ + ผลไม้สด', cal: 550 },
          { time: 'อาหารว่าง', food: 'ถั่วอัลมอนด์อบสุก 1 กำมือเล็ก + กรีกโยเกิร์ตรสธรรมชาติผสมน้ำผึ้งแท้สดชื่น', cal: 240 },
          { time: 'มื้อเย็น', food: 'สเต็กปลาแซลมอนย่างตะไคร้ราดซอสผลไม้ + แครอทและบรอกโคลีต้มราดเนยถั่ว', cal: 520 }
        ]
      };
    } else if (bmi >= 18.5 && bmi < 23) {
      return {
        title: 'เซ็ตเมนูสมดุลรักษาสุขภาพกระชับสัดส่วน (Healthy Balance & Toning)',
        carb: 'ข้าวมะลิกล้องสลับข้าวไรซ์เบอร์รี่',
        protein: 'อกไก่ เต้าหู้ขาว แปรรูปถั่วเหลือง ปลาทะเลน้ำลึก',
        fat: 'ไขมันดีจากน้ำมันมะกอกผ่านสลัดน้ำใส',
        meals: [
          { time: 'มื้อเช้า', food: 'มูสลี่ข้าวโอ๊ตแช่นมอัลมอนด์จืด + สตรอเบอร์รี่และบลูเบอร์รี่สด + ไข่ต้ม 2 ฟอง', cal: 360 },
          { time: 'มื้อกลางวัน', food: 'ข้าวมะลิกล้อง 1.5 ทัพพี + ต้มจืดเต้าหู้หมูสับยัดไส้ผักกาดขาว + ปลานิลนึ่งแจ่วมะเขือเทศสว่าง', cal: 420 },
          { time: 'อาหารว่าง', food: 'แอปเปิ้ลสีเขียวหั่นสไลซ์จิ้มทาผงชินนามอนหรือผงมะพร้าว 6 ชิ้น', cal: 90 },
          { time: 'มื้อเย็น', food: 'แกงส้มกุ้งผักรวมสูตรบางเบาคุมเค็ม + ไข่เจียวไร้น้ำมันนึ่งสมุนไพรสด', cal: 380 }
        ]
      };
    } else {
      return {
        title: 'เซ็ตเมนูลดสัดส่วนสลายไขมันสะสม (Calorie Deficit & Fat Burn)',
        carb: 'ข้าวไรซ์เบอร์รี่สัดส่วนจำกัด หรือฟักทองต้มแทนแป้ง',
        protein: 'เนื้อปลาขาวนึ่ง เนื้ออกไก่ลอกหนัง สันในหมูไร้ติดมัน ไข่ขาว',
        fat: 'ลดการปรุงประกอบด้วยน้ำมันทุกชนิด เน้นนึ่ง ต้ม และอบทดแทน',
        meals: [
          { time: 'มื้อเช้า', food: 'ไข่ดาวน้ำคลุกสมุนไพร 2 ฟอง + สลัดผักไฮโดรโปนิกส์ราดน้ำสลัดบัลซามิกแบบใส 1 จานใหญ่', cal: 210 },
          { time: 'มื้อกลางวัน', food: 'ข้าวไรซ์เบอร์รี่สกัดแป้ง 1 ทัพพี + อกไก่นึ่งขมิ้นตะไคร้หอม + ผักต้มรอบจานจุใจฝักทองหน่อไม้ฝรั่ง', cal: 310 },
          { time: 'อาหารว่าง', food: 'ฝรั่งกิมจูหั่นเต๋าชิ้นพอดีคำ 1 ถ้วยแก้วเล็ก (วิตามินซีสูง น้ำตาลต่ำมาก)', cal: 60 },
          { time: 'มื้อเย็น', food: 'ซุปมิโซะใส่เต้าหู้ขาวก้อนอ่อนและสาหร่ายวากาเมะบวกปลายัดใส้นึ่งเบา ทานคู่ผักกาดขาวลวก', cal: 240 }
        ]
      };
    }
  };

  const dietPlan = getDietAdvicePlan();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">คุมโภชนาการตามน้ำหนักตัว (Nutrition Calculator)</h2>
          <p className="text-xs text-slate-500 font-sans">คำนวณ BMI อัตราเผาผลาญความร้อน แนะนำปริมาณดื่มน้ำ ดัชนีเมนูแคลอรี่ในชุมชน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Calculator Inputs */}
        <div className="lg:col-span-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <h3 className="font-bold text-xs text-slate-700 font-sans uppercase mb-4 tracking-wider flex items-center gap-1.5">
            📋 กรอกดัชนีร่างกายของคุณ
          </h3>

          <form onSubmit={handleCalculateAndLog} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ส่วนสูงของท่าน (ซม.)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max="250"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 font-mono text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">น้ำหนักตัวปัจจุบัน (กก.)</label>
                <input
                  type="number"
                  required
                  min="20"
                  max="300"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 font-mono text-center font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ระบุอายุผู้ใช้ (ปี)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 font-mono text-center"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ระบุเพศสรีระ</label>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1.5 text-center text-[10px] font-sans font-bold border rounded-lg transition-all ${
                      gender === 'male'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    ชาย
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1.5 text-center text-[10px] font-sans font-bold border rounded-lg transition-all ${
                      gender === 'female'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    หญิง
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 mb-1 block font-sans">ระดับกิจกรรมออกกำลังต่อสัปดาห์</label>
              <select
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="sedentary">ไม่ได้ออกกำลังกายเลย (ทํางานหน้าคอม)</option>
                <option value="light">ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์</option>
                <option value="moderate">ออกปานกลาง 3-5 วัน/สัปดาห์วิ่งจ็อกกิ้ง</option>
                <option value="active">ออกกำลังกายหนักมาก 6-7 วัน/สัปดาห์</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex justify-center items-center gap-1 shadow-sm cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> ประเมินดัชนี & บันทึกลงไดอารี่
            </button>
          </form>

          {/* Quick hydration advice */}
          {waterGoal > 0 && (
            <div className="mt-4 p-3.5 bg-sky-50 border border-sky-100/50 rounded-xl flex gap-2.5 items-start text-xs text-sky-950">
              <Droplet className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold font-sans">คำแนะนำดื่มน้ำสำหรับน้ำหนักคุณ</p>
                <p className="text-[11px] text-sky-800 font-sans leading-relaxed mt-0.5">
                  ควรจิบน้ำสะอาดอย่างน้อย <strong className="font-mono text-base text-sky-700">{waterGoal}</strong> มล. ต่อวัน (ประมาณ 8-10 แก้วมาตรฐาน) เพื่อพยุงหัวใจขับกรดยูริกออกจากเซลล์
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Calculations Outputs and Custom Food Diet suggestions */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-5">
          {bmiResult && tdeeResult && (
            <div className="space-y-4">
              {/* BMI Bar indicator */}
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="text-center p-3 bg-slate-50/80 rounded-xl border border-slate-100 shrink-0 select-none min-w-[100px]">
                  <p className="text-[10px] text-slate-400 font-sans font-semibold">ดัชนีมวลกาย</p>
                  <p className={`text-3xl font-extrabold font-mono text-${bmiResult.color} mt-0.5`}>{bmiResult.bmi}</p>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-slate-800 font-sans leading-tight flex justify-center sm:justify-start items-center gap-1">
                    <Activity className={`w-4 h-4 text-${bmiResult.color}`} />
                    เกณฑ์ประเมิน: <span className={`text-${bmiResult.color}`}>{bmiResult.status}</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed text-justify font-sans">{bmiResult.advice}</p>
                </div>
              </div>

              {/* TDEE Burn details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 font-sans font-medium">BMR อัตราพื้นฐานเซลล์</p>
                    <p className="text-lg font-extrabold text-slate-800 font-mono mt-0.5">{tdeeResult.bmr} <span className="text-[10px] text-slate-400 font-sans font-normal">kcal / วัน</span></p>
                  </div>
                  <Flame className="w-6 h-6 text-orange-500 opacity-80" />
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 font-sans font-medium">TDEE อัตรากิจกรรมเผาผลาญ</p>
                    <p className="text-lg font-extrabold text-teal-600 font-mono mt-0.5">{tdeeResult.tdee} <span className="text-[10px] text-slate-400 font-sans font-normal">kcal / วัน</span></p>
                  </div>
                  <Flame className="w-6 h-6 text-emerald-500 opacity-80" />
                </div>
              </div>

              {/* Detailed custom localized food recommendations based on evaluated BMI category */}
              {dietPlan && (
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-50">
                    <h4 className="font-bold text-xs text-slate-800 font-sans flex items-center gap-1">
                      <Utensils className="w-4 h-4 text-emerald-600" /> แนะนำเมนูอาหารตามเกณฑ์น้ำหนักตัวของคุณ
                    </h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-sans">
                      {dietPlan.title.split(' (')[0]}
                    </span>
                  </div>

                  {/* Meal list cards representation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    {dietPlan.meals.map((meal, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-mono bg-white text-slate-500 font-extrabold border border-slate-200/50 px-1.5 py-0.5 rounded leading-none block w-max">
                            {meal.time}
                          </span>
                          <p className="text-xs text-slate-700 font-semibold font-sans mt-2 leading-snug">{meal.food}</p>
                        </div>
                        <p className="text-[10px] text-emerald-600 font-mono font-bold mt-2">~ {meal.cal} แคลอรี่</p>
                      </div>
                    ))}
                  </div>

                  {/* Healthy advice footnotes */}
                  <div className="text-[10px] text-slate-400 leading-relaxed font-sans pt-1">
                    * ปรุงรสตามใจด้วยเกลือต่ำกว่า 2000 มก. เลี่ยงของเหลวทอดชุ่มน้ำมัน และควรตบท้ายด้วยน้ำแร่ธรรมชาติหลังมื้ออาหาร
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Core Historical Weigh-in Logs */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <h3 className="font-bold text-xs text-slate-700 font-sans uppercase mb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" /> ประวัติการประเมินและการชั่งน้ำหนักย้อนหลัง ({logs.length})
            </h3>

            {logs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-sans">
                      <th className="py-2 font-semibold">วันที่จดบันทึก</th>
                      <th className="py-2 font-semibold">น้ำหนัก (กก.)</th>
                      <th className="py-2 font-semibold">ดัชนี BMI</th>
                      <th className="py-2 font-semibold">สถานะสรีระ</th>
                      <th className="py-2 font-semibold">เป้าแคลอรี่/วัน</th>
                      <th className="py-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 5).map(lg => (
                      <tr key={lg.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-2.5 font-mono text-[10px] text-slate-500">{lg.date}</td>
                        <td className="py-2.5 font-bold font-mono text-slate-800">{lg.weight} kg</td>
                        <td className="py-2.5 font-bold font-mono text-slate-800">{lg.bmi}</td>
                        <td className="py-2.5 font-sans font-medium text-slate-600">{lg.bmiStatus}</td>
                        <td className="py-2.5 font-mono text-emerald-600 font-bold">{lg.caloriesGoal} kcal</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => deleteLog(lg.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                            title="ลบข้อมูลบันทึก"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length > 5 && <p className="text-center text-[10px] text-slate-400 mt-2 font-sans font-medium">* แสดงเฉพาะบันทึกการชั่ง 5 ครั้งล่าสุดเพื่อประสิทธิภาพสูงสุด</p>}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-[11px] font-sans mt-1">ยังไม่มีการชั่งน้ำหนักบันทึกข้อมูลย้อนหลัง</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
