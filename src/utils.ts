/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the Haversine distance between two points on the Earth
 * @param lat1 latitude of point 1 in degrees
 * @param lon1 longitude of point 1 in degrees
 * @param lat2 latitude of point 2 in degrees
 * @param lon2 longitude of point 2 in degrees
 * @returns distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
}

/**
 * Validates height and weight inputs and calculates BMI
 * Height in cm, Weight in kg
 */
export function calculateBMI(weight: number, height: number): {
  bmi: number;
  status: string;
  color: string;
  advice: string;
} {
  const heightInMeters = height / 100;
  const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

  let status = '';
  let color = '';
  let advice = '';

  if (bmi < 18.5) {
    status = 'น้ำหนักน้อยกว่าเกณฑ์ (Underweight)';
    color = 'amber-500';
    advice = 'คุณจัดอยู่ในเกณฑ์น้ำหนักน้อย ควรรับประทานอาหารอาหารที่มีพลังงานและสารอาหารครบถ้วน เน้นโปรตีนกลุ่มเนื้อสัตว์ ไข่ นม และคาร์โบไฮเดรตเชิงซ้อน และพักผ่อนให้เพียงพอเพื่อเสริมสร้างมวลกล้ามเนื้อ';
  } else if (bmi >= 18.5 && bmi < 23) {
    status = 'น้ำหนักปกติ สมส่วน (Healthy Weight)';
    color = 'emerald-500';
    advice = 'ยอดเยี่ยมมาก! สุขภาพและดัชนีมวลกายของคุณอยู่ในเกณฑ์ปกติ ควรดูแลและรักษาสมดุลนี้อย่างต่อเนื่องด้วยสารอาหารที่สดใหม่ ผลไม้ ผักหลากสี และออกกำลังกายสม่ำเสมอสัปดาห์ละ 150 นาที';
  } else if (bmi >= 23 && bmi < 25) {
    status = 'น้ำหนักเกินเกณฑ์เล็กน้อย / ท้วม (Overweight - Level 1)';
    color = 'orange-400';
    advice = 'คุณมีน้ำหนักอยู่ในระดับท้วมเล็กน้อย ควรเริ่มเฝ้าระวังและการควบคุมอาหารรสหวาน มัน เค็ม คุมสัดส่วนคาร์โบไฮเดรต และเพิ่มปริมาณใยอาหารจากผักผลไม้ พร้อมกับการเดินเร็วหรือวิ่งจ๊อกกิ้งเบาๆ';
  } else if (bmi >= 25 && bmi < 30) {
    status = 'โรคอ้วนระดับ 1 (Obese Class 1)';
    color = 'orange-600';
    advice = 'คุณมีเกณฑ์เสี่ยงเป็นโรคอ้วนระดับที่ 1 แนะนำให้ปรับสัดส่วนจานอาหารแบบ 2:1:1 (ผัก 2 ส่วน ข้าวน้อย 1 ส่วน โปรตีนไร้มัน 1 ส่วน) และลดเครื่องดื่มหวานชงต่างๆ เพื่อลดการสะสมไขมันช่องท้อง';
  } else {
    status = 'โรคอ้วนระดับ 2 / อ้วนอันตราย (Obese Class 2)';
    color = 'rose-600';
    advice = 'มีปริมาณไขมันสะสมในร่างกายเกินขอบเขต แนะนำให้ปรึกษานักโภชนาการหรือแพทย์ผู้เชี่ยวชาญเพื่อร่วมกันวางแผนการบริโภคอาหารที่ถูกต้อง และประเมินสุขภาพหลอดเลือดเป็นประจำ';
  }

  return { bmi, status, color, advice };
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR)
 * Activity Level multiplier:
 * sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725
 */
export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active'
): { bmr: number; tdee: number } {
  // Harris-Benedict Formula
  let bmr = 0;
  if (gender === 'male') {
    bmr = 66 + 13.7 * weight + 5 * height - 6.8 * age;
  } else {
    bmr = 655 + 9.6 * weight + 1.8 * height - 4.7 * age;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  const tdee = bmr * multipliers[activityLevel];
  return { bmr: Math.round(bmr), tdee: Math.round(tdee) };
}

/**
 * Safely saves data to localStorage
 */
export function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
}

/**
 * Safely reads data from localStorage
 */
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}
