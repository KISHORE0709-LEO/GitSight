# Navigation Structure Clarification

## Question
Are "Dashboard, Incidents, Logs, Chaos, Architecture, DevOps" showing from the GitHub username uploaded in the analyze page or are they hardcoded?

## Answer
**They are HARDCODED static navigation items.**

## How It Works

### Navigation Items (Hardcoded)
The sidebar navigation in `src/components/AppSidebar.tsx` contains static menu items:

```typescript
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Analyze", url: "/analyze", icon: Search },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Incidents", url: "/incidents", icon: AlertTriangle },
  { title: "Logs", url: "/logs", icon: FileText },
  { title: "Chaos", url: "/chaos", icon: Zap },
  { title: "Architecture", url: "/architecture", icon: Network },
  { title: "DevOps", url: "/devops", icon: GitBranch },
];
```

These are **always available** regardless of whether a user has been analyzed or not.

### What IS Dynamic
The **Analyze page** is where you enter a GitHub username and get dynamic results:
- Commits count
- Merged PRs
- Rejected PRs
- Productivity score
- Weekly activity chart
- Developer rank
- Activity trend

### Data Flow

```
1. User enters GitHub username in Analyze page
   ↓
2. Frontend calls API with username
   ↓
3. Backend fetches GitHub data for that user
   ↓
4. Results displayed on Analyze page
   ↓
5. Navigation items remain static (always available)
```

## Why Are They Hardcoded?

The navigation items are **application-wide features**, not user-specific:

- **Dashboard** - System-wide metrics and observability
- **Incidents** - Real-time operational alerts
- **Logs** - System logs and events
- **Chaos** - Chaos engineering experiments
- **Architecture** - System architecture visualization
- **DevOps** - CI/CD pipeline monitoring

These are **platform features**, not dependent on which GitHub user you analyze.

## If You Want Dynamic Navigation

If you want the navigation to change based on the analyzed user, you would need to:

1. Store the analyzed username in global state (Context/Redux)
2. Pass it through the navigation
3. Update each page to use that username
4. Modify the sidebar to show user-specific options

**Example:**
```typescript
// Instead of static items
const items = [
  { title: "Home", url: "/" },
  { title: `Analyze ${analyzedUsername}`, url: `/analyze/${analyzedUsername}` },
  // etc
];
```

## Current Architecture

The current design is **correct** because:
- Navigation is **application-wide**, not user-specific
- Each page is independent and can work without a previously analyzed user
- Users can navigate freely between features
- The Analyze page is just one feature among many

## Summary

| Item | Type | Source |
|------|------|--------|
| Dashboard, Incidents, Logs, etc. | Static Navigation | Hardcoded in AppSidebar.tsx |
| Commits, PRs, Score, etc. | Dynamic Data | From GitHub API based on username |
| Analyze page results | Dynamic | Fetched when user enters username |

**The navigation is intentionally hardcoded as static application features.**
