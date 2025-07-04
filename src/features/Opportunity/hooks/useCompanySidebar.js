import { useState, useEffect } from "react";
import apiService from "../Services/apiService";
import { userId } from "@/services/httpClient";

export const useCompanySidebar = (selectedCompany, opportunities) => {
  const [companyData, setCompanyData] = useState(null);
  const [tabData, setTabData] = useState({
    all: [],
    notes: [],
    calls: [],
    meetings: [],
    emails: [],
    tasks: [],
  });
  const [loadingStates, setLoadingStates] = useState({
    company: false,
    global: false,
    all: false,
    notes: false,
    calls: false,
    meetings: false,
    emails: false,
    tasks: false,
  });
  const [errorStates, setErrorStates] = useState({
    company: null,
    global: null,
    all: null,
    notes: null,
    calls: null,
    meetings: null,
    emails: null,
    tasks: null,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [allTabsLoaded, setAllTabsLoaded] = useState(false);

  // Form states
  const [callForm, setCallForm] = useState({ 
    note: "", 
    scheduledDate: "", 
    scheduledTime: "", 
    activityType: "",
    callDisposition: "",
    assignedBy: "",
    assignedTo: "",
    isPrivate: false, 
    addToTaskList: false 
  });
  const [meetingForm, setMeetingForm] = useState({
    note: "",
    scheduledDate: "",
    scheduledTime: "",
    activityType: "",
    assignedBy: "",
    assignedTo: "",
    isPrivate: false,
    addToTaskList: false,
  });
  const [noteForm, setNoteForm] = useState({ 
    note: "",
    activityType: "",
    assignedBy: "",
    assignedTo: "",
    isPrivate: false,
    addToTaskList: false
  });

  // Get contact ID from opportunities with enhanced debugging
  const getContactId = () => {
    console.log('🔍 DEBUG: Getting contact ID for company:', selectedCompany);
    console.log('🔍 DEBUG: Available opportunities:', opportunities);
    
    if (!selectedCompany || !opportunities) {
      console.log('❌ DEBUG: Missing selectedCompany or opportunities data');
      return null;
    }

    // Detect if this is proposals data (has ContactDetails.Name)
    const isProposalView = Array.isArray(opportunities) && opportunities.length > 0 && opportunities[0].ContactDetails && opportunities[0].ContactDetails.Name;
    let opportunity;
    if (isProposalView) {
      // For proposals, match by ContactDetails.Name
      opportunity = opportunities.find(
        (opp) => opp.ContactDetails && opp.ContactDetails.Name === selectedCompany
      );
    } else {
      // For opportunities, match by companyName or company
      opportunity = opportunities.find(
        (opp) => opp.companyName === selectedCompany || opp.company === selectedCompany
      );
    }

    console.log('🔍 DEBUG: Found matching opportunity:', opportunity);

    if (!opportunity) {
      console.log('❌ DEBUG: No matching opportunity found for company:', selectedCompany);
      return null;
    }

    // Check all possible contact ID fields
    const contactId = opportunity?.ContactDetails?.ID || 
                     opportunity?.contactId || 
                     opportunity?.ContactID ||
                     opportunity?.SubContactDetails?.ID;
    
    console.log('🔍 DEBUG: Extracted contact ID:', contactId);
    console.log('🔍 DEBUG: ContactDetails structure:', opportunity?.ContactDetails);
    console.log('🔍 DEBUG: SubContactDetails structure:', opportunity?.SubContactDetails);
    
    return contactId;
  };

  // Set loading state for specific tab
  const setTabLoading = (tab, loading) => {
    setLoadingStates((prev) => ({ ...prev, [tab]: loading }));
  };

  // Set error state for specific tab
  const setTabError = (tab, error) => {
    setErrorStates((prev) => ({ ...prev, [tab]: error }));
  };

  // Fetch company details with enhanced debugging
  const fetchCompanyDetails = async () => {
    const contactId = getContactId();
    console.log('🔍 DEBUG: fetchCompanyDetails called with contactId:', contactId);
    
    if (!contactId) {
      const errorMsg = "Contact ID not found for this company. Please check opportunity data structure.";
      console.error('❌ DEBUG:', errorMsg);
      setTabError("company", errorMsg);
      setCompanyData(null);
      return;
    }

    setTabLoading("company", true);
    setTabError("company", null);

    try {
      console.log('🔍 DEBUG: Making API call to getCompanyDetails with contactId:', contactId);
      const response = await apiService.getCompanyDetails(contactId);
      console.log('🔍 DEBUG: API response from getCompanyDetails:', response);
      
      if (response?.content?.Status === "Success") {
        const companyDetails = response.content.Data.ContactDetails;
        console.log('🔍 DEBUG: Extracted company details:', companyDetails);
        console.log('🔍 DEBUG: Company email:', companyDetails?.Email);
        console.log('🔍 DEBUG: Company phone:', companyDetails?.Phone || companyDetails?.CellPhone);
        setCompanyData(companyDetails);
      } else {
        const errorMsg = `API returned unsuccessful status: ${response?.content?.Status}`;
        console.error('❌ DEBUG:', errorMsg);
        console.error('❌ DEBUG: Full response:', response);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("❌ DEBUG: Error fetching company details:", err);
      console.error("❌ DEBUG: Error stack:", err.stack);
      setTabError("company", `Failed to load company details: ${err.message}`);
      setCompanyData(null);
    } finally {
      setTabLoading("company", false);
    }
  };

  // Generic function to fetch single tab data
  const fetchSingleTabData = async (tabName, contactId) => {
    const basePayload = {
      LimitChars: "200",
      UserID: userId,
      ContactID: contactId,
      IsPrimaryAndSubContacts: false,
      ActivitySourceType: 0,
      IsPinned: false,
    };

    let response;

    switch (tabName) {
      case "all":
        response = await apiService.post("/services/Crm/Activities", {
          ...basePayload,
          ActivityType: 4,
        });
        break;

      case "notes":
        response = await apiService.post("/services/Crm/Activities", {
          ...basePayload,
          ActivityType: 5,
          ActivitySourceType: 2,
        });
        break;

      case "calls":
        response = await apiService.post("/services/Crm/Activities", {
          ...basePayload,
          ActivityType: 2,
        });
        break;

      case "meetings":
        response = await apiService.post("/services/Crm/Activities", {
          ...basePayload,
          ActivityType: 3,
        });
        break;

      case "emails":
        console.log('🔍 DEBUG: Fetching emails with payload:', {
          ...basePayload,
          ActivityType: 7,
          ActivitySourceType: 2,
        });
        response = await apiService.post("/services/Crm/Activities", {
          ...basePayload,
          ActivityType: 7,
          ActivitySourceType: 2,
        });
        console.log('🔍 DEBUG: Emails API response:', response);
        break;

      case "tasks":
        console.log('🔍 DEBUG: Fetching tasks with contactId:', contactId);
        response = await apiService.get(`/services/Crm/tasks/Details/${contactId}`);
        console.log('🔍 DEBUG: Tasks API response:', response);
        break;

      default:
        throw new Error(`Unknown tab: ${tabName}`);
    }

    if (response?.content?.Status === "Success") {
      let data = [];
      
      if (tabName === "tasks") {
        // Tasks have a different response structure - data is in List
        data = response.content.List || [];
        console.log('🔍 DEBUG: Tasks data processed:', data);
      } else {
        // Other activities use List
        data = response.content.List || [];
      }

      console.log(`🔍 DEBUG: ${tabName} data processed:`, data);
      return data;
    } else {
      if (response?.content?.Status === "Success" && response.content.List === null) {
        return [];
      } else {
        throw new Error(`Failed to fetch ${tabName} data`);
      }
    }
  };

  // Fetch all tabs data at once
  const fetchAllTabsData = async () => {
    const contactId = getContactId();
    if (!contactId) {
      setTabError("global", "Contact ID not found");
      return;
    }

    setTabLoading("global", true);
    setTabError("global", null);

    const tabs = ["all", "notes", "calls", "meetings", "emails", "tasks"];
    
    try {
      // Fetch all tabs concurrently
      const results = await Promise.allSettled(
        tabs.map(tab => fetchSingleTabData(tab, contactId))
      );

      const newTabData = { ...tabData };
      const newErrorStates = { ...errorStates };

      results.forEach((result, index) => {
        const tabName = tabs[index];
        
        if (result.status === "fulfilled") {
          newTabData[tabName] = result.value;
          newErrorStates[tabName] = null;
        } else {
          console.error(`Error fetching ${tabName} data:`, result.reason);
          newErrorStates[tabName] = result.reason.message;
        }
      });

      setTabData(newTabData);
      setErrorStates(newErrorStates);
      setAllTabsLoaded(true);
    } catch (err) {
      console.error("Error fetching all tabs data:", err);
      setTabError("global", err.message);
    } finally {
      setTabLoading("global", false);
    }
  };

  // Refresh all tabs data
  const refreshAllTabsData = async () => {
    setAllTabsLoaded(false);
    await fetchAllTabsData();
  };

  // Generic function to fetch single tab data (for individual refreshes)
  const fetchTabData = async (tabName) => {
    const contactId = getContactId();
    if (!contactId) {
      setTabError(tabName, "Contact ID not found");
      return;
    }

    setTabLoading(tabName, true);
    setTabError(tabName, null);

    try {
      const data = await fetchSingleTabData(tabName, contactId);
      setTabData((prev) => ({ ...prev, [tabName]: data }));
    } catch (err) {
      console.error(`Error fetching ${tabName} data:`, err);
      setTabError(tabName, err.message);
    } finally {
      setTabLoading(tabName, false);
    }
  };

  // Handle tab change - no API calls needed since data is preloaded
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    
    // Only fetch if data hasn't been loaded yet (fallback)
    if (!allTabsLoaded) {
      fetchTabData(newTab);
    }
  };

  // Refresh specific tab data
  const refreshTabData = (tabName) => {
    fetchTabData(tabName);
  };

  // Add call functionality with updated payload structure
  const handleAddCall = async () => {
    const contactId = getContactId();
    if (!contactId) return;

    try {
      const payload = {
        notificationType: "Calls",
        notificationJson: {
          Contacts: {
            ID: contactId,
            Name: selectedCompany,
            FirstName: companyData?.FirstName || "",
            LastName: companyData?.LastName || ""
          },
          CallDisposition: callForm.callDisposition || "",
          IsPrivate: callForm.isPrivate || false,
          Note: callForm.note,
          ActivityType: callForm.activityType || "",
          ActivityRep: { ID: callForm.assignedBy ? callForm.assignedBy : -1 },
          MeetingDate: callForm.scheduledDate,
          MeetingTime: callForm.scheduledTime,
          IsAddtoTaskList: callForm.addToTaskList || false,
          RepAssignedTo: { 
            ID: callForm.assignedTo ? callForm.assignedTo : -1 
          },
          IsAIScheduled: false
        },
        bulkInsertNotificationJson: {}
      };

      await apiService.post("/services/crm/activities/save", payload);

      // Reset form and refresh calls tab
      setCallForm({ 
        note: "", 
        scheduledDate: "", 
        scheduledTime: "", 
        activityType: "",
        callDisposition: "",
        assignedBy: "",
        assignedTo: "",
        isPrivate: false, 
        addToTaskList: false 
      });
      refreshTabData("calls");
      refreshTabData("all");
    } catch (err) {
      console.error("Error adding call:", err);
    }
  };

  // Add meeting functionality with updated payload structure
  const handleAddMeeting = async () => {
    const contactId = getContactId();
    if (!contactId) return;

    try {
      const payload = {
        notificationType: "Meetings",
        notificationJson: {
          Contacts: {
            ID: contactId,
            Name: selectedCompany,
            FirstName: companyData?.FirstName || "",
            LastName: companyData?.LastName || ""
          },
          IsPrivate: meetingForm.isPrivate || false,
          Note: meetingForm.note,
          ActivityType: meetingForm.activityType || "",
          ActivityRep: { ID: meetingForm.assignedBy ? meetingForm.assignedBy : -1 },
          MeetingDate: meetingForm.scheduledDate,
          MeetingTime: meetingForm.scheduledTime,
          IsAddtoTaskList: meetingForm.addToTaskList || false,
          RepAssignedTo: { 
            ID: meetingForm.assignedTo ? meetingForm.assignedTo : -1 
          },
          IsAIScheduled: false
        },
        bulkInsertNotificationJson: {}
      };

      await apiService.post("/services/crm/activities/save", payload);

      // Reset form and refresh meetings tab
      setMeetingForm({ 
        note: "", 
        scheduledDate: "", 
        scheduledTime: "", 
        activityType: "",
        assignedBy: "",
        assignedTo: "",
        isPrivate: false, 
        addToTaskList: false 
      });
      refreshTabData("meetings");
      refreshTabData("all");
    } catch (err) {
      console.error("Error adding meeting:", err);
    }
  };

  // Add note functionality - Updated to use correct API endpoint and payload
  const handleAddNote = async () => {
    const contactId = getContactId();
    if (!contactId) return;

    try {
      const payload = {
        notificationType: "Notes",
        notificationJson: {
          Contacts: {
            ID: contactId,
            Name: selectedCompany,
            FirstName: companyData?.FirstName || "",
            LastName: companyData?.LastName || ""
          },
          IsPrivate: noteForm.isPrivate || false,
          Note: noteForm.note,
          ActivityType: noteForm.activityType || "",
          ActivityRep: { ID: noteForm.assignedBy ? noteForm.assignedBy : -1 },
          MeetingDate: "",
          MeetingTime: "",
          IsAddtoTaskList: noteForm.addToTaskList || false,
          RepAssignedTo: { 
            ID: noteForm.assignedTo ? noteForm.assignedTo : -1 
          },
          IsAIScheduled: false
        },
        bulkInsertNotificationJson: {}
      };

      await apiService.post("/services/crm/activities/save", payload);

      // Reset form and refresh notes tab
      setNoteForm({ 
        note: "",
        activityType: "",
        assignedBy: "",
        assignedTo: "",
        isPrivate: false,
        addToTaskList: false
      });
      refreshTabData("notes");
      refreshTabData("all");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Initial load - fetch company details and all tab data with enhanced debugging
  useEffect(() => {
    console.log('🔍 DEBUG: useEffect triggered with selectedCompany:', selectedCompany);
    console.log('🔍 DEBUG: opportunities data:', opportunities);
    
    if (selectedCompany) {
      // Reset states
      setTabData({ all: [], notes: [], calls: [], meetings: [], emails: [], tasks: [] });
      setAllTabsLoaded(false);
      setErrorStates({
        company: null,
        global: null,
        all: null,
        notes: null,
        calls: null,
        meetings: null,
        emails: null,
        tasks: null,
      });
      
      // Fetch company details and all tabs data
      console.log('🔍 DEBUG: Starting fetchCompanyDetails...');
      fetchCompanyDetails();
      console.log('🔍 DEBUG: Starting fetchAllTabsData...');
      fetchAllTabsData();
    }
  }, [selectedCompany]);

  return {
    companyData,
    tabData,
    loadingStates,
    errorStates,
    activeTab,
    allTabsLoaded,
    callForm,
    setCallForm,
    meetingForm,
    setMeetingForm,
    noteForm,
    setNoteForm,
    handleTabChange,
    refreshTabData,
    refreshAllTabsData,
    handleAddCall,
    handleAddMeeting,
    handleAddNote,
    fetchCompanyDetails,
  };
};
