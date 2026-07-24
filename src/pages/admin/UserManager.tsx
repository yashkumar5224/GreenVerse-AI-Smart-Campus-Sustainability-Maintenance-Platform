import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../hooks/useStore';
import { Users, Mail, PlusCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export const UserManager: React.FC = () => {
  const { user } = useStore();
  const [users, setUsers] = useState<any[]>([]);
  const [_loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        setUsers(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          role: p.role,
          dept: p.dept,
          avatar: p.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.email}`,
          points: p.points,
          badge: p.badge
        })));
      } else {
        // Fallback to localStorage
        setUsers(JSON.parse(localStorage.getItem('gv_users') || '[]'));
      }
    } catch (err) {
      console.warn('Supabase profiles fetch failed, using localStorage:', err);
      setUsers(JSON.parse(localStorage.getItem('gv_users') || '[]'));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'MAINTENANCE' | 'ADMIN' | 'SUPER_ADMIN'>('STUDENT');
  const [dept, setDept] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      dept: role === 'STUDENT' ? dept : null,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
      points: role === 'STUDENT' ? 10 : 0,
      badge: role === 'STUDENT' ? 'Eco Novice' : null
    };

    try {
      const { error } = await supabase.from('profiles').insert([newProfile]);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase profile insert failed, saving locally:', err);
    }
    const localUsers = JSON.parse(localStorage.getItem('gv_users') || '[]');
    if (!localUsers.some((u: any) => u.id === newProfile.id)) {
      localUsers.push({ ...newProfile, avatar: newProfile.avatar_url });
      localStorage.setItem('gv_users', JSON.stringify(localUsers));
    }

    await fetchUsers();
    setName('');
    setEmail('');
    setDept('');
  };

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) {
      alert("Cannot delete active authenticated user session.");
      return;
    }
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase profile delete failed:', err);
    }
    const localUsers = JSON.parse(localStorage.getItem('gv_users') || '[]');
    const next = localUsers.filter((u: any) => u.id !== id);
    localStorage.setItem('gv_users', JSON.stringify(next));
    
    await fetchUsers();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-950/80 text-purple-400 border border-purple-900';
      case 'ADMIN': return 'bg-amber-950/80 text-amber-400 border border-amber-900';
      case 'MAINTENANCE': return 'bg-cyan-950/80 text-cyan-400 border border-cyan-900';
      default: return 'bg-slate-900 text-slate-500 border border-slate-800';
    }
  };

  return (
    <div className="w-full min-h-screen pb-16 px-6 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-white">Campus User Directory</h2>
        <p className="text-xs text-slate-400">Manage registered engineering students, facility technicians, administrators, and guest profiles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Register User */}
        <div className="glass-panel p-6 rounded-2xl border border-brand-border">
          <form onSubmit={handleAddUser} className="flex flex-col gap-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-1.5">
              <PlusCircle size={16} className="text-emerald-400" /> Provision Account
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Sinha"
                required
                className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={12} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@spnrec.ac.in"
                  required
                  className="w-full bg-slate-900 border border-brand-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white glass-input"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Access Level (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2.5 text-xs text-white glass-input"
              >
                <option value="STUDENT">Student (Eco Warrior)</option>
                <option value="MAINTENANCE">Maintenance Tech Staff</option>
                <option value="ADMIN">Campus Administrator</option>
              </select>
            </div>

            {role === 'STUDENT' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Academic Department</label>
                <input
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="Civil Engineering"
                  className="bg-slate-900 border border-brand-border rounded-xl px-3 py-2 text-xs text-white glass-input"
                />
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center gap-1 cursor-pointer"
            >
              Provision Credentials
            </button>
          </form>
        </div>

        {/* Right Column: User Directory List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
            <Users size={16} className="text-cyan-400" /> Registered Accounts List ({users.length})
          </h3>

          <div className="glass-panel rounded-2xl border border-brand-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-brand-border text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Points</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-900/10 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt="avatar" className="w-7 h-7 rounded-full border border-brand-border bg-slate-950" />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-200">{u.name}</div>
                            {u.dept && <span className="text-[9px] text-slate-500">{u.dept}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{u.email}</td>
                      <td className="p-4">
                        <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {u.points !== undefined ? `${u.points} pts` : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-slate-500 hover:text-red-400 transition"
                          title="Revoke user access"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserManager;
