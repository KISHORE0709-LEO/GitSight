import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { useAnalysis } from "@/context/AnalysisContext";
import { GitCommit, GitPullRequest, GitMerge, XCircle, Trophy, Search, Terminal, Loader2, AlertCircle, TrendingUp, Award, Code2, Star, Cloud, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mockApi } from "@/services/mockApi";

import type { AnalysisResult } from "@/services/mockApi";

export default function Analyze() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const { setAnalyzedUsername } = useAnalysis();

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await mockApi.analyzeUser(username.trim());
      setData(result);
      setAnalyzedUsername(result.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDeveloperRank = (score: number) => {
    if (score > 500) return { rank: "Top 5%", trend: "Exceptional" };
    if (score > 300) return { rank: "Top 12%", trend: "Increasing" };
    if (score > 150) return { rank: "Top 30%", trend: "Stable" };
    return { rank: "Top 50%", trend: "Growing" };
  };

  const developerStats = data ? getDeveloperRank(data.score) : null;

  return (
    <Layout>
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Developer Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">Analyze GitHub activity and productivity scores</p>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-all box-glow-primary hover:scale-[1.02] active:scale-[0.98]"
          >
            Analyze
          </button>
        </div>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-mono">Analyzing {username}...</p>
            <p className="text-xs text-muted-foreground">Fetching GitHub data and calculating metrics</p>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-destructive/50 bg-destructive/10 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Analysis Failed</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {data && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border card-shine">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 flex items-center justify-center">
                <span className="text-xl font-black font-mono text-primary">
                  {data.username[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground font-mono">@{data.username}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Last 30 days activity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard icon={GitCommit} title="Commits" value={data.commits} variant="primary" />
              <MetricCard icon={GitMerge} title="Merged PRs" value={data.mergedPR} variant="accent" />
              <MetricCard icon={XCircle} title="Rejected PRs" value={data.rejectedPR} variant="warning" />
              <MetricCard icon={Trophy} title="Score" value={data.score} variant="primary" />
              <MetricCard icon={GitPullRequest} title="Total PRs" value={data.mergedPR + data.rejectedPR} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Repositories</p>
                <p className="text-3xl font-bold font-mono text-foreground">{data.repositories}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Followers</p>
                <p className="text-3xl font-bold font-mono text-foreground">{data.followers}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Following</p>
                <p className="text-3xl font-bold font-mono text-foreground">{data.following}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 font-mono text-xs text-muted-foreground flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="text-primary font-bold mb-1">Score Calculation Formula</p>
                <span>
                  <span className="text-primary font-bold">score</span> = (commits × 1) + (merged_pr × 5) − (rejected_pr × 2) = <span className="text-foreground font-bold">{data.score}</span>
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border card-shine p-6">
              <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Weekly Commit Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 16% 14%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215 15% 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(215 15% 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(222 20% 8%)", border: "1px solid hsl(222 16% 14%)", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 12 }}
                    labelStyle={{ color: "hsl(210 40% 96%)" }}
                    cursor={{ fill: "hsl(142 70% 45% / 0.05)" }}
                  />
                  <Bar dataKey="commits" fill="hsl(142 70% 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {developerStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 flex items-center gap-3">
                  <Award className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase">Developer Rank</p>
                    <p className="text-lg font-bold text-foreground font-mono">{developerStats.rank}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase">Activity Trend</p>
                    <p className="text-lg font-bold text-foreground font-mono">{developerStats.trend}</p>
                  </div>
                </div>
              </div>
            )}

            {data.topLanguages && data.topLanguages.length > 0 && (
              <div className="rounded-xl border border-border card-shine p-6">
                <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Top Languages</h3>
                <div className="space-y-3">
                  {data.topLanguages.map((lang) => (
                    <div key={lang.language} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-mono text-foreground">{lang.language}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${lang.percentage}%` }} />
                        </div>
                        <span className="text-xs font-mono text-muted-foreground w-8 text-right">{lang.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.awsTools && data.awsTools.length > 0 && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 card-shine p-6">
                <h3 className="text-xs font-mono text-blue-400 uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  AWS Cloud Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {data.awsTools.map((tool) => (
                    <motion.div
                      key={tool.tool}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/10 hover:border-blue-500/50 transition-all text-center"
                    >
                      <div className="text-2xl mb-2">{tool.icon}</div>
                      <p className="text-xs font-mono text-foreground font-bold">{tool.tool}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{tool.proficiency}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {data.devopsTools && data.devopsTools.length > 0 && (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 card-shine p-6">
                <h3 className="text-xs font-mono text-orange-400 uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  DevOps & Infrastructure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {data.devopsTools.map((tool) => (
                    <motion.div
                      key={tool.tool}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border border-orange-500/20 bg-orange-500/10 hover:border-orange-500/50 transition-all text-center"
                    >
                      <div className="text-2xl mb-2">{tool.icon}</div>
                      <p className="text-xs font-mono text-foreground font-bold">{tool.tool}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{tool.proficiency}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {data.recentRepos && data.recentRepos.length > 0 && (
              <div className="rounded-xl border border-border card-shine p-6">
                <h3 className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-bold mb-6">Recent Repositories</h3>
                <div className="space-y-4">
                  {data.recentRepos.map((repo) => (
                    <motion.div
                      key={repo.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitPullRequest className="h-4 w-4 text-primary" />
                          <span className="text-sm font-mono text-foreground">{repo.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{repo.language}</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-warning" />
                            {repo.stars}
                          </div>
                        </div>
                      </div>

                      {(repo.awsTools.length > 0 || repo.devopsTools.length > 0) && (
                        <div className="space-y-2 pt-2 border-t border-border/30">
                          {repo.awsTools.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {repo.awsTools.map((toolObj) => (
                                <span
                                  key={toolObj.tool}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono"
                                >
                                  <span>{toolObj.icon}</span>
                                  {toolObj.tool}
                                </span>
                              ))}
                            </div>
                          )}
                          {repo.devopsTools.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {repo.devopsTools.map((toolObj) => (
                                <span
                                  key={toolObj.tool}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono"
                                >
                                  <span>{toolObj.icon}</span>
                                  {toolObj.tool}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
