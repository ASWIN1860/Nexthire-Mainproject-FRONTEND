import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, FileText, Settings, Award, Calendar, Edit3, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Profile = () => {
  const [user, setUser] = useState({
    username: 'Guest User',
    email: 'guest@example.com',
  });
  const [profileDp,setProfileDp]=useState("")

  useEffect(() => {
    const storedName = sessionStorage.getItem('uname');
    const storedMail = sessionStorage.getItem('email');
    const storedDp = sessionStorage.getItem('dp');
    if (storedName && storedMail) {
      setUser({
        username: storedName,
        email: storedMail,
      });
    }
    if(storedDp){
      setProfileDp(storedDp)
    }
  }, []);

  const stats = [
    { label: 'Resumes Analyzed', value: '12', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Jobs Applied', value: '8', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Profile Views', value: '45', icon: User, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { label: 'Skills Matched', value: '24', icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-slate-800/80 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1">
              <div className="bg-slate-900 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                {
                  profileDp?
                  <>
                  <img src={profileDp} width={112} className='rounded-full' alt="" />
                  </>
                  :
                   <User className="w-16 h-16 text-slate-300" />
                }
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
              <Edit3  className="w-4 h-4"  />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
            <div className="flex flex-col sm:flex-row gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className='font-bold'>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span >Joined May 2026</span>
              </div>
            </div>
          </div>

          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-slate-800/80"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 2 && <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-slate-800/80" />}
                <div className="relative z-10 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <h3 className="text-slate-200 font-medium">Uploaded a new resume for analysis</h3>
                  <p className="text-sm text-slate-400 mt-1">Software_Engineer_Resume_v2.pdf</p>
                  <p className="text-xs text-slate-500 mt-2">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-8 rounded-2xl border border-slate-800/80"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Top Skills</h2>
          <div className="flex flex-wrap gap-2">
            {['React.js', 'Node.js', 'Python', 'Machine Learning', 'Docker', 'AWS', 'MongoDB', 'TypeScript'].map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
