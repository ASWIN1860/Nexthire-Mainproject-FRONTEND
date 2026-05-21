/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CheckCircle2,
  Building,
  TrendingUp,
} from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import AddSkill from "../../components/admin/AddSkill";
import AddJob from "../../components/admin/AddJob";

import { getAllResumeApi, getAllUsersApi,getAllJobsApi,getAllApplicationsApi } from "../../services/allApis";

// Chart data will be calculated dynamically

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
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalResumes,setTotalResumes]=useState(0)
  const [totalJobs,setTotalJobs]=useState(0)
  const [totalApplications,setTotalApplications]=useState(0)

  const [usersData, setUsersData] = useState([]);
  const [resumesData, setResumesData] = useState([]);

  const getTotalApplications=async()=>{
    try{
      const result=await getAllApplicationsApi()
      if(result.status===200){
        setTotalApplications(result.data.length)
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const getUsersCount = async () => {
    try {
      const result = await getAllUsersApi();
      if (result.status === 200) {
        setTotalUsers(result.data.length);
        setUsersData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalResumes=async()=>{
    try{
      const result=await getAllResumeApi()
      if(result.status===200){
        setTotalResumes(result.data.length)
        setResumesData(result.data);
      }
    }
    catch(err){
      console.log(err)
    }
  }

  const getAllJobs=async()=>{
    try{
      const allJobs=await getAllJobsApi()
      if(allJobs.status===200){
        setTotalJobs(allJobs.data.length)
      }
      console.log(allJobs)
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getUsersCount()
    getTotalResumes()
    getAllJobs()
    getTotalApplications()
  },[]);

  const processChartData = () => {
    const dateMap = {};
    const addDate = (dateStr, type) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if(!dateMap[key]) {
        dateMap[key] = { name: key, signups: 0, uploads: 0, timestamp: d.setHours(0,0,0,0) };
      }
      dateMap[key][type]++;
    };

    usersData.forEach(user => {
      if (user.createdAt) addDate(user.createdAt, "signups");
    });
    resumesData.forEach(resume => {
      if (resume.createdAt) addDate(resume.createdAt, "uploads");
    });

    const sortedData = Object.values(dateMap).sort((a,b) => a.timestamp - b.timestamp);
    
    if (sortedData.length === 0) {
      return { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], signupsSeries: [0,0,0,0,0,0,0], uploadsSeries: [0,0,0,0,0,0,0] };
    }

    const categories = sortedData.map(d => d.name);
    const signupsSeries = sortedData.map(d => d.signups);
    const uploadsSeries = sortedData.map(d => d.uploads);

    return { categories, signupsSeries, uploadsSeries };
  };

  const chartInfo = processChartData();

  const chartOptions = {
    chart: {
      type: "spline",
      backgroundColor: "transparent",
      style: { fontFamily: "inherit" },
      height: 300,
    },
    title: { text: null },
    xAxis: {
      categories: chartInfo.categories,
      labels: { style: { color: "#94a3b8" } },
      gridLineColor: "#334155",
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash'
    },
    yAxis: {
      title: { text: null },
      labels: { style: { color: "#94a3b8" } },
      gridLineColor: "#334155",
      gridLineDashStyle: 'Dash'
    },
    legend: {
      itemStyle: { color: "#cbd5e1" },
      itemHoverStyle: { color: "#ffffff" },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      borderColor: "#334155",
      style: { color: "#f8fafc" },
      shared: true
    },
    plotOptions: {
      spline: {
        lineWidth: 3,
        marker: {
          radius: 4,
          fillColor: "#0f172a",
          lineWidth: 2,
          lineColor: null
        }
      }
    },
    series: [
      { name: "Uploads", data: chartInfo.uploadsSeries, color: "#8b5cf6" },
      { name: "Signups", data: chartInfo.signupsSeries, color: "#3b82f6" },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Platform Overview</h1>
        <p className="text-slate-400 mt-1">
          Track user engagement and system metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardAdmin
          icon={Users}
          title="Total Users"
          value={totalUsers}
          subValue="+14%"
          colorClass="bg-blue-600"
        />
        <StatCardAdmin
          icon={FileText}
          title="Resumes Analyzed"
          value={totalResumes}
          subValue="+22%"
          colorClass="bg-purple-600"
        />
        <StatCardAdmin
          icon={Building}
          title="Active Jobs"
          value={totalJobs}
          subValue="+5%"
          colorClass="bg-orange-600"
        />
        <StatCardAdmin
          icon={CheckCircle2}
          title="Total Applications"
          value={totalApplications}
          subValue="+18%"
          colorClass="bg-emerald-600"
        />
      </div>

      <div className="glass-panel p-6 rounded-3xl mt-6 lg:h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-100">Growth Overview</h2>
        </div>
        <div className="h-72 lg:h-80 w-full mt-4">
          {(()=>{
            const HCR = HighchartsReact.default || HighchartsReact;
            return <HCR highcharts={Highcharts} options={chartOptions} />
          })()}
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
