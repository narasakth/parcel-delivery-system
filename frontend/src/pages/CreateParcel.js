import { useState } from 'react';
import { api } from '../services/api';
import { PackagePlus, Calculator } from 'lucide-react';

export default function CreateParcel() {
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ weight_kg: '', distance_km: '' });

  const previewFee = (w, d) => {
    const base = 20, perKg = 10, perKm = 2;
    return Math.max(0, Math.round(base + perKg * (parseFloat(w) || 0) + perKm * (parseFloat(d) || 0)));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const body = Object.fromEntries(form.entries());
      body.weight_kg = parseFloat(body.weight_kg || 0);
      body.distance_km = parseFloat(body.distance_km || 0);
      const res = await api.createParcel(body);
      setCreated(res);
      e.currentTarget.reset();
      setFormData({ weight_kg: '', distance_km: '' });
    } catch (error) {
      console.error('Error creating parcel:', error);
    } finally { setLoading(false); }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputCls = "rounded-lg bg-black border border-gray-700 text-gray-100 placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400";
  const cardCls  = "rounded-2xl border border-yellow-500/30 bg-black/60 shadow-lg overflow-hidden";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-400">Create Parcel</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <section className={cardCls}>
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-5 text-black flex items-center gap-3">
            <div className="p-2 bg-black/10 rounded-lg"><PackagePlus className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-extrabold">กรอกข้อมูลพัสดุ</h3>
              <p className="text-black/70 text-sm">ผู้ส่ง / ผู้รับ / รายละเอียดพัสดุ</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-5 grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">ผู้ส่ง</label>
                <input name="sender_name" className={inputCls} placeholder="ชื่อผู้ส่ง" required />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">เบอร์ผู้ส่ง</label>
                <input name="sender_phone" className={inputCls} placeholder="0xx-xxx-xxxx" required />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">ผู้รับ</label>
                <input name="receiver_name" className={inputCls} placeholder="ชื่อผู้รับ" required />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">เบอร์ผู้รับ</label>
                <input name="receiver_phone" className={inputCls} placeholder="0xx-xxx-xxxx" required />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-yellow-400">ที่อยู่ผู้รับ</label>
              <textarea name="receiver_address" className={inputCls} placeholder="บ้านเลขที่ / ถนน / ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์" required />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">น้ำหนัก (กก.)</label>
                <input name="weight_kg" value={formData.weight_kg} onChange={onChange} className={inputCls} placeholder="เช่น 2.5" required />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">ขนาด (กxยxส ซม.)</label>
                <input name="size_lwh_cm" className={inputCls} placeholder="เช่น 20x30x15" />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-yellow-400">ระยะทาง (กม.)</label>
                <input name="distance_km" value={formData.distance_km} onChange={onChange} className={inputCls} placeholder="เช่น 15" required />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button disabled={loading} className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2.5 font-semibold shadow">
                {loading ? 'กำลังบันทึก…' : 'บันทึก'}
              </button>
              <div className="text-sm text-gray-400">* ค่าขนส่งคำนวณซ้ำฝั่งเซิร์ฟเวอร์เมื่อบันทึก</div>
            </div>

            {created && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-900/30 p-4 text-emerald-200">
                สร้างสำเร็จ: {created.tracking_no} (id #{created.id})
              </div>
            )}
          </form>
        </section>

        {/* Live Fee Preview */}
        <section className={cardCls}>
          <div className="bg-black/50 p-5 flex items-center gap-3 border-b border-yellow-500/20">
            <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30"><Calculator className="w-5 h-5 text-yellow-400" /></div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-400">ตัวอย่างค่าขนส่ง (Live)</h3>
              <p className="text-gray-300 text-sm">สูตร: 20 + 10×น้ำหนัก(กก.) + 2×ระยะทาง(กม.)</p>
            </div>
          </div>
          <div className="p-6">
            <div className="text-sm text-gray-300 mb-2">กรอกน้ำหนัก/ระยะทางในแบบฟอร์ม แล้วดูผลด้านล่าง</div>
            <div className="rounded-xl border border-yellow-500/30 bg-black/70 p-6">
              <div className="text-gray-300">ค่าประมาณ</div>
              <div className="text-4xl font-extrabold tracking-tight text-yellow-400">฿{previewFee(formData.weight_kg, formData.distance_km).toLocaleString()}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
