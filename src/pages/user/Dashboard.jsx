/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import {
  Trophy,
  FileText,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Search,
  Clock,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';

import { getResumeHistoryApi, deleteResumeHistoryApi, getMatchedJobsApi, getUserApplicationsApi } from '../../services/allApis';
import { toast } from 'react-toastify';

const StatCard = ({ icon: Icon, title, value, trend, colorClass }) => (
  <motion.div whileHover={{ y: -5 }} className="glass-card p-6">
    <div className="flex items-start justify-between p-3">
      <div>
        <p className="text-slate-400 font-medium text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-slate-100 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [recentResumes, setRecentResumes] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [matchedJobsCount, setMatchedJobsCount] = useState(0);
  const [applicationsSentCount, setApplicationsSentCount] = useState(0);
  const [topSkills, setTopSkills] = useState([]);
  const [chartOptions, setChartOptions] = useState(null);
  
  const navigate = useNavigate();

  const getResumeHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const [historyRes, matchedRes, appsRes] = await Promise.all([
        getResumeHistoryApi(),
        getMatchedJobsApi(),
        getUserApplicationsApi()
      ]);

      if (historyRes.status === 200 && historyRes.data) {
        setRecentResumes(historyRes.data);
        if (historyRes.data.length > 0) {
          const totalScore = historyRes.data.reduce((acc, curr) => acc + curr.score, 0);
          setAverageScore(Math.round(totalScore / historyRes.data.length));

          // Top Skills from latest resume
          const latestResume = historyRes.data[0];
          const skills = latestResume.skills || [];
          const topFive = skills.slice(0, 5).map(skill => ({
            name: skill,
            progress: Math.floor(Math.random() * 20) + 80,
            color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-cyan-500'][Math.floor(Math.random() * 5)]
          }));
          setTopSkills(topFive);

          // Chart Options
          const sortedData = [...historyRes.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const categories = sortedData.map(r => new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
          const dataPoints = sortedData.map(r => r.score);

          setChartOptions({
            chart: {
              type: "areaspline",
              backgroundColor: "transparent",
            },
            title: { text: null },
            xAxis: {
              categories: categories,
              labels: { style: { color: "#94a3b8" } },
              lineColor: "#334155",
            },
            yAxis: {
              title: { text: null },
              labels: { style: { color: "#94a3b8" } },
              gridLineColor: "#334155",
              gridLineDashStyle: "Dash",
            },
            tooltip: {
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              style: { color: "#f8fafc" },
            },
            legend: { enabled: false },
            series: [{
              name: "Score",
              data: dataPoints,
              color: "#3b82f6",
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, "rgba(59, 130, 246, 0.4)"],
                  [1, "rgba(59, 130, 246, 0.0)"],
                ],
              },
            }],
            credits: { enabled: false },
          });

        } else {
          setAverageScore(0);
          setTopSkills([]);
          setChartOptions(null);
        }
      }

      if (matchedRes && matchedRes.status === 200 && matchedRes.data) {
        setMatchedJobsCount(matchedRes.data.length);
      }
      if (appsRes && appsRes.status === 200 && appsRes.data) {
        setApplicationsSentCount(appsRes.data.length);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setIsLoadingHistory(false);
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
    if (!confirmDelete) return;
    try {
      await deleteResumeHistoryApi(id);
      setRecentResumes(recentResumes.filter((item) => item._id !== id));
      getResumeHistory();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem("uname")) {
      setUsername(sessionStorage.getItem("uname"));
    } else {
      setUsername("User");
    }
    getResumeHistory();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div>
          {username && (
            <h1 className="text-2xl font-bold text-white-100">
              Welcome back, {username}!
            </h1>
          )}
          <p className="text-white-400 mt-1 font-bold">
            Here is what's happening with your job search today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Trophy}
            title="Overall Resume Score"
            value={`${averageScore}/100`}
            trend="+5%"
            colorClass="bg-blue-600 shadow-lg shadow-blue-600/30"
          />
          <StatCard
            icon={FileText}
            title="Resumes Analyzed"
            value={recentResumes.length}
            trend="+2"
            colorClass="bg-purple-600 shadow-lg shadow-purple-600/30"
          />
          <StatCard
            icon={CheckCircle2}
            title="Matched Jobs"
            value={matchedJobsCount}
            trend="+12%"
            colorClass="bg-emerald-600 shadow-lg shadow-emerald-600/30"
          />
          <StatCard
            icon={Briefcase}
            title="Applications Sent"
            value={applicationsSentCount}
            trend="+3"
            colorClass="bg-orange-600 shadow-lg shadow-orange-600/30"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-100">
                Resume Match Score Over Time
              </h2>
            </div>
            <div className="h-72 w-full mt-4">
              {chartOptions ? (
                (()=>{
                  const HCR = HighchartsReact.default || HighchartsReact;
                  return <HCR highcharts={Highcharts} options={chartOptions} />
                })()
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data to display
                </div>
              )}
            </div>
          </div>

          {/* Top Skills */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-100 mb-6">
              Your Top Skills
            </h2>
            <div className="space-y-5">
              {topSkills.length > 0 ? topSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300 font-medium">{skill.name}</span>
                    <span className="text-slate-400">{skill.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-2 rounded-full ${skill.color}`}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-sm">No skills found yet. Analyze a resume!</p>
              )}
            </div>
          </div>
        </div>



        {/* Recent Resume History */}

        <div className="glass-panel p-6 rounded-2xl">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-bold text-slate-100">
              Recent Resume History
            </h2>

          </div>



          {isLoadingHistory ? (

            <div className="text-center py-10 text-slate-400">
              Loading Resume History...
            </div>

          ) : recentResumes.length === 0 ? (

            <div className="glass-card p-12 flex flex-col items-center justify-center text-center">

              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-slate-700/50">

                <FileText className="w-8 h-8 text-slate-500" />

              </div>

              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                No resumes analyzed yet
              </h3>

              <p className="text-slate-400 max-w-sm mb-6">
                Upload your first resume to see ATS scores, matched skills,
                and tailored feedback here.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {recentResumes.map((resume) => (

                <motion.div
                  key={resume._id}
                  whileHover={{ scale: 1.01 }}
                  className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all duration-300"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700">

                      <FileText className="w-5 h-5 text-blue-400" />

                    </div>

                    <div>

                      <h4 className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-[300px]">

                        {resume.resumeFile?.split('/').pop()}

                      </h4>

                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">

                        <span className="flex items-center gap-1">

                          <Clock className="w-3.5 h-3.5" />

                          {new Date(resume.createdAt).toLocaleString()}

                        </span>

                      </div>

                    </div>

                  </div>



                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4 w-full md:w-auto">

                    {/* Stats */}

                    <div className="flex items-center gap-4 sm:gap-6 text-sm">

                      {/* ATS */}
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">
                          ATS Score
                        </span>
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md border text-xs font-semibold
                        ${resume.atsReadinessScore >= 80
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : resume.atsReadinessScore >= 60
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                          {resume.atsReadinessScore}% Match
                        </span>
                      </div>



                      {/* Skills */}

                      <div className="flex flex-col">

                        <span className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">
                          Skills
                        </span>

                        <span className="text-slate-200 font-medium text-xs sm:text-sm">

                          {resume.skills?.length || 0} Found

                        </span>

                      </div>



                      {/* Missing */}

                      <div className="flex flex-col">

                        <span className="text-slate-400 text-[10px] sm:text-xs mb-1 uppercase tracking-wider">
                          Missing skills
                        </span>

                        <span className="text-slate-200 font-medium text-xs sm:text-sm flex items-center gap-1">

                          {resume.missingSkills?.length > 0 ? (

                            <>
                              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />

                              {resume.missingSkills?.length}

                            </>

                          ) : (

                            '0'

                          )}

                        </span>

                      </div>

                    </div>



                    {/* Actions */}

                    <div className="flex items-center gap-2">

                      <button onClick={()=>{
                        navigate('/resume/result',{
                          state:{
                            resumeData:resume
                          }
                        })
                      }} className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg text-xs sm:text-sm font-medium border border-blue-500/20 transition-colors">

                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                        <span className="hidden sm:inline">
                          View Result
                        </span>

                        <span className="inline sm:hidden">
                          View
                        </span>

                      </button>

                      <button
                        onClick={()=>handleDelete(resume._id)}
                        className="flex items-center justify-center p-1.5 sm:p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors"
                        title="Delete"
                      >

                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                      </button>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          )}

        </div>

      </div>

    </>

  );

};

export default Dashboard;