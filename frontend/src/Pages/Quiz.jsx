import React, { useEffect, useState, useRef } from "react";

/* ======================================================
   MASTER QUESTION BANK (150 questions across 9 domains)
====================================================== */

const MASTER_QUESTIONS = [
  { q: "Best data structure for fast search?", options: ["Array", "Linked List", "Hash Table", "Stack"], answer: "Hash Table", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Purpose of system design interviews?", options: ["Syntax checking", "Scalability thinking", "Academic marks", "Coding speed"], answer: "Scalability thinking", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "CAP theorem relates to?", options: ["Distributed databases", "Operating systems", "Networking protocols", "UI design"], answer: "Distributed databases", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: "O(log n)", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is Big O notation used for?", options: ["Memory usage", "Algorithm efficiency", "Code style", "Debugging"], answer: "Algorithm efficiency", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Which sorting algorithm is stable?", options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"], answer: "Merge Sort", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Primary goal of OOP?", options: ["Speed", "Code reusability", "Low memory", "Simple syntax"], answer: "Code reusability", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Difference between Stack and Queue?", options: ["LIFO vs FIFO", "Size", "Memory location", "Speed"], answer: "LIFO vs FIFO", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What does REST stand for?", options: ["Representational State Transfer", "Remote Server Technology", "Real-time Execution System", "Rapid External Storage"], answer: "Representational State Transfer", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "HTTP status code for 'Not Found'?", options: ["200", "404", "500", "301"], answer: "404", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is a deadlock in OS?", options: ["Infinite loop", "Resource contention cycle", "Memory leak", "Cache miss"], answer: "Resource contention cycle", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Primary key in DBMS ensures?", options: ["Uniqueness", "Sorting", "Indexing speed", "Backup"], answer: "Uniqueness", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is normalization?", options: ["Reduce redundancy", "Increase speed", "Encrypt data", "Compress tables"], answer: "Reduce redundancy", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Difference between SQL and NoSQL?", options: ["Structured vs flexible schema", "Speed vs storage", "Free vs paid", "Local vs cloud"], answer: "Structured vs flexible schema", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is caching?", options: ["Temporary fast storage", "Permanent backup", "Encryption", "Compression"], answer: "Temporary fast storage", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "Load balancer does what?", options: ["Distributes traffic", "Stores data", "Authenticates users", "Encrypts connections"], answer: "Distributes traffic", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Microservices communicate via?", options: ["APIs", "Direct memory", "Shared database", "Files"], answer: "APIs", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is CI/CD?", options: ["Continuous Integration & Deployment", "Code Inspection & Debugging", "Cloud Infrastructure Design", "Client Interaction Cycle"], answer: "Continuous Integration & Deployment", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "Git command to merge branches?", options: ["git merge", "git pull", "git push", "git commit"], answer: "git merge", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is a race condition?", options: ["Timing-dependent bug", "Memory overflow", "Syntax error", "Network delay"], answer: "Timing-dependent bug", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Difference between TCP and UDP?", options: ["Reliable vs fast", "Encrypted vs plain", "Client vs server", "Wired vs wireless"], answer: "Reliable vs fast", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is DNS?", options: ["Domain Name System", "Data Network Service", "Dynamic Node Server", "Direct Network Storage"], answer: "Domain Name System", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "SSL/TLS is used for?", options: ["Secure communication", "Faster loading", "Caching", "Compression"], answer: "Secure communication", domain: "tech", difficulty: "easy", weight: 1 },
  { q: "What is sharding?", options: ["Horizontal partitioning", "Vertical scaling", "Backup strategy", "Load testing"], answer: "Horizontal partitioning", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Event-driven architecture uses?", options: ["Message queues", "Direct calls", "Shared memory", "Polling"], answer: "Message queues", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "What is idempotency in APIs?", options: ["Same result on retry", "Faster response", "Encrypted payload", "Compressed data"], answer: "Same result on retry", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Graph database best for?", options: ["Relationships", "Tabular data", "Documents", "Key-value"], answer: "Relationships", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "What is blue-green deployment?", options: ["Zero-downtime strategy", "A/B testing", "Canary release", "Hotfix"], answer: "Zero-downtime strategy", domain: "tech", difficulty: "hard", weight: 3 },
  { q: "Rate limiting prevents?", options: ["Abuse/DoS", "Data loss", "Slow database", "Memory leak"], answer: "Abuse/DoS", domain: "tech", difficulty: "medium", weight: 2 },
  { q: "OAuth is used for?", options: ["Authorization", "Encryption", "Compression", "Caching"], answer: "Authorization", domain: "tech", difficulty: "medium", weight: 2 },
  
  // DATA SCIENCE
  { q: "Most important skill for Data Science?", options: ["HTML", "Statistics", "Graphic design", "Video editing"], answer: "Statistics", domain: "data", difficulty: "easy", weight: 1 },
  { q: "SQL is primarily used for?", options: ["Styling websites", "Querying relational data", "Training models", "UI design"], answer: "Querying relational data", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Bias-variance tradeoff relates to?", options: ["Model overfitting/underfitting", "UI responsiveness", "Cloud costs", "CI/CD"], answer: "Model overfitting/underfitting", domain: "data", difficulty: "hard", weight: 3 },
  { q: "Pandas is a library for?", options: ["Python data manipulation", "Web scraping", "Game development", "Mobile apps"], answer: "Python data manipulation", domain: "data", difficulty: "easy", weight: 1 },
  { q: "What is data cleaning?", options: ["Handling missing/inconsistent data", "Visualizing charts", "Deploying models", "Collecting data"], answer: "Handling missing/inconsistent data", domain: "data", difficulty: "easy", weight: 1 },
  { q: "EDA stands for?", options: ["Exploratory Data Analysis", "Efficient Data Algorithm", "External Database Access", "Error Detection Automation"], answer: "Exploratory Data Analysis", domain: "data", difficulty: "easy", weight: 1 },
  { q: "Correlation measures?", options: ["Linear relationship", "Causation", "Outliers", "Clustering"], answer: "Linear relationship", domain: "data", difficulty: "medium", weight: 2 },
  { q: "What is overfitting?", options: ["Model too complex on training data", "Too simple model", "Fast training", "Low accuracy"], answer: "Model too complex on training data", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Cross-validation helps prevent?", options: ["Overfitting", "Data leakage", "Slow training", "High bias"], answer: "Overfitting", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Feature engineering means?", options: ["Creating better input features", "Selecting hardware", "Deploying model", "Visualizing data"], answer: "Creating better input features", domain: "data", difficulty: "medium", weight: 2 },
  { q: "What is a confusion matrix?", options: ["Evaluation for classification", "Data storage", "Visualization tool", "Clustering method"], answer: "Evaluation for classification", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Precision vs Recall trade-off in?", options: ["Imbalanced classification", "Regression", "Clustering", "Dimensionality reduction"], answer: "Imbalanced classification", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is PCA?", options: ["Dimensionality reduction", "Clustering", "Regression", "Neural network"], answer: "Dimensionality reduction", domain: "data", difficulty: "hard", weight: 3 },
  { q: "A/B testing is used for?", options: ["Comparing variants", "Training models", "Cleaning data", "Storing results"], answer: "Comparing variants", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Time series forecasting uses?", options: ["ARIMA, LSTM", "K-Means", "Decision Trees", "SVM"], answer: "ARIMA, LSTM", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is outlier detection?", options: ["Identifying anomalous points", "Removing duplicates", "Scaling features", "Encoding categories"], answer: "Identifying anomalous points", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Imputation handles?", options: ["Missing values", "Outliers", "Duplicates", "Class imbalance"], answer: "Missing values", domain: "data", difficulty: "easy", weight: 1 },
  { q: "What is regularization?", options: ["Prevents overfitting", "Speeds training", "Increases accuracy", "Reduces features"], answer: "Prevents overfitting", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Ensemble learning combines?", options: ["Multiple models", "Single strong model", "Only trees", "Only neural nets"], answer: "Multiple models", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Random Forest is an example of?", options: ["Bagging", "Boosting", "Stacking", "Clustering"], answer: "Bagging", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Gradient Boosting improves by?", options: ["Focusing on errors", "Random sampling", "Parallel trees", "Feature selection"], answer: "Focusing on errors", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is feature scaling?", options: ["Normalization/Standardization", "Selection", "Engineering", "Encoding"], answer: "Normalization/Standardization", domain: "data", difficulty: "easy", weight: 1 },
  { q: "ROC-AUC evaluates?", options: ["Classification threshold independence", "Regression error", "Clustering quality", "Time series"], answer: "Classification threshold independence", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is data leakage?", options: ["Training info in test", "Missing values", "High variance", "Low bias"], answer: "Training info in test", domain: "data", difficulty: "hard", weight: 3 },
  { q: "SMOTE is used for?", options: ["Class imbalance", "Dimensionality reduction", "Outlier removal", "Feature selection"], answer: "Class imbalance", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is clustering?", options: ["Unsupervised grouping", "Supervised classification", "Regression", "Dimensionality reduction"], answer: "Unsupervised grouping", domain: "data", difficulty: "medium", weight: 2 },
  { q: "K-Means is sensitive to?", options: ["Outliers & initialization", "Labels", "Time order", "Categorical data"], answer: "Outliers & initialization", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Silhouette score measures?", options: ["Clustering quality", "Regression error", "Classification accuracy", "Feature importance"], answer: "Clustering quality", domain: "data", difficulty: "hard", weight: 3 },
  { q: "What is ETL?", options: ["Extract, Transform, Load", "Evaluate, Train, Learn", "Encrypt, Transfer, Log", "Explore, Test, Launch"], answer: "Extract, Transform, Load", domain: "data", difficulty: "medium", weight: 2 },
  { q: "Data warehouse is for?", options: ["Analytics & reporting", "Real-time transactions", "Small datasets", "Unstructured logs"], answer: "Analytics & reporting", domain: "data", difficulty: "medium", weight: 2 },

  // CLOUD & DEVOPS
  { q: "AWS EC2 provides?", options: ["Virtual servers", "Object storage", "Database", "DNS"], answer: "Virtual servers", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "Docker creates?", options: ["Containers", "Virtual machines", "Bare metal servers", "Databases"], answer: "Containers", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Kubernetes primarily manages?", options: ["Container orchestration", "Virtual machines", "Databases", "Networking"], answer: "Container orchestration", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Serverless computing means?", options: ["No server management", "Physical servers", "Only VMs", "Local hosting"], answer: "No server management", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "AWS S3 is for?", options: ["Object storage", "Block storage", "Compute", "Database"], answer: "Object storage", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "VPC stands for?", options: ["Virtual Private Cloud", "Very Powerful Computer", "Virtual Public Container", "Volume Performance Cache"], answer: "Virtual Private Cloud", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "IAM in cloud controls?", options: ["Access & permissions", "Compute resources", "Storage", "Networking"], answer: "Access & permissions", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "Auto-scaling adjusts?", options: ["Resources based on load", "Fixed instances", "Manual only", "Storage only"], answer: "Resources based on load", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "CDN stands for?", options: ["Content Delivery Network", "Cloud Data Node", "Central Database Network", "Compute Distribution Node"], answer: "Content Delivery Network", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Lambda functions run?", options: ["On-demand code", "Always running", "Only VMs", "Local only"], answer: "On-demand code", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "RDS provides?", options: ["Managed relational databases", "Object storage", "Compute", "DNS"], answer: "Managed relational databases", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Elastic Load Balancer does?", options: ["Distributes traffic", "Stores data", "Runs containers", "Manages DNS"], answer: "Distributes traffic", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "CloudFormation/Terraform for?", options: ["Infrastructure as Code", "Monitoring", "Logging", "Billing"], answer: "Infrastructure as Code", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Multi-AZ deployment for?", options: ["High availability", "Cost reduction", "Speed", "Security"], answer: "High availability", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "What is hybrid cloud?", options: ["On-prem + public cloud", "Only public", "Only private", "Only edge"], answer: "On-prem + public cloud", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Edge computing processes?", options: ["Near data source", "Central cloud only", "On-prem only", "Client device"], answer: "Near data source", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "SLA means?", options: ["Service Level Agreement", "System Load Average", "Secure Login Access", "Storage Limit Allocation"], answer: "Service Level Agreement", domain: "cloud", difficulty: "easy", weight: 1 },
  { q: "Shared responsibility model defines?", options: ["Security duties split", "Cost sharing", "Performance", "Bandwidth"], answer: "Security duties split", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Regions vs Availability Zones?", options: ["Geographic vs isolated", "Same location", "Cost difference", "Speed"], answer: "Geographic vs isolated", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Reserved Instances save?", options: ["Cost with commitment", "Performance", "Latency", "Bandwidth"], answer: "Cost with commitment", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Snowball is for?", options: ["Large data transfer", "Compute", "Streaming", "DNS"], answer: "Large data transfer", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "CloudWatch monitors?", options: ["Metrics & logs", "Billing", "Security", "DNS"], answer: "Metrics & logs", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "What is lift-and-shift?", options: ["Rehosting to cloud", "Refactoring", "New build", "Hybrid"], answer: "Rehosting to cloud", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "12 Factor App methodology for?", options: ["Cloud-native apps", "Monoliths", "Desktop", "Embedded"], answer: "Cloud-native apps", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Service mesh (Istio) manages?", options: ["Microservice communication", "Storage", "Compute", "DNS"], answer: "Microservice communication", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "Spot Instances are?", options: ["Cheaper, interruptible", "Dedicated", "Reserved", "On-demand"], answer: "Cheaper, interruptible", domain: "cloud", difficulty: "medium", weight: 2 },
  { q: "Direct Connect provides?", options: ["Private network link", "Public internet", "VPN only", "WiFi"], answer: "Private network link", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "GuardDuty is for?", options: ["Threat detection", "Encryption", "Backup", "Scaling"], answer: "Threat detection", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "EKS manages?", options: ["Kubernetes clusters", "Virtual machines", "Databases", "Storage"], answer: "Kubernetes clusters", domain: "cloud", difficulty: "hard", weight: 3 },
  { q: "What is canary deployment?", options: ["Gradual rollout", "All at once", "Blue-green", "Rollback only"], answer: "Gradual rollout", domain: "cloud", difficulty: "hard", weight: 3 },

  // BUSINESS
  { q: "Most valued soft skill in MNCs?", options: ["Communication", "Gaming", "Fast typing", "Drawing"], answer: "Communication", domain: "business", difficulty: "easy", weight: 1 },
  { q: "KPIs are used to?", options: ["Measure performance", "Design UI", "Write code", "Deploy servers"], answer: "Measure performance", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Product-market fit means?", options: ["Product meets market demand", "Good marketing", "Beautiful UI", "High sales"], answer: "Product meets market demand", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Agile methodology focuses on?", options: ["Iterative delivery", "Long planning", "Fixed scope", "Waterfall"], answer: "Iterative delivery", domain: "business", difficulty: "easy", weight: 1 },
  { q: "Scrum uses?", options: ["Sprints & roles", "Gantt charts", "Yearly plans", "Fixed teams"], answer: "Sprints & roles", domain: "business", difficulty: "medium", weight: 2 },
  { q: "MVP stands for?", options: ["Minimum Viable Product", "Most Valuable Player", "Maximum Value Proposition", "Market Validation Plan"], answer: "Minimum Viable Product", domain: "business", difficulty: "easy", weight: 1 },
  { q: "Stakeholder is?", options: ["Anyone impacted by project", "Only client", "Only team", "Only manager"], answer: "Anyone impacted by project", domain: "business", difficulty: "easy", weight: 1 },
  { q: "OKRs stand for?", options: ["Objectives & Key Results", "Operational Key Resources", "Organizational Knowledge Review", "Output & Key Revenue"], answer: "Objectives & Key Results", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Customer journey map shows?", options: ["User experience flow", "Code flow", "Server architecture", "Database schema"], answer: "User experience flow", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Burn-down chart tracks?", options: ["Remaining work", "Team velocity", "Defects", "Revenue"], answer: "Remaining work", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Lean startup emphasizes?", options: ["Build-Measure-Learn", "Plan-Execute-Scale", "Design-Code-Test", "Sell-Market-Grow"], answer: "Build-Measure-Learn", domain: "business", difficulty: "hard", weight: 3 },
  { q: "SWOT analysis includes?", options: ["Strengths, Weaknesses, Opportunities, Threats", "Sales, Work, Operations, Targets", "Strategy, Workflow, Output, Team", "Scope, Work, Objectives, Tasks"], answer: "Strengths, Weaknesses, Opportunities, Threats", domain: "business", difficulty: "easy", weight: 1 },
  { q: "North Star Metric is?", options: ["Single key growth metric", "Revenue only", "User count", "Profit"], answer: "Single key growth metric", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Churn rate measures?", options: ["Customer loss", "New signups", "Revenue growth", "Profit"], answer: "Customer loss", domain: "business", difficulty: "medium", weight: 2 },
  { q: "LTV means?", options: ["Customer Lifetime Value", "Long Term Vision", "Lead to Value", "Launch Time Value"], answer: "Customer Lifetime Value", domain: "business", difficulty: "medium", weight: 2 },
  { q: "CAC is?", options: ["Customer Acquisition Cost", "Cloud Access Control", "Content Approval Cycle", "Career Advancement Credit"], answer: "Customer Acquisition Cost", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Growth hacking focuses on?", options: ["Rapid low-cost growth", "Traditional marketing", "TV ads", "Print media"], answer: "Rapid low-cost growth", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Pivot in startup means?", options: ["Strategic direction change", "More funding", "Hiring", "Office move"], answer: "Strategic direction change", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Moat refers to?", options: ["Competitive advantage", "Office building", "Funding round", "Team size"], answer: "Competitive advantage", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Retention is more important than?", options: ["Acquisition", "Marketing spend", "Features", "Design"], answer: "Acquisition", domain: "business", difficulty: "medium", weight: 2 },
  { q: "User persona represents?", options: ["Ideal customer archetype", "Real user", "Employee", "Investor"], answer: "Ideal customer archetype", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Feature creep means?", options: ["Adding too many features", "Fast development", "Bug fixing", "Deployment"], answer: "Adding too many features", domain: "business", difficulty: "medium", weight: 2 },
  { q: "RICE scoring prioritizes by?", options: ["Reach, Impact, Confidence, Effort", "Revenue, Innovation, Cost, Execution", "Risk, Importance, Complexity, Ease", "Return, Investment, Capability, Efficiency"], answer: "Reach, Impact, Confidence, Effort", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Jobs to be Done framework focuses on?", options: ["Customer goals", "Product features", "Price", "Marketing"], answer: "Customer goals", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Virality coefficient >1 means?", options: ["Exponential growth", "Linear growth", "Decline", "Stable"], answer: "Exponential growth", domain: "business", difficulty: "hard", weight: 3 },
  { q: "AARRR framework stands for?", options: ["Acquisition, Activation, Retention, Referral, Revenue", "Analysis, Action, Review, Report, Repeat", "Awareness, Acquisition, Revenue, Retention, Referral", "Attract, Acquire, Retain, Refer, Revenue"], answer: "Acquisition, Activation, Retention, Referral, Revenue", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Cross-functional team includes?", options: ["Multiple disciplines", "Only developers", "Only designers", "Only managers"], answer: "Multiple disciplines", domain: "business", difficulty: "easy", weight: 1 },
  { q: "Technical debt refers to?", options: ["Shortcuts in code quality", "Financial loan", "Server cost", "Cloud bill"], answer: "Shortcuts in code quality", domain: "business", difficulty: "medium", weight: 2 },
  { q: "Northbound traction means?", options: ["Top-down adoption", "Bottom-up", "Sideways", "External"], answer: "Top-down adoption", domain: "business", difficulty: "hard", weight: 3 },
  { q: "Bottom-up adoption is?", options: ["Users drive adoption", "Management mandates", "Sales team", "Marketing"], answer: "Users drive adoption", domain: "business", difficulty: "hard", weight: 3 },

  // AI/ML
  { q: "Supervised learning requires?", options: ["Labeled data", "Unlabeled data", "Rewards", "Clusters"], answer: "Labeled data", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "CNNs are best suited for?", options: ["Image processing", "Tabular data", "Text sequences", "Time series"], answer: "Image processing", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Vanishing gradient problem commonly occurs in?", options: ["Deep neural networks", "Linear models", "Decision trees", "K-Means"], answer: "Deep neural networks", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "The core mechanism of Transformer architecture is?", options: ["Attention mechanism", "Convolution", "Recurrence", "Pooling only"], answer: "Attention mechanism", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "BERT is primarily pre-trained using?", options: ["Masked language modeling", "Image classification", "Reinforcement tasks", "Clustering"], answer: "Masked language modeling", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Reinforcement learning primarily uses?", options: ["Rewards & actions", "Labeled data", "Feature vectors", "Clusters"], answer: "Rewards & actions", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "A GAN consists of which two components?", options: ["Generator & Discriminator", "Encoder & Decoder", "Two classifiers", "Autoencoder only"], answer: "Generator & Discriminator", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Transfer learning typically reuses?", options: ["Pre-trained models", "Random weights", "Small datasets", "New architecture"], answer: "Pre-trained models", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "LSTMs were specifically designed to handle?", options: ["Sequential data", "Images", "Tabular data", "Graph structures"], answer: "Sequential data", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "The ReLU activation function is defined as?", options: ["f(x) = max(0, x)", "f(x) = 1/(1+e^-x)", "f(x) = (e^x - e^-x)/(e^x + e^-x)", "f(x) = x"], answer: "f(x) = max(0, x)", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "Dropout is commonly used to prevent?", options: ["Overfitting", "Underfitting", "Slow convergence", "Vanishing gradients"], answer: "Overfitting", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Backpropagation is used to compute?", options: ["Gradients", "Predictions", "Feature importance", "Clusters"], answer: "Gradients", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "One epoch means?", options: ["One full pass through the training data", "One batch update", "One layer training", "One neuron update"], answer: "One full pass through the training data", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "Batch size primarily affects?", options: ["Training stability & speed", "Model architecture", "Dataset size", "Activation choice"], answer: "Training stability & speed", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Fine-tuning refers to?", options: ["Adjusting a pre-trained model on new data", "Training from scratch", "Freezing all layers", "Data cleaning"], answer: "Adjusting a pre-trained model on new data", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Prompt engineering is the practice of?", options: ["Crafting effective inputs for LLMs", "Building new models", "Deploying APIs", "Labeling data"], answer: "Crafting effective inputs for LLMs", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "RAG stands for?", options: ["Retrieval Augmented Generation", "Random Attention Graph", "Recurrent Autoencoder Graph", "Reinforcement Agent Guidance"], answer: "Retrieval Augmented Generation", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Hallucination in large language models means?", options: ["Generating plausible but false information", "Slow response time", "High accuracy", "Low latency"], answer: "Generating plausible but false information", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Zero-shot learning means?", options: ["No training examples for the task", "One example", "Few examples", "Many examples"], answer: "No training examples for the task", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Diffusion models are primarily used for?", options: ["Image generation", "Classification", "Regression", "Clustering"], answer: "Image generation", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Tokenization in NLP refers to?", options: ["Splitting text into tokens", "Compressing data", "Encrypting text", "Labeling entities"], answer: "Splitting text into tokens", domain: "ai", difficulty: "easy", weight: 1 },
  { q: "Self-attention mechanism allows the model to?", options: ["Weigh importance of different words", "Reduce dimensions", "Increase inference speed", "Compress embeddings"], answer: "Weigh importance of different words", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Chain-of-thought prompting encourages?", options: ["Step-by-step reasoning", "Short direct answers", "Image inputs", "Code execution"], answer: "Step-by-step reasoning", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "Federated learning trains models on?", options: ["Decentralized data without sharing it", "Central server only", "Public datasets only", "Cloud storage"], answer: "Decentralized data without sharing it", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Model quantization primarily reduces?", options: ["Model size and inference speed", "Training time only", "Accuracy only", "Dataset size"], answer: "Model size and inference speed", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Few-shot learning involves?", options: ["Providing a few examples in the prompt", "No examples", "Many examples", "Unlabeled data"], answer: "Providing a few examples in the prompt", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "An autoencoder is commonly used for?", options: ["Dimensionality reduction & anomaly detection", "Classification only", "Regression only", "Image generation only"], answer: "Dimensionality reduction & anomaly detection", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Gradient descent updates model parameters using?", options: ["Loss gradient direction", "Random search", "Feature importance", "Hyperparameter grid"], answer: "Loss gradient direction", domain: "ai", difficulty: "medium", weight: 2 },
  { q: "The Adam optimizer combines benefits of?", options: ["Momentum & adaptive learning rates", "Only momentum", "Only RMSProp", "Basic SGD only"], answer: "Momentum & adaptive learning rates", domain: "ai", difficulty: "hard", weight: 3 },
  { q: "Multimodal AI models can process?", options: ["Multiple data types (text, image, audio)", "Text only", "Image only", "Audio only"], answer: "Multiple data types (text, image, audio)", domain: "ai", difficulty: "medium", weight: 2 },

  // CYBER SECURITY
  { q: "Most common attack vector today?", options: ["Phishing", "DDoS", "SQL Injection", "Brute Force"], answer: "Phishing", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "CIA triad stands for?", options: ["Confidentiality, Integrity, Availability", "Control, Impact, Assessment", "Cyber, Intelligence, Action", "Cryptography, Intrusion, Attack"], answer: "Confidentiality, Integrity, Availability", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Zero Trust model assumes?", options: ["Verify every request", "Trust internal network", "Block external only", "Allow by default"], answer: "Verify every request", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "OWASP Top 10 includes?", options: ["Injection, Broken Auth", "Slow loading", "Poor UI", "High cost"], answer: "Injection, Broken Auth", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "MFA stands for?", options: ["Multi-Factor Authentication", "Main Frame Access", "Mobile First Architecture", "Multi Firewall Attack"], answer: "Multi-Factor Authentication", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Encryption at rest protects?", options: ["Stored data", "Data in transit", "Running code", "Network traffic"], answer: "Stored data", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "SIEM tools are used for?", options: ["Log monitoring & alerts", "Code deployment", "UI testing", "Cloud billing"], answer: "Log monitoring & alerts", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "VPN provides?", options: ["Encrypted tunnel", "Faster internet", "Free WiFi", "Ad blocking"], answer: "Encrypted tunnel", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Firewall operates at which OSI layer?", options: ["Layer 3/4", "Layer 7 only", "Layer 1", "Application"], answer: "Layer 3/4", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "XSS attack targets?", options: ["Client-side scripts", "Database", "Server memory", "Network"], answer: "Client-side scripts", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Common hashing algorithm for passwords?", options: ["bcrypt", "MD5", "SHA-1", "Base64"], answer: "bcrypt", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "GDPR is related to?", options: ["Data privacy", "Cloud pricing", "AI ethics", "Open source"], answer: "Data privacy", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Least privilege principle means?", options: ["Minimal access needed", "Full access", "Admin by default", "Guest access"], answer: "Minimal access needed", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "WAF protects against?", options: ["Web attacks", "DDoS only", "Malware", "Insider threats"], answer: "Web attacks", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Blue team in cybersecurity does?", options: ["Defense", "Attack simulation", "Pen testing", "Bug bounty"], answer: "Defense", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Red team does?", options: ["Simulate real attacks", "Monitor logs", "Patch systems", "Write policies"], answer: "Simulate real attacks", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Penetration testing is also known as?", options: ["Ethical hacking", "Code review", "Load testing", "UI testing"], answer: "Ethical hacking", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "SOC stands for?", options: ["Security Operations Center", "System on Chip", "Service Operation Control", "Secure Online Cloud"], answer: "Security Operations Center", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Ransomware typically demands payment in?", options: ["Cryptocurrency", "Cash", "Credit card", "Bank transfer"], answer: "Cryptocurrency", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "DLP stands for?", options: ["Data Loss Prevention", "Deep Learning Platform", "Digital License Protection", "Domain Link Protocol"], answer: "Data Loss Prevention", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Supply chain attack example?", options: ["SolarWinds", "DDoS", "Phishing email", "Brute force"], answer: "SolarWinds", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Common tool for network scanning?", options: ["Nmap", "Wireshark", "Burp Suite", "Metasploit"], answer: "Nmap", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Threat hunting is?", options: ["Proactive search for threats", "Reactive incident response", "Patch management", "Backup"], answer: "Proactive search for threats", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "SOC 2 compliance is for?", options: ["Service organizations", "Government", "Startups only", "Hardware"], answer: "Service organizations", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "PKI uses?", options: ["Public/private keys", "Passwords only", "Biometrics", "Tokens"], answer: "Public/private keys", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Most secure protocol for remote access?", options: ["SSH", "Telnet", "FTP", "RDP"], answer: "SSH", domain: "cyber", difficulty: "easy", weight: 1 },
  { q: "Hashing is?", options: ["One-way function", "Reversible", "Encryption", "Compression"], answer: "One-way function", domain: "cyber", difficulty: "medium", weight: 2 },
  { q: "Common web vulnerability?", options: ["CSRF", "Slow API", "Poor design", "High traffic"], answer: "CSRF", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Incident response steps include?", options: ["Preparation, Detection, Containment", "Code, Test, Deploy", "Plan, Do, Check", "Build, Measure, Learn"], answer: "Preparation, Detection, Containment", domain: "cyber", difficulty: "hard", weight: 3 },
  { q: "Endpoint Detection & Response (EDR) monitors?", options: ["Devices", "Network only", "Cloud only", "Servers only"], answer: "Devices", domain: "cyber", difficulty: "medium", weight: 2 },

  // MARKETING
  { q: "SEO stands for?", options: ["Search Engine Optimization", "Social Engagement Online", "Sales Enablement Outreach", "Server Error Override"], answer: "Search Engine Optimization", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Primary goal of content marketing?", options: ["Build trust & authority", "Direct sales", "Viral memes", "Paid ads"], answer: "Build trust & authority", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "CTR means?", options: ["Click-Through Rate", "Cost To Revenue", "Customer Trust Rating", "Conversion Target Ratio"], answer: "Click-Through Rate", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "A/B testing is used for?", options: ["Optimizing conversions", "Coding websites", "Training models", "Deploying servers"], answer: "Optimizing conversions", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Funnel stages include?", options: ["Awareness, Consideration, Conversion", "Code, Test, Deploy", "Plan, Do, Check", "Build, Measure, Learn"], answer: "Awareness, Consideration, Conversion", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Google Analytics tracks?", options: ["User behavior", "Stock prices", "Weather", "Code errors"], answer: "User behavior", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Email open rate is affected by?", options: ["Subject line", "Server speed", "Database size", "Code quality"], answer: "Subject line", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "ROAS stands for?", options: ["Return on Ad Spend", "Revenue Over Average Sales", "Reach Over Audience Size", "Risk of Ad Strategy"], answer: "Return on Ad Spend", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Influencer marketing leverages?", options: ["Social proof", "Paid search", "TV ads", "Billboards"], answer: "Social proof", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Customer persona represents?", options: ["Ideal buyer profile", "Real customer", "Employee", "Investor"], answer: "Ideal buyer profile", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Conversion rate optimization focuses on?", options: ["Turning visitors into customers", "Increasing traffic", "Reducing bounce rate only", "Building brand"], answer: "Turning visitors into customers", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "PPC means?", options: ["Pay Per Click", "Post Per Comment", "Page Per Conversion", "Product Price Comparison"], answer: "Pay Per Click", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Remarketing targets?", options: ["Previous website visitors", "New users only", "Competitors", "Random audience"], answer: "Previous website visitors", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Organic traffic comes from?", options: ["Unpaid search results", "Paid ads", "Social media only", "Email"], answer: "Unpaid search results", domain: "marketing", difficulty: "easy", weight: 1 },
  { q: "Bounce rate measures?", options: ["Single-page sessions", "Time on site", "Pages per session", "Conversion rate"], answer: "Single-page sessions", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Lead magnet is?", options: ["Free value for email", "Paid product", "Social post", "Ad creative"], answer: "Free value for email", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Viral coefficient >1 means?", options: ["Exponential growth", "Linear growth", "Decline", "Stable"], answer: "Exponential growth", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Customer Lifetime Value (CLV) helps?", options: ["Predict long-term revenue", "Daily sales", "Ad cost", "Bounce rate"], answer: "Predict long-term revenue", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Growth hacking combines?", options: ["Marketing + data + creativity", "Sales + HR", "Finance + ops", "Design + legal"], answer: "Marketing + data + creativity", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "North Star Metric is?", options: ["Single key growth metric", "Revenue only", "User count", "Profit"], answer: "Single key growth metric", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Churn rate measures?", options: ["Customer loss", "New signups", "Revenue growth", "Ad spend"], answer: "Customer loss", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "CAC is?", options: ["Customer Acquisition Cost", "Cloud Access Control", "Content Approval Cycle", "Career Advancement Credit"], answer: "Customer Acquisition Cost", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "LTV:CAC ratio should ideally be?", options: ["3:1 or higher", "1:1", "1:3", "10:1"], answer: "3:1 or higher", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Omnichannel marketing means?", options: ["Seamless experience across channels", "Only online", "Only offline", "Single channel"], answer: "Seamless experience across channels", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Brand equity refers to?", options: ["Value of brand name", "Stock price", "Ad budget", "Sales volume"], answer: "Value of brand name", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "NPS measures?", options: ["Customer loyalty", "Sales growth", "Ad performance", "Website speed"], answer: "Customer loyalty", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "Affiliate marketing pays for?", options: ["Referrals & sales", "Clicks only", "Impressions", "Likes"], answer: "Referrals & sales", domain: "marketing", difficulty: "medium", weight: 2 },
  { q: "User-generated content builds?", options: ["Authenticity & trust", "Paid traffic", "SEO only", "Ad revenue"], answer: "Authenticity & trust", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Dark funnel refers to?", options: ["Untrackable buyer journey", "Black hat SEO", "Hidden ads", "Underground sales"], answer: "Untrackable buyer journey", domain: "marketing", difficulty: "hard", weight: 3 },
  { q: "Marketing automation helps with?", options: ["Lead nurturing", "Manual emails", "Cold calling", "Print ads"], answer: "Lead nurturing", domain: "marketing", difficulty: "medium", weight: 2 },

  // DESIGN
  { q: "Figma is used for?", options: ["UI/UX design", "Coding", "Data analysis", "Cloud deployment"], answer: "UI/UX design", domain: "design", difficulty: "easy", weight: 1 },
  { q: "User persona helps?", options: ["Understand target users", "Write code", "Deploy servers", "Run ads"], answer: "Understand target users", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Wireframe is?", options: ["Low-fidelity layout", "Final design", "Coded page", "3D model"], answer: "Low-fidelity layout", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Golden ratio in design is approximately?", options: ["1.618", "1.5", "2", "1"], answer: "1.618", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Accessibility includes?", options: ["Color contrast, alt text", "Fancy animations", "Complex navigation", "Small text"], answer: "Color contrast, alt text", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Material Design is by?", options: ["Google", "Apple", "Microsoft", "Adobe"], answer: "Google", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Hick's Law says?", options: ["More choices = slower decision", "Less choices = confusion", "Color affects speed", "Size matters most"], answer: "More choices = slower decision", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Microinteractions enhance?", options: ["User delight", "Page speed", "SEO", "Ad revenue"], answer: "User delight", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Responsive design adapts to?", options: ["Screen size", "User age", "Location", "Time"], answer: "Screen size", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Design thinking process includes?", options: ["Empathize, Define, Ideate, Prototype, Test", "Code, Test, Deploy", "Plan, Execute, Review", "Sell, Market, Grow"], answer: "Empathize, Define, Ideate, Prototype, Test", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Color psychology: Blue represents?", options: ["Trust & calm", "Energy & passion", "Growth & health", "Luxury & power"], answer: "Trust & calm", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Typography hierarchy improves?", options: ["Readability", "Loading speed", "SEO ranking", "Ad clicks"], answer: "Readability", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Dark mode saves battery on?", options: ["OLED screens", "LCD screens", "All screens", "No screens"], answer: "OLED screens", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Gestalt principle of proximity means?", options: ["Close elements appear related", "Similar colors group", "Large items dominate", "Motion attracts attention"], answer: "Close elements appear related", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Adobe XD is for?", options: ["Prototyping", "Video editing", "3D modeling", "Music production"], answer: "Prototyping", domain: "design", difficulty: "easy", weight: 1 },
  { q: "User flow maps?", options: ["User journey through app", "Data flow", "Money flow", "Server flow"], answer: "User journey through app", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Neumorphism uses?", options: ["Soft shadows", "Flat colors", "Bold gradients", "Skeuomorphic textures"], answer: "Soft shadows", domain: "design", difficulty: "hard", weight: 3 },
  { q: "WCAG stands for?", options: ["Web Content Accessibility Guidelines", "World Class Animation Group", "Web Color and Graphics", "Wireless Connectivity Association"], answer: "Web Content Accessibility Guidelines", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Brutalism in design features?", options: ["Raw, unpolished look", "Minimalism", "Elegant curves", "Pastel colors"], answer: "Raw, unpolished look", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Card sorting helps with?", options: ["Information architecture", "Color palette", "Animation timing", "Font selection"], answer: "Information architecture", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Affordance in design means?", options: ["Object suggests use", "Beautiful appearance", "Fast loading", "High contrast"], answer: "Object suggests use", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Glassmorphism uses?", options: ["Blurred background", "Solid colors", "Sharp edges", "3D shadows"], answer: "Blurred background", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Design sprint lasts?", options: ["5 days", "1 week", "1 month", "3 months"], answer: "5 days", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Mood board is used for?", options: ["Visual direction", "User testing", "Coding", "Marketing"], answer: "Visual direction", domain: "design", difficulty: "easy", weight: 1 },
  { q: "Progressive disclosure shows?", options: ["Information gradually", "All at once", "Nothing", "Only errors"], answer: "Information gradually", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Skeuomorphism mimics?", options: ["Real-world objects", "Flat icons", "Abstract shapes", "Code structure"], answer: "Real-world objects", domain: "design", difficulty: "hard", weight: 3 },
  { q: "Heatmap shows?", options: ["User attention areas", "Server heat", "Color temperature", "Traffic sources"], answer: "User attention areas", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Mobile-first design starts with?", options: ["Smallest screen", "Largest screen", "Desktop only", "Print"], answer: "Smallest screen", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Design system includes?", options: ["Reusable components", "One-off designs", "Random colors", "Different fonts"], answer: "Reusable components", domain: "design", difficulty: "medium", weight: 2 },
  { q: "Framer is used for?", options: ["Interactive prototypes", "Static images", "Backend code", "Database"], answer: "Interactive prototypes", domain: "design", difficulty: "easy", weight: 1 },

  // MANAGEMENT
  { q: "Agile methodology focuses on?", options: ["Iterative delivery", "Long planning", "Fixed scope", "Waterfall"], answer: "Iterative delivery", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Scrum uses?", options: ["Sprints & roles", "Gantt charts", "Yearly plans", "Fixed teams"], answer: "Sprints & roles", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Kanban visualizes?", options: ["Work flow", "Financial reports", "Code structure", "Server logs"], answer: "Work flow", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Critical path in project shows?", options: ["Longest sequence of tasks", "Shortest path", "Cheapest tasks", "Easiest tasks"], answer: "Longest sequence of tasks", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Stakeholder management involves?", options: ["Communication & expectations", "Coding", "Design", "Marketing"], answer: "Communication & expectations", domain: "management", difficulty: "medium", weight: 2 },
  { q: "RACI matrix defines?", options: ["Responsible, Accountable, Consulted, Informed", "Risk, Action, Control, Impact", "Resource, Activity, Cost, Income", "Requirement, Analysis, Change, Implementation"], answer: "Responsible, Accountable, Consulted, Informed", domain: "management", difficulty: "hard", weight: 3 },
  { q: "SWOT analysis includes?", options: ["Strengths, Weaknesses, Opportunities, Threats", "Sales, Work, Operations, Targets", "Strategy, Workflow, Output, Team", "Scope, Work, Objectives, Tasks"], answer: "Strengths, Weaknesses, Opportunities, Threats", domain: "management", difficulty: "easy", weight: 1 },
  { q: "OKRs stand for?", options: ["Objectives & Key Results", "Operational Key Resources", "Organizational Knowledge Review", "Output & Key Revenue"], answer: "Objectives & Key Results", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Burn-down chart tracks?", options: ["Remaining work", "Team velocity", "Defects", "Revenue"], answer: "Remaining work", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Risk register documents?", options: ["Potential risks", "Completed tasks", "Team salaries", "Marketing budget"], answer: "Potential risks", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Gantt chart shows?", options: ["Timeline & dependencies", "Financial data", "User feedback", "Code quality"], answer: "Timeline & dependencies", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Change management deals with?", options: ["People side of change", "Technical upgrades only", "Budget changes", "Location moves"], answer: "People side of change", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Triple constraint includes?", options: ["Scope, Time, Cost", "Quality, Risk, Resources", "Team, Tools, Training", "Plan, Do, Check, Act"], answer: "Scope, Time, Cost", domain: "management", difficulty: "medium", weight: 2 },
  { q: "PMBOK is?", options: ["Project Management Body of Knowledge", "Product Marketing Book", "Programming Methodology", "Personal Management Basics"], answer: "Project Management Body of Knowledge", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Retrospective meeting is for?", options: ["Continuous improvement", "Celebration", "Planning next phase", "Budget review"], answer: "Continuous improvement", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Velocity in Scrum measures?", options: ["Team capacity", "Individual performance", "Bug count", "Revenue"], answer: "Team capacity", domain: "management", difficulty: "medium", weight: 2 },
  { q: "MVP in project means?", options: ["Minimum Viable Product", "Most Valuable Player", "Maximum Value Plan", "Management Vision Presentation"], answer: "Minimum Viable Product", domain: "management", difficulty: "easy", weight: 1 },
  { q: "RAID log tracks?", options: ["Risks, Actions, Issues, Decisions", "Revenue, Assets, Income, Debt", "Resources, Activities, Inputs, Deliverables", "Requirements, Analysis, Implementation, Design"], answer: "Risks, Actions, Issues, Decisions", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Servant leadership in management means?", options: ["Supporting team success", "Command & control", "Micromanagement", "Top-down decisions"], answer: "Supporting team success", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Conflict resolution technique: Win-Win is?", options: ["Collaboration", "Compromise", "Avoidance", "Competition"], answer: "Collaboration", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Earned Value Management measures?", options: ["Project performance", "Team happiness", "Marketing reach", "Sales growth"], answer: "Project performance", domain: "management", difficulty: "hard", weight: 3 },
  { q: "MoSCoW prioritization uses?", options: ["Must, Should, Could, Won't", "Money, Scope, Cost, Quality", "Market, Sales, Customers, Operations", "Manage, Organize, Schedule, Control"], answer: "Must, Should, Could, Won't", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Lessons learned are captured?", options: ["At project end", "Only at beginning", "Never", "During marketing"], answer: "At project end", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Resource leveling avoids?", options: ["Over-allocation", "Under-budget", "Scope creep", "Technical debt"], answer: "Over-allocation", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Agile manifesto values?", options: ["Individuals & interactions over processes", "Comprehensive documentation", "Contract negotiation", "Following a plan"], answer: "Individuals & interactions over processes", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Sprint review is for?", options: ["Demonstrating work", "Planning next sprint", "Retrospective", "Daily standup"], answer: "Demonstrating work", domain: "management", difficulty: "easy", weight: 1 },
  { q: "Product backlog is owned by?", options: ["Product Owner", "Scrum Master", "Team", "Stakeholder"], answer: "Product Owner", domain: "management", difficulty: "medium", weight: 2 },
  { q: "Definition of Done ensures?", options: ["Quality standards met", "Work completed fast", "Client happy", "Budget saved"], answer: "Quality standards met", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Hybrid methodology combines?", options: ["Agile + Waterfall", "Scrum + Kanban", "Lean + Six Sigma", "All of above"], answer: "Agile + Waterfall", domain: "management", difficulty: "hard", weight: 3 },
  { q: "Emotional intelligence in leadership includes?", options: ["Self-awareness, empathy", "Technical skills", "Coding ability", "Financial knowledge"], answer: "Self-awareness, empathy", domain: "management", difficulty: "medium", weight: 2 },

  // FINANCE & ACCOUNTING
  { q: "What is compound interest?", options: ["Interest on interest", "Simple interest", "Bank fee", "Investment return"], answer: "Interest on interest", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "P&L statement shows?", options: ["Profit and Loss", "Performance Level", "Product Launch", "Payment List"], answer: "Profit and Loss", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "EBITDA stands for?", options: ["Earnings Before Interest, Taxes, Depreciation, Amortization", "Expected Budget in Total Dividends Allocation", "Equity Before Interest Tax Deduction", "Economic Balance in Trade and Asset"], answer: "Earnings Before Interest, Taxes, Depreciation, Amortization", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Liquidity ratio measures?", options: ["Ability to pay short-term debts", "Long-term profitability", "Market share", "Revenue growth"], answer: "Ability to pay short-term debts", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "NPV is used for?", options: ["Investment evaluation", "Tax calculation", "Inventory management", "Sales forecasting"], answer: "Investment evaluation", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Balance sheet shows?", options: ["Assets, Liabilities, Equity", "Revenue and expenses", "Cash flow", "Sales data"], answer: "Assets, Liabilities, Equity", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "ROI stands for?", options: ["Return on Investment", "Rate of Interest", "Revenue Optimization Index", "Risk of Inflation"], answer: "Return on Investment", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "Depreciation is?", options: ["Asset value decrease over time", "Interest payment", "Tax deduction", "Profit margin"], answer: "Asset value decrease over time", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Working capital is?", options: ["Current Assets - Current Liabilities", "Total Assets", "Net Profit", "Revenue - Expenses"], answer: "Current Assets - Current Liabilities", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Break-even point is when?", options: ["Revenue = Costs", "Profit maximized", "Loss minimized", "Revenue doubled"], answer: "Revenue = Costs", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Accounts receivable represents?", options: ["Money owed to company", "Money company owes", "Cash in hand", "Inventory value"], answer: "Money owed to company", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "GAAP stands for?", options: ["Generally Accepted Accounting Principles", "Global Accounting and Auditing Process", "Government Asset Allocation Plan", "General Analysis of Profit"], answer: "Generally Accepted Accounting Principles", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Cash flow statement tracks?", options: ["Cash inflows and outflows", "Profit margins", "Asset purchases", "Debt levels"], answer: "Cash inflows and outflows", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "IPO means?", options: ["Initial Public Offering", "International Profit Operation", "Investment Portfolio Optimization", "Internal Price Offer"], answer: "Initial Public Offering", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "Beta in finance measures?", options: ["Stock volatility vs market", "Company profit", "Dividend rate", "Tax rate"], answer: "Stock volatility vs market", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Diversification reduces?", options: ["Investment risk", "Returns", "Costs", "Taxes"], answer: "Investment risk", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Fiscal year is?", options: ["12-month accounting period", "Calendar year", "Tax season", "Quarter period"], answer: "12-month accounting period", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "Equity financing involves?", options: ["Selling ownership shares", "Taking loans", "Leasing assets", "Issuing bonds"], answer: "Selling ownership shares", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Market capitalization is?", options: ["Share price × Outstanding shares", "Total assets", "Annual revenue", "Net profit"], answer: "Share price × Outstanding shares", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Dividend yield shows?", options: ["Annual dividend / Share price", "Total dividends paid", "Profit margin", "Revenue growth"], answer: "Annual dividend / Share price", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Hedge fund strategy focuses on?", options: ["High returns, high risk", "Low risk only", "Government bonds", "Savings accounts"], answer: "High returns, high risk", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Credit score affects?", options: ["Loan interest rates", "Salary", "Tax rate", "Insurance premium only"], answer: "Loan interest rates", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Mutual fund pools?", options: ["Multiple investors' money", "Company profits", "Government funds", "Personal savings"], answer: "Multiple investors' money", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "Capital gains tax applies to?", options: ["Investment profits", "Salary income", "Gifts received", "Inheritance"], answer: "Investment profits", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Venture capital invests in?", options: ["Startups with high potential", "Established companies", "Government bonds", "Real estate only"], answer: "Startups with high potential", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Debt-to-equity ratio measures?", options: ["Financial leverage", "Profitability", "Liquidity", "Market share"], answer: "Financial leverage", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Blue chip stocks are?", options: ["Large, established companies", "Startups", "Penny stocks", "Government bonds"], answer: "Large, established companies", domain: "finance", difficulty: "medium", weight: 2 },
  { q: "Inflation causes?", options: ["Purchasing power decrease", "Money value increase", "Deflation", "Interest rate drop"], answer: "Purchasing power decrease", domain: "finance", difficulty: "easy", weight: 1 },
  { q: "Leverage in finance means?", options: ["Using borrowed money to invest", "Reducing debt", "Selling assets", "Saving money"], answer: "Using borrowed money to invest", domain: "finance", difficulty: "hard", weight: 3 },
  { q: "Liquidity premium compensates for?", options: ["Inability to quickly sell", "High returns", "Low risk", "Tax benefits"], answer: "Inability to quickly sell", domain: "finance", difficulty: "hard", weight: 3 },

  // HEALTHCARE & MEDICINE
  { q: "Primary healthcare focuses on?", options: ["Preventive and basic care", "Surgery only", "Emergency care", "Specialized treatment"], answer: "Preventive and basic care", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "BMI stands for?", options: ["Body Mass Index", "Basic Medical Information", "Blood Monitoring Interval", "Bone Mineral Index"], answer: "Body Mass Index", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Epidemiology studies?", options: ["Disease patterns in populations", "Individual treatment", "Surgery techniques", "Drug development"], answer: "Disease patterns in populations", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Telemedicine enables?", options: ["Remote healthcare delivery", "Surgery practice", "Drug manufacturing", "Laboratory testing"], answer: "Remote healthcare delivery", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "EHR stands for?", options: ["Electronic Health Record", "Emergency Health Response", "Essential Healthcare Resources", "Evaluated Health Risk"], answer: "Electronic Health Record", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Clinical trials test?", options: ["New treatments and drugs", "Hospital equipment", "Patient satisfaction", "Insurance policies"], answer: "New treatments and drugs", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Preventive medicine aims to?", options: ["Stop disease before it starts", "Cure existing diseases", "Perform surgery", "Provide emergency care"], answer: "Stop disease before it starts", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Health insurance deductible is?", options: ["Amount paid before coverage starts", "Monthly premium", "Total coverage limit", "Copayment amount"], answer: "Amount paid before coverage starts", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Pharmacology studies?", options: ["Drugs and their effects", "Surgery techniques", "Disease diagnosis", "Patient care"], answer: "Drugs and their effects", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "ICU stands for?", options: ["Intensive Care Unit", "Immediate Care Urgency", "Internal Clinical Unit", "Isolated Care Unit"], answer: "Intensive Care Unit", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Vital signs include?", options: ["Heart rate, BP, temperature, respiration", "Blood test results", "X-ray findings", "Medication list"], answer: "Heart rate, BP, temperature, respiration", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Genomics in healthcare enables?", options: ["Personalized medicine", "Standard treatment", "Surgery planning", "Insurance pricing"], answer: "Personalized medicine", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Public health focuses on?", options: ["Community health promotion", "Individual treatment", "Private hospitals", "Pharmaceutical sales"], answer: "Community health promotion", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Healthcare analytics uses?", options: ["Data to improve outcomes", "Patient feedback only", "Manual records", "Billing systems"], answer: "Data to improve outcomes", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Medical imaging includes?", options: ["X-ray, MRI, CT scan", "Blood tests", "Physical examination", "Patient history"], answer: "X-ray, MRI, CT scan", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Chronic disease is?", options: ["Long-lasting condition", "Short-term illness", "Infectious disease", "Emergency condition"], answer: "Long-lasting condition", domain: "healthcare", difficulty: "easy", weight: 1 },
  { q: "Healthcare informatics combines?", options: ["IT and healthcare", "Surgery and medicine", "Nursing and pharmacy", "Diagnosis and treatment"], answer: "IT and healthcare", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Value-based care focuses on?", options: ["Patient outcomes", "Service volume", "Procedure count", "Hospital beds"], answer: "Patient outcomes", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Medical ethics involves?", options: ["Moral principles in healthcare", "Hospital management", "Billing practices", "Technology use"], answer: "Moral principles in healthcare", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Health equity means?", options: ["Fair access to healthcare", "Equal payment", "Same treatment for all", "Universal insurance"], answer: "Fair access to healthcare", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Biostatistics applies to?", options: ["Medical data analysis", "Patient care", "Surgery planning", "Drug dispensing"], answer: "Medical data analysis", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Clinical pathways guide?", options: ["Standardized treatment plans", "Hospital navigation", "Billing processes", "Emergency exits"], answer: "Standardized treatment plans", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Differential diagnosis involves?", options: ["Distinguishing similar conditions", "Single disease identification", "Treatment selection", "Surgery planning"], answer: "Distinguishing similar conditions", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Healthcare supply chain manages?", options: ["Medical supplies and equipment", "Patient flow", "Doctor schedules", "Insurance claims"], answer: "Medical supplies and equipment", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Quality improvement in healthcare uses?", options: ["Systematic methods to enhance care", "Random changes", "Cost reduction only", "Staff reduction"], answer: "Systematic methods to enhance care", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Patient safety protocols prevent?", options: ["Medical errors and harm", "Long wait times", "High costs", "Staff turnover"], answer: "Medical errors and harm", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Healthcare policy affects?", options: ["System organization and funding", "Individual treatment", "Doctor salaries", "Hospital design"], answer: "System organization and funding", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Care coordination improves?", options: ["Patient experience across providers", "Single doctor visits", "Hospital efficiency", "Billing accuracy"], answer: "Patient experience across providers", domain: "healthcare", difficulty: "medium", weight: 2 },
  { q: "Population health management addresses?", options: ["Health of defined groups", "Individual patients only", "Hospital statistics", "Insurance groups"], answer: "Health of defined groups", domain: "healthcare", difficulty: "hard", weight: 3 },
  { q: "Medical coding translates?", options: ["Diagnoses to standardized codes", "Patient language", "Lab results", "Treatment plans"], answer: "Diagnoses to standardized codes", domain: "healthcare", difficulty: "medium", weight: 2 },

  // CONTENT CREATION & MEDIA
  { q: "Content marketing builds?", options: ["Audience through valuable content", "Quick sales", "Email lists only", "Social followers"], answer: "Audience through valuable content", domain: "content", difficulty: "easy", weight: 1 },
  { q: "SEO-optimized content focuses on?", options: ["Search engine visibility", "Word count only", "Images only", "Video length"], answer: "Search engine visibility", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Evergreen content is?", options: ["Always relevant", "Seasonal", "News-based", "Trending only"], answer: "Always relevant", domain: "content", difficulty: "easy", weight: 1 },
  { q: "Content calendar helps with?", options: ["Planning and scheduling", "Writing faster", "SEO ranking", "Social shares"], answer: "Planning and scheduling", domain: "content", difficulty: "easy", weight: 1 },
  { q: "Video retention rate measures?", options: ["How long viewers watch", "Total views", "Likes count", "Share count"], answer: "How long viewers watch", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Engagement rate includes?", options: ["Likes, comments, shares", "Views only", "Followers only", "Clicks only"], answer: "Likes, comments, shares", domain: "content", difficulty: "easy", weight: 1 },
  { q: "YouTube algorithm favors?", options: ["Watch time and engagement", "Upload frequency only", "Subscriber count only", "Video length"], answer: "Watch time and engagement", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Podcast growth depends on?", options: ["Consistent quality content", "Episode length", "Number of guests", "Music quality"], answer: "Consistent quality content", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Copywriting aims to?", options: ["Persuade and convert", "Inform only", "Entertain only", "Describe products"], answer: "Persuade and convert", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Storytelling in content creates?", options: ["Emotional connection", "Longer articles", "More keywords", "Better grammar"], answer: "Emotional connection", domain: "content", difficulty: "easy", weight: 1 },
  { q: "Content repurposing means?", options: ["Adapting content for different platforms", "Copying content", "Deleting old content", "Writing new content"], answer: "Adapting content for different platforms", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Influencer collaboration works best with?", options: ["Aligned audience and values", "Highest follower count", "Lowest cost", "Multiple posts"], answer: "Aligned audience and values", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Content funnel stages are?", options: ["Awareness, Consideration, Decision", "Create, Post, Share", "Write, Edit, Publish", "Plan, Execute, Analyze"], answer: "Awareness, Consideration, Decision", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Viral content typically has?", options: ["Strong emotional appeal", "Perfect grammar", "Long format", "Technical details"], answer: "Strong emotional appeal", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Content audit evaluates?", options: ["Existing content performance", "Grammar errors", "Image quality", "Posting schedule"], answer: "Existing content performance", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Editorial guidelines ensure?", options: ["Consistent brand voice", "Fast writing", "Long articles", "Many keywords"], answer: "Consistent brand voice", domain: "content", difficulty: "medium", weight: 2 },
  { q: "User-generated content provides?", options: ["Authenticity and trust", "Free content only", "More followers", "Better SEO"], answer: "Authenticity and trust", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Content distribution channels include?", options: ["Owned, Earned, Paid", "Social only", "Email only", "Website only"], answer: "Owned, Earned, Paid", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Thumbnail design affects?", options: ["Click-through rate", "Video quality", "Audio quality", "Upload speed"], answer: "Click-through rate", domain: "content", difficulty: "easy", weight: 1 },
  { q: "Content personalization uses?", options: ["User data and preferences", "Generic templates", "Same message for all", "Random selection"], answer: "User data and preferences", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Native advertising blends with?", options: ["Platform's regular content", "Banner ads", "Pop-ups", "Spam emails"], answer: "Platform's regular content", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Content accessibility includes?", options: ["Captions, alt text, readable fonts", "Popular topics", "Trending hashtags", "High resolution"], answer: "Captions, alt text, readable fonts", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Brand journalism focuses on?", options: ["Company stories as news", "Product ads", "Sales pitches", "Press releases"], answer: "Company stories as news", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Content velocity measures?", options: ["Publishing frequency", "Reading speed", "Video speed", "Loading time"], answer: "Publishing frequency", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Micro-content is?", options: ["Short, snackable pieces", "Long articles", "E-books", "White papers"], answer: "Short, snackable pieces", domain: "content", difficulty: "easy", weight: 1 },
  { q: "Content attribution tracks?", options: ["How content drives conversions", "Who wrote it", "Word count", "Publication date"], answer: "How content drives conversions", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Interactive content includes?", options: ["Quizzes, polls, calculators", "Static images", "Plain text", "PDFs only"], answer: "Quizzes, polls, calculators", domain: "content", difficulty: "medium", weight: 2 },
  { q: "Content gap analysis identifies?", options: ["Missing topics to cover", "Grammar errors", "Broken links", "Slow pages"], answer: "Missing topics to cover", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Thought leadership content establishes?", options: ["Industry expertise and authority", "Entertainment value", "Viral potential", "SEO ranking"], answer: "Industry expertise and authority", domain: "content", difficulty: "hard", weight: 3 },
  { q: "Content amplification uses?", options: ["Paid promotion to extend reach", "Organic only", "Email only", "Social only"], answer: "Paid promotion to extend reach", domain: "content", difficulty: "medium", weight: 2 },
];

/* ======================================================
   UTILITIES
====================================================== */

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getDifficultyByRound = (round) =>
  round === 1 ? "easy" : round === 2 ? "medium" : "hard";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/* ======================================================
   MAGNETIC CURSOR COMPONENT
====================================================== */

const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      setIsVisible(true);
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Magnetic effect on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .domain-card');
    
    const magneticEffect = (e) => {
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const strength = 0.3;
        const moveX = deltaX * strength;
        const moveY = deltaY * strength;
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        cursor.style.transform = 'scale(1.5)';
      }
    };

    const resetMagnetic = (e) => {
      e.currentTarget.style.transform = 'translate(0, 0)';
      cursor.style.transform = 'scale(1)';
    };

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', magneticEffect);
      el.addEventListener('mousemove', magneticEffect);
      el.addEventListener('mouseleave', resetMagnetic);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', magneticEffect);
        el.removeEventListener('mousemove', magneticEffect);
        el.removeEventListener('mouseleave', resetMagnetic);
      });
    };
  }, []);

  const cursorStyle = {
    position: 'fixed',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #6366f1',
    pointerEvents: 'none',
    zIndex: 10000,
    transform: 'translate(-50%, -50%)',
    transition: 'transform 0.15s ease-out',
    opacity: isVisible ? 1 : 0,
    mixBlendMode: 'difference',
  };

  return <div ref={cursorRef} style={cursorStyle} />;
};

/* ======================================================
   MAIN QUIZ COMPONENT
====================================================== */

export default function Quiz() {
  const [stage, setStage] = useState("selection");
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [round, setRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [scores, setScores] = useState({
    tech: 0,
    data: 0,
    ai: 0,
    cloud: 0,
    business: 0,
    cyber: 0,
    marketing: 0,
    design: 0,
    management: 0,
    finance: 0,
    healthcare: 0,
    content: 0,
  });

  const totalQuestionsPerRound = 15;
  const maxRounds = 3;

  const domainInfo = {
    tech: { 
      name: "Software Engineering", 
      description: "Build scalable systems and applications",
      color: "#6366f1" 
    },
    data: { 
      name: "Data Science & Analytics", 
      description: "Extract insights from complex data",
      color: "#10b981" 
    },
    ai: { 
      name: "AI / Machine Learning", 
      description: "Develop intelligent systems",
      color: "#f59e0b" 
    },
    cloud: { 
      name: "Cloud & DevOps", 
      description: "Build and manage cloud infrastructure",
      color: "#06b6d4" 
    },
    business: { 
      name: "Product & Business", 
      description: "Drive strategic growth and innovation",
      color: "#8b5cf6" 
    },
    cyber: { 
      name: "Cyber Security", 
      description: "Protect systems and data from threats",
      color: "#ef4444" 
    },
    marketing: { 
      name: "Digital Marketing", 
      description: "Drive growth through digital channels",
      color: "#f97316" 
    },
    design: { 
      name: "UI/UX & Design", 
      description: "Create exceptional user experiences",
      color: "#ec4899" 
    },
    management: { 
      name: "Project Management", 
      description: "Lead teams and deliver results",
      color: "#6366f1" 
    },
    finance: { 
      name: "Finance & Accounting", 
      description: "Manage money and financial strategy",
      color: "#14b8a6" 
    },
    healthcare: { 
      name: "Healthcare & Medicine", 
      description: "Improve patient care and health systems",
      color: "#22c55e" 
    },
    content: { 
      name: "Content Creation & Media", 
      description: "Create engaging stories and experiences",
      color: "#a855f7" 
    },
  };

  /* ======================
     DOMAIN SELECTION
  ======================= */
  const toggleDomain = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
  };

  const startQuiz = () => {
    if (selectedDomains.length === 0) {
      alert("Please select at least one domain to continue");
      return;
    }
    setStage("quiz");
  };

  /* ======================
     Initialize Round Questions
  ======================= */
  useEffect(() => {
    if (stage !== "quiz") return;

    const difficulty = getDifficultyByRound(round);

    let filtered = MASTER_QUESTIONS.filter(
      (q) => selectedDomains.includes(q.domain) && q.difficulty === difficulty
    );

    if (filtered.length < totalQuestionsPerRound) {
      filtered = MASTER_QUESTIONS.filter((q) => q.difficulty === difficulty);
    }

    if (round > 1) {
      filtered = filtered.sort((a, b) => scores[a.domain] - scores[b.domain]);
    }

    const selected = shuffle(filtered).slice(0, totalQuestionsPerRound);
    setQuestions(selected);
    setCurrentIndex(0);
    setTimeLeft(300);
    setIsAnswered(false);
    setSelectedOption(null);
  }, [round, stage]);

  /* ======================
     Timer Logic
  ======================= */
  useEffect(() => {
    if (stage !== "quiz" || completed || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, completed, questions.length, stage]);

  /* ======================
     Handle Answer
  ======================= */
  const handleOptionClick = (option) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.answer;

    if (isCorrect) {
      setScores((prev) => ({
        ...prev,
        [currentQuestion.domain]: prev[currentQuestion.domain] + currentQuestion.weight,
      }));
    }

    setTimeout(() => {
      handleNext();
    }, 1500);
  };

  /* ======================
     Next Question / Round
  ======================= */
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      if (round < maxRounds) {
        setRound(round + 1);
      } else {
        setCompleted(true);
        setStage("results");
      }
    }
  };

  /* ======================
     Results Logic
  ======================= */
  const sortedDomains = Object.entries(scores)
    .filter(([domain]) => selectedDomains.includes(domain))
    .sort((a, b) => b[1] - a[1])
    .map(([domain, score]) => ({ domain, score }));

  const bestDomain = sortedDomains[0]?.domain || selectedDomains[0] || "tech";
  const bestDomainName = domainInfo[bestDomain]?.name || "Unknown";

  const improvementMap = {
    tech: "Focus on data structures, algorithms, system design patterns, and contribute to open-source projects to build a strong technical foundation.",
    data: "Strengthen your statistical knowledge, master SQL and Python libraries (Pandas, NumPy), and work on real-world datasets through Kaggle competitions.",
    ai: "Deepen your understanding of neural networks, study mathematics (linear algebra, calculus), and implement models using PyTorch or TensorFlow.",
    cloud: "Gain hands-on experience with AWS/Azure/GCP, learn Docker and Kubernetes, and practice infrastructure-as-code with Terraform.",
    business: "Develop strategic thinking, improve stakeholder communication, and study product management frameworks like OKRs and RICE scoring.",
    cyber: "Study network security, practice ethical hacking on platforms like HackTheBox, and obtain certifications like CEH or CISSP.",
    marketing: "Learn data-driven marketing, master Google Analytics and SEO, and build campaigns focusing on conversion optimization.",
    design: "Study design systems, practice in Figma, learn accessibility standards (WCAG), and build a strong portfolio with case studies.",
    management: "Strengthen leadership skills, learn Agile and Scrum methodologies, and practice stakeholder management in real projects.",
    finance: "Master financial modeling in Excel, understand financial statements deeply, study valuation methods, and consider CFA or CPA certifications.",
    healthcare: "Gain clinical knowledge, understand healthcare systems and policy, learn health informatics, and explore population health management.",
    content: "Build a diverse portfolio, master storytelling techniques, learn SEO and analytics, and study platform algorithms for maximum reach.",
  };

  /* ======================
     GLOBAL STYLES
  ======================= */
  
  // Import Google Fonts for cursive headings
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const globalStyles = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  const headingStyles = {
    fontFamily: "'Playfair Display', 'Dancing Script', serif",
    fontStyle: 'italic',
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '24px',
    ...globalStyles,
  };

  /* ======================
     RENDER: DOMAIN SELECTION
  ======================= */
  if (stage === "selection") {
    return (
      <div style={containerStyle}>
        <MagneticCursor />
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '60px',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '64px',
            animation: 'fadeInDown 0.8s ease-out',
          }}>
            <style>{`
              @keyframes fadeInDown {
                from {
                  opacity: 0;
                  transform: translateY(-30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              
              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-30px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
              
              @keyframes pulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.05);
                }
              }
              
              .domain-card {
                animation: scaleIn 0.5s ease-out;
                animation-fill-mode: both;
              }
              
              .domain-card:nth-child(1) { animation-delay: 0.1s; }
              .domain-card:nth-child(2) { animation-delay: 0.15s; }
              .domain-card:nth-child(3) { animation-delay: 0.2s; }
              .domain-card:nth-child(4) { animation-delay: 0.25s; }
              .domain-card:nth-child(5) { animation-delay: 0.3s; }
              .domain-card:nth-child(6) { animation-delay: 0.35s; }
              .domain-card:nth-child(7) { animation-delay: 0.4s; }
              .domain-card:nth-child(8) { animation-delay: 0.45s; }
              .domain-card:nth-child(9) { animation-delay: 0.5s; }
              .domain-card:nth-child(10) { animation-delay: 0.55s; }
              .domain-card:nth-child(11) { animation-delay: 0.6s; }
              .domain-card:nth-child(12) { animation-delay: 0.65s; }
            `}</style>
            
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '24px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6366f1',
              letterSpacing: '0.5px',
              animation: 'fadeInDown 0.6s ease-out',
            }}>
              PathNex AI Intelligence Platform
            </div>
            
            <h1 style={{
              fontSize: '56px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 16px 0',
              letterSpacing: '-1px',
              lineHeight: '1.1',
              ...headingStyles,
            }}>
              Select Your Career Focus Areas
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: '#64748b',
              margin: '0',
              fontWeight: '400',
              lineHeight: '1.6',
              animation: 'fadeInUp 0.8s ease-out',
            }}>
              Choose one or more domains to generate a personalized intelligence assessment
            </p>
          </div>

          {/* Domain Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}>
            <style>{`
              .domain-card:hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
              }
              
              .domain-card:active {
                transform: translateY(-2px) scale(0.98) !important;
              }
            `}</style>
            
            {Object.entries(domainInfo).map(([key, info]) => {
              const isSelected = selectedDomains.includes(key);
              return (
                <div
                  key={key}
                  className="domain-card"
                  onClick={() => toggleDomain(key)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '28px',
                    cursor: 'pointer',
                    border: `2px solid ${isSelected ? info.color : '#e2e8f0'}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    boxShadow: isSelected 
                      ? `0 8px 24px ${info.color}30` 
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{
                    width: '4px',
                    height: '48px',
                    background: info.color,
                    borderRadius: '4px',
                    position: 'absolute',
                    left: '0',
                    top: '28px',
                    opacity: isSelected ? 1 : 0.3,
                    transition: 'all 0.3s',
                  }} />
                  
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.3px',
                    transition: 'color 0.3s',
                  }}>
                    {info.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '15px',
                    color: '#64748b',
                    margin: '0',
                    lineHeight: '1.5',
                  }}>
                    {info.description}
                  </p>

                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '24px',
                      right: '24px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: info.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                      animation: 'scaleIn 0.3s ease-out',
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div style={{
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
            animation: 'fadeInUp 1s ease-out',
          }}>
            <style>{`
              .cta-button {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              }
              
              .cta-button:not(:disabled):hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4) !important;
              }
              
              .cta-button:not(:disabled):active {
                transform: translateY(0);
                box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3) !important;
              }
            `}</style>
            
            <button
              className="cta-button"
              onClick={startQuiz}
              disabled={selectedDomains.length === 0}
              style={{
                padding: '16px 48px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: selectedDomains.length > 0 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                  : '#cbd5e1',
                border: 'none',
                borderRadius: '12px',
                cursor: selectedDomains.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: selectedDomains.length > 0 
                  ? '0 4px 16px rgba(99, 102, 241, 0.3)' 
                  : 'none',
                letterSpacing: '0.3px',
              }}
            >
              Start Personalized Assessment
              {selectedDomains.length > 0 && ` (${selectedDomains.length} selected)`}
            </button>

            <p style={{
              marginTop: '20px',
              fontSize: '14px',
              color: '#94a3b8',
              fontWeight: '400',
            }}>
              This assessment adapts to your strengths and gaps
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ======================
     RENDER: RESULTS SCREEN
  ======================= */
  if (stage === "results") {
    const maxPossibleScore = maxRounds * 3 * totalQuestionsPerRound;
    const totalScore = sortedDomains.reduce((sum, d) => sum + d.score, 0);
    const overallPercentage = Math.round((totalScore / (maxPossibleScore * selectedDomains.length)) * 100);

    return (
      <div style={containerStyle}>
        <MagneticCursor />
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          paddingTop: '40px',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px',
            animation: 'fadeInDown 0.8s ease-out',
          }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '24px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6366f1',
              letterSpacing: '0.5px',
            }}>
              Assessment Complete
            </div>
            
            <h1 style={{
              fontSize: '52px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 12px 0',
              letterSpacing: '-1px',
              ...headingStyles,
            }}>
              Career Readiness Report
            </h1>
            
            <p style={{
              fontSize: '17px',
              color: '#64748b',
              margin: '0',
              fontWeight: '400',
              animation: 'fadeInUp 0.8s ease-out',
            }}>
              Based on your selected interests and performance across {maxRounds} progressive rounds
            </p>
          </div>

          {/* Top Highlight Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '32px',
            border: `2px solid ${domainInfo[bestDomain].color}`,
            boxShadow: `0 12px 32px ${domainInfo[bestDomain].color}20`,
            position: 'relative',
            overflow: 'hidden',
            animation: 'scaleIn 0.6s ease-out',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: `linear-gradient(90deg, ${domainInfo[bestDomain].color}, ${domainInfo[bestDomain].color}99)`,
            }} />
            
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: domainInfo[bestDomain].color,
              marginBottom: '12px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Top Recommended Path
            </div>
            
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#0f172a',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
              ...headingStyles,
            }}>
              {bestDomainName}
            </h2>
            
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: domainInfo[bestDomain].color,
              margin: '16px 0',
              letterSpacing: '-1px',
            }}>
              {sortedDomains[0]?.score || 0} <span style={{fontSize: '24px', color: '#94a3b8'}}>points</span>
            </div>
            
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: `${domainInfo[bestDomain].color}15`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: domainInfo[bestDomain].color,
            }}>
              {overallPercentage}% Overall Performance
            </div>
          </div>

          {/* Performance Breakdown */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            animation: 'fadeInUp 0.8s ease-out',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 24px 0',
              letterSpacing: '-0.3px',
            }}>
              Performance Across Selected Domains
            </h3>

            <style>{`
              @keyframes fillBar {
                from {
                  width: 0;
                }
                to {
                  width: var(--target-width);
                }
              }
              
              .performance-bar {
                animation: fillBar 1.2s cubic-bezier(0.4, 0, 0.2, 1);
                animation-fill-mode: both;
              }
              
              .performance-bar:nth-child(1) { animation-delay: 0.2s; }
              .performance-bar:nth-child(2) { animation-delay: 0.35s; }
              .performance-bar:nth-child(3) { animation-delay: 0.5s; }
              .performance-bar:nth-child(4) { animation-delay: 0.65s; }
              .performance-bar:nth-child(5) { animation-delay: 0.8s; }
              .performance-bar:nth-child(6) { animation-delay: 0.95s; }
              .performance-bar:nth-child(7) { animation-delay: 1.1s; }
              .performance-bar:nth-child(8) { animation-delay: 1.25s; }
              .performance-bar:nth-child(9) { animation-delay: 1.4s; }
              .performance-bar:nth-child(10) { animation-delay: 1.55s; }
              .performance-bar:nth-child(11) { animation-delay: 1.7s; }
              .performance-bar:nth-child(12) { animation-delay: 1.85s; }
            `}</style>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sortedDomains.map(({ domain, score }, i) => {
                const percentage = (score / (maxRounds * 3 * totalQuestionsPerRound)) * 100;
                return (
                  <div key={domain}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        color: '#0f172a',
                      }}>
                        {domainInfo[domain].name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: domainInfo[domain].color,
                      }}>
                        {score} pts
                      </div>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}>
                      <div 
                        className="performance-bar"
                        style={{
                          '--target-width': `${percentage}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${domainInfo[domain].color}, ${domainInfo[domain].color}cc)`,
                          borderRadius: '8px',
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Improvement Section */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f1f5f9',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 16px 0',
              letterSpacing: '-0.3px',
            }}>
              Recommended Next Steps for {bestDomainName}
            </h3>
            
            <p style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: '1.7',
              margin: '0',
            }}>
              {improvementMap[bestDomain]}
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            paddingTop: '24px',
          }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#6366f1',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              Retake Assessment
            </button>
            
            <button
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
              }}
            >
              Generate Full Career Roadmap →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ======================
     RENDER: QUIZ IN PROGRESS
  ======================= */
  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <MagneticCursor />
        <div style={{
          fontSize: '18px',
          color: '#64748b',
          fontWeight: '500',
        }}>
          Preparing your personalized assessment...
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isTimeUrgent = timeLeft < 30;

  return (
    <div style={containerStyle}>
      <MagneticCursor />
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '40px',
      }}>
        {/* Header */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px 32px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.3px',
            }}>
              Career Intelligence Assessment
            </h2>
            
            <div style={{
              padding: '8px 16px',
              background: isTimeUrgent ? '#fef2f2' : '#f8fafc',
              border: `1px solid ${isTimeUrgent ? '#fecaca' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: isTimeUrgent ? '#dc2626' : '#475569',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: '500',
              }}>
                Round {round}/3 ({getDifficultyByRound(round).toUpperCase()}) • Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#6366f1',
              }}>
                {Math.round(progress)}%
              </span>
            </div>
            
            <div style={{
              width: '100%',
              height: '6px',
              background: '#f1f5f9',
              borderRadius: '8px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '8px',
                transition: 'width 0.3s ease-out',
              }} />
            </div>
          </div>

          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            fontWeight: '400',
          }}>
            Focused on: {selectedDomains.map(d => domainInfo[d].name).join(', ')}
          </div>
        </div>

        {/* Question Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
          marginBottom: '24px',
          animation: 'scaleIn 0.4s ease-out',
        }}>
          <style>{`
            .option-button {
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .option-button:not(:disabled):hover {
              transform: translateX(4px);
              border-color: #6366f1 !important;
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
            }
            
            .option-button:not(:disabled):active {
              transform: translateX(2px) scale(0.98);
            }
          `}</style>
          
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#0f172a',
            lineHeight: '1.4',
            margin: '0 0 32px 0',
            letterSpacing: '-0.3px',
          }}>
            {currentQuestion.q}
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {currentQuestion.options.map((option, i) => {
              const isCorrect = isAnswered && option === currentQuestion.answer;
              const isWrong = isAnswered && selectedOption === option && !isCorrect;
              const isDisabled = isAnswered;

              let btnStyle = {
                width: '100%',
                padding: '18px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#0f172a',
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: isDisabled ? 'default' : 'pointer',
                textAlign: 'left',
                position: 'relative',
              };

              if (isCorrect) {
                btnStyle = {
                  ...btnStyle,
                  background: '#f0fdf4',
                  borderColor: '#10b981',
                  color: '#065f46',
                  animation: 'pulse 0.5s ease-out',
                };
              } else if (isWrong) {
                btnStyle = {
                  ...btnStyle,
                  background: '#fef2f2',
                  borderColor: '#ef4444',
                  color: '#991b1b',
                };
              } else if (isDisabled) {
                btnStyle = {
                  ...btnStyle,
                  opacity: 0.5,
                };
              }

              return (
                <button
                  key={i}
                  className="option-button"
                  onClick={() => handleOptionClick(option)}
                  disabled={isAnswered}
                  style={btnStyle}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: isCorrect ? '#10b981' : isWrong ? '#ef4444' : '#f1f5f9',
                    color: isCorrect || isWrong ? '#ffffff' : '#64748b',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginRight: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    verticalAlign: 'middle',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                  
                  {isCorrect && (
                    <span style={{
                      position: 'absolute',
                      right: '24px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      animation: 'scaleIn 0.3s ease-out',
                    }}>✓</span>
                  )}
                  {isWrong && (
                    <span style={{
                      position: 'absolute',
                      right: '24px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      animation: 'scaleIn 0.3s ease-out',
                    }}>✗</span>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '12px',
              background: selectedOption === currentQuestion.answer ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${selectedOption === currentQuestion.answer ? '#86efac' : '#fecaca'}`,
              animation: 'slideInLeft 0.4s ease-out',
            }}>
              {selectedOption === currentQuestion.answer ? (
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  color: '#065f46',
                  fontWeight: '500',
                }}>
                  Correct! +{currentQuestion.weight} points
                </p>
              ) : (
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  color: '#991b1b',
                  fontWeight: '500',
                }}>
                  Incorrect. Correct answer: <strong>{currentQuestion.answer}</strong>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#94a3b8',
          fontWeight: '400',
        }}>
          Adaptive difficulty • Time-bound • Personalized scoring
        </div>
      </div>
    </div>
  );
}