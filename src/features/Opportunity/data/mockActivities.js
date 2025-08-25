import { Phone, Mail, FileText, Users, CheckSquare } from "lucide-react";

// Sample notes added via the scheduler
export const scheduledNotes = [
  {
    id: 101,
    type: "note",
    date: "Mon Jun 02 2025 02:30 PM",
    user: "Courtney Karp",
    description: "Quick follow-up note from today's discovery call. Client mentioned they're having issues with their current CRM's reporting capabilities. Need to schedule a demo of our advanced analytics features next week.",
    icon: FileText,
    color: "text-green-600"
  },
  {
    id: 102,
    type: "call",
    date: "Mon Jun 02 2025 03:15 PM",
    user: "Courtney Karp",
    description: "Scheduled follow-up call to discuss pricing options and timeline for implementation. Client is interested in our enterprise package but needs board approval for budget allocation.",
    icon: Phone,
    color: "text-orange-600"
  },
  {
    id: 103,
    type: "meeting",
    date: "Tue Jun 03 2025 10:00 AM",
    user: "Jim Halpert",
    description: "Technical demo meeting scheduled with IT team to review integration capabilities and security features. Will cover API documentation and data migration process.",
    icon: Users,
    color: "text-purple-600"
  }
];

// Mock activity data organized by type - Extracted for clarity
export const callActivities = [
  {
    id: 1,
    type: "call",
    date: "Wed Jun 04 2025 04:22 PM",
    user: "Courtney Karp",
    description: "Follow-up call to see how things are going with the Salesforce platform they are currently on and if anything has changed since we last talked back in March. Called from my cell phone as requested by the client. The conversation lasted about 45 minutes and covered several key points. First, we discussed their current pain points with data synchronization between their marketing automation platform and Salesforce. They mentioned that leads are taking too long to appear in Salesforce after being captured on their website, sometimes up to 6 hours delay. This is causing issues with their sales team's response time. Second, we talked about their upcoming expansion plans - they're planning to hire 15 new sales reps over the next quarter and need to ensure their CRM can handle the increased load. They're also considering implementing additional custom fields for better lead scoring. The IT director mentioned they've been having performance issues during peak hours, especially when running large reports. I recommended scheduling a technical assessment call with our solutions architect to review their current configuration and identify optimization opportunities. They seemed very interested in our new AI-powered lead scoring feature that was just released. Action items: Send over the technical assessment questionnaire, schedule follow-up call with solutions architect for next week, and provide case studies from similar companies in their industry.",
    icon: Phone,
    color: "text-orange-600"
  },
  {
    id: 2,
    type: "call", 
    date: "Tue Mar 25 2025 12:42 PM",
    user: "Courtney Karp",
    description: "Scheduled call at 11:15am SHARP as requested. Left voicemail again when no answer - this is the third attempt this week. In the message, I asked about how the meeting with his team went last Friday, specifically regarding the proposal we submitted for their CRM overhaul project. I also mentioned that I wanted to follow up on whether he had a chance to review the additional information and customer reviews that I sent him via email on February 4th. The email included three detailed case studies from companies in similar industries who successfully implemented our platform, along with ROI calculations and implementation timelines. I also wanted to discuss the demo feedback his team provided and address any remaining concerns about data migration from their legacy system. His assistant mentioned he's been in back-to-back board meetings this week preparing for their Q2 planning session, which explains the delayed response. I emphasized in the voicemail that we're flexible on timing and can accommodate their schedule. Next steps: Try calling again tomorrow afternoon, send a brief email summarizing the key points we need to discuss, and offer to send over a preliminary implementation timeline based on their requirements. Also considering reaching out to the IT director directly as an alternative contact point.",
    icon: Phone,
    color: "text-orange-600"
  },
  {
    id: 7,
    type: "call",
    date: "Mon May 12 2025 02:30 PM",
    user: "Courtney Karp",
    description: "Quick check-in call with the procurement team to discuss contract terms and pricing adjustments. They requested a 15% discount on the annual subscription due to budget constraints for Q3. Discussed alternative pricing models including monthly payments and a phased implementation approach. The procurement manager mentioned they're comparing our proposal with two other vendors and need to make a decision by end of month. I offered to schedule a call with our finance team to explore creative pricing options that could work within their budget while maintaining our margin requirements.",
    icon: Phone,
    color: "text-orange-600"
  },
  {
    id: 8,
    type: "call",
    date: "Thu May 08 2025 10:15 AM",
    user: "Courtney Karp",
    description: "Cold call to a new prospect in the healthcare technology space. Spoke with the VP of Sales Operations about their current CRM challenges. They're currently using an outdated system that doesn't integrate well with their marketing automation tools. Scheduled a discovery call for next week to learn more about their specific requirements and pain points. They seemed particularly interested in our reporting and analytics capabilities.",
    icon: Phone,
    color: "text-orange-600"
  }
];

export const emailActivities = [
  {
    id: 3,
    type: "email",
    date: "Tue Mar 18 2025 12:43 PM", 
    user: "Courtney Karp",
    description: "Email was automatically captured using our Chrome Extension during client correspondence. The email thread contained detailed discussions about their current CRM limitations and specific requirements for the new system. Key points covered included: integration requirements with their existing marketing automation platform (HubSpot), data migration timeline and methodology, user training and change management strategy, custom field requirements for their unique sales process, reporting and dashboard needs for executive visibility, mobile access requirements for field sales team, and security compliance requirements due to their healthcare industry regulations. The client expressed concerns about downtime during migration and requested a detailed rollback plan. They also asked about our disaster recovery procedures and data backup policies. I provided comprehensive answers to all their questions and attached our security compliance documentation, implementation methodology guide, and a detailed project timeline. The client seemed particularly interested in our API capabilities for integrating with their custom inventory management system. Follow-up actions include scheduling a technical deep-dive session with their IT team and preparing a customized ROI analysis based on their current system costs and projected efficiency gains.",
    icon: Mail,
    color: "text-blue-600"
  },
  {
    id: 9,
    type: "email",
    date: "Fri May 16 2025 03:20 PM",
    user: "Courtney Karp",
    description: "Sent detailed proposal follow-up email with additional technical specifications and pricing breakdown. Included testimonials from three similar companies in their industry and case studies showing ROI within 6 months. Also attached our implementation roadmap and support documentation. The client requested information about our API capabilities and third-party integrations, which I addressed in detail.",
    icon: Mail,
    color: "text-blue-600"
  },
  {
    id: 10,
    type: "email",
    date: "Wed May 14 2025 09:45 AM",
    user: "Courtney Karp",
    description: "Received email response from the IT director with technical questions about our platform's security features and compliance certifications. They specifically asked about SOC 2 Type II compliance, data encryption standards, and user access controls. I forwarded their questions to our technical team and scheduled a call for early next week to address all their concerns.",
    icon: Mail,
    color: "text-blue-600"
  }
];

export const noteActivities = [
  {
    id: 4,
    type: "note",
    date: "Mon Mar 10 2025 02:15 PM",
    user: "Courtney Karp",
    description: "Comprehensive discovery session notes from initial client meeting. Company background: Mid-sized healthcare technology company with 200+ employees, currently using an outdated CRM system that's causing significant operational inefficiencies. Their main pain points include: lack of integration between sales and marketing systems resulting in lead attribution issues, manual data entry processes that are consuming 2-3 hours per sales rep per day, limited reporting capabilities that prevent accurate sales forecasting, no mobile access for field sales team, and poor user adoption due to complex interface. Current system details: Legacy on-premise solution implemented 8 years ago, no recent updates or customizations, limited API capabilities, expensive maintenance contract with vendor that's not responsive to support requests. Decision-making process: 5-person evaluation committee including CIO, Sales Director, Marketing Director, IT Manager, and VP of Operations. Timeline: Looking to make a decision by end of Q2, with implementation starting in Q3. Budget: $150K-$200K for initial implementation, plus ongoing subscription costs. Competitors being evaluated: Salesforce, HubSpot, and Pipedrive. Our advantages: Better healthcare industry experience, more flexible pricing, superior customer support, and stronger integration capabilities. Next steps: Prepare detailed proposal with customized demo, provide references from similar healthcare companies, and schedule technical assessment call.",
    icon: FileText,
    color: "text-green-600"
  },
  {
    id: 11,
    type: "note",
    date: "Tue May 13 2025 11:30 AM",
    user: "Courtney Karp",
    description: "Post-demo notes: The demo went extremely well. All five decision makers were present and engaged throughout the 90-minute session. They were particularly impressed with our workflow automation features and real-time reporting capabilities. The Sales Director asked several detailed questions about lead scoring and pipeline management. The IT Manager was satisfied with our security features and integration capabilities. Main concerns raised: timeline for implementation and potential disruption to current operations. Next steps: Prepare implementation timeline with minimal disruption strategy.",
    icon: FileText,
    color: "text-green-600"
  },
  {
    id: 12,
    type: "note",
    date: "Thu May 09 2025 04:45 PM",
    user: "Courtney Karp",
    description: "Research notes on prospect company: They're experiencing rapid growth (30% year-over-year) and their current CRM is becoming a bottleneck. Recent funding round of $25M suggests they have budget for technology upgrades. Their main competitor just implemented Salesforce, so timing might be perfect for them to modernize their sales process. Key stakeholders identified: CEO (final decision maker), VP Sales (primary champion), IT Director (technical gatekeeper).",
    icon: FileText,
    color: "text-green-600"
  }
];

export const meetingActivities = [
  {
    id: 5,
    type: "meeting",
    date: "Fri Mar 07 2025 11:00 AM",
    user: "Courtney Karp",
    description: "Initial discovery meeting with key decision makers held at their corporate headquarters conference room. Attendees included: John Smith (CIO), Sarah Johnson (Sales Director), Mike Chen (Marketing Director), Lisa Rodriguez (IT Manager), and David Brown (VP of Operations). Meeting duration: 2 hours with detailed Q&A session. Key discussion points covered their current technology stack, business processes, growth projections, and specific requirements for a new CRM solution. Current challenges identified: Data silos between departments causing inconsistent customer information, manual processes leading to human errors and inefficiencies, lack of real-time visibility into sales pipeline causing inaccurate forecasting, limited scalability of current system hindering growth plans, compliance issues with healthcare regulations due to inadequate security features, and poor user experience resulting in low adoption rates. Their wish list includes: Seamless integration with existing systems (EHR, billing, marketing automation), mobile-first design for remote sales team, advanced reporting and analytics capabilities, automated workflow features to reduce manual tasks, role-based access controls for security compliance, and scalable architecture to support future growth. Budget considerations: They have allocated $150K-$200K for initial implementation with ongoing monthly costs not to exceed $8K. Timeline constraints: Need to have new system operational by Q4 to support their expansion into two new markets. Competitive landscape: Currently evaluating three other vendors with final decision expected by end of April. Action items from meeting: Provide detailed technical specifications, arrange demo for broader team, submit formal proposal with pricing, and schedule follow-up meeting with IT team for technical deep dive.",
    icon: Users,
    color: "text-purple-600"
  },
  {
    id: 13,
    type: "meeting",
    date: "Mon May 19 2025 02:00 PM",
    user: "Courtney Karp",
    description: "Product demonstration meeting with expanded team including end users from sales and marketing departments. Demonstrated key features including lead management, opportunity tracking, reporting dashboards, and mobile app functionality. The sales team was particularly excited about the pipeline visualization and automated follow-up reminders. Marketing team loved the lead scoring and campaign tracking features. Very positive reception overall with several 'wow' moments during the demo.",
    icon: Users,
    color: "text-purple-600"
  },
  {
    id: 14,
    type: "meeting",
    date: "Wed May 15 2025 03:30 PM",
    user: "Courtney Karp",
    description: "Technical deep-dive meeting with IT team to discuss integration requirements, security protocols, and implementation methodology. Covered API documentation, data migration processes, user provisioning, and ongoing maintenance requirements. IT team expressed confidence in our technical approach and were satisfied with our security certifications. Scheduled follow-up meeting to finalize technical specifications.",
    icon: Users,
    color: "text-purple-600"
  }
];

export const taskActivities = [
  {
    id: 6,
    type: "task",
    date: "Thu Mar 06 2025 09:30 AM",
    user: "Courtney Karp",
    description: "Follow-up task to send comprehensive proposal with custom pricing options based on their specific requirements and budget constraints. The proposal needs to include several key components: detailed technical specifications covering all requested features and integrations, customized pricing structure with multiple tiers to fit their budget, implementation timeline with clear milestones and deliverables, data migration plan with minimal downtime strategy, training program outline for end users and administrators, ongoing support options with response time guarantees, security compliance documentation for healthcare regulations, ROI analysis showing projected cost savings and efficiency gains, and references from similar healthcare technology companies. Additional considerations: Include optional add-on features they expressed interest in such as advanced analytics module, mobile app development, and custom API integrations. Pricing strategy should be competitive but account for the custom development work required for their healthcare-specific workflows. Timeline considerations: They need the proposal by end of this week for internal review before their board meeting next month. Technical requirements: Ensure our solution can integrate with their existing EHR system, billing platform, and marketing automation tools. Compliance needs: Address HIPAA requirements, data encryption standards, and audit trail capabilities. Competitive differentiation: Emphasize our healthcare industry expertise, flexible deployment options, and superior customer support model compared to larger vendors they're considering.",
    icon: CheckSquare,
    color: "text-red-600"
  },
  {
    id: 15,
    type: "task",
    date: "Sat May 17 2025 10:00 AM",
    user: "Courtney Karp",
    description: "Weekend task: Prepare competitive analysis document comparing our solution against Salesforce and HubSpot. Need to highlight our advantages in healthcare industry expertise, implementation speed, and customer support responsiveness. Also need to address their concerns about long-term scalability and create talking points for handling price objections. Goal is to have this ready for Monday's strategy meeting.",
    icon: CheckSquare,
    color: "text-red-600"
  },
  {
    id: 16,
    type: "task",
    date: "Mon May 12 2025 08:00 AM",
    user: "Courtney Karp",
    description: "Update CRM with all recent activity and schedule follow-up tasks for next week. Need to ensure all contact information is current and sync calendar invites for upcoming meetings. Also need to prepare agenda for Wednesday's technical review meeting and coordinate with solutions architect on demo preparation.",
    icon: CheckSquare,
    color: "text-red-600"
  },
  {
    id: 17,
    type: "task",
    date: "Fri May 10 2025 05:30 PM",
    user: "Courtney Karp",
    description: "End of week administrative tasks: Update opportunity stage in CRM, prepare weekly activity report for sales manager, and review pipeline forecast for month-end reporting. Also need to follow up on pending proposals from other prospects and schedule next week's prospecting activities.",
    icon: CheckSquare,
    color: "text-red-600"
  },
  {
    id: 18,
    type: "task",
    date: "Wed May 07 2025 01:15 PM",
    user: "Courtney Karp",
    description: "Research task: Gather additional case studies and references from healthcare companies similar to this prospect. Need at least 3 detailed case studies showing measurable ROI and successful implementations. Also compile list of current healthcare clients who might be willing to serve as references during the evaluation process.",
    icon: CheckSquare,
    color: "text-red-600"
  }
];
