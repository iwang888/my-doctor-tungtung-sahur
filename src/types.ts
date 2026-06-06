/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  image: string;
  rating: number;
  reviews: number;
  experience: number;
  education: string;
  availability: string[];
  bio: string;
  recommendedMedicineIds?: string[];
}

export interface Department {
  id: string;
  name: string;
  englishName: string;
  description: string;
  icon: string;
  color: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: 'public' | 'private';
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  rating: number;
  isOpen24h: boolean;
  specialties: string[];
}

export interface Medication {
  id: string;
  name: string;
  thaiName: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  dosage: string;
  indication: string;
  sideEffects: string;
}

export interface CartItem {
  medication: Medication;
  quantity: number;
}

export interface Prescription {
  doctorName: string;
  departmentName: string;
  date: string;
  medications: {
    medicationId: string;
    name: string;
    dosage: string;
    quantity: number;
  }[];
  notes?: string;
  status: 'pending' | 'ordered';
}

export interface Caregiver {
  id: string;
  name: string;
  role: 'nurse' | 'caregiver' | 'therapist';
  roleThai: string;
  experienceYears: number;
  rating: number;
  skills: string[];
  bio: string;
  pricePerDay: number;
  available: boolean;
  image: string;
}

export interface HomeCareBooking {
  id: string;
  patientName: string;
  patientAge: number;
  caregiverId: string;
  caregiverName: string;
  startDate: string;
  durationDays: number;
  conditions: string[];
  notes: string;
  bookingTime: string;
}

export interface NutritionLog {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  bmiStatus: string;
  tdee: number;
  waterGoal: number;
  caloriesGoal: number;
}

export interface MyClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
}
