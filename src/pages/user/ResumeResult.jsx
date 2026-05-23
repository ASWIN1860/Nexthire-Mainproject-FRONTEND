/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

import {
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileSearch,
  ArrowRight,
  FileText,
} from "lucide-react";

import { getLatestResumeApi } from "../../services/allApis";
import base_url from "../../services/base_url";
import { data, Link, useLocation} from "react-router-dom";

const ResumeResult = () => {
  const location = useLocation();
  const selectedResume = location.state?.resumeData;
  const [resumeData, setResumeData] = useState(selectedResume || {});
  const [loading, setLoading] = useState(true);



  // get latest resume
  const getLatestResume = async () => {
    try {
      const result = await getLatestResumeApi();

      console.log(result.data);

      setResumeData(result.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //test report ATS

  const downloadATSReport = () => {
    if (!resumeData) {
      console.error("Resume data not found!");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = 20;

    const drawCard = (y, height, color = [245, 247, 250]) => {
      doc.setFillColor(...color);
      doc.roundedRect(margin, y, pageWidth - margin * 2, height, 3, 3, "F");
    };

    const img = new Image();
    img.src = "/NextHireLogo.png";

    img.onload = () => {
      // --- 1. HEADER SECTION ---
      doc.addImage(img, "PNG", margin, currentY, 35, 10);

      currentY += 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(33, 37, 41);
      doc.text("ATS Resume Analysis Report", margin, currentY);

      currentY += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("AI Powered Resume Evaluation", margin, currentY);

      const currentDate = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      doc.setFontSize(9);
      doc.text(`Generated: ${currentDate}`, pageWidth - margin, currentY, {
        align: "right",
      });

      currentY += 10;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY, pageWidth - margin, currentY);

      // --- 2. SUMMARY CARD (WITH ALIGNMENT FIX) ---
      currentY += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.setFont("helvetica", "bold");

      let verdictText = resumeData?.finalVerdict || resumeData?.resumeCategory || "N/A";
      const experienceText = `Experience Level: ${resumeData?.experienceAnalysis?.experienceLevel || resumeData?.experienceLevel || "N/A"}`;
      
      // Split verdict text to fit the card width
      const splitVerdict = doc.splitTextToSize(`Verdict: ${verdictText}`, pageWidth - margin * 2 - 45); // Deducting space for score circle
      
      // Calculate dynamic height for card based on verdict length
      const cardHeight = Math.max(30, (splitVerdict.length * 5) + 20);
      drawCard(currentY, cardHeight);

      // Render Verdict Text
      doc.text(splitVerdict, margin + 5, currentY + 10);
      
      // Render Experience Level relative to the end of Verdict text
      const experienceY = currentY + 10 + (splitVerdict.length * 5) + 2;
      doc.text(experienceText, margin + 5, experienceY);

      // --- 3. ATS SCORE ---
      const score = resumeData?.score || 0;
      let scoreColor = [239, 68, 68];
      if (score >= 80) scoreColor = [34, 197, 94];
      else if (score >= 60) scoreColor = [234, 179, 8];

      doc.setFillColor(...scoreColor);
      // Center circle vertically within the dynamic card height
      doc.circle(pageWidth - margin - 20, currentY + (cardHeight / 2), 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(`${score}%`, pageWidth - margin - 20, currentY + (cardHeight / 2) + 1.5, {
        align: "center",
      });

      currentY += cardHeight + 15;

      // --- 4. MATCHED SKILLS ---
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Your Resume Parsed Skills", margin, currentY);

      currentY += 8;
      let skillX = margin;
      doc.setFontSize(9);
      (resumeData?.skills || []).forEach((skill) => {
        const textWidth = doc.getTextWidth(skill) + 6;
        if (skillX + textWidth > pageWidth - margin) {
          skillX = margin;
          currentY += 8;
        }
        if (currentY > 280) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(skillX, currentY - 4, textWidth, 6, 1, 1, "F");
        doc.setTextColor(21, 128, 61);
        doc.text(skill, skillX + 3, currentY);
        skillX += textWidth + 3;
      });

      // --- 5. MISSING SKILLS ---
      currentY += 15;
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text("Missing Skills", margin, currentY);

      currentY += 8;
      let mSkillX = margin;
      (resumeData?.missingSkills || []).forEach((skill) => {
        const textWidth = doc.getTextWidth(skill) + 6;
        if (mSkillX + textWidth > pageWidth - margin) {
          mSkillX = margin;
          currentY += 8;
        }
        if (currentY > 280) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFillColor(254, 226, 226);
        doc.roundedRect(mSkillX, currentY - 4, textWidth, 6, 1, 1, "F");
        doc.setTextColor(185, 28, 28);
        doc.text(skill, mSkillX + 3, currentY);
        mSkillX += textWidth + 3;
      });

      // --- 6. STRENGTHS & WEAKNESSES ---
      currentY += 20;
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("Key Strengths", margin, currentY);

      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      (resumeData?.strengths || []).slice(0, 3).forEach((str) => {
        const splitStr = doc.splitTextToSize(
          `• ${str}`,
          pageWidth - margin * 2,
        );
        if (currentY + splitStr.length * 5 > 280) {
          doc.addPage();
          currentY = 20;
        }
        currentY += 6;
        doc.text(splitStr, margin + 5, currentY);
        currentY += (splitStr.length - 1) * 5;
      });

      // --- 7. IMPROVEMENT SUGGESTIONS ---
      currentY += 15;
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("Improvement Suggestions", margin, currentY);

      const suggestions = resumeData?.improvementSuggestions || [];
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      if (suggestions.length > 0) {
        suggestions.forEach((item) => {
          const text = `${item.issue}: ${item.solution}`;
          const splitText = doc.splitTextToSize(
            text,
            pageWidth - margin * 2 - 10,
          );

          if (currentY + splitText.length * 5 + 10 > 280) {
            doc.addPage();
            currentY = 20;
          }

          currentY += 8;
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(
            margin,
            currentY - 5,
            pageWidth - margin * 2,
            splitText.length * 5 + 2,
            1,
            1,
            "F",
          );

          doc.text(splitText, margin + 5, currentY);
          currentY += splitText.length * 5;
        });
      } else {
        const recommendations = resumeData?.recommendations || [];
        recommendations.forEach((text) => {
          const splitText = doc.splitTextToSize(
            text,
            pageWidth - margin * 2 - 10,
          );

          if (currentY + splitText.length * 5 + 10 > 280) {
            doc.addPage();
            currentY = 20;
          }

          currentY += 8;
          doc.setFillColor(248, 250, 252);
          doc.roundedRect(
            margin,
            currentY - 5,
            pageWidth - margin * 2,
            splitText.length * 5 + 2,
            1,
            1,
            "F",
          );

          doc.text(splitText, margin + 5, currentY);
          currentY += splitText.length * 5;
        });
      }

      // --- 8. FOOTER ---
      if (currentY > 280) {
        doc.addPage();
      }

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Generated by NextHire AI Resume Analyzer", pageWidth / 2, 285, {
        align: "center",
      });

      doc.save(`NextHire_Report_${score}.pdf`);
    };

    img.onerror = () => {
      alert("Logo loading failed. Please check the path.");
    };
  };

  // component load

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.resumeData) {
      setResumeData(location.state.resumeData);
      setLoading(false);
      window.history.replaceState({}, document.title);
    } else {
      getLatestResume();
    }
  }, []);

  // dynamic score color

  const overallScore = resumeData?.score || 0;

  const scoreColor =
    overallScore >= 80
      ? "text-green-400"
      : overallScore >= 60
        ? "text-yellow-400"
        : "text-red-400";

  // loading

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-slate-300 text-2xl font-bold">
          Loading Resume Analysis...
        </h1>
      </div>
    );
  }

  // no resume

  if (!resumeData) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <img
          src="https://img.magnific.com/premium-vector/no-data-found-empty-file-folder-concept-design-vector-illustration_620585-1698.jpg?semt=ais_hybrid&w=740&q=80"
          width={"250px"}
          alt=""
        />

        <h2 className="text-2xl font-bold text-slate-200 mt-4">
          No Resume Found !!!
        </h2>

        <p className="text-slate-400 mt-2">Please upload a resume first.</p>

        <Link
          to={"/resume/upload"}
          className="btn-primary mt-5 px-5 py-2 rounded-lg"
        >
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Resume Analysis Report
          </h1>

          <p className="text-slate-400 mt-1">
            Detailed breakdown of your resume performance.
          </p>

          <h2 className="text-black mt-3 bg-amber-300 rounded px-3 py-1 font-bold inline-block">
            Uploaded date & time :{" "}
            {resumeData?.createdAt
              ? new Date(resumeData.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })
              : "No Date"}
          </h2>
        </div>
        <a
          href={
            resumeData?.resumeFile?.startsWith("http")
              ? resumeData.resumeFile
              : resumeData?.resumeFile
                ? `${base_url}/${resumeData.resumeFile.replace(/\\/g, "/")}`
                : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="btn-primary flex items-center justify-center gap-2">
            View Resume PDF <FileText size={18} />
          </button>
        </a>

        <button
          onClick={downloadATSReport}
          className="btn-primary flex items-center justify-center gap-2"
        >
          Download ATS Report
          <Download size={18} />
        </button>
      </div>

      {/* Score Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Card */}

        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />

              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={
                  overallScore >= 80
                    ? "#4ade80"
                    : overallScore >= 60
                      ? "#facc15"
                      : "#f87171"
                }
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 300" }}
                animate={{
                  strokeDasharray: `${(overallScore / 100) * 283} 283`,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-bold ${scoreColor}`}>
                {overallScore}
              </span>

              <span className="text-slate-400 text-sm">/ 100</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-200 mt-6">
            Resume Score
          </h2>

          <p className="text-slate-400 mt-2 text-sm max-w-xs">
            Your resume has been successfully analyzed.
          </p>
        </div>

        {/* Metrics */}

        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-4">
            Key Metrics
          </h3>

          <div className="space-y-5">
            {[
              {
                name: "Overall Score",
                score: overallScore,
                icon: Award,
                color: "text-green-400",
                bg: "bg-emerald-500/20",
              },
              {
                name: "Skills Match",
                score: resumeData?.skillsMatchScore || 0,
                icon: FileSearch,
                color: "text-yellow-400",
                bg: "bg-yellow-500/20",
              },
              {
                name: "ATS Readiness",
                score: resumeData?.atsReadinessScore || 0,
                icon: CheckCircle,
                color: "text-blue-400",
                bg: "bg-blue-500/20",
              },
              {
                name: "Missing Skills",
                score: resumeData?.missingSkills?.length || 0,
                icon: AlertTriangle,
                color: "text-red-400",
                bg: "bg-red-500/20",
              },
            ].map((metric, i) => (
              <div
                key={metric.name}
                className={`flex items-center gap-4 ${metric.color}`}
              >
                {/* ^ Ivide parent-il color koduthal child-il bg-current work aakum */}

                <div className={`p-3 rounded-xl ${metric.bg}`}>
                  <metric.icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-200 font-medium text-sm">
                      {metric.name}
                    </span>

                    <span className="text-slate-300 text-sm">
                      {metric.name === "Missing Skills"
                        ? `${metric.score} ${metric.score > 1 ? "skills" : "skill"}`
                        : `${metric.score}/100`}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          metric.name === "Missing Skills"
                            ? `${Math.min(metric.score * 10, 100)}%`
                            : `${metric.score}%`,
                      }}
                      transition={{ duration: 1.2, delay: i * 0.1 }}
                      // bg-current upayogikkunnath vazhi parent-le text-color background color aayi maarum
                      className="h-1.5 rounded-full bg-current"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parsed Skills */}

        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-800 pb-4">
            Parsed Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {resumeData?.skills?.length > 0 ? (
              resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-blue-400" />

                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-400">No skills found</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}

        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-800 pb-4">
            Missing Skills
          </h3>

          <div className="flex flex-wrap gap-2">
            {resumeData?.missingSkills?.length > 0 ? (
              resumeData.missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg text-sm border border-red-500/20 flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />

                  {skill}
                </span>
              ))
            ) : (
              <p className="text-green-400">No missing skills 🎉</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Description */}

      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-800 pb-4 ">
          Job Description
        </h3>

        <p className="text-slate-400 whitespace-pre-line leading-7 font-bold">
          {resumeData?.description}
        </p>
      </div>

      {/* Suggestions */}

      <div className="glass-panel p-6 rounded-3xl ">
        <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-800 pb-4">
          AI - ATS Detailed Insights
        </h3>

        <ul className="space-y-5">
          <li className="flex gap-4">
            <div className="flex-shrink-0 mt-0.5">
              <FileSearch className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-slate-200 font-medium text-sm">
                FINAL VERDICT
              </h4>
              <p className="text-slate-400 text-sm mt-1">
                {resumeData?.finalVerdict ||
                  resumeData?.resumeCategory ||
                  resumeData?.aiResponse ||
                  "Pending evaluation."}
              </p>
            </div>
          </li>

          {resumeData?.atsAnalysis?.atsCompatibility && (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  ATS COMPATIBILITY
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  {resumeData.atsAnalysis.atsCompatibility}
                </p>
              </div>
            </li>
          )}

          {resumeData?.jobFitAnalysis?.technicalAlignment && (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <FileSearch className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  TECHNICAL ALIGNMENT
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  {resumeData.jobFitAnalysis.technicalAlignment}
                </p>
              </div>
            </li>
          )}

          {resumeData?.competitivenessAnalysis?.marketCompetitiveness && (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  MARKET COMPETITIVENESS
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  {resumeData.competitivenessAnalysis.marketCompetitiveness}
                </p>
              </div>
            </li>
          )}

          {resumeData?.strengths?.length > 0 && (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  STRENGTHS
                </h4>
                <ul className="list-disc pl-5 text-slate-400 text-sm mt-1">
                  {Array.isArray(resumeData.strengths) ? (
                    resumeData.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))
                  ) : (
                    <li>{resumeData.strengths}</li>
                  )}
                </ul>
              </div>
            </li>
          )}

          {resumeData?.weaknesses?.length > 0 && (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  WEAKNESSES
                </h4>
                <ul className="list-disc pl-5 text-slate-400 text-sm mt-1">
                  {Array.isArray(resumeData.weaknesses) ? (
                    resumeData.weaknesses.map((weak, idx) => (
                      <li key={idx}>{weak}</li>
                    ))
                  ) : (
                    <li>{resumeData.weaknesses}</li>
                  )}
                </ul>
              </div>
            </li>
          )}

          {resumeData?.improvementSuggestions?.length > 0 ? (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  IMPROVEMENT SUGGESTIONS
                </h4>
                <div className="space-y-3 mt-2">
                  {resumeData.improvementSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/50 p-3 rounded-lg border border-slate-700"
                    >
                      <p className="text-slate-200 text-sm font-medium">
                        Issue:{" "}
                        <span className="text-slate-400 font-normal">
                          {suggestion.issue}
                        </span>
                      </p>
                      <p className="text-slate-200 text-sm font-medium mt-1">
                        Solution:{" "}
                        <span className="text-slate-400 font-normal">
                          {suggestion.solution}
                        </span>
                      </p>
                      {suggestion.expectedImpact && (
                        <p className="text-slate-200 text-sm font-medium mt-1">
                          Impact:{" "}
                          <span className="text-emerald-400 font-normal">
                            {suggestion.expectedImpact}
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ) : (
            <li className="flex gap-5">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="text-slate-200 font-medium text-sm">
                  RECOMMENDATIONS
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  {Array.isArray(resumeData?.recommendations)
                    ? resumeData.recommendations.join(", ")
                    : resumeData?.recommendations ||
                      "No specific recommendations available."}
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ResumeResult;
