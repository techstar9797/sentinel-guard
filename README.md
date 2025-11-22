# Sentinel - AI-Powered Fraud Detection Platform

Sentinel is a privacy-first, AI-powered fraud detection platform that combines blockchain intelligence, behavioral analytics, and continuous learning to protect digital assets while maintaining regulatory compliance.

## 🏗️ Architecture Overview

### Multi-Agent System

Sentinel employs a sophisticated multi-agent architecture where specialized AI agents work collaboratively:

1. **Watcher Agent** (`/`)
   - Real-time transaction monitoring dashboard
   - Live activity feed and case overview
   - Key metrics visualization (total cases, high priority alerts, detection rate)
   - Quick access to recent investigations

2. **Detective Agent** (`/cases`, `/investigation`)
   - Deep investigation capabilities
   - Risk analysis and evidence gathering
   - Integration with TRM Labs for blockchain intelligence
   - Moralis API for comprehensive transaction data
   - Case management and status tracking

3. **Guardian Agent** (`/guidelines`)
   - Decision framework enforcement
   - Risk-based approval/decline logic
   - Compliance rule management
   - Automated decision recommendations

4. **Coach Agent** (`/playbooks`, `/performance`)
   - Pattern recognition and playbook generation
   - Continuous learning from case outcomes
   - Performance metrics tracking (APS - Agent Performance Score)
   - False positive/negative rate optimization
   - Agent version management and A/B testing

## 🔒 Privacy-First Architecture

### Skyflow Integration

Sentinel implements a **zero-trust PII architecture** using Skyflow's Data Privacy Vault:

```
┌─────────────────────────────────────────────────────────────┐
│                      Sentinel Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                      ┌─────────────────┐  │
│  │  Frontend    │◄────────────────────►│  Fraud Engine   │  │
│  │  (React)     │   Tokenized Data     │  (Edge Funcs)   │  │
│  └──────────────┘                      └─────────────────┘  │
│         │                                        │           │
│         │                                        │           │
│         ▼                                        ▼           │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Supabase Database (Tokens Only)            │     │
│  │  - wallet_address                                  │     │
│  │  - name_token (sky_xxxxx)                         │     │
│  │  - email_token (sky_xxxxx)                        │     │
│  │  - phone_token (sky_xxxxx)                        │     │
│  │  - address_token (sky_xxxxx)                      │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            │ Tokenization/Detokenization
                            │ (AES-256 Encryption)
                            ▼
                 ┌──────────────────────┐
                 │   Skyflow Vault      │
                 │   (PII Storage)      │
                 │                      │
                 │  - Actual Names      │
                 │  - Email Addresses   │
                 │  - Phone Numbers     │
                 │  - Addresses         │
                 │                      │
                 │  Encrypted at Rest   │
                 │  & in Transit        │
                 └──────────────────────┘
```

**Key Privacy Features:**
- **No PII in Application Database**: Only Skyflow tokens are stored
- **Tokenization at Entry**: PII is tokenized before reaching the application
- **Audited Detokenization**: All PII access is logged and requires justification
- **GDPR & CCPA Compliant**: Right to be forgotten, data minimization
- **Data Residency**: Configurable vault locations for regional compliance

### Compliance Dashboard

The compliance dashboard (`/compliance`) provides real-time visibility into:
- PII tokenization coverage (100% target)
- GDPR/CCPA compliance status
- Detokenization request audit trail
- Data retention policy enforcement
- Analyst access monitoring

## 🔍 Decision Guidelines

Sentinel implements risk-based decision logic:

### Approval Criteria
- ✅ **TRM Risk Score**: < 0.5 (Low Risk)
- ✅ **Dark Web Signals**: None detected
- ✅ **Transaction Velocity**: Within normal patterns
- ✅ **Geo-Location**: Not from sanctioned regions

### Decline Criteria
- ❌ **TRM Risk Score**: ≥ 0.9 (High Risk)
- ❌ **Sanctioned Entity**: OFAC/EU sanctions match
- ❌ **Dark Web Activity**: Confirmed marketplace transactions
- ❌ **Ransomware Association**: Direct or indirect link

### Manual Review Criteria
- 🔍 **TRM Risk Score**: 0.5 - 0.9 (Medium Risk)
- 🔍 **Unusual Patterns**: Deviates from user history
- 🔍 **New User**: First transaction with limited history
- 🔍 **High Value**: Above configured threshold

## 🧠 Continuous Learning Cycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Monitor    │────►│   Detect     │────►│   Decide     │
│  (Watcher)   │     │ (Detective)  │     │ (Guardian)   │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                                          │
       │                                          ▼
       │                                   ┌──────────────┐
       │                                   │   Execute    │
       │                                   │  (Action)    │
       │                                   └──────────────┘
       │                                          │
       │              ┌──────────────┐           │
       └──────────────│    Learn     │◄──────────┘
                      │   (Coach)    │
                      └──────────────┘
```

The Coach agent continuously:
1. Analyzes case outcomes (approved, declined, false positives)
2. Identifies emerging fraud patterns
3. Generates new playbooks automatically
4. Adjusts risk thresholds based on performance metrics
5. Suggests agent parameter tuning

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with custom design system
- **Shadcn UI** components
- **React Query** for data fetching and caching
- **React Router** for navigation

### Backend (Lovable Cloud)
- **Supabase** for database and authentication
- **Edge Functions** for serverless business logic
- **PostgreSQL** with Row Level Security (RLS)

### Integrations
- **TRM Labs**: Blockchain intelligence and risk scoring
- **Moralis**: Multi-chain transaction data and wallet analytics
- **Skyflow**: PII tokenization and data privacy vault
- **Anthropic Claude**: AI-powered decision reasoning (via edge functions)
- **AWS/Redis**: Caching and performance optimization

## 📁 Project Structure

```
sentinel/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn components
│   │   ├── DecisionBadge.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── pages/              # Route components
│   │   ├── Index.tsx       # Watcher dashboard
│   │   ├── Cases.tsx       # Case list
│   │   ├── Investigation.tsx
│   │   ├── Guidelines.tsx
│   │   ├── Playbooks.tsx
│   │   ├── Performance.tsx
│   │   ├── Compliance.tsx
│   │   └── DemoPrivacy.tsx
│   ├── services/           # API integrations
│   │   ├── trmService.ts
│   │   └── moralisService.ts
│   ├── data/              # Mock data for demo
│   └── types/             # TypeScript definitions
├── supabase/
│   ├── functions/         # Edge functions
│   │   ├── trm-screen/
│   │   ├── moralis-screen/
│   │   ├── skyflow-tokenize/
│   │   ├── skyflow-detokenize/
│   │   └── screen-with-privacy/
│   └── migrations/        # Database schema
└── public/
    └── assets/logos/      # Partner logos (TRM, Skyflow, etc.)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (via Lovable Cloud)
- API keys for integrations:
  - TRM Labs API key
  - Moralis API key
  - Skyflow API key
  - Redis credentials (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/techstar9797/sentinel-guard.git
   cd sentinel-guard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Environment variables are managed through Supabase secrets:
   - `SUPABASE_URL` and `SUPABASE_ANON_KEY` (auto-configured)
   - `TRM_API_KEY` - TRM Labs API key
   - `MORALIS_API_KEY` - Moralis API key
   - `SKYFLOW_API_KEY` - Skyflow vault API key
   - `REDIS_ACCOUNT_KEY`, `REDIS_USER_KEY` (optional)

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open [http://localhost:5173](http://localhost:5173)

## 📊 Database Schema

### Cases Table
```sql
cases (
  id UUID PRIMARY KEY,
  case_number TEXT UNIQUE,
  wallet_address TEXT,
  name_token TEXT,          -- Skyflow token
  email_token TEXT,         -- Skyflow token
  phone_token TEXT,         -- Skyflow token
  address_token TEXT,       -- Skyflow token
  status TEXT,              -- pending, investigating, resolved
  priority TEXT,            -- low, medium, high, critical
  decision TEXT,            -- approved, declined, manual_review
  trm_risk_score FLOAT,
  trm_risk_level TEXT,
  trm_evidence JSONB,
  agent_version TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Compliance Metrics Table
```sql
compliance_metrics (
  id UUID PRIMARY KEY,
  metric_date DATE,
  gdpr_compliant BOOLEAN,
  ccpa_compliant BOOLEAN,
  data_residency TEXT,
  tokenized_fields INTEGER,
  total_pii_fields INTEGER,
  tokenization_percentage FLOAT,
  detokenization_requests INTEGER,
  analyst_access_count INTEGER,
  created_at TIMESTAMP
)
```

## 🔐 Security Considerations

1. **Row Level Security (RLS)**: All database tables have RLS policies enabled
2. **API Key Management**: All keys stored as encrypted Supabase secrets
3. **Audit Logging**: All detokenization requests are logged with timestamp and user
4. **Zero-Knowledge Architecture**: Application never sees raw PII
5. **Rate Limiting**: Edge functions implement rate limiting to prevent abuse

## 📈 Performance Metrics

The platform tracks key performance indicators:
- **APS (Agent Performance Score)**: Composite score of detection accuracy
- **False Positive Rate**: Percentage of legitimate transactions flagged
- **False Negative Rate**: Percentage of fraud cases missed
- **Loss Prevented**: Estimated fraud amount prevented
- **Dark Web Signal Usage**: Percentage of cases using dark web intelligence
- **Average Investigation Time**: Time to case resolution

## 🔄 CI/CD

Changes pushed to the repository are automatically synced with Lovable Cloud. Edge functions are deployed automatically upon changes.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

For technical support or questions about the platform, please contact:
- Technical Lead: [Your contact information]
- Security Issues: [Security contact]

---

**Built with ❤️ using Lovable, Supabase, TRM Labs, Skyflow, and Moralis**
