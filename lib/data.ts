// ---------------------------------------------------------------------------
// SITE DATA — edit this file to update the entire site's content.
// Everything below is placeholder content structured for easy replacement.
// ---------------------------------------------------------------------------

export const identity = {
  name: "Muhammad Jawad Ahmad",
  roles: ["Backend Engineer", "Cybersecurity Specialist", "Founder of Phantex Tech"],
  tagline:
    "Building secure systems, scalable infrastructure, and innovative technology products.",
  email: "imjawadahmad.work@gmail.com",
  github: "https://github.com/iamamystery",
  /** Typed nullable so the UI degrades to an inactive channel if it is ever
      cleared, rather than rendering a dead link. */
  linkedin: "https://www.linkedin.com/in/jawad-algotixai-dev/" as string | null,
  location: "Punjab, Pakistan",
};

// ---------------------------------------------------------------------------
// LET'S BUILD SOMETHING THAT LASTS — section 10.
// A direct channel rather than a lead-capture form.
// ---------------------------------------------------------------------------

export const contact = {
  standfirst:
    "Whether you\u2019re building a startup, scaling infrastructure, or solving complex backend challenges, I\u2019d love to hear about it. Let\u2019s build reliable systems together.",
  role: "Backend Engineer @ Algotix AI",
  agency: "Founder \u2014 Phantex Tech",
  availability: [
    "Available for backend engineering projects",
    "Available for API architecture and system design consulting",
    "Open to remote collaborations",
    "Open to startup and long-term engineering opportunities",
  ],
  messagePlaceholder:
    "Tell me about your project, your goals, or the engineering challenge you\u2019re trying to solve.",
  /** Shown only after the message has genuinely been delivered. */
  successMessage:
    "Message received. I\u2019ll get back to you as soon as possible.",
};

// ---------------------------------------------------------------------------
// HERO — the Digital Headquarters entry screen.
// Kept separate from `identity` because the hero speaks in a tighter, more
// declarative voice than the rest of the site (and other sections consume
// `identity.roles` verbatim).
// ---------------------------------------------------------------------------

export const hero = {
  /** Small label above the name. */
  label: "Digital Headquarters",
  /** Rendered as stacked lines — one per array entry. */
  nameLines: ["Muhammad", "Jawad", "Ahmad"],
  /** Professional identity, shown as a hairline-separated row. */
  roles: ["Backend Engineer", "Automation Engineer", "Founder @ Phantex Tech"],
  /** The one sentence a recruiter reads in second two. Keep it concrete. */
  statement:
    "I build scalable backend systems, automation platforms, and production-grade software — the infrastructure products depend on, designed to hold under load and under attack.",
  /** The hero carries a single call to action by design. */
  primaryCta: { label: "Explore My Work", href: "#projects" },
  /** Quiet technology badges — the last thing in the hierarchy. */
  stack: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
  /** Telemetry strings for the HQ frame. Cosmetic, but keep them truthful. */
  telemetry: {
    coordinates: "31.5204° N, 74.3587° E",
    status: "All systems operational",
    node: "PHX-01",
  },
};

export const metrics = [
  { label: "Projects Built", value: 24, suffix: "" },
  { label: "Systems Designed", value: 12, suffix: "" },
  { label: "Security Domains", value: 8, suffix: "" },
  { label: "Technologies Used", value: 30, suffix: "+" },
];

// ---------------------------------------------------------------------------
// THE ENGINEER BEHIND THE SYSTEMS — section 01.
// Editorial, not biographical: how the work is thought about, before any of
// it is shown. Written in a declarative register — no "passionate about".
// ---------------------------------------------------------------------------

export const founder = {
  /** Section heading, split across two lines for composition. */
  headingLines: ["The engineer", "behind the systems"],
  /** One sentence under the heading. */
  standfirst:
    "Every system inherits the judgement of the engineer who designed it.",

  /** The opening statement. Two beats: the thing refused, then the claim.
      The first line is set recessive and the second dominant, so the
      composition performs the turn rather than just stating it. */
  statement: {
    counter: "I don't build websites.",
    claim: "I build the systems people depend on.",
  },

  /** Three to four lines. Concrete nouns, no adjectives doing the work. */
  paragraph:
    "My work sits underneath the product — the APIs, the data layer, the queues and workers, the path from commit to production. I design for distributed failure before it happens, automate what would otherwise be repeated by hand, and treat security as an architectural constraint rather than a final review.",

  /** Personnel record for the identity panel. Reads as an internal profile
      inside the headquarters, not an "about me" block. */
  profile: {
    role: "Backend Engineer",
    organization: "Phantex Tech",
    specialization: [
      "Backend Architecture",
      "Distributed Systems",
      "Automation",
    ],
    mission:
      "Building production-grade software that stays secure, reliable, and scalable under real load.",
  },

  /** Principles, not skills — each is a decision rule, stated once. */
  principles: [
    {
      title: "Security First",
      detail:
        "Every system is designed on the assumption that it will be attacked, and built so that it survives being right about that.",
    },
    {
      title: "Architecture Before Code",
      detail:
        "The expensive decisions are made before the first commit. Everything after is implementation detail.",
    },
    {
      title: "Automation Over Repetition",
      detail:
        "Anything done twice by hand is a system waiting to be written. Toil is a design flaw, not a workload.",
    },
    {
      title: "Performance Is A Feature",
      detail:
        "Latency is not a metric to report after launch. It is part of what the product is.",
    },
  ],
};

// ---------------------------------------------------------------------------
// BUILD · SECURE · SCALE — section 02.
// Three chapters read in order, not three cards read in parallel. Each
// chapter assumes the one before it, which is the whole argument: you
// cannot secure what does not hold, or scale what is not secure.
// ---------------------------------------------------------------------------

export type Chapter = {
  id: string;
  /** The chapter word — set large, one per discipline. */
  word: string;
  /** The narrative beat. Why this discipline comes where it does. */
  thesis: string;
  items: { name: string; detail: string }[];
};

export const chapters: Chapter[] = [
  {
    id: "build",
    word: "Build",
    thesis:
      "Before anything can be defended or scaled, it has to exist and hold. This is the layer everything else stands on.",
    items: [
      {
        name: "Backend Engineering",
        detail:
          "Services, workers, and data flow \u2014 the machinery a product actually runs on.",
      },
      {
        name: "APIs",
        detail:
          "Contract-first REST and gRPC, versioned deliberately, rate-limited by default.",
      },
      {
        name: "Databases",
        detail:
          "Schema design, indexing strategy, and query paths that stay fast as rows accumulate.",
      },
      {
        name: "Distributed Systems",
        detail:
          "Event-driven services and queues that degrade in parts rather than all at once.",
      },
    ],
  },
  {
    id: "secure",
    word: "Secure",
    thesis:
      "A system that works is not the same as a system that holds. Security is decided in the architecture, not in the audit that follows it.",
    items: [
      {
        name: "Authentication",
        detail:
          "Proving identity \u2014 sessions, tokens, and rotation handled as infrastructure.",
      },
      {
        name: "Authorization",
        detail:
          "Deciding what that identity may do, enforced at the boundary rather than the view.",
      },
      {
        name: "Cybersecurity",
        detail:
          "Threat modelling, dependency review, and configuration hardening across the stack.",
      },
      {
        name: "Secure Architecture",
        detail:
          "Zero-trust boundaries and least privilege, chosen before the first commit.",
      },
    ],
  },
  {
    id: "scale",
    word: "Scale",
    thesis:
      "Scale is not more servers. It is holding the same guarantees at a hundred times the load, without a rewrite.",
    items: [
      {
        name: "Cloud Infrastructure",
        detail:
          "Containerised, declared as code, and costed as an engineering constraint.",
      },
      {
        name: "Performance",
        detail:
          "Latency budgets, caching layers, and profiling treated as product work.",
      },
      {
        name: "Automation",
        detail:
          "Delivery and operational toil converted into pipelines that need no attention.",
      },
      {
        name: "Product Engineering",
        detail:
          "Turning architecture into something shippable, iterable, and maintained.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// ENGINEERING CASE STUDIES — section 03.
// Real, shipped work. Every field here is supplied by the author: nothing
// about architecture, performance, or outcomes is inferred or invented.
// If a case study needs a claim, it needs a source first.
// ---------------------------------------------------------------------------

export type ProjectStatus = "Live" | "In Development" | "Coming Soon";

export type Project = {
  slug: string;
  /** Case file number, in the headquarters' own numbering. */
  code: string;
  name: string;
  category: string;
  status: ProjectStatus;
  /** Exactly one project carries this — it takes visual priority. */
  flagship?: boolean;
  summary: string;
  technologies: string[];
  /** Deployed URL, or null when there is not one yet. */
  live: string | null;
  github: string;
};

export const projects: Project[] = [
  {
    slug: "enterprise-threat-intelligence",
    code: "PX-01",
    name: "Enterprise Threat Intelligence Platform",
    category: "Backend Engineering",
    status: "In Development",
    flagship: true,
    summary:
      "A production-grade cybersecurity intelligence platform built with FastAPI that collects, normalizes, stores, and distributes threat intelligence through secure REST APIs using clean architecture and scalable backend patterns.",
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "JWT",
      "Docker",
    ],
    live: null,
    github: "https://github.com/iamamystery/enterpriseintelligence",
  },
  {
    slug: "kingdomx",
    code: "PX-02",
    name: "KingdomX",
    category: "Full-Stack SaaS",
    status: "Live",
    summary:
      "A modern SaaS platform designed to streamline business operations through scalable architecture, intuitive dashboards, and enterprise-grade user experience.",
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis"],
    live: "https://kingdomx-demo.vercel.app/",
    github: "https://github.com/iamamystery/KingDomX",
  },
  {
    slug: "cloud-infrastructure-manager",
    code: "PX-03",
    name: "Cloud Infrastructure Manager",
    category: "Cloud Infrastructure",
    status: "Live",
    summary:
      "A cloud infrastructure management platform for deploying, monitoring, and optimizing resources across multiple cloud providers.",
    technologies: ["React", "Go", "Kubernetes", "Terraform", "AWS"],
    live: "https://cloud-infra-manager.vercel.app/",
    github: "https://github.com/iamamystery/Cloud-InfraStructure-Manager-",
  },
  {
    slug: "database-optimization-tool",
    code: "PX-04",
    name: "Database Optimization Tool",
    category: "Database Engineering",
    status: "Live",
    summary:
      "An intelligent database optimization platform that analyzes performance, identifies bottlenecks, and recommends optimizations for production databases.",
    technologies: ["Python", "PostgreSQL", "Redis"],
    live: "https://databaseot.vercel.app/",
    github: "https://github.com/iamamystery/DataBase-Optimization-Tool",
  },
  {
    slug: "analytics-dashboard",
    code: "PX-05",
    name: "Analytics Dashboard",
    category: "Data Visualization",
    status: "Live",
    summary:
      "A modern analytics platform providing real-time dashboards, interactive visualizations, and actionable business insights.",
    technologies: ["Next.js", "Python", "GraphQL", "D3.js"],
    live: "https://analyticsdashboard-nine.vercel.app/",
    github: "https://github.com/iamamystery/Analytics-Dashboard-",
  },
];

export type SystemNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: string;
  detail: string;
  decisions: string[];
};

export const systemNodes: SystemNode[] = [
  {
    id: "user", label: "User", x: 60, y: 200, kind: "Client",
    detail: "Web, mobile, and third-party API consumers. Untrusted by default — every request must prove who it is.",
    decisions: ["Treat all clients as hostile networks", "Version the public contract from day one"],
  },
  {
    id: "gateway", label: "API Gateway", x: 230, y: 200, kind: "Edge",
    detail: "The single front door. TLS termination, rate limiting, request validation, and routing policy live here.",
    decisions: ["One entry point → one audit trail", "Adaptive rate limits per identity, not per IP"],
  },
  {
    id: "auth", label: "Authentication", x: 400, y: 80, kind: "Identity",
    detail: "Issues short-lived, scoped tokens. Sessions, MFA, and device posture are decided here and nowhere else.",
    decisions: ["Short-lived JWTs + rotating refresh", "Auth logic centralized, never duplicated in services"],
  },
  {
    id: "services", label: "Services", x: 400, y: 200, kind: "Compute",
    detail: "Stateless domain services communicating over mTLS. Each owns its data and exposes a narrow contract.",
    decisions: ["Stateless → horizontal scaling is trivial", "Service-to-service trust only via signed context"],
  },
  {
    id: "queue", label: "Queues", x: 400, y: 320, kind: "Async",
    detail: "Message queues decouple slow work from the request path — emails, exports, webhooks, retries.",
    decisions: ["Everything non-critical goes async", "Idempotent consumers, dead-letter everything"],
  },
  {
    id: "db", label: "Databases", x: 580, y: 120, kind: "State",
    detail: "PostgreSQL as the system of record. Migrations reviewed like code; backups tested, not assumed.",
    decisions: ["Boring, proven storage wins", "Encryption at rest + field-level for PII"],
  },
  {
    id: "cache", label: "Caches", x: 580, y: 240, kind: "Speed",
    detail: "Redis layers absorbing read pressure. Caches are an optimization, never a source of truth.",
    decisions: ["Cache with explicit TTL + invalidation events", "Design for cache-miss storms"],
  },
  {
    id: "cloud", label: "Cloud Infra", x: 740, y: 200, kind: "Foundation",
    detail: "Infrastructure as code across regions. Least-privilege IAM, private networking, and observability built in.",
    decisions: ["If it isn't in Terraform, it doesn't exist", "Alerts on symptoms users feel, not raw metrics"],
  },
];

export const systemEdges: [string, string][] = [
  ["user", "gateway"],
  ["gateway", "auth"],
  ["gateway", "services"],
  ["services", "queue"],
  ["services", "db"],
  ["services", "cache"],
  ["auth", "db"],
  ["queue", "services"],
  ["db", "cloud"],
  ["cache", "cloud"],
  ["services", "cloud"],
];

export type VaultEntry = {
  id: string;
  clearance: string;
  title: string;
  category: string;
  summary: string;
  points: string[];
};

export const vaultEntries: VaultEntry[] = [
  {
    id: "V-001", clearance: "RESEARCH", title: "Anatomy of a Token Theft", category: "Security Research",
    summary: "How session tokens leak in modern SPAs — and the storage, scoping, and rotation patterns that make theft worthless.",
    points: ["XSS remains the top exfiltration path", "HttpOnly + short expiry beats clever storage tricks", "Rotation turns a stolen token into a race the attacker loses"],
  },
  {
    id: "V-002", clearance: "CASE STUDY", title: "Hardening a Startup in 30 Days", category: "Case Studies",
    summary: "A pre-Series-A team with zero security posture: what was fixed first, what was deferred, and why order matters.",
    points: ["Week 1: secrets out of the repo, MFA everywhere", "Week 2–3: least-privilege IAM and dependency audit", "Week 4: incident runbook and logging baseline"],
  },
  {
    id: "V-003", clearance: "THREAT MODEL", title: "STRIDE for a Payments API", category: "Threat Models",
    summary: "A worked threat model: every trust boundary in a payment flow, the attacks that cross it, and the controls that stop them.",
    points: ["Spoofing → mTLS + signed webhooks", "Tampering → hash-chained ledger entries", "Repudiation → dual-control on manual adjustments"],
  },
  {
    id: "V-004", clearance: "DESIGN", title: "Secure-by-Default Service Template", category: "Secure Design Concepts",
    summary: "The service skeleton every new Phantex system starts from: auth, input validation, and audit logging pre-wired.",
    points: ["Insecure configuration should require effort", "Validation at the boundary, types everywhere else", "Every privileged action produces an audit event"],
  },
  {
    id: "V-005", clearance: "METHOD", title: "The 5-Layer Review", category: "Security Methodologies",
    summary: "The review sequence applied to every release: dependencies, configuration, code, infrastructure, and human process.",
    points: ["Most incidents are config, not code", "Automate layers 1–2, focus humans on 3–5", "Review the process that produced the code, too"],
  },
];

// ---------------------------------------------------------------------------
// ENGINEERING JOURNAL — section 07.
// A writing archive, not a blog. Entries live here rather than in the MDX
// pipeline because most are not written yet; an entry becomes a real link
// only when its status is "Published" and it carries a slug pointing at a
// file in content/articles.
// ---------------------------------------------------------------------------

export type JournalStatus = "Published" | "In Progress" | "Coming Soon";

export type JournalEntry = {
  code: string;
  title: string;
  description: string;
  category: string;
  /** Author-estimated while unwritten; swap for the MDX value on publish. */
  readTime: string;
  status: JournalStatus;
  /** Required for "Published" — the MDX filename without its extension. */
  slug?: string;
};

export const journal: JournalEntry[] = [
  {
    code: "JN-01",
    title: "Designing APIs That Age Well",
    description:
      "Versioning, contracts, and architectural decisions that keep APIs maintainable for years.",
    category: "Backend Engineering",
    readTime: "8 min",
    status: "Coming Soon",
  },
  {
    code: "JN-02",
    title: "Threat Modeling Before Writing Code",
    description:
      "Why security architecture should begin before implementation \u2014 not after deployment.",
    category: "Cybersecurity",
    readTime: "10 min",
    status: "Coming Soon",
  },
  {
    code: "JN-03",
    title: "Scaling PostgreSQL Without Guesswork",
    description:
      "Practical indexing, query optimization, migrations, and performance tuning techniques.",
    category: "Database Engineering",
    readTime: "12 min",
    status: "Coming Soon",
  },
  {
    code: "JN-04",
    title: "Building ETIP: Architecture Decisions",
    description:
      "A behind-the-scenes look at the design decisions, trade-offs, and clean architecture behind the Enterprise Threat Intelligence Platform.",
    category: "Case Study",
    readTime: "15 min",
    status: "In Progress",
  },
  {
    code: "JN-05",
    title: "Lessons From Building Phantex Tech",
    description:
      "Engineering lessons, client work, remote collaboration, and building a software agency from the ground up.",
    category: "Startup Journey",
    readTime: "9 min",
    status: "Coming Soon",
  },
];

// ---------------------------------------------------------------------------
// BUILDING PHANTEX TECH — section 06.
// An honest account of a young studio. Nothing here is aspirational stated as
// fact: no products that do not exist, no stages that have not been reached,
// no counts of clients, revenue, or headcount. If a claim cannot be shown,
// it is not made.
// ---------------------------------------------------------------------------

export type MilestoneState = "done" | "current" | "pending";

export const phantex = {
  name: "Phantex Tech",

  /** Company snapshot. Facts only — deliberately no vanity metrics. */
  established: "2026",
  location: "Remote \u00B7 Pakistan",
  stage: "Growing Engineering Studio",
  focus: [
    "Backend Engineering",
    "Automation",
    "Cloud Infrastructure",
    "Cybersecurity",
  ],

  standfirst:
    "Every company starts somewhere. Phantex Tech is a remote engineering studio focused on building secure, scalable software systems. Every project in this portfolio represents part of that journey.",

  who: [
    "Phantex Tech is a remote software engineering studio founded to design and build modern backend systems, automation platforms, cloud infrastructure, and secure applications.",
    "We are currently a small team focused on craftsmanship, long-term thinking, and engineering quality over quantity.",
  ],

  mission: [
    "Build software that is secure by design, scalable from day one, and engineered to solve real business problems.",
    "Every system should be reliable, maintainable, and built with production in mind.",
  ],

  /** What the studio actually does today — capabilities, not products. */
  capabilities: [
    {
      name: "Backend Engineering",
      items: ["FastAPI", "REST APIs", "Authentication", "Database Design"],
    },
    {
      name: "Automation",
      items: ["Python Automation", "Web Scraping", "Workflow Automation"],
    },
    {
      name: "Cloud Infrastructure",
      items: ["Docker", "CI/CD", "Infrastructure"],
    },
    {
      name: "Cybersecurity",
      items: ["API Security", "Threat Modeling", "RBAC"],
    },
    {
      name: "AI Engineering",
      items: ["Developer Tools", "AI Integrations", "Automation Systems"],
    },
  ],

  outlook: [
    "Phantex Tech is still in its early stages.",
    "The long-term vision is to grow into a trusted engineering company known for building secure backend platforms, cloud-native systems, developer tools, and AI-powered software.",
    "Rather than chasing rapid growth, the focus is on building reliable software and earning trust through engineering excellence.",
  ],

  /** The year so far. The final entry is intentionally unwritten — inventing
      a milestone would be exactly the kind of claim this section removes. */
  year: "2026",
  milestones: [
    { label: "Founded Phantex Tech", state: "done" as MilestoneState },
    {
      label: "Started building internal engineering tools",
      state: "done" as MilestoneState,
    },
    { label: "Delivered first software projects", state: "done" as MilestoneState },
    {
      label: "Expanding into backend systems and AI products",
      state: "current" as MilestoneState,
    },
    { label: "Next milestone", state: "pending" as MilestoneState },
  ],
};

// ---------------------------------------------------------------------------
// THE JOURNEY SO FAR — section 08.
// The author's actual path: self-taught from 2024, first professional role in
// 2025, backend engineering in 2026, building Phantex Tech alongside it.
// Deliberately unembellished — the credibility is in the progression, and a
// short honest history reads stronger than a long invented one.
// ---------------------------------------------------------------------------

export type TimelineEvent = {
  /** A year, or "Future" for the open-ended final chapter. */
  year: string;
  label: string;
  title: string;
  body: string;
};

export const timeline: TimelineEvent[] = [
  {
    year: "2024",
    label: "The Beginning",
    title: "Started Learning Software Engineering",
    body: "In 2024 I began teaching myself software engineering from scratch. I spent countless hours learning programming fundamentals, backend development, databases, APIs, debugging, and building projects. Every project became another lesson.",
  },
  {
    year: "2025",
    label: "First Professional Role",
    title: "Software Engineer \u2014 TMB Tax Bureau",
    body: "Joined TMB Tax Bureau as a Software Engineer, where I worked on real-world software and gained experience collaborating within a professional engineering environment. This period transformed personal learning into practical engineering experience.",
  },
  {
    year: "2026",
    label: "New Chapter",
    title: "Backend Engineer \u2014 Algotix AI",
    body: "Joined Algotix AI as a Backend Engineer, focusing on backend architecture, APIs, databases, automation, and scalable systems. Working on production software while continuing to deepen my expertise in backend engineering.",
  },
  {
    year: "Future",
    label: "Building The Future",
    title: "Growing Phantex Tech",
    body: "Alongside my engineering career, I am building Phantex Tech \u2014 a remote software agency focused on creating secure, scalable, and high-quality digital products. The long-term vision is to grow it into a technology company recognized for engineering excellence.",
  },
];

export const proof = {
  stats: metrics,
  breakdown: [
    { label: "Backend systems", value: 12, max: 24 },
    { label: "Security engagements", value: 8, max: 24 },
    { label: "Product builds", value: 4, max: 24 },
  ],
  achievements: [
    "Designed a zero-trust gateway unifying 40+ services",
    "Built a ledger engine processing 1.2M transactions/day",
    "Founded Phantex Tech and shipped its first private beta",
    "Published security playbooks used by early-stage teams",
  ],
  research: [
    "Token lifecycle security in SPAs",
    "Explainable anomaly detection for small teams",
    "Cost-aware autoscaling strategies",
  ],
};
