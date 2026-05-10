import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Database, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '../../utils/cn';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'platform', label: 'Platform Settings', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Admin Settings</h1>
        <p className="text-slate-400 mt-1">Manage your platform configuration and personal preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-left",
                  isActive
                    ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-slate-400")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Full Name</label>
                    <input type="text" defaultValue="Admin User" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Email Address</label>
                    <input type="email" defaultValue="admin@nexthire.com" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Role</label>
                    <input type="text" value="Super Administrator" disabled className="input-field opacity-50 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'platform' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">Platform Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Site Name</label>
                    <input type="text" defaultValue="NextHire AI Resume Analyzer" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Support Email</label>
                    <input type="email" defaultValue="support@nexthire.com" className="input-field" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                    <div>
                      <p className="font-medium text-slate-200">Maintenance Mode</p>
                      <p className="text-sm text-slate-400">Temporarily disable access to non-admin users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { title: 'New User Registrations', desc: 'Get notified when a new user signs up.' },
                    { title: 'System Alerts', desc: 'Receive alerts for critical system events.' },
                    { title: 'Weekly Reports', desc: 'Receive weekly analytics and reports via email.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
                      <div>
                        <p className="font-medium text-slate-200">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-100 mb-6">Security Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Current Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">New Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div className="pt-2">
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex justify-end">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
