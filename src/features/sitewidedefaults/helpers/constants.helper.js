import { AdManagement, AccountReceivable, Production, CirculationSettings, ContactManagement, CustomerPortal, UserSettings, EmailSettings, Communications, GoogleCalendar, MarketingManagerPackage, Helpdesk, MediaMateAI } from "../components/Index";

const tabList = [
  { Value: "AdManagement", Label: "Ad Management", Component: AdManagement },
  { Value: "AccountReceivable", Label: "Account Receivable", Component: AccountReceivable },
  { Value: "Production", Label: "Production", Component: Production },
  { Value: "CirculationSettings", Label: "Circulation Settings", Component: CirculationSettings },
  { Value: "ContactManagement", Label: "Contact Management", Component: ContactManagement },
  { Value: "CustomerPortal", Label: "Customer Portal", Component: CustomerPortal },
  { Value: "UserSettings", Label: "User Settings", Component: UserSettings },
  { Value: "EmailSettings", Label: "Email Settings", Component: EmailSettings },
  { Value: "Communications", Label: "Communications", Component: Communications },
  { Value: "GoogleCalendar", Label: "Google Calendar", Component: GoogleCalendar },
  {
    Value: "MarketingManagerPackageSettings",
    Label: "Marketing Manager Package Settings",
    Component: MarketingManagerPackage,
  },
  { Value: "Helpdesk", Label: "Helpdesk", Component: Helpdesk },
  { Value: "MediaMateAI", Label: "Media Mate AI", Component: MediaMateAI },
];

export { tabList };