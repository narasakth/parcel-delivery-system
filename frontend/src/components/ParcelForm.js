import { useState } from 'react';

export default function ParcelForm({ onSubmit, previewFee }) {
    const [form, setForm] = useState({
        sender_name: '', sender_phone: '',
        receiver_name: '', receiver_phone: '', receiver_address: '',
        weight_kg: '', size_lwh_cm: '', distance_km: ''
    });

    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    
    return (
        <div className="max-w-4xl mx-auto">
            <form className="bg-white rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm overflow-hidden animate-fade-in" 
                  onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">สร้างรายการพัสดุ</h3>
                            <p className="text-indigo-100">กรอกข้อมูลพัสดุเพื่อสร้างรายการใหม่</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-8">
                    {/* Sender & Receiver Info */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Sender Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                                <h4 className="text-lg font-semibold text-gray-800">ข้อมูลผู้ส่ง</h4>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        name="sender_name" 
                                        placeholder="ชื่อผู้ส่ง" 
                                        value={form.sender_name} 
                                        onChange={change} 
                                        required 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <input 
                                        name="sender_phone" 
                                        placeholder="เบอร์โทรศัพท์ผู้ส่ง" 
                                        value={form.sender_phone} 
                                        onChange={change} 
                                        required 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Receiver Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                                <h4 className="text-lg font-semibold text-gray-800">ข้อมูลผู้รับ</h4>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        name="receiver_name" 
                                        placeholder="ชื่อผู้รับ" 
                                        value={form.receiver_name} 
                                        onChange={change} 
                                        required 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <input 
                                        name="receiver_phone" 
                                        placeholder="เบอร์โทรศัพท์ผู้รับ" 
                                        value={form.receiver_phone} 
                                        onChange={change} 
                                        required 
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                            <h4 className="text-lg font-semibold text-gray-800">ที่อยู่ผู้รับ</h4>
                        </div>
                        <div className="relative">
                            <textarea 
                                name="receiver_address" 
                                placeholder="กรอกที่อยู่ผู้รับอย่างละเอียด" 
                                value={form.receiver_address} 
                                onChange={change} 
                                required 
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                            />
                            <div className="absolute top-3 right-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                            <h4 className="text-lg font-semibold text-gray-800">รายละเอียดพัสดุ</h4>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="relative">
                                <input 
                                    name="weight_kg" 
                                    placeholder="น้ำหนัก (กก.)" 
                                    value={form.weight_kg} 
                                    onChange={change} 
                                    required 
                                    type="number"
                                    step="0.1"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-400 text-sm">กก.</span>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <input 
                                    name="size_lwh_cm" 
                                    placeholder="ขนาด (กxยxส ซม.)" 
                                    value={form.size_lwh_cm} 
                                    onChange={change} 
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-400 text-sm">ซม.</span>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <input 
                                    name="distance_km" 
                                    placeholder="ระยะทาง (กม.)" 
                                    value={form.distance_km} 
                                    onChange={change} 
                                    required 
                                    type="number"
                                    step="0.1"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50 focus:bg-white"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-400 text-sm">กม.</span>
                                </div>
                            </div>
            </div>
            </div>

                    {/* Fee Preview */}
            {previewFee && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">ค่าขนส่งประมาณ</p>
                                        <p className="text-lg font-bold text-indigo-700">฿{previewFee(form).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>สร้างรายการพัสดุ</span>
                        </button>
                    </div>
                </div>
        </form>
        </div>
    );
}
