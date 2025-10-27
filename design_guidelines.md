# AI Resume Analyzer & Career Recommendation App - Design Guidelines

## Design Approach
**System-Based Approach** inspired by Material Design principles with Linear's minimalist aesthetics. This utility-focused application prioritizes clarity, information hierarchy, and efficient data presentation while maintaining a professional, trustworthy appearance.

## Typography System

**Font Families:**
- Primary: 'Inter' (Google Fonts) - for UI elements, body text, and data
- Monospace: 'JetBrains Mono' - for technical skills and code snippets

**Type Scale:**
- Headings: 3xl (dashboard titles), 2xl (section headers), xl (card headers)
- Body: base (primary content), sm (supporting text, labels)
- Weight hierarchy: 600 (semibold headings), 500 (medium labels), 400 (regular body)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, and 24
- Component padding: p-6 for cards, p-8 for major sections
- Element spacing: space-y-4 for related items, space-y-8 for distinct sections
- Container margins: mx-4 (mobile), mx-8 (tablet), mx-auto with max-width (desktop)

**Grid Structure:**
- Main container: max-w-7xl mx-auto
- Dashboard: 12-column grid with sidebar (3 cols) + main content (9 cols)
- Cards grid: 2 columns (tablet), 3 columns (desktop) for features/stats

## Core Components

### Landing Page Layout

**Hero Section (90vh):**
- Full-width with gradient overlay
- Centered content with max-w-4xl
- Large headline (text-5xl font-semibold)
- Subheadline (text-xl)
- CTA button group (primary + secondary with blurred backgrounds on image)
- Trust indicators below CTAs: "Trusted by 50,000+ job seekers" with subtle icon row

**How It Works Section (py-24):**
- 3-column grid showing upload → analyze → recommendations flow
- Icon-based process cards with numbered steps
- Each card: icon, heading, description with staggered reveal pattern

**Features Grid (py-24):**
- 2x3 grid layout showcasing six key features
- Cards with: icon, feature title, description, benefit statement
- Hover lift effect on cards

**Testimonials (py-20):**
- 2-column masonry layout with user success stories
- Quote card format: photo, quote, name, role transition details

**CTA Section (py-32):**
- Centered content with compelling headline
- Single prominent upload button
- Supporting text about free analysis
- Visual element showing sample analysis preview

### Application Dashboard

**Navigation:**
- Persistent left sidebar (w-64) with logo, main nav items, user profile at bottom
- Top bar with breadcrumbs, notifications icon, user avatar

**Upload Interface:**
- Centered in viewport with max-w-2xl
- Large drag-and-drop zone (min-h-96) with dashed border
- File format icons (PDF, DOCX) displayed
- Upload button and file size limit text
- Progress bar animation during processing

**Analysis Dashboard:**
- Hero metrics bar: 4-column grid showing overall score, experience years, skills count, match percentage
- Main content area divided into:
  - Left column (2/3 width): Detailed analysis cards stacked vertically
  - Right column (1/3 width): Quick actions and recommendations sidebar

**Analysis Result Cards:**
- Resume Score Card: Large circular progress indicator, score breakdown (presentation, content, keywords), expandable details
- Skills Analysis: Tag cloud with proficiency levels, categorized (technical, soft, domain)
- Experience Timeline: Vertical timeline with role cards showing duration and key achievements
- Education Section: Clean list with institution, degree, dates
- Career Recommendations: Card grid (2 cols) with role titles, match percentage bars, key requirements, action buttons

**Skills Gap Analysis:**
- Comparison view: Current skills vs. Target role requirements
- Missing skills highlighted in distinct visual treatment
- Learning resource suggestions for each gap

**Optimization Suggestions:**
- Accordion-style expandable sections
- Icon-coded priorities (high/medium/low impact)
- Before/after text comparisons
- Actionable checklist format

## Navigation Patterns

**Landing to App Flow:**
- Sticky header with "Try Now" CTA
- Smooth scroll anchors for landing sections
- Clear transition to upload interface

**Dashboard Navigation:**
- Persistent sidebar with analysis sections
- Tabbed interface for switching between different analyses
- Breadcrumb trail: Home > Upload > Results > Career Paths

## Data Visualization

**Charts and Graphs:**
- Use Chart.js library via CDN
- Donut charts for score breakdowns
- Horizontal bar charts for skills proficiency
- Radar charts for competency mapping
- Progress bars for match percentages

**Visual Indicators:**
- Score ranges: Color-coded badges (needs improvement / good / excellent)
- Icon system: Heroicons for consistent visual language
- Status indicators: Subtle badges for processing states

## Form Elements

**File Upload:**
- Large click/drop target area
- Clear file type acceptance messaging
- Visual upload progress feedback
- Success confirmation with file details

**Interactive Elements:**
- Primary buttons: Solid, rounded corners, medium padding
- Secondary buttons: Outlined variant
- Icon buttons for actions (download, share, edit)
- Toggle switches for settings

## Component Spacing & Rhythm

**Card Components:**
- Internal padding: p-6 to p-8
- Border radius: rounded-lg for cards, rounded-xl for major sections
- Shadow hierarchy: shadow-sm (default), shadow-md (hover), shadow-lg (modals)

**Section Padding:**
- Desktop: py-20 to py-32
- Mobile: py-12 to py-16
- Consistent vertical rhythm throughout

## Accessibility

- Minimum touch target: 44x44px for all interactive elements
- Clear focus indicators on all inputs and buttons
- Semantic HTML throughout (nav, main, article, section)
- ARIA labels for icon-only buttons
- Sufficient contrast ratios for all text

## Images

**Hero Image:**
- Full-width background image showing diverse professionals reviewing documents/screens
- Subtle gradient overlay for text readability
- High-quality, professional photography aesthetic

**Feature Section:**
- Dashboard preview mockup showing sample analysis results
- Screenshot of AI recommendations interface

**Testimonial Section:**
- Professional headshots for user testimonials (circular crop, consistent size)

**How It Works:**
- Iconography-based (use Heroicons), no photographs needed

This design creates a professional, data-rich application that balances visual appeal with functional clarity, guiding users seamlessly from landing page through resume analysis to actionable career insights.