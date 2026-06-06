/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { THAI_HOSPITALS } from '../data';
import { Hospital } from '../types';
import { calculateDistance } from '../utils';
import { Compass, Shield, Phone, Hospital as HospIcon, MapPin, Navigation, ExternalLink, RefreshCw, Star } from 'lucide-react';

interface LocationState {
  lat: number;
  lng: number;
  accuracy: number | null;
  granted: boolean | null; // null = pending, false = denied, true = granted
  source: 'gps' | 'simulator';
}

export default function HospitalsSection() {
  const [userLocation, setUserLocation] = useState<LocationState>({
    lat: 13.7468, // Siam Paragon as central default
    lng: 100.5350,
    accuracy: null,
    granted: null,
    source: 'simulator'
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');

  // Simulator hotspot selections
  const BANGKOK_HOTSPOTS = [
    { name: 'สยามสแควร์ (สยามพารากอน)', lat: 13.7468, lng: 100.5350 },
    { name: 'ห้าแยกลาดพร้าว (เซ็นทรัลลาดพร้าว)', lat: 13.8130, lng: 100.5600 },
    { name: 'ศิริราช (วังหลัง-ศาลายา)', lat: 13.7573, lng: 100.4852 },
    { name: 'ทองหล่อ-พร้อมพงษ์ (สุขุมวิท)', lat: 13.7348, lng: 100.5756 },
  ];

  // Request real GPS localization
  const detectLiveGPS = () => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ของคุณไม่สนับสนุนการใช้งาน GPS Geolocation');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          granted: true,
          source: 'gps'
        });
        setLoading(false);
      },
      (error) => {
        console.warn('Geolocation warning / denied:', error.message);
        setUserLocation(prev => ({
          ...prev,
          granted: false,
          source: 'simulator'
        }));
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Run initial detection or simulate auto-load on start
  useEffect(() => {
    detectLiveGPS();
  }, []);

  // Compute live distances using premium utils.ts
  const processedHospitals = THAI_HOSPITALS.map(hosp => {
    const distanceVal = calculateDistance(userLocation.lat, userLocation.lng, hosp.latitude, hosp.longitude);
    return {
      ...hosp,
      distance: distanceVal
    };
  })
  .filter(hosp => {
    if (filterType !== 'all' && hosp.type !== filterType) return false;
    if (searchQuery.trim() !== '') {
      return hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             hosp.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
             hosp.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return true;
  })
  // Sort by nearest hospital first
  .sort((a, b) => a.distance - b.distance);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-sans">โรงพยาบาลใกล้ตัวฉัน (Hospitals Near Me)</h2>
            <p className="text-xs text-slate-500 font-sans">คำนวณระยะห่างด้วยระบบ GPS ค้นหาแผนกฉุกเฉินเฉพาะทาง และเปิดนำทางด่วน</p>
          </div>
        </div>

        {/* GPS Control bar */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="text-xs text-slate-500 flex items-center gap-1.5 font-sans">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
              กำลังเรียกพิกัดดาวเทียม...
            </div>
          ) : (
            <button
              onClick={detectLiveGPS}
              className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer font-sans"
              id="btn-detect-gps"
            >
              <RefreshCw className="w-3.5 h-3.5" /> อัปเดตพิกัด GPS ซ้ำ
            </button>
          )}
        </div>
      </div>

      {/* Geolocation Sensor Display Overlay */}
      <div className="mb-6 p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${userLocation.source === 'gps' ? 'bg-emerald-500' : 'bg-amber-400'} animate-pulse`}></span>
            <span className="text-xs font-bold text-slate-800 font-sans">
              {userLocation.source === 'gps'
                ? `รับข้อมูลพิกัดดาวเทียมจริง (พิกัดถูกต้อง ±${userLocation.accuracy} เมตร)`
                : 'ไม่ได้อนุญาตตำแหน่ง GPS หรือกำลังใช้ตำแหน่งจำลองเขตกรุงเทพมหานคร'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            พิกัดปัจจุบัน: Latitude {userLocation.lat.toFixed(5)}° / Longitude {userLocation.lng.toFixed(5)}°
          </p>
        </div>

        {/* Hotspot location overrides */}
        <div className="space-y-1">
          <label className="text-[9px] font-bold text-slate-400 block font-mono">ปรับตำแหน่งจำลองเพื่อตรวจคำนวณระยะทาง</label>
          <div className="flex flex-wrap gap-1">
            {BANGKOK_HOTSPOTS.map((hot, idx) => {
              const isCurrent = Math.abs(userLocation.lat - hot.lat) < 0.001;
              return (
                <button
                  key={idx}
                  onClick={() => setUserLocation({
                    lat: hot.lat,
                    lng: hot.lng,
                    accuracy: 10,
                    granted: false,
                    source: 'simulator'
                  })}
                  className={`text-[10px] px-2.5 py-1 rounded-md border transition font-sans ${
                    isCurrent
                      ? 'bg-rose-600 text-white border-rose-600 font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {hot.name.split(' (')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="พิมพ์ค้นหาโรงพยาบาล แผนกเฉพาะทาง หรือที่อยู่..."
          className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-500 font-sans"
        />
        <div className="flex gap-1.5">
          {(['all', 'public', 'private'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 border rounded-xl text-xs font-bold transition font-sans ${
                filterType === type
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {type === 'all' ? 'ทั้งหมด' : type === 'public' ? 'รพ. รัฐบาล' : 'รพ. เอกชน'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Map Listing Grid */}
      {processedHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedHospitals.map(hosp => (
            <div
              key={hosp.id}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:border-rose-200 hover:shadow-md transition flex flex-col justify-between"
              id={`hospital-card-${hosp.id}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans uppercase font-extrabold ${
                    hosp.type === 'public'
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-100/50'
                      : 'bg-indigo-50 text-indigo-800 border-indigo-100/50'
                  }`}>
                    {hosp.type === 'public' ? 'รพ. รัฐบาล (Govt)' : 'รพ. เอกชน (Pvt)'}
                  </span>

                  {/* Calculated dynamic distance distance tag */}
                  <div className="bg-rose-50 text-rose-700 font-bold font-mono text-xs px-2.5 py-0.5 rounded-full border border-rose-100/30 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    {hosp.distance} กม.
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-800 leading-tight flex items-start gap-1.5 font-sans mb-1">
                  <HospIcon className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  {hosp.name}
                </h3>
                
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-sans">{hosp.address}</p>

                {/* Specialties Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {hosp.specialties.map((spec, i) => (
                    <span key={i} className="bg-slate-50 text-slate-600 text-[9px] font-sans px-1.5 py-0.5 rounded border border-slate-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${hosp.phone}`}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs rounded-lg border border-slate-200/50 font-bold flex items-center gap-1 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {hosp.phone}
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-sm font-sans"
                >
                  <Navigation className="w-3.5 h-3.5" /> นำทางไปสาขายา
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <Shield className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-xs font-sans mt-2">ไม่พบโรงพยาบาลในพิกัดคำถามของคุณหรือที่สอดคล้องกับตัวกรอง</p>
        </div>
      )}
    </div>
  );
}
