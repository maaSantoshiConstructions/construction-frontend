import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FaPlus, FaBan, FaTimes } from 'react-icons/fa';
import { getUsers, createUser, updateUser } from '../../../api/users';
import DataTable from '../../../components/common/DataTable';
import Pagination from '../../../components/common/Pagination';
import ErrorMessage from '../../../components/common/ErrorMessage';

const roleColors = {
  super_admin: 'bg-red-100 text-red-700',
  company_admin: 'bg-amber-100 text-amber-700',
  sales_executive: 'bg-orange-100 text-orange-700',
  channel_partner: 'bg-green-100 text-green-700',
  customer: 'bg-slate-100 text-slate-700',
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUsers = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await getUsers({ page: p, limit: 10 });
      setUsers(res?.data || []);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const openCreate = () => {
    reset({ name: '', email: '', password: '', role: 'sales_executive' });
    setShowModal(true);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await createUser(formData);
      toast.success('User created');
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await updateUser(user._id, { active: !user.active });
      toast.success(`User ${user.active ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: r => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-sm font-bold">{r.name?.charAt(0) || '?'}</div>
        <span className="font-medium text-slate-800">{r.name}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: r => r.email || '-' },
    { key: 'role', label: 'Role', render: r => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[r.role] || 'bg-slate-100 text-slate-600'}`}>
        {r.role?.replace(/_/g, ' ')}
      </span>
    )},
    { key: 'active', label: 'Status', render: r => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {r.active !== false ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'lastLogin', label: 'Last Login', render: r => r.lastLogin ? new Date(r.lastLogin).toLocaleDateString() : 'Never' },
    { key: 'actions', label: 'Actions', render: r => (
      <button onClick={() => handleToggleActive(r)} className={`p-1.5 rounded-lg ${r.active !== false ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
        <FaBan />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Users</h1>
          <p className="text-slate-500 text-sm">Manage system users and their roles</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors">
          <FaPlus /> Add User
        </button>
      </div>

      {error ? <ErrorMessage message={error} onRetry={() => fetchUsers()} /> : (
        <>
          <DataTable columns={columns} data={users} loading={loading} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add User</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input {...register('name', { required: 'Name is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
                <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select {...register('role')} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="super_admin">Super Admin</option>
                  <option value="company_admin">Company Admin</option>
                  <option value="sales_executive">Sales Executive</option>
                  <option value="channel_partner">Channel Partner</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                  {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
