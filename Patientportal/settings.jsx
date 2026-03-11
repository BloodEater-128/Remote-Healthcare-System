import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";


/* ════════════════════════════════════════
   PATIENT DATA
════════════════════════════════════════ */
const PATIENT_STATIC = {
  id: "PAT-0042",
  uhid: "UHID-CGH-20240042",
  regPhone: "+91 98765-43210",
  regDate: "10 Jan 2025",
};

const PATIENT_EDITABLE_DEFAULT = {
  name: "Alex Johnson",
  dob: "1988-06-14",
  gender: "Male",
  blood: "O+",
  email: "alex.johnson@email.com",
  altPhone: "",
  whatsapp: "+91 98765-43210",
  address: "12, Sector 5, Dwarka, New Delhi – 110075",
  emergencyName: "Sarah Johnson",
  emergencyRel: "Spouse",
  emergencyPhone: "+91 91234-56789",
  language: "English",
  notifyAppt: true,
  notifyReport: true,
  notifyBill: true,
  notifyReminder: true,
};

/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */
const Input = ({ label, value, onChange, disabled, type = "text", hint, icon, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'Syne',sans-serif", fontSize: ".62rem", fontWeight: 700, color: disabled ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.38)", textTransform: "uppercase", letterSpacing: ".08em", display: "flex", alignItems: "center", gap: 5 }}>
        {icon && <span>{icon}</span>}
        {label}
        {required && <span style={{ color: "#ff6b6b" }}>*</span>}
        {disabled && <span style={{ marginLeft: "auto", fontSize: ".55rem", padding: "1px 7px", borderRadius: 50, background: "rgba(255,107,107,.1)", border: "1px solid rgba(255,107,107,.18)", color: "#ff9999", fontWeight: 600, letterSpacing: ".04em" }}>🔒 LOCKED</span>}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 11,
            background: disabled ? "rgba(255,255,255,.02)" : focused ? "rgba(0,200,255,.06)" : "rgba(255,255,255,.04)",
            border: disabled ? "1px solid rgba(255,255,255,.05)" : focused ? "1px solid rgba(0,200,255,.35)" : "1px solid rgba(255,255,255,.09)",
            color: disabled ? "rgba(255,255,255,.3)" : "#fff",
            fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", outline: "none",
            transition: "all .2s",
            cursor: disabled ? "not-allowed" : "text",
            boxShadow: focused && !disabled ? "0 0 0 3px rgba(0,200,255,.07)" : "none",
          }}
        />
      </div>
      {hint && <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.22)", marginTop: 1 }}>{hint}</div>}
    </div>
  );
};

const Select = ({ label, value, onChange, options, icon }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'Syne',sans-serif", fontSize: ".62rem", fontWeight: 700, color: "rgba(255,255,255,.38)", textTransform: "uppercase", letterSpacing: ".08em", display: "flex", alignItems: "center", gap: 5 }}>
        {icon && <span>{icon}</span>}{label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 11,
          background: focused ? "rgba(0,200,255,.06)" : "rgba(255,255,255,.04)",
          border: focused ? "1px solid rgba(0,200,255,.35)" : "1px solid rgba(255,255,255,.09)",
          color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem",
          outline: "none", cursor: "pointer", transition: "all .2s",
          boxShadow: focused ? "0 0 0 3px rgba(0,200,255,.07)" : "none",
        }}>
        {options.map(o => <option key={o} value={o} style={{ background: "#0b1a30" }}>{o}</option>)}
      </select>
    </div>
  );
};

const Toggle = ({ label, description, value, onChange, color = "#00ff9d" }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", transition: "border-color .2s" }}>
    <div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, color: "rgba(255,255,255,.75)" }}>{label}</div>
      {description && <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 2 }}>{description}</div>}
    </div>
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 50, position: "relative", cursor: "pointer",
        background: value ? `${color}30` : "rgba(255,255,255,.08)",
        border: value ? `1px solid ${color}50` : "1px solid rgba(255,255,255,.12)",
        transition: "all .25s", flexShrink: 0,
      }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 22 : 3, width: 16, height: 16, borderRadius: "50%",
        background: value ? color : "rgba(255,255,255,.3)",
        transition: "all .25s",
        boxShadow: value ? `0 0 8px ${color}` : "none",
      }} />
    </button>
  </div>
);

const SectionCard = ({ title, icon, children, accent = "#00c8ff" }) => (
  <div style={{ background: "rgba(255,255,255,.025)", border: `1px solid rgba(255,255,255,.07)`, borderRadius: 18, overflow: "hidden", animation: "fadeUp .4s both", marginBottom: "1.1rem" }}>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.02)" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}14`, border: `1px solid ${accent}24`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{icon}</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 800, color: "#fff" }}>{title}</div>
    </div>
    <div style={{ padding: "1.1rem 1.3rem" }}>{children}</div>
  </div>
);

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
const Toast = ({ msg, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      padding: "12px 20px", borderRadius: 13, display: "flex", alignItems: "center", gap: 10,
      background: type === "success" ? "rgba(0,255,157,.12)" : "rgba(255,107,107,.12)",
      border: type === "success" ? "1px solid rgba(0,255,157,.3)" : "1px solid rgba(255,107,107,.3)",
      color: type === "success" ? "#00ff9d" : "#ff6b6b",
      fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700,
      animation: "slideUp .3s both",
      boxShadow: type === "success" ? "0 8px 32px rgba(0,255,157,.12)" : "0 8px 32px rgba(255,107,107,.12)",
    }}>
      <span style={{ fontSize: "1.1rem" }}>{type === "success" ? "✅" : "❌"}</span>
      {msg}
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function SettingsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...PATIENT_EDITABLE_DEFAULT });
  const [saved, setSaved] = useState({ ...PATIENT_EDITABLE_DEFAULT });
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState(new Date());

  // ── Password change state ──────────────────────────────────
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pwStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const pwStrengthLabel = (s) => ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"][s] || "";
  const pwStrengthColor = (s) => ["#ff6b6b", "#ff6b6b", "#fbbf24", "#ffd93d", "#00c8ff", "#00ff9d"][s] || "#ff6b6b";

  const setPw = (key) => (val) => setPwForm(f => ({ ...f, [key]: val }));

  const handlePwChange = async () => {
    const errs = {};
    if (!pwForm.current) errs.current = "Enter your current password";
    if (pwForm.newPw.length < 8) errs.newPw = "Must be at least 8 characters";
    if (pwForm.newPw === pwForm.current && pwForm.newPw) errs.newPw = "Must differ from current password";
    if (pwForm.newPw !== pwForm.confirm) errs.confirm = "Passwords do not match";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPwSaving(true);
    await new Promise(r => setTimeout(r, 1100));
    setPwSaving(false);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setPwErrors({});
    setShowPwForm(false);
    setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    setToast({ msg: "Password changed successfully! 🔐", type: "success" });
  };

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API call
    setSaved({ ...form });
    setSaving(false);
    setToast({ msg: "Settings saved successfully!", type: "success" });
  };

  const handleDiscard = () => {
    setForm({ ...saved });
    setToast({ msg: "Changes discarded.", type: "error" });
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: "👤" },
    { key: "contact", label: "Contact", icon: "📞" },
    { key: "emergency", label: "Emergency", icon: "🚨" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "account", label: "Account", icon: "🔐" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes hb{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.09)}60%{transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{height:100%;font-family:'DM Sans',sans-serif;background:#050f1f}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,200,255,.2);border-radius:99px}
        .vp{display:flex;height:100vh;overflow:hidden;background:#050f1f}
        
        /* ── SIDEBAR ── */
        .sidebar{width:72px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:1rem .5rem;background:rgba(5,12,28,.95);border-right:1px solid rgba(255,255,255,.06);gap:4px;z-index:20;transition:width .3s cubic-bezier(.16,1,.3,1);overflow:hidden}
        .sidebar.expanded{width:220px;align-items:flex-start;padding:1rem .8rem}
        .sb-profile{display:flex;align-items:center;gap:11px;padding:10px 8px;border-radius:13px;background:rgba(0,200,255,.06);border:1px solid rgba(0,200,255,.14);margin-bottom:.8rem;width:100%;cursor:pointer;transition:background .2s;flex-shrink:0}
        .sb-profile:hover{background:rgba(0,200,255,.1)}
        .sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0066ff,#00c8ff);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:2px solid rgba(0,200,255,.35);animation:hb 3s ease-in-out infinite}
        .sb-profile-info{display:none;flex-direction:column;min-width:0}
        .sidebar.expanded .sb-profile-info{display:flex}
        .sb-name{font-family:'Syne',sans-serif;font-size:.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .sb-role{font-size:.62rem;color:rgba(0,200,255,.7);margin-top:1px}
        .sb-toggle{width:100%;display:flex;align-items:center;flex-direction:row;gap:6px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);cursor:pointer;color:rgba(255,255,255,.5);transition:all .2s;margin-bottom:.5rem;flex-shrink:0}
        .sb-toggle:hover{background:rgba(255,255,255,.08);color:#fff}
        .sb-toggle-lines{display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .sb-toggle-line{height:2px;width:18px;border-radius:99px;background:currentColor}
        .sb-toggle-line:nth-child(2){width:13px}
        .sb-toggle-line:nth-child(3){width:8px}
        .sb-nav{display:flex;flex-direction:column;gap:3px;width:100%;flex:1}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:11px;border:none;cursor:pointer;background:transparent;transition:all .2s;color:rgba(255,255,255,.38);width:100%;white-space:nowrap;overflow:hidden}
        .sb-item:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .sb-item.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.18);color:#00c8ff}
        .sb-item-icon{font-size:1.15rem;flex-shrink:0;width:24px;text-align:center}
        .sb-item-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-item-label{display:block}
        .sb-active-bar{width:3px;height:16px;border-radius:99px;background:#00c8ff;box-shadow:0 0 8px #00c8ff;margin-left:auto;flex-shrink:0;display:none}
        .sb-item.active .sb-active-bar{display:block}
        .sb-divider{width:100%;height:1px;background:rgba(255,255,255,.06);margin:.4rem 0;flex-shrink:0}
        .sb-bottom{display:flex;flex-direction:column;gap:4px;width:100%;flex-shrink:0}
        .sb-logout{display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;border-radius:11px;border:1px solid rgba(255,80,80,.15);cursor:pointer;background:rgba(255,80,80,.05);transition:all .2s;color:rgba(255,100,100,.7);width:100%;white-space:nowrap;overflow:hidden}
        .sb-logout:hover{background:rgba(255,80,80,.12);color:#ff6b6b;border-color:rgba(255,80,80,.3)}
        .sidebar.expanded .sb-logout{justify-content:flex-start}
        .sb-logout-label{font-family:'Syne',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.04em;display:none}
        .sidebar.expanded .sb-logout-label{display:block}

        /* ── MAIN ── */
        .vp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
        .vp-topbar{display:flex;align-items:center;justify-content:space-between;padding:.9rem 1.8rem;background:rgba(5,15,31,.96);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;backdrop-filter:blur(10px)}
        .vp-title{font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:800;color:#fff}
        .vp-sub{font-size:.72rem;color:rgba(255,255,255,.32);margin-top:1px}
        .vp-topright{display:flex;align-items:center;gap:10px}
        .live-pill{display:flex;align-items:center;gap:7px;padding:6px 14px;background:rgba(0,255,157,.07);border:1px solid rgba(0,255,157,.2);border-radius:50px}
        .live-dot{width:7px;height:7px;border-radius:50%;background:#00ff9d;box-shadow:0 0 8px #00ff9d;animation:blink 1s step-start infinite;flex-shrink:0}
        .live-pill span{font-size:.7rem;color:#00ff9d;font-weight:700;letter-spacing:.06em}
        .time-txt{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:700;color:#00c8ff}

        /* ── SETTINGS TABS ── */
        .s-tabs{display:flex;gap:4px;padding:.8rem 1.8rem .6rem;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;background:rgba(5,15,31,.7);overflow-x:auto}
        .s-tabs::-webkit-scrollbar{height:0}
        .s-tab{display:flex;align-items:center;gap:7px;padding:7px 16px;border-radius:9px;border:none;cursor:pointer;font-family:'Syne',sans-serif;font-size:.74rem;font-weight:700;letter-spacing:.04em;transition:all .2s;background:transparent;color:rgba(255,255,255,.35);white-space:nowrap;flex-shrink:0}
        .s-tab:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.7)}
        .s-tab.active{background:rgba(0,200,255,.1);border:1px solid rgba(0,200,255,.2);color:#00c8ff}

        /* ── CONTENT ── */
        .vp-content{flex:1;overflow-y:auto;padding:1.4rem 1.8rem}

        /* ── SAVE BAR ── */
        .save-bar{
          display:flex;align-items:center;justify-content:space-between;
          padding:10px 1.8rem;background:rgba(251,191,36,.07);
          border-top:1px solid rgba(251,191,36,.2);flex-shrink:0;
          animation:fadeUp .2s both;
        }

        @media(max-width:768px){
          .sidebar{display:none}
          .vp-content{padding:1rem}
          .s-tabs{padding:.6rem 1rem}
        }
      `}</style>

      <div className="vp">

        <Sidebar active="settings" />

        {/* ══ MAIN ══ */}
        <div className="vp-main">

          {/* topbar */}
          <div className="vp-topbar">
            <div>
              <div className="vp-title">⚙️ Settings</div>
              <div className="vp-sub">Manage your profile, contact info & notification preferences</div>
            </div>
            <div className="vp-topright">
              <div className="live-pill"><div className="live-dot" /><span>SYNCED</span></div>
              <span className="time-txt">{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>

          {/* section tabs */}
          <div className="s-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`s-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* unsaved changes bar */}
          {isDirty && (
            <div className="save-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: ".9rem" }}>⚠️</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "#fbbf24" }}>You have unsaved changes</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleDiscard}
                  style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700 }}>
                  Discard
                </button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: "6px 16px", borderRadius: 8, background: "rgba(0,200,255,.15)", border: "1px solid rgba(0,200,255,.35)", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6, opacity: saving ? .7 : 1 }}>
                  {saving ? <span style={{ animation: "spin .8s linear infinite", display: "inline-block" }}>⟳</span> : null}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* content area */}
          <div className="vp-content">

            {/* ─── PROFILE TAB ─── */}
            {activeTab === "profile" && (
              <div style={{ maxWidth: 680 }}>

                {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "1.1rem 1.3rem", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, marginBottom: "1.1rem", animation: "fadeUp .3s both" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#0066ff,#00c8ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", border: "3px solid rgba(0,200,255,.35)", boxShadow: "0 0 24px rgba(0,200,255,.2)", flexShrink: 0 }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "1rem", fontWeight: 800, color: "#fff" }}>{form.name || "—"}</div>
                    <div style={{ fontSize: ".68rem", color: "rgba(0,200,255,.7)", marginTop: 2 }}>Patient · {PATIENT_STATIC.id}</div>
                    <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Registered {PATIENT_STATIC.regDate} · City General Hospital</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 50, background: "rgba(0,255,157,.1)", border: "1px solid rgba(0,255,157,.25)", color: "#00ff9d", fontSize: ".6rem", fontWeight: 700 }}>● Active</span>
                  </div>
                </div>

                {/* Locked IDs */}
                <SectionCard title="Hospital Registration (Read-only)" icon="🏥" accent="#ff6b6b">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Input label="Patient ID" value={PATIENT_STATIC.id} disabled icon="🪪" hint="Assigned by hospital — cannot be changed" />
                    <Input label="UHID" value={PATIENT_STATIC.uhid} disabled icon="🏥" hint="Unique Hospital ID — cannot be changed" />
                    <Input label="Registered Mobile" value={PATIENT_STATIC.regPhone} disabled icon="📱" hint="Mobile used during registration — contact hospital to update" />
                    <Input label="Registered On" value={PATIENT_STATIC.regDate} disabled icon="📅" />
                  </div>
                </SectionCard>

                {/* Editable profile */}
                <SectionCard title="Personal Information" icon="👤" accent="#00c8ff">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Input label="Full Name" value={form.name} onChange={set("name")} icon="✏️" required />
                    <Input label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" icon="🎂" />
                    <Select label="Gender" value={form.gender} onChange={set("gender")} icon="🧬"
                      options={["Male", "Female", "Non-binary", "Prefer not to say"]} />
                    <Select label="Blood Group" value={form.blood} onChange={set("blood")} icon="🩸"
                      options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]} />
                    <Select label="Preferred Language" value={form.language} onChange={set("language")} icon="🌐"
                      options={["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati"]} />
                  </div>
                </SectionCard>

              </div>
            )}

            {/* ─── CONTACT TAB ─── */}
            {activeTab === "contact" && (
              <div style={{ maxWidth: 680 }}>

                <SectionCard title="Contact Details" icon="📞" accent="#00c8ff">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Input label="Email Address" value={form.email} onChange={set("email")} type="email" icon="📧" required />
                    <Input label="Alternate Phone" value={form.altPhone} onChange={set("altPhone")} type="tel" icon="📲" hint="Optional second number" />
                    <div style={{ gridColumn: "1/-1" }}>
                      <Input label="Home Address" value={form.address} onChange={set("address")} icon="🏠" />
                    </div>
                  </div>
                </SectionCard>

                {/* WhatsApp notification number */}
                <SectionCard title="WhatsApp Notifications" icon="💬" accent="#00ff9d">
                  <div style={{ padding: "10px 14px", borderRadius: 11, background: "rgba(0,255,157,.06)", border: "1px solid rgba(0,255,157,.15)", marginBottom: "1rem", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.1rem", marginTop: 1 }}>ℹ️</span>
                    <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.55)", lineHeight: 1.7 }}>
                      Add a <strong style={{ color: "#00ff9d" }}>WhatsApp number</strong> to receive appointment reminders, report ready alerts, medicine reminders, and billing notifications directly on WhatsApp. This can be different from your registered mobile number.
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ gridColumn: "1/-1" }}>
                      <Input
                        label="WhatsApp Number"
                        value={form.whatsapp}
                        onChange={set("whatsapp")}
                        type="tel"
                        icon="💬"
                        hint="Enter with country code e.g. +91 98765-43210"
                        required
                      />
                    </div>
                  </div>

                  {/* Preview of what notifications will be sent */}
                  <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                    {[
                      { icon: "📅", label: "Appointment Reminders", desc: "1 day & 1 hr before" },
                      { icon: "📋", label: "Report Ready Alerts", desc: "When results are uploaded" },
                      { icon: "💊", label: "Medicine Reminders", desc: "Daily dose reminders" },
                      { icon: "🧾", label: "Bill Notifications", desc: "New bill or due reminders" },
                    ].map(({ icon, label, desc }) => (
                      <div key={label} style={{ padding: "9px 12px", borderRadius: 10, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 9, alignItems: "center" }}>
                        <span style={{ fontSize: "1rem" }}>{icon}</span>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.7)" }}>{label}</div>
                          <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

              </div>
            )}

            {/* ─── EMERGENCY TAB ─── */}
            {activeTab === "emergency" && (
              <div style={{ maxWidth: 680 }}>
                <div style={{ padding: "10px 14px", borderRadius: 11, background: "rgba(255,107,107,.06)", border: "1px solid rgba(255,107,107,.15)", marginBottom: "1rem", display: "flex", gap: 10, alignItems: "center", animation: "fadeUp .3s both" }}>
                  <span style={{ fontSize: "1.1rem" }}>🚨</span>
                  <div style={{ fontSize: ".74rem", color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>
                    Emergency contact will be notified by the hospital in case of a medical emergency. Please keep this information up to date.
                  </div>
                </div>

                <SectionCard title="Emergency Contact" icon="🚨" accent="#ff6b6b">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Input label="Contact Name" value={form.emergencyName} onChange={set("emergencyName")} icon="👤" required />
                    <Select label="Relationship" value={form.emergencyRel} onChange={set("emergencyRel")} icon="🤝"
                      options={["Spouse", "Parent", "Sibling", "Child", "Friend", "Guardian", "Other"]} />
                    <div style={{ gridColumn: "1/-1" }}>
                      <Input label="Emergency Phone Number" value={form.emergencyPhone} onChange={set("emergencyPhone")} type="tel" icon="📞" required
                        hint="This number will be called first in an emergency" />
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ─── NOTIFICATIONS TAB ─── */}
            {activeTab === "notifications" && (
              <div style={{ maxWidth: 680 }}>

                <SectionCard title="WhatsApp Notification Preferences" icon="💬" accent="#00ff9d">
                  <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                    <Toggle
                      label="Appointment Reminders"
                      description="Get reminders 1 day and 1 hour before your scheduled appointment"
                      value={form.notifyAppt}
                      onChange={set("notifyAppt")}
                      color="#00ff9d"
                    />
                    <Toggle
                      label="Report Ready Alerts"
                      description="Notified when your lab or radiology report is uploaded"
                      value={form.notifyReport}
                      onChange={set("notifyReport")}
                      color="#00c8ff"
                    />
                    <Toggle
                      label="Billing Notifications"
                      description="New bill generated or payment due reminders"
                      value={form.notifyBill}
                      onChange={set("notifyBill")}
                      color="#fbbf24"
                    />
                    <Toggle
                      label="Medicine Reminders"
                      description="Daily reminders for your current medications"
                      value={form.notifyReminder}
                      onChange={set("notifyReminder")}
                      color="#a78bfa"
                    />
                  </div>

                  <div style={{ marginTop: "1rem", padding: "10px 14px", borderRadius: 11, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".72rem", fontWeight: 700, color: "rgba(255,255,255,.6)" }}>Sending to WhatsApp</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".82rem", fontWeight: 800, color: "#00ff9d", marginTop: 2 }}>{form.whatsapp || "—"}</div>
                    </div>
                    <button onClick={() => setActiveTab("contact")}
                      style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.2)", color: "#00c8ff", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700 }}>
                      Change Number
                    </button>
                  </div>
                </SectionCard>

              </div>
            )}

            {/* ─── ACCOUNT TAB ─── */}
            {activeTab === "account" && (
              <div style={{ maxWidth: 680 }}>

                <SectionCard title="Account Security" icon="🔐" accent="#a78bfa">
                  <div style={{ display: "flex", flexDirection: "column", gap: ".7rem" }}>

                    {/* ── Change Password ── */}
                    <div style={{ borderRadius: 13, background: "rgba(255,255,255,.025)", border: `1px solid ${showPwForm ? "rgba(167,139,250,.35)" : "rgba(255,255,255,.07)"}`, overflow: "hidden", transition: "border-color .2s" }}>

                      {/* Header row */}
                      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(167,139,250,.1)", border: "1px solid rgba(167,139,250,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🔑</div>
                          <div>
                            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, color: "rgba(255,255,255,.75)" }}>Password</div>
                            <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Last changed 30 days ago · ••••••••••••</div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setShowPwForm(v => !v); setPwErrors({}); setPwForm({ current: "", newPw: "", confirm: "" }); }}
                          style={{ padding: "6px 14px", borderRadius: 8, background: showPwForm ? "rgba(255,107,107,.1)" : "rgba(167,139,250,.1)", border: showPwForm ? "1px solid rgba(255,107,107,.25)" : "1px solid rgba(167,139,250,.25)", color: showPwForm ? "#ff9999" : "#a78bfa", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700, transition: "all .2s" }}>
                          {showPwForm ? "✕ Cancel" : "🔑 Change"}
                        </button>
                      </div>

                      {/* Inline form — slides open */}
                      {showPwForm && (
                        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 14, animation: "fadeUp .25s both" }}>

                          {/* Current password */}
                          <div style={{ marginBottom: 12 }}>
                            <label style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 5 }}>Current Password</label>
                            <div style={{ position: "relative" }}>
                              <input
                                type={showCurrent ? "text" : "password"}
                                value={pwForm.current}
                                onChange={e => setPw("current")(e.target.value)}
                                placeholder="Enter current password"
                                style={{ width: "100%", padding: "10px 42px 10px 14px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${pwErrors.current ? "#ff6b6b" : "rgba(255,255,255,.09)"}`, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", outline: "none" }}
                              />
                              <button onClick={() => setShowCurrent(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.35)", fontSize: ".85rem" }}>
                                {showCurrent ? "🙈" : "👁"}
                              </button>
                            </div>
                            {pwErrors.current && <div style={{ fontSize: ".6rem", color: "#ff6b6b", marginTop: 4 }}>⚠ {pwErrors.current}</div>}
                          </div>

                          {/* New password */}
                          <div style={{ marginBottom: 8 }}>
                            <label style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 5 }}>New Password</label>
                            <div style={{ position: "relative" }}>
                              <input
                                type={showNew ? "text" : "password"}
                                value={pwForm.newPw}
                                onChange={e => setPw("newPw")(e.target.value)}
                                placeholder="Min. 8 characters"
                                style={{ width: "100%", padding: "10px 42px 10px 14px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${pwErrors.newPw ? "#ff6b6b" : "rgba(255,255,255,.09)"}`, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", outline: "none" }}
                              />
                              <button onClick={() => setShowNew(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.35)", fontSize: ".85rem" }}>
                                {showNew ? "🙈" : "👁"}
                              </button>
                            </div>
                            {pwErrors.newPw && <div style={{ fontSize: ".6rem", color: "#ff6b6b", marginTop: 4 }}>⚠ {pwErrors.newPw}</div>}

                            {/* Strength bar */}
                            {pwForm.newPw.length > 0 && (() => {
                              const s = pwStrength(pwForm.newPw);
                              const col = pwStrengthColor(s);
                              return (
                                <div style={{ marginTop: 8 }}>
                                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                                    {[0, 1, 2, 3, 4].map(i => (
                                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < s ? col : "rgba(255,255,255,.08)", transition: "background .3s" }} />
                                    ))}
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.25)" }}>
                                      {[
                                        pwForm.newPw.length >= 8 ? "✓" : "✗",
                                        " 8+ chars  ",
                                        /[A-Z]/.test(pwForm.newPw) ? "✓" : "✗",
                                        " uppercase  ",
                                        /[0-9]/.test(pwForm.newPw) ? "✓" : "✗",
                                        " number  ",
                                        /[^A-Za-z0-9]/.test(pwForm.newPw) ? "✓" : "✗",
                                        " symbol",
                                      ].map((t, i) => (
                                        <span key={i} style={{ color: t === "✓" ? "#00ff9d" : t === "✗" ? "rgba(255,107,107,.6)" : "rgba(255,255,255,.22)" }}>{t}</span>
                                      ))}
                                    </div>
                                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: col }}>{pwStrengthLabel(s)}</div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Confirm password */}
                          <div style={{ marginBottom: 16 }}>
                            <label style={{ fontFamily: "'Syne',sans-serif", fontSize: ".6rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 5 }}>Confirm New Password</label>
                            <div style={{ position: "relative" }}>
                              <input
                                type={showConfirm ? "text" : "password"}
                                value={pwForm.confirm}
                                onChange={e => setPw("confirm")(e.target.value)}
                                placeholder="Re-enter new password"
                                style={{ width: "100%", padding: "10px 42px 10px 14px", borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${pwErrors.confirm ? "#ff6b6b" : pwForm.confirm && pwForm.confirm === pwForm.newPw ? "rgba(0,255,157,.35)" : "rgba(255,255,255,.09)"}`, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: ".82rem", outline: "none" }}
                              />
                              <button onClick={() => setShowConfirm(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.35)", fontSize: ".85rem" }}>
                                {showConfirm ? "🙈" : "👁"}
                              </button>
                            </div>
                            {pwErrors.confirm && <div style={{ fontSize: ".6rem", color: "#ff6b6b", marginTop: 4 }}>⚠ {pwErrors.confirm}</div>}
                            {!pwErrors.confirm && pwForm.confirm && pwForm.confirm === pwForm.newPw && (
                              <div style={{ fontSize: ".6rem", color: "#00ff9d", marginTop: 4 }}>✓ Passwords match</div>
                            )}
                          </div>

                          {/* Submit */}
                          <button
                            onClick={handlePwChange}
                            disabled={pwSaving}
                            style={{ width: "100%", padding: "11px", borderRadius: 10, background: "linear-gradient(135deg,rgba(124,58,237,.4),rgba(167,139,250,.3))", border: "1px solid rgba(167,139,250,.4)", color: "#c4b5fd", cursor: pwSaving ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, letterSpacing: ".05em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all .2s", opacity: pwSaving ? .7 : 1 }}>
                            {pwSaving
                              ? <><span style={{ animation: "spin .8s linear infinite", display: "inline-block" }}>⟳</span> Changing Password…</>
                              : <>🔐 Update Password</>
                            }
                          </button>

                        </div>
                      )}
                    </div>

                    {/* 2FA */}
                    <div style={{ padding: "14px 16px", borderRadius: 13, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,255,157,.08)", border: "1px solid rgba(0,255,157,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🛡️</div>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, color: "rgba(255,255,255,.75)" }}>Two-Factor Authentication</div>
                          <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Extra security via OTP on registered mobile</div>
                        </div>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 50, background: "rgba(0,255,157,.1)", border: "1px solid rgba(0,255,157,.22)", color: "#00ff9d", fontSize: ".6rem", fontWeight: 700 }}>Enabled</span>
                    </div>

                    {/* Active sessions */}
                    <div style={{ padding: "14px 16px", borderRadius: 13, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,200,255,.08)", border: "1px solid rgba(0,200,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>📱</div>
                        <div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, color: "rgba(255,255,255,.75)" }}>Active Sessions</div>
                          <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Chrome · Windows · New Delhi · Just now</div>
                        </div>
                      </div>
                      <button style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,107,107,.07)", border: "1px solid rgba(255,107,107,.18)", color: "#ff9999", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700 }}>
                        Sign Out All
                      </button>
                    </div>

                  </div>
                </SectionCard>

                {/* Danger zone */}
                <SectionCard title="Danger Zone" icon="⚠️" accent="#ff6b6b">
                  <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                    <div style={{ padding: "13px 16px", borderRadius: 12, background: "rgba(255,107,107,.05)", border: "1px solid rgba(255,107,107,.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, color: "rgba(255,255,255,.7)" }}>Download My Data</div>
                        <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Export all your reports, bills, and vitals</div>
                      </div>
                      <button style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700 }}>
                        Export
                      </button>
                    </div>
                    <div style={{ padding: "13px 16px", borderRadius: 12, background: "rgba(255,107,107,.05)", border: "1px solid rgba(255,107,107,.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: ".76rem", fontWeight: 700, color: "#ff9999" }}>Log Out</div>
                        <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.28)", marginTop: 1 }}>Sign out of the patient portal</div>
                      </div>
                      <button style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,107,107,.1)", border: "1px solid rgba(255,107,107,.25)", color: "#ff6b6b", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: ".65rem", fontWeight: 700 }}>
                        Log Out
                      </button>
                    </div>
                  </div>
                </SectionCard>

              </div>
            )}

            {/* bottom save button (always visible in content) */}
            {activeTab !== "account" && (
              <div style={{ maxWidth: 680, marginTop: "1rem", paddingBottom: "1rem" }}>
                <button onClick={handleSave} disabled={saving || !isDirty}
                  style={{ padding: "12px 28px", borderRadius: 12, background: isDirty ? "linear-gradient(135deg,rgba(0,100,255,.4),rgba(0,200,255,.3))" : "rgba(255,255,255,.04)", border: isDirty ? "1px solid rgba(0,200,255,.4)" : "1px solid rgba(255,255,255,.08)", color: isDirty ? "#00c8ff" : "rgba(255,255,255,.2)", cursor: isDirty ? "pointer" : "not-allowed", fontFamily: "'Syne',sans-serif", fontSize: ".78rem", fontWeight: 700, letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 7, transition: "all .2s", boxShadow: isDirty ? "0 0 20px rgba(0,200,255,.15)" : "none" }}>
                  {saving ? <span style={{ animation: "spin .8s linear infinite", display: "inline-block" }}>⟳</span> : "💾"}
                  {saving ? "Saving…" : isDirty ? "Save Changes" : "All Changes Saved"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}
