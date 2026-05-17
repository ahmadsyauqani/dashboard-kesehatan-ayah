'use client';

import { useState } from 'react';
import { Parameter } from '@/types/health';

interface HealthTipsProps {
  parameters: Parameter[];
}

interface Tip {
  id: string;
  category: string;
  emoji: string;
  title: string;
  concern: string;
  gradient: string;
  gradientBg: string;
  foods: { name: string; emoji: string; why: string }[];
  avoid: { name: string; emoji: string; why: string }[];
  lifestyle: { text: string; emoji: string }[];
}

function getLatest(param: Parameter | undefined): { value: number | string; status: string } | null {
  if (!param) return null;
  const valid = param.values.filter(v => v.value !== '-');
  return valid.length > 0 ? valid[valid.length - 1] : null;
}

function generateTips(parameters: Parameter[]): Tip[] {
  const tips: Tip[] = [];
  const get = (id: string) => parameters.find(p => p.id === id);

  // 1. Diabetes / Gula Darah
  const glucose = getLatest(get('fasting_glucose'));
  const hba1c = getLatest(get('hba1c'));
  if ((glucose && Number(glucose.value) > 99) || (hba1c && Number(hba1c.value) > 5.7)) {
    tips.push({
      id: 'diabetes',
      category: 'Gula Darah & Diabetes',
      emoji: '🩸',
      title: 'Cara Menurunkan Gula Darah',
      concern: `GDP ${glucose?.value ?? '-'} mg/dL, HbA1c ${hba1c?.value ?? '-'}% — di atas target`,
      gradient: 'from-rose-400 to-pink-500',
      gradientBg: 'from-rose-50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/10',
      foods: [
        { name: 'Sayur hijau (bayam, kangkung, brokoli)', emoji: '🥦', why: 'Rendah gula, tinggi serat — memperlambat lonjakan gula darah' },
        { name: 'Ikan laut (salmon, kembung, tongkol)', emoji: '🐟', why: 'Omega-3 membantu sensitivitas insulin' },
        { name: 'Kacang-kacangan (almond, kedelai)', emoji: '🥜', why: 'Protein nabati & serat tinggi, GI rendah' },
        { name: 'Oatmeal / gandum utuh', emoji: '🌾', why: 'Karbohidrat kompleks yang dicerna perlahan' },
        { name: 'Kayu manis (taburkan di makanan)', emoji: '🫚', why: 'Penelitian menunjukkan bisa membantu sensitivitas insulin' },
        { name: 'Labu siam, pare', emoji: '🥒', why: 'Pare mengandung zat mirip insulin alami' },
      ],
      avoid: [
        { name: 'Nasi putih berlebihan', emoji: '🍚', why: 'GI tinggi — ganti separuh porsi dengan nasi merah' },
        { name: 'Minuman manis (teh manis, jus kemasan)', emoji: '🥤', why: 'Lonjakan gula darah sangat cepat' },
        { name: 'Roti putih, mie instan', emoji: '🍜', why: 'Karbohidrat olahan — cepat jadi gula' },
        { name: 'Buah sangat manis (mangga, durian)', emoji: '🥭', why: 'Porsi kecil saja, jangan berlebihan' },
      ],
      lifestyle: [
        { text: 'Jalan kaki 30 menit setelah makan — bantu turunkan gula', emoji: '🚶' },
        { text: 'Makan porsi kecil tapi lebih sering (5x sehari)', emoji: '🍽️' },
        { text: 'Minum air putih minimal 8 gelas/hari', emoji: '💧' },
        { text: 'Tidur cukup 7-8 jam — kurang tidur naikkan gula darah', emoji: '😴' },
        { text: 'Rutin minum obat sesuai resep dokter', emoji: '💊' },
      ],
    });
  }

  // 2. Fungsi Ginjal
  const egfr = getLatest(get('egfr'));
  const creat = getLatest(get('creatinine'));
  if ((egfr && Number(egfr.value) < 90) || (creat && Number(creat.value) > 1.20)) {
    tips.push({
      id: 'kidney',
      category: 'Fungsi Ginjal',
      emoji: '🫘',
      title: 'Cara Menjaga Ginjal Tetap Sehat',
      concern: `eLFG ${egfr?.value ?? '-'} mL/min — ${Number(egfr?.value) < 60 ? 'perlu perhatian serius' : 'sedikit di bawah normal'}`,
      gradient: 'from-teal-400 to-cyan-500',
      gradientBg: 'from-teal-50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/10',
      foods: [
        { name: 'Putih telur', emoji: '🥚', why: 'Protein berkualitas tinggi, rendah fosfor' },
        { name: 'Ikan (kukus/panggang)', emoji: '🐟', why: 'Protein baik tanpa beban berlebih untuk ginjal' },
        { name: 'Kubis, kembang kol', emoji: '🥬', why: 'Rendah kalium, aman untuk ginjal' },
        { name: 'Apel, anggur, nanas', emoji: '🍎', why: 'Buah rendah kalium yang aman' },
        { name: 'Bawang putih', emoji: '🧄', why: 'Anti-inflamasi, melindungi ginjal' },
      ],
      avoid: [
        { name: 'Makanan tinggi garam', emoji: '🧂', why: 'Garam berlebih membebani ginjal' },
        { name: 'Daging merah berlebihan', emoji: '🥩', why: 'Protein tinggi yang berat untuk ginjal' },
        { name: 'Makanan kaleng & olahan', emoji: '🥫', why: 'Tinggi natrium dan pengawet' },
        { name: 'Minuman bersoda', emoji: '🥤', why: 'Tinggi fosfor yang membebani ginjal' },
      ],
      lifestyle: [
        { text: 'Minum air putih 6-8 gelas/hari — jangan terlalu sedikit atau berlebihan', emoji: '💧' },
        { text: 'Kurangi garam — masak pakai rempah sebagai pengganti', emoji: '🌿' },
        { text: 'Jangan tahan buang air kecil terlalu lama', emoji: '🚽' },
        { text: 'Kontrol gula darah — diabetes adalah penyebab utama kerusakan ginjal', emoji: '🩸' },
        { text: 'Hindari obat pereda nyeri tanpa resep dokter (ibuprofen, dll)', emoji: '⚠️' },
      ],
    });
  }

  // 3. Kolesterol / Lipid
  const hdl = getLatest(get('hdl'));
  const ldl = getLatest(get('ldl'));
  if ((hdl && Number(hdl.value) < 40) || (ldl && Number(ldl.value) > 100)) {
    tips.push({
      id: 'lipid',
      category: 'Kolesterol',
      emoji: '🫀',
      title: 'Cara Menjaga Kolesterol Tetap Sehat',
      concern: `HDL ${hdl?.value ?? '-'} mg/dL (baik harus > 40), LDL ${ldl?.value ?? '-'} mg/dL`,
      gradient: 'from-red-400 to-rose-500',
      gradientBg: 'from-red-50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/10',
      foods: [
        { name: 'Alpukat', emoji: '🥑', why: 'Lemak sehat yang menaikkan HDL (kolesterol baik)' },
        { name: 'Ikan berlemak (salmon, sarden)', emoji: '🐟', why: 'Omega-3 menurunkan trigliserida & naikkan HDL' },
        { name: 'Kacang almond & kenari', emoji: '🥜', why: 'Lemak tak jenuh yang menurunkan LDL' },
        { name: 'Minyak zaitun', emoji: '🫒', why: 'Ganti minyak goreng biasa — lebih sehat untuk jantung' },
        { name: 'Oat & biji-bijian', emoji: '🌾', why: 'Beta-glucan menyerap kolesterol di usus' },
      ],
      avoid: [
        { name: 'Gorengan', emoji: '🍳', why: 'Minyak trans menaikkan LDL dan turunkan HDL' },
        { name: 'Jeroan (hati, ampela)', emoji: '🫁', why: 'Sangat tinggi kolesterol' },
        { name: 'Mentega & margarin', emoji: '🧈', why: 'Lemak jenuh — ganti dengan minyak zaitun' },
        { name: 'Makanan cepat saji', emoji: '🍔', why: 'Tinggi lemak trans dan garam' },
      ],
      lifestyle: [
        { text: 'Olahraga rutin 30 menit/hari — jalan cepat sudah cukup', emoji: '🏃' },
        { text: 'Makan serat dari sayur & buah setiap hari', emoji: '🥗' },
        { text: 'Rutin minum obat kolesterol sesuai resep', emoji: '💊' },
        { text: 'Masak dengan cara kukus/rebus, kurangi goreng', emoji: '🍲' },
      ],
    });
  }

  // 4. Elektrolit (Natrium rendah)
  const natrium = getLatest(get('natrium'));
  const kalium = getLatest(get('kalium'));
  if ((natrium && Number(natrium.value) < 136) || (kalium && Number(kalium.value) > 5.1)) {
    tips.push({
      id: 'electrolyte',
      category: 'Elektrolit',
      emoji: '⚡',
      title: 'Menjaga Keseimbangan Mineral Tubuh',
      concern: `Natrium ${natrium?.value ?? '-'} mEq/L${Number(natrium?.value) < 136 ? ' (rendah)' : ''}, Kalium ${kalium?.value ?? '-'} mEq/L`,
      gradient: 'from-sky-400 to-blue-500',
      gradientBg: 'from-sky-50 to-blue-50/50 dark:from-sky-950/20 dark:to-blue-950/10',
      foods: [
        { name: 'Sup kaldu ayam/sapi', emoji: '🍲', why: 'Mengembalikan natrium secara alami' },
        { name: 'Wortel, kentang (rebus)', emoji: '🥕', why: 'Mineral seimbang yang mudah diserap' },
        { name: 'Pisang (porsi kecil jika kalium normal)', emoji: '🍌', why: 'Sumber kalium alami — atur porsi sesuai kondisi' },
        { name: 'Air kelapa muda', emoji: '🥥', why: 'Elektrolit alami yang menyeimbangkan tubuh' },
      ],
      avoid: [
        { name: 'Minum air terlalu banyak sekaligus', emoji: '💧', why: 'Bisa mengencerkan natrium — minum sedikit-sedikit' },
        { name: 'Suplemen kalium tanpa resep', emoji: '💊', why: 'Bisa berbahaya jika kalium sudah tinggi' },
      ],
      lifestyle: [
        { text: 'Minum air secukupnya — tidak kurang, tidak berlebihan', emoji: '💧' },
        { text: 'Konsultasi dokter jika sering pusing atau lemas', emoji: '🩺' },
        { text: 'Cek elektrolit rutin setiap kontrol', emoji: '📋' },
      ],
    });
  }

  // 5. Asam Urat
  const uricAcid = getLatest(get('uric_acid'));
  if (uricAcid && Number(uricAcid.value) > 7.0) {
    tips.push({
      id: 'uric',
      category: 'Asam Urat',
      emoji: '💠',
      title: 'Cara Menurunkan Asam Urat',
      concern: `Asam Urat ${uricAcid.value} mg/dL — di atas batas normal 7.0`,
      gradient: 'from-purple-400 to-fuchsia-500',
      gradientBg: 'from-purple-50 to-fuchsia-50/50 dark:from-purple-950/20 dark:to-fuchsia-950/10',
      foods: [
        { name: 'Ceri & stroberi', emoji: '🍒', why: 'Mengandung anthocyanin yang menurunkan asam urat' },
        { name: 'Susu rendah lemak', emoji: '🥛', why: 'Protein susu membantu ekskresi asam urat' },
        { name: 'Sayuran hijau (bukan bayam)', emoji: '🥬', why: 'Serat tinggi, purin rendah' },
        { name: 'Air putih banyak', emoji: '💧', why: 'Membantu ginjal membuang asam urat' },
      ],
      avoid: [
        { name: 'Jeroan (hati, ginjal, otak)', emoji: '🫁', why: 'Sangat tinggi purin — penyebab utama asam urat' },
        { name: 'Seafood (udang, kerang, cumi)', emoji: '🦐', why: 'Tinggi purin' },
        { name: 'Daging merah berlebihan', emoji: '🥩', why: 'Purin tinggi — batasi porsi' },
        { name: 'Minuman beralkohol', emoji: '🍺', why: 'Menghambat pembuangan asam urat oleh ginjal' },
      ],
      lifestyle: [
        { text: 'Minum air putih 8-10 gelas/hari', emoji: '💧' },
        { text: 'Jaga berat badan ideal', emoji: '⚖️' },
        { text: 'Hindari puasa terlalu lama — bisa naikkan asam urat', emoji: '🍽️' },
        { text: 'Minum obat sesuai resep jika ada', emoji: '💊' },
      ],
    });
  }

  // 6. Hematologi — Sel darah putih abnormal
  const neutrophil = getLatest(get('neutrophil'));
  const lymphocyte = getLatest(get('lymphocyte'));
  if ((neutrophil && Number(neutrophil.value) > 67.9) || (lymphocyte && Number(lymphocyte.value) < 21.8)) {
    tips.push({
      id: 'immunity',
      category: 'Daya Tahan Tubuh',
      emoji: '🛡️',
      title: 'Meningkatkan Kekebalan Tubuh',
      concern: `Neutrofil ${neutrophil?.value ?? '-'}% (tinggi), Limfosit ${lymphocyte?.value ?? '-'}% (rendah) — bisa tanda peradangan`,
      gradient: 'from-indigo-400 to-violet-500',
      gradientBg: 'from-indigo-50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/10',
      foods: [
        { name: 'Jeruk, jambu biji, pepaya', emoji: '🍊', why: 'Vitamin C tinggi — memperkuat sel imun' },
        { name: 'Yogurt / susu fermentasi', emoji: '🥛', why: 'Probiotik menjaga kesehatan usus & imunitas' },
        { name: 'Bawang putih & jahe', emoji: '🧄', why: 'Anti-inflamasi dan anti-bakteri alami' },
        { name: 'Tempe & tahu', emoji: '🫘', why: 'Protein nabati yang mudah dicerna dan bergizi' },
        { name: 'Kunyit (dalam masakan)', emoji: '🟡', why: 'Kurkumin adalah anti-inflamasi kuat' },
      ],
      avoid: [
        { name: 'Makanan ultra-olahan', emoji: '🍟', why: 'Memicu peradangan dalam tubuh' },
        { name: 'Gula berlebihan', emoji: '🍬', why: 'Gula tinggi menekan fungsi sel imun' },
        { name: 'Begadang', emoji: '🌙', why: 'Kurang tidur sangat menurunkan imunitas' },
      ],
      lifestyle: [
        { text: 'Tidur 7-8 jam setiap malam', emoji: '😴' },
        { text: 'Kelola stres — stres kronis menurunkan imunitas', emoji: '🧘' },
        { text: 'Olahraga ringan teratur (jalan, berenang)', emoji: '🏊' },
        { text: 'Jaga kebersihan tangan dan lingkungan', emoji: '🧼' },
        { text: 'Konsultasi dokter jika sering merasa tidak enak badan', emoji: '🩺' },
      ],
    });
  }

  return tips;
}

export default function HealthTips({ parameters }: HealthTipsProps) {
  const tips = generateTips(parameters);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (tips.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      {/* Section Header */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-xs">💡</span>
        </div>
        <div>
          <h2 className="text-xs font-bold text-[var(--warm-700)]">
            Saran & Rekomendasi Kesehatan
          </h2>
          <p className="text-[10px] text-[var(--warm-400)]">
            Tips sehari-hari berdasarkan hasil lab terbaru
          </p>
        </div>
      </div>

      {/* Tips Cards */}
      {tips.map((tip) => {
        const isExpanded = expandedId === tip.id;
        return (
          <div
            key={tip.id}
            className={`card overflow-hidden transition-all duration-300 ${
              isExpanded ? 'ring-1 ring-emerald-200 dark:ring-emerald-800/50' : ''
            }`}
          >
            {/* Card Header — always visible */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : tip.id)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tip.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                <span className="text-lg">{tip.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-[var(--warm-700)] truncate">
                  {tip.title}
                </h3>
                <p className="text-[10px] text-[var(--warm-400)] truncate">
                  {tip.concern}
                </p>
              </div>
              <span className={`text-[var(--warm-400)] transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className={`px-4 pb-4 bg-gradient-to-br ${tip.gradientBg} animate-fade-in`}>
                {/* Makanan yang Disarankan */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-[10px]">✅</span>
                    Makanan yang Disarankan
                  </h4>
                  <div className="space-y-1.5">
                    {tip.foods.map((food, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-sm flex-shrink-0 mt-0.5">{food.emoji}</span>
                        <div>
                          <p className="text-[11px] font-semibold text-[var(--warm-700)]">{food.name}</p>
                          <p className="text-[10px] text-[var(--warm-400)]">{food.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Makanan yang Dihindari */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[10px]">🚫</span>
                    Yang Sebaiknya Dihindari / Dikurangi
                  </h4>
                  <div className="space-y-1.5">
                    {tip.avoid.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white/60 dark:bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-sm flex-shrink-0 mt-0.5">{item.emoji}</span>
                        <div>
                          <p className="text-[11px] font-semibold text-[var(--warm-700)]">{item.name}</p>
                          <p className="text-[10px] text-[var(--warm-400)]">{item.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips Gaya Hidup */}
                <div>
                  <h4 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px]">💪</span>
                    Tips Gaya Hidup
                  </h4>
                  <div className="space-y-1">
                    {tip.lifestyle.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[var(--warm-600)] dark:text-[var(--warm-300)]">
                        <span className="flex-shrink-0">{item.emoji}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-3 pt-2 border-t border-[var(--warm-200)] dark:border-[var(--warm-100)]">
                  <p className="text-[9px] text-[var(--warm-400)] italic">
                    ⚕️ Saran ini bersifat umum. Selalu konsultasikan dengan dr. Debby C. Soemitha, Sp.PD sebelum mengubah pola makan atau gaya hidup.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
