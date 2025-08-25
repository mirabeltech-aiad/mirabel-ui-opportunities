
// Mock stage change data - extracted for clarity and reusability
export const getMockStageChanges = () => [
  {
    id: 1,
    date: "2024-01-15",
    stage: "Lead",
    previousStage: null,
    user: "Michael Scott",
    notes: "Opportunity created and initial stage set"
  },
  {
    id: 2,
    date: "2024-01-22",
    stage: "Qualified",
    previousStage: "Lead",
    user: "Courtney Karp",
    notes: "Lead qualified after initial contact"
  },
  {
    id: 3,
    date: "2024-02-01",
    stage: "1st Demo",
    previousStage: "Qualified",
    user: "Courtney Karp",
    notes: "First demo scheduled and completed successfully"
  },
  {
    id: 4,
    date: "2024-02-10",
    stage: "Discovery",
    previousStage: "1st Demo",
    user: "Courtney Karp",
    notes: "Moved to discovery after successful initial demo"
  },
  {
    id: 5,
    date: "2024-02-25",
    stage: "Technical Review",
    previousStage: "Discovery",
    user: "Jim Halpert",
    notes: "Technical team review and requirements gathering"
  },
  {
    id: 6,
    date: "2024-03-05",
    stage: "Proposal",
    previousStage: "Technical Review",
    user: "Courtney Karp",
    notes: "Client requirements gathered, proposal phase started"
  },
  {
    id: 7,
    date: "2024-03-20",
    stage: "Negotiation",
    previousStage: "Proposal",
    user: "Courtney Karp",
    notes: "Proposal submitted, entering negotiation phase"
  },
  {
    id: 8,
    date: "2024-04-02",
    stage: "Closed Won",
    previousStage: "Negotiation",
    user: "Michael Scott",
    notes: "Deal successfully closed and won!"
  }
];
