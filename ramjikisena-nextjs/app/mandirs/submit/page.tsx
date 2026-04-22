'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Church, MapPin, Clock, Phone, Send, CheckCircle2, ArrowLeft, Camera, Globe, Building2, Calendar, Info, Plus, X, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TEMPLE_TYPES = ['Other','Jyotirlinga','Shakti Peeth','Char Dham','Divya Desam','Ashtavinayak'];
const AARTI_PRESETS = ['Mangala Aarti','Shangar Aarti','Rajbhog Aarti','Utthapan Aarti','Bhog Aarti','Sandhya Aarti','Shayan Aarti'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Ekadashi','Purnima','Amavasya','All Days'];

const iStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,130,0,0.25)', color: '#f9e07a' };
const iCls = "w-full px-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none";
const lStyle = { color: 'rgba(255,200,120,0.55)' };

function F({ label, k, form, set, ph, ta, type='text' }: any) {
  return (
    <div>
      <label className="text-xs font-black mb-1 block" style={lStyle}>{label}</label>
      {ta ? <textarea value={form[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} rows={3} className={iCls+' resize-none'} style={iStyle}/>
          : <input type={type} value={form[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph} className={iCls} style={iStyle}/>}
    </div>
  );
}

function Chk({ label, k, form, set }: any) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={!!form[k]} onChange={e=>set(k,e.target.checked)} className="w-4 h-4 rounded accent-orange-500"/>
      <span className="text-sm font-bold" style={{color:'rgba(255,200,120,0.7)'}}>{label}</span>
    </label>
  );
}

function Sec({ icon, title, children }: any) {
  return (
    <div className="rounded-2xl p-5 space-y-3" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,130,0,0.2)'}}>
      <div className="flex items-center gap-2 mb-1">
        <span style={{color:'#f9e07a'}}>{icon}</span>
        <p className="text-sm font-black text-white">{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function SubmitMandirPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aartiList, setAartiList] = useState<{name:string;time:string}[]>([{name:'',time:''}]);
  const [specialDays, setSpecialDays] = useState<{day:string;opening:string;closing:string;note:string}[]>([]);
  const [festivals, setFestivals] = useState<{name:string;month:string;description:string}[]>([]);
  const [nearby, setNearby] = useState<{name:string;distance:string;type:string}[]>([]);
  const [form, setF] = useState<Record<string,any>>({
    name:'', description:'', history:'', significance:'',
    templeType:'Other', architecture:'', builtYear:'', languages:'',
    'location.address':'', 'location.city':'', 'location.state':'', 'location.pincode':'',
    'timing.opening':'', 'timing.closing':'', 'timing.specialTimings':'',
    'contact.phone':'', 'contact.email':'', 'contact.website':'',
    'deity.main':'', 'deity.others':'',
    'visitInfo.entryFee':'', 'visitInfo.bestTimeToVisit':'', 'visitInfo.dressCode':'',
    'visitInfo.annualVisitors':'', 'visitInfo.donationInfo':'', 'visitInfo.trustName':'', 'visitInfo.managedBy':'',
    'visitInfo.photographyAllowed':true, 'visitInfo.mobileAllowed':true, 'visitInfo.shoeStand':true,
    'facilities.parking':false, 'facilities.prasad':false, 'facilities.accommodation':false,
    'facilities.wheelchairAccessible':false, 'facilities.restrooms':false, 'facilities.drinkingWater':false,
    'facilities.cloakroom':false, 'facilities.medicalAid':false, 'facilities.foodStalls':false,
    'socialMedia.facebook':'', 'socialMedia.instagram':'', 'socialMedia.youtube':'', 'socialMedia.twitter':'',
    photos:'', videos:'',
  });
  const set = (k:string,v:any) => setF(p=>({...p,[k]:v}));

  useEffect(() => { if (!localStorage.getItem('token')) router.push('/login'); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form['location.city'] || !form['location.state']) return;
    setSubmitting(true);
    try {
      const body = {
        name: form.name, description: form.description, history: form.history, significance: form.significance,
        templeType: form.templeType, architecture: form.architecture, builtYear: form.builtYear,
        languages: form.languages ? form.languages.split(',').map((s:string)=>s.trim()).filter(Boolean) : [],
        photos: form.photos ? form.photos.split(',').map((s:string)=>s.trim()).filter(Boolean) : [],
        videos: form.videos ? form.videos.split(',').map((s:string)=>s.trim()).filter(Boolean) : [],
        location: { address:form['location.address'], city:form['location.city'], state:form['location.state'], pincode:form['location.pincode'] },
        timing: {
          opening: form['timing.opening'], closing: form['timing.closing'],
          specialTimings: form['timing.specialTimings'],
          aarti: aartiList.filter(a=>a.name||a.time),
          specialDays: specialDays.filter(d=>d.day),
        },
        contact: { phone:form['contact.phone'], email:form['contact.email'], website:form['contact.website'] },
        deity: { main:form['deity.main'], others: form['deity.others']?form['deity.others'].split(',').map((s:string)=>s.trim()).filter(Boolean):[] },
        visitInfo: {
          entryFee:form['visitInfo.entryFee'], bestTimeToVisit:form['visitInfo.bestTimeToVisit'],
          dressCode:form['visitInfo.dressCode'], annualVisitors:form['visitInfo.annualVisitors'],
          donationInfo:form['visitInfo.donationInfo'], trustName:form['visitInfo.trustName'], managedBy:form['visitInfo.managedBy'],
          photographyAllowed:form['visitInfo.photographyAllowed'], mobileAllowed:form['visitInfo.mobileAllowed'], shoeStand:form['visitInfo.shoeStand'],
        },
        facilities: {
          parking:form['facilities.parking'], prasad:form['facilities.prasad'], accommodation:form['facilities.accommodation'],
          wheelchairAccessible:form['facilities.wheelchairAccessible'], restrooms:form['facilities.restrooms'], drinkingWater:form['facilities.drinkingWater'],
          cloakroom:form['facilities.cloakroom'], medicalAid:form['facilities.medicalAid'], foodStalls:form['facilities.foodStalls'],
        },
        festivals, nearbyAttractions: nearby,
        socialMedia: { facebook:form['socialMedia.facebook'], instagram:form['socialMedia.instagram'], youtube:form['socialMedia.youtube'], twitter:form['socialMedia.twitter'] },
      };
      const res = await api.post('/api/mandirs/submit', body);
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else alert(data.message || 'कुछ गलत हुआ');
    } catch { alert('Network error'); }
    finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div className="min-h-screen flex flex-col" style={{background:'#0f0500'}}>
      <Navbar/>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{background:'rgba(22,163,74,0.15)',border:'2px solid rgba(22,163,74,0.4)'}}>
            <CheckCircle2 className="w-10 h-10 text-green-400"/>
          </div>
          <h2 className="text-2xl font-black text-white mb-3">सबमिट हो गया! 🙏</h2>
          <p className="text-sm mb-6" style={{color:'rgba(255,200,120,0.6)'}}>Admin approval के बाद आपका मंदिर सार्वजनिक रूप से दिखेगा।</p>
          <div className="flex gap-3 justify-center">
            <button onClick={()=>router.push('/mandirs')} className="px-6 py-2.5 rounded-xl font-black text-sm"
              style={{background:'linear-gradient(135deg,#f9e07a,#d4920a)',color:'#3a0f00'}}>मंदिर देखें</button>
            <button onClick={()=>setSubmitted(false)} className="px-6 py-2.5 rounded-xl font-black text-sm"
              style={{background:'rgba(255,255,255,0.08)',color:'rgba(255,200,120,0.7)',border:'1px solid rgba(200,130,0,0.3)'}}>और सबमिट करें</button>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const fp = {form, set};
  const addBtn = (onClick:()=>void, label:string) => (
    <button type="button" onClick={onClick} className="flex items-center gap-2 text-xs font-black px-3 py-2 rounded-xl"
      style={{background:'rgba(200,130,0,0.15)',color:'#f9e07a',border:'1px dashed rgba(200,130,0,0.4)'}}>
      <Plus className="w-3.5 h-3.5"/> {label}
    </button>
  );
  const delBtn = (onClick:()=>void) => (
    <button type="button" onClick={onClick} className="p-2 rounded-xl flex-shrink-0"
      style={{background:'rgba(239,68,68,0.15)',color:'#f87171'}}><X className="w-4 h-4"/></button>
  );

  return (
    <div className="min-h-screen" style={{background:'#0f0500'}}>
      <Navbar/>
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <button onClick={()=>router.back()} className="flex items-center gap-2 text-sm mb-6" style={{color:'rgba(255,200,120,0.5)'}}>
          <ArrowLeft className="w-4 h-4"/> वापस जाएं
        </button>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest"
            style={{background:'rgba(200,130,0,0.2)',border:'1px solid rgba(200,130,0,0.3)',color:'#f9e07a'}}>
            🛕 मंदिर सबमिट करें
          </div>
          <h1 className="text-2xl font-black text-white">अपने मंदिर की पूरी जानकारी दें</h1>
          <p className="text-sm mt-1" style={{color:'rgba(255,200,120,0.5)'}}>Admin approval के बाद सार्वजनिक रूप से दिखेगा</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Basic */}
          <Sec icon={<Church className="w-4 h-4"/>} title="बुनियादी जानकारी *">
            <F label="मंदिर का नाम *" k="name" ph="जैसे: श्री राम मंदिर" {...fp}/>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black mb-1 block" style={lStyle}>मंदिर प्रकार</label>
                <select value={form.templeType} onChange={e=>set('templeType',e.target.value)} className={iCls} style={iStyle}>
                  {TEMPLE_TYPES.map(t=><option key={t} value={t} style={{background:'#1a0800'}}>{t}</option>)}
                </select>
              </div>
              <F label="निर्माण वर्ष / शताब्दी" k="builtYear" ph="जैसे: 12th Century" {...fp}/>
            </div>
            <F label="मुख्य देवता" k="deity.main" ph="जैसे: श्री राम" {...fp}/>
            <F label="अन्य देवता (comma से)" k="deity.others" ph="सीता माता, लक्ष्मण जी" {...fp}/>
            <F label="वास्तुकला शैली" k="architecture" ph="Dravidian, Nagara, Vesara" {...fp}/>
            <F label="भाषाएं (comma से)" k="languages" ph="Hindi, Sanskrit, Tamil" {...fp}/>
            <F label="विवरण" k="description" ph="मंदिर के बारे में..." ta {...fp}/>
            <F label="धार्मिक महत्व / क्यों प्रसिद्ध है" k="significance" ph="इस मंदिर का धार्मिक महत्व..." ta {...fp}/>
            <F label="इतिहास" k="history" ph="ऐतिहासिक विवरण..." ta {...fp}/>
          </Sec>

          {/* Location */}
          <Sec icon={<MapPin className="w-4 h-4"/>} title="स्थान *">
            <F label="पता" k="location.address" ph="गली, मोहल्ला" {...fp}/>
            <div className="grid grid-cols-2 gap-3">
              <F label="शहर *" k="location.city" ph="अयोध्या" {...fp}/>
              <F label="राज्य *" k="location.state" ph="उत्तर प्रदेश" {...fp}/>
            </div>
            <F label="PIN Code" k="location.pincode" ph="224123" {...fp}/>
          </Sec>

          {/* Timing */}
          <Sec icon={<Clock className="w-4 h-4"/>} title="समय और आरती">
            <div className="grid grid-cols-2 gap-3">
              <F label="खुलने का समय" k="timing.opening" ph="5:00 AM" {...fp}/>
              <F label="बंद होने का समय" k="timing.closing" ph="10:00 PM" {...fp}/>
            </div>
            <F label="विशेष समय नोट" k="timing.specialTimings" ph="सोमवार को 12-4 बजे बंद" {...fp}/>

            {/* Aarti List */}
            <div>
              <label className="text-xs font-black mb-2 block" style={lStyle}>🔔 आरती समय</label>
              <div className="space-y-2">
                {aartiList.map((a,i)=>(
                  <div key={i} className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input list={`aarti-preset-${i}`} value={a.name} onChange={e=>{const n=[...aartiList];n[i].name=e.target.value;setAartiList(n);}}
                        placeholder="आरती का नाम" className={iCls} style={iStyle}/>
                      <datalist id={`aarti-preset-${i}`}>
                        {AARTI_PRESETS.map(p=><option key={p} value={p}/>)}
                      </datalist>
                    </div>
                    <input value={a.time} onChange={e=>{const n=[...aartiList];n[i].time=e.target.value;setAartiList(n);}}
                      placeholder="5:00 AM" className={iCls} style={{...iStyle,width:'110px'}}/>
                    {delBtn(()=>setAartiList(aartiList.filter((_,j)=>j!==i)))}
                  </div>
                ))}
              </div>
              {addBtn(()=>setAartiList([...aartiList,{name:'',time:''}]),'आरती जोड़ें')}
            </div>

            {/* Special Days */}
            <div>
              <label className="text-xs font-black mb-2 block" style={lStyle}>📅 विशेष दिन / अलग समय</label>
              <div className="space-y-2">
                {specialDays.map((d,i)=>(
                  <div key={i} className="flex gap-2 items-center flex-wrap">
                    <div className="relative" style={{minWidth:'120px'}}>
                      <input list={`day-preset-${i}`} value={d.day} onChange={e=>{const n=[...specialDays];n[i].day=e.target.value;setSpecialDays(n);}}
                        placeholder="दिन" className={iCls} style={iStyle}/>
                      <datalist id={`day-preset-${i}`}>
                        {DAYS.map(p=><option key={p} value={p}/>)}
                      </datalist>
                    </div>
                    <input value={d.opening} onChange={e=>{const n=[...specialDays];n[i].opening=e.target.value;setSpecialDays(n);}}
                      placeholder="खुलने का समय" className={iCls} style={{...iStyle,flex:1}}/>
                    <input value={d.closing} onChange={e=>{const n=[...specialDays];n[i].closing=e.target.value;setSpecialDays(n);}}
                      placeholder="बंद होने का समय" className={iCls} style={{...iStyle,flex:1}}/>
                    <input value={d.note} onChange={e=>{const n=[...specialDays];n[i].note=e.target.value;setSpecialDays(n);}}
                      placeholder="नोट (optional)" className={iCls} style={{...iStyle,flex:1}}/>
                    {delBtn(()=>setSpecialDays(specialDays.filter((_,j)=>j!==i)))}
                  </div>
                ))}
              </div>
              {addBtn(()=>setSpecialDays([...specialDays,{day:'',opening:'',closing:'',note:''}]),'विशेष दिन जोड़ें')}
            </div>
          </Sec>

          {/* Visit Info */}
          <Sec icon={<Info className="w-4 h-4"/>} title="यात्रा जानकारी">
            <div className="grid grid-cols-2 gap-3">
              <F label="प्रवेश शुल्क" k="visitInfo.entryFee" ph="निःशुल्क या ₹20" {...fp}/>
              <F label="वार्षिक आगंतुक" k="visitInfo.annualVisitors" ph="10 Lakh+" {...fp}/>
            </div>
            <F label="आने का सबसे अच्छा समय" k="visitInfo.bestTimeToVisit" ph="October to March, Morning 6-8 AM" {...fp}/>
            <F label="ड्रेस कोड" k="visitInfo.dressCode" ph="Traditional attire preferred" {...fp}/>
            <F label="Trust / Committee का नाम" k="visitInfo.trustName" ph="Shri Ram Mandir Trust" {...fp}/>
            <F label="प्रबंधन (Managed By)" k="visitInfo.managedBy" ph="ASI, State Govt, Private Trust" {...fp}/>
            <F label="दान जानकारी" k="visitInfo.donationInfo" ph="Online donation: www...." {...fp}/>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Chk label="📸 Photography Allowed" k="visitInfo.photographyAllowed" {...fp}/>
              <Chk label="📱 Mobile Allowed" k="visitInfo.mobileAllowed" {...fp}/>
              <Chk label="👟 Shoe Stand Available" k="visitInfo.shoeStand" {...fp}/>
            </div>
          </Sec>

          {/* Facilities */}
          <Sec icon={<Building2 className="w-4 h-4"/>} title="सुविधाएं">
            <div className="grid grid-cols-2 gap-2">
              {[['facilities.parking','🅿️ Parking'],['facilities.prasad','🍬 Prasad'],
                ['facilities.accommodation','🏨 Accommodation'],['facilities.wheelchairAccessible','♿ Wheelchair Access'],
                ['facilities.restrooms','🚻 Restrooms'],['facilities.drinkingWater','💧 Drinking Water'],
                ['facilities.cloakroom','🧳 Cloakroom'],['facilities.medicalAid','🏥 Medical Aid'],
                ['facilities.foodStalls','🍽️ Food Stalls'],
              ].map(([k,label])=><Chk key={k} label={label} k={k} {...fp}/>)}
            </div>
          </Sec>

          {/* Festivals */}
          <Sec icon={<Calendar className="w-4 h-4"/>} title="प्रमुख त्योहार">
            {festivals.map((f,i)=>(
              <div key={i} className="flex gap-2">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {(['name','month','description'] as const).map(field=>(
                    <input key={field} value={f[field]} onChange={e=>{const n=[...festivals];n[i][field]=e.target.value;setFestivals(n);}}
                      placeholder={field==='name'?'त्योहार':field==='month'?'महीना':'विवरण'} className={iCls} style={iStyle}/>
                  ))}
                </div>
                {delBtn(()=>setFestivals(festivals.filter((_,j)=>j!==i)))}
              </div>
            ))}
            {addBtn(()=>setFestivals([...festivals,{name:'',month:'',description:''}]),'त्योहार जोड़ें')}
          </Sec>

          {/* Nearby */}
          <Sec icon={<MapPin className="w-4 h-4"/>} title="आस-पास के स्थान">
            {nearby.map((a,i)=>(
              <div key={i} className="flex gap-2">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  {(['name','distance','type'] as const).map(field=>(
                    <input key={field} value={a[field]} onChange={e=>{const n=[...nearby];n[i][field]=e.target.value;setNearby(n);}}
                      placeholder={field==='name'?'स्थान':field==='distance'?'2 km':'Temple'} className={iCls} style={iStyle}/>
                  ))}
                </div>
                {delBtn(()=>setNearby(nearby.filter((_,j)=>j!==i)))}
              </div>
            ))}
            {addBtn(()=>setNearby([...nearby,{name:'',distance:'',type:''}]),'स्थान जोड़ें')}
          </Sec>

          {/* Photos & Videos */}
          <Sec icon={<Camera className="w-4 h-4"/>} title="फोटो और वीडियो">
            <F label="फोटो URLs (comma से)" k="photos" ph="https://example.com/photo1.jpg, ..." {...fp}/>
            <F label="YouTube Embed URLs (comma से)" k="videos" ph="https://www.youtube.com/embed/..." {...fp}/>
          </Sec>

          {/* Contact */}
          <Sec icon={<Phone className="w-4 h-4"/>} title="संपर्क (वैकल्पिक)">
            <div className="grid grid-cols-2 gap-3">
              <F label="फोन नंबर" k="contact.phone" ph="+91 XXXXX XXXXX" {...fp}/>
              <F label="Email" k="contact.email" ph="mandir@example.com" {...fp}/>
            </div>
            <F label="वेबसाइट" k="contact.website" ph="https://..." {...fp}/>
          </Sec>

          {/* Social */}
          <Sec icon={<Globe className="w-4 h-4"/>} title="सोशल मीडिया (वैकल्पिक)">
            <div className="grid grid-cols-2 gap-3">
              <F label="Facebook" k="socialMedia.facebook" ph="https://facebook.com/..." {...fp}/>
              <F label="Instagram" k="socialMedia.instagram" ph="https://instagram.com/..." {...fp}/>
              <F label="YouTube" k="socialMedia.youtube" ph="https://youtube.com/..." {...fp}/>
              <F label="Twitter / X" k="socialMedia.twitter" ph="https://twitter.com/..." {...fp}/>
            </div>
          </Sec>

          <button type="submit" disabled={submitting||!form.name||!form['location.city']||!form['location.state']}
            className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{background:'linear-gradient(135deg,#f9e07a 0%,#d4920a 50%,#b8760a 100%)',color:'#3a0f00',boxShadow:'0 8px 24px rgba(180,100,0,0.35)'}}>
            <Send className="w-4 h-4"/>
            {submitting ? 'सबमिट हो रहा है...' : 'मंदिर सबमिट करें 🙏'}
          </button>
        </form>
      </div>
    </div>
  );
}
