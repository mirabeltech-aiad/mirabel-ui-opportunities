/**
 * Reports data and configuration
 */
export const reportsData = {
  categories: [
    "All",
    "Favorites",
    "Revenue Reports",
    "Subscribers",
    "Subscriber Reports",
    "Performance Reports"
  ],
  reports: [
    {
      id: 1,
      icon: "📈",
      title: "Renewal Performance Report",
      description: "Comprehensive renewal metrics including rates, trends, and campaign performance.",
      tags: ["renewal", "performance"],
      category: ["All", "Revenue Reports", "Performance Reports"],
      routePath: "/reports/renewal-performance",
      isStarred: true,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 2,
      icon: "👥",
      title: "Active Subscriber Summary Report",
      description: "Provides an overview of currently active subscribers across all products.",
      tags: ["active", "subscribers"],
      category: ["All", "Subscribers", "Subscriber Reports"],
      routePath: "/reports/active-subscriber-summary",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 3,
      icon: "📊",
      title: "Subscriber Demographic Report",
      description: "Analyzes subscriber demographics including age, location, and subscription preferences.",
      tags: ["demographic", "age"],
      category: ["All", "Subscribers", "Subscriber Reports"],
      routePath: "/reports/subscriber-demographic",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 4,
      icon: "📈",
      title: "Subscriber Growth Over Time Report",
      description: "Shows trends in subscriber acquisition and growth patterns over time.",
      tags: ["growth", "trends"],
      category: ["All", "Subscribers", "Performance Reports"],
      routePath: "/reports/subscriber-growth-time",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 5,
      icon: "🗺️",
      title: "Geographic Distribution Report",
      description: "Maps subscriber distribution across different geographic regions.",
      tags: ["geographic", "distribution"],
      category: ["All", "Subscriber Reports"],
      routePath: "/reports/geographic-distribution",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 6,
      icon: "📉",
      title: "Churn & Cancellation Report",
      description: "Tracks subscription cancellations and analyzes churn patterns.",
      tags: ["churn", "cancellation"],
      category: ["All", "Performance Reports"],
      routePath: "/reports/churn-cancellation",
      isStarred: true,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 7,
      icon: "🎁",
      title: "Complimentary Subscriptions Report",
      description: "Reports on free subscriptions provided to staff, partners, or promotional purposes.",
      tags: ["complimentary", "free"],
      category: ["All", "Subscribers"],
      routePath: "/reports/complimentary-subscriptions",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 8,
      icon: "🎁",
      title: "Gift Subscriptions Report",
      description: "Tracks gift subscriptions given by customers to others.",
      tags: ["gift", "subscriptions"],
      category: ["All", "Subscribers", "Revenue Reports"],
      routePath: "/reports/gift-subscriptions",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 9,
      icon: "⏰",
      title: "Subscription Aging Report",
      description: "Shows how long subscribers have been active and identifies tenure patterns.",
      tags: ["aging", "tenure"],
      category: ["All", "Subscriber Reports"],
      routePath: "/reports/subscription-aging",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 10,
      icon: "🔮",
      title: "Expiration Forecast Report",
      description: "Predicts upcoming subscription expirations and renewal opportunities.",
      tags: ["expiration", "forecast"],
      category: ["All", "Revenue Reports"],
      routePath: "/reports/expiration-forecast",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    },
    {
      id: 11,
      icon: "📊",
      title: "Churn by Cohort",
      description: "Analyze customer retention and churn patterns across acquisition cohorts with behavioral insights and risk assessment.",
      tags: ["cohort", "churn"],
      category: ["All", "Performance Reports"],
      routePath: "/reports/churn-cohort",
      isStarred: false,
      isAdmin: true,
      usedID: "",
      modifiedTitle: ""
    }
  ]
};
