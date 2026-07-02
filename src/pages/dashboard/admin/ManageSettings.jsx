import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaSave } from 'react-icons/fa';
import { getSettings, updateSetting } from '../../../api/settings';
import ErrorMessage from '../../../components/common/ErrorMessage';

const TABS = ['General', 'SEO', 'Social', 'Email'];

export default function ManageSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('General');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: '', address: '', phone: '', email: '',
    metaTitle: '', metaDescription: '',
    facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '',
    smtpHost: '', smtpPort: '', smtpUser: '', smtpPass: '', smtpFrom: '',
  });

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getSettings();
      const s = res?.data || {};
      setSettings(s);
      setForm(prev => ({ ...prev, ...s }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      await updateSetting(key, form[key]);
      toast.success(`${key} updated`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGroup = async (keys) => {
    setSaving(true);
    try {
      for (const key of keys) {
        await updateSetting(key, form[key]);
      }
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-slate-200 rounded-xl animate-pulse" />)}</div>;
  if (error) return <ErrorMessage message={error} onRetry={fetchSettings} />;

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500";

  const renderGeneral = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
        <input value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
        <textarea value={form.address} onChange={e => handleChange('address', e.target.value)} rows={3} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input value={form.phone} onChange={e => handleChange('phone', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input value={form.email} onChange={e => handleChange('email', e.target.value)} className={inputClass} />
        </div>
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
        <input value={form.metaTitle} onChange={e => handleChange('metaTitle', e.target.value)} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
        <textarea value={form.metaDescription} onChange={e => handleChange('metaDescription', e.target.value)} rows={4} className={inputClass} />
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-4">
      {[
        { key: 'facebook', label: 'Facebook URL' },
        { key: 'twitter', label: 'Twitter URL' },
        { key: 'instagram', label: 'Instagram URL' },
        { key: 'linkedin', label: 'LinkedIn URL' },
        { key: 'youtube', label: 'YouTube URL' },
      ].map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
          <input value={form[key]} onChange={e => handleChange(key, e.target.value)} className={inputClass} placeholder={`https://${key}.com/...`} />
        </div>
      ))}
    </div>
  );

  const renderEmail = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
          <input value={form.smtpHost} onChange={e => handleChange('smtpHost', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label>
          <input value={form.smtpPort} onChange={e => handleChange('smtpPort', e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Username</label>
          <input value={form.smtpUser} onChange={e => handleChange('smtpUser', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password</label>
          <input type="password" value={form.smtpPass} onChange={e => handleChange('smtpPass', e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">From Email</label>
        <input value={form.smtpFrom} onChange={e => handleChange('smtpFrom', e.target.value)} className={inputClass} />
      </div>
    </div>
  );

  const tabContent = {
    General: renderGeneral,
    SEO: renderSEO,
    Social: renderSocial,
    Email: renderEmail,
  };

  const tabKeys = {
    General: ['companyName', 'address', 'phone', 'email'],
    SEO: ['metaTitle', 'metaDescription'],
    Social: ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'],
    Email: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpFrom'],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Settings</h1>
        <p className="text-slate-500 text-sm">Configure application settings</p>
      </div>

      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {tabContent[activeTab]()}
        <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => handleSaveGroup(tabKeys[activeTab])}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
