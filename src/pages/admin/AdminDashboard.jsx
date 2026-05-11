/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle2, Building, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AddSkill from '../../components/admin/AddSkill';
import AddJob from '../../components/admin/AddJob';
const data = [
  { name: 'Mon', signups: 400, uploads: 240 },
  { name: 'Tue', signups: 300, uploads: 1398 },
  { name: 'Wed', signups: 200, uploads: 9800 },
  { name: 'Thu', signups: 278, uploads: 3908 },
  { name: 'Fri', signups: 189, uploads: 4800 },
  { name: 'Sat', signups: 239, uploads: 3800 },
  { name: 'Sun', signups: 349, uploads: 4300 },
];

const StatCardAdmin = ({ icon: Icon, title, value, subValue, colorClass }) => (
  <motion.div whileHover={{ y: -5 }} className="glass-card p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 font-medium text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-slate-100 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <TrendingUp className="w-4 h-4 text-emerald-400" />
      <span className="text-emerald-400 text-sm font-medium">{subValue}</span>
      <span className="text-slate-500 text-sm">vs last week</span>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Platform Overview</h1>
        <p className="text-slate-400 mt-1">Track user engagement and system metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardAdmin 
          icon={Users} title="Total Users" value="12,489" subValue="+14%" 
          colorClass="bg-blue-600" 
        />
        <StatCardAdmin 
          icon={FileText} title="Resumes Analyzed" value="48,201" subValue="+22%" 
          colorClass="bg-purple-600" 
        />
        <StatCardAdmin 
          icon={Building} title="Active Jobs" value="1,834" subValue="+5%" 
          colorClass="bg-orange-600" 
        />
        <StatCardAdmin 
          icon={CheckCircle2} title="Successful Matches" value="5,231" subValue="+18%" 
          colorClass="bg-emerald-600" 
        />
      </div>

      <div className="glass-panel p-6 rounded-3xl mt-6 lg:h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-100">Growth Overview</h2>
        </div>
        <div className="h-72 lg:h-80 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '0.75rem', color: '#f8fafc' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Line type="monotone" dataKey="uploads" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }} />
              <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <AddSkill />
        <AddJob />
      </div>
    </div>
  );
};

export default AdminDashboard;
