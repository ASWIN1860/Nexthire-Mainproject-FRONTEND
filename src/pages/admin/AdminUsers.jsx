import { useState } from 'react';
import { Search, MoreVertical, Edit2, Trash2, Ban } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joined: 'Oct 24, 2023', score: 92 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joined: 'Nov 12, 2023', score: 85 },
  { id: 3, name: 'Mike Ross', email: 'mike@example.com', role: 'User', status: 'Suspended', joined: 'Dec 05, 2023', score: '-' },
  { id: 4, name: 'Sarah Connor', email: 'sarah@example.com', role: 'Admin', status: 'Active', joined: 'Jan 15, 2024', score: '-' },
  { id: 5, name: 'Bruce Wayne', email: 'bruce@example.com', role: 'User', status: 'Active', joined: 'Feb 20, 2024', score: 98 },
];

const AdminUsers = () => {
  const [users] = useState(mockUsers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-slate-400 mt-1">View and manage platform users.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Avg Score</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-slate-200 font-medium">{user.name}</div>
                        <div className="text-slate-500 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 w-max ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${user.score >= 90 ? 'text-emerald-400' : user.score >= 80 ? 'text-blue-400' : 'text-slate-500'}`}>
                      {user.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <span>Showing 1 to 5 of 12,489 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 text-slate-300">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
