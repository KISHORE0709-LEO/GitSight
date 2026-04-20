import { Layout } from "@/components/Layout";
import { GitCommit, GitPullRequest, Trophy, Zap, BarChart3, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: "You Enter a GitHub Username",
      description: "Type in any GitHub username (like 'octocat' or 'torvalds') - these are real developers on GitHub!",
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: GitCommit,
      title: "We Find Their Code Work",
      description: "We look at everything they've done on GitHub - all the code they've written (commits), pull requests they've made, and projects they've worked on.",
      color: "from-green-500/20 to-green-600/10",
      borderColor: "border-green-500/20"
    },
    {
      icon: BarChart3,
      title: "We Calculate a Score",
      description: "We count their commits (1 point each), merged PRs (5 points each), and subtract rejected PRs (2 points each). This gives us their productivity score!",
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Trophy,
      title: "We Show You the Results",
      description: "You see their score, how many commits they made, their top programming languages, and charts showing when they were most active.",
      color: "from-yellow-500/20 to-yellow-600/10",
      borderColor: "border-yellow-500/20"
    },
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description: "The system watches for any problems - like if things are running slow or if there are too many requests. It alerts us if something goes wrong!",
      color: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-500/20"
    },
    {
      icon: BarChart3,
      title: "Compare Developers",
      description: "See a leaderboard of top developers ranked by their productivity score. Find out who's the most active coder!",
      color: "from-pink-500/20 to-pink-600/10",
      borderColor: "border-pink-500/20"
    }
  ];

  const features = [
    {
      title: "📊 Productivity Score",
      description: "A number that shows how active and productive a developer is based on their GitHub activity."
    },
    {
      title: "📈 Weekly Charts",
      description: "See a bar chart showing which days of the week the developer was most active coding."
    },
    {
      title: "🏆 Leaderboard",
      description: "A ranking of developers showing who has the highest productivity score."
    },
    {
      title: "⚠️ Incident Alerts",
      description: "The system watches for problems and tells us if something isn't working right."
    },
    {
      title: "💻 Language Stats",
      description: "See which programming languages a developer uses most (like Python, JavaScript, Go, etc)."
    },
    {
      title: "📚 Repository Info",
      description: "View their most popular projects and how many stars (likes) they have from other developers."
    }
  ];

  return (
    <Layout>
      <div className="px-6 py-10 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-foreground">How GitSight Works</h1>
          <p className="text-lg text-muted-foreground">
            A simple explanation of how we analyze GitHub developers (explained like you're 10 years old! 👶)
          </p>
        </motion.div>

        {/* Main Steps */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">The 6 Simple Steps</h2>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${step.borderColor} bg-gradient-to-br ${step.color} backdrop-blur-sm`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 border border-primary/30">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">What Can You See?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
              >
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Formula */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-primary/20 bg-primary/5"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">The Magic Formula 🧮</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              We calculate a developer's productivity score using this simple math:
            </p>
            <div className="bg-card p-4 rounded-lg border border-border font-mono text-sm">
              <p className="text-foreground">
                <span className="text-primary font-bold">Score</span> = 
                <span className="text-green-400"> (Commits × 1)</span> + 
                <span className="text-blue-400"> (Merged PRs × 5)</span> - 
                <span className="text-red-400"> (Rejected PRs × 2)</span>
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>💡 <span className="font-semibold">Commits:</span> Each piece of code they write = 1 point</p>
              <p>✅ <span className="font-semibold">Merged PRs:</span> Code they wrote that got accepted = 5 points (worth more!)</p>
              <p>❌ <span className="font-semibold">Rejected PRs:</span> Code that didn't get accepted = -2 points (loses points)</p>
            </div>
          </div>
        </motion.div>

        {/* Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-accent/20 bg-accent/5"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Example 📝</h2>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Let's say a developer named Alex has:
            </p>
            <div className="bg-card p-4 rounded-lg border border-border space-y-2">
              <p className="text-foreground">📌 100 commits = 100 × 1 = <span className="text-green-400 font-bold">100 points</span></p>
              <p className="text-foreground">✅ 20 merged PRs = 20 × 5 = <span className="text-blue-400 font-bold">100 points</span></p>
              <p className="text-foreground">❌ 5 rejected PRs = 5 × 2 = <span className="text-red-400 font-bold">-10 points</span></p>
              <p className="text-foreground border-t border-border pt-2 mt-2">
                <span className="font-bold">Total Score:</span> 100 + 100 - 10 = <span className="text-primary font-bold text-lg">190 points</span> 🎉
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-border bg-card"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Does This Matter? 🤔</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <span><span className="font-semibold text-foreground">See Real Activity:</span> You can see exactly how active a developer is on GitHub</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <span><span className="font-semibold text-foreground">Compare Developers:</span> Use the leaderboard to see who's the most productive</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <span><span className="font-semibold text-foreground">Learn Patterns:</span> See when developers are most active and what languages they use</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <span><span className="font-semibold text-foreground">Monitor Health:</span> The system watches for problems so we know if something breaks</span>
            </li>
          </ul>
        </motion.div>

        {/* Try It Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-primary/20 bg-primary/5 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Try It? 🚀</h2>
          <p className="text-muted-foreground mb-4">
            Go to the <span className="font-semibold text-foreground">Analyze</span> page and type in a GitHub username to see it in action!
          </p>
          <p className="text-sm text-muted-foreground">
            Try these famous developers: <span className="font-mono text-primary">octocat</span>, <span className="font-mono text-primary">torvalds</span>, or <span className="font-mono text-primary">gaearon</span>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
