import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaUser, FaSave, FaKey, FaTimes } from 'react-icons/fa';
import { getMe, updateProfile, updatePassword } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext';

export default function Profile() {
  const { user: authUser, loadUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [avatar, setAvatar] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: res } = await getMe();
        const u = res?.data || res || authUser;
        setProfile({ name: u.name || '', email: u.email || '', phone: u.phone || '', address: u.address || '' });
      } catch {
        if (authUser) setProfile({ name: authUser.name || '', email: authUser.email || '', phone: authUser.phone || '', address: authUser.address || '' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      toast.success('Profile updated successfully');
      loadUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password updated successfully');
      setShowPasswordForm(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 animate-pulse">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="h-6 w-48 bg-slate-200 rounded mx-auto mb-2" />
          <div className="h-4 w-32 bg-slate-100 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account details</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-6 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3">
            {avatar ? (
              <img src={URL.createObjectURL(avatar)} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <FaUser className="text-white text-3xl" />
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{profile.name || 'User'}</h2>
          <p className="text-orange-200 text-sm">{profile.email}</p>
        </div>

        <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={profile.email} disabled className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Avatar</label>
              <input type="file" onChange={e => setAvatar(e.target.files[0])} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg transition-colors">
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setShowPasswordForm(true)} className="flex items-center gap-2 px-5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
              <FaKey /> Change Password
            </button>
          </div>
        </form>
      </motion.div>

      {showPasswordForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowPasswordForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Change Password</h2>
              <button onClick={() => setShowPasswordForm(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handlePasswordUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input type="password" value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input type="password" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500" required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg">{saving ? 'Updating...' : 'Update Password'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
