import React from "react";
import { Building2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanySidebar } from "@/features/Opportunity/hooks/useCompanySidebar";
import { useCompanyData } from "@/features/Opportunity/hooks/useCompanyData";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/features/Opportunity/Services/apiService";
import { userService } from "@/features/Opportunity/Services/userService";
import CompanySidebarHeader from "../CompanySidebar/CompanySidebarHeader";
import CompanyDetailsCard from "../CompanySidebar/CompanyDetailsCard";
import ActivityTabs from "../CompanySidebar/ActivityTabs";

const CompanySidebar = ({
  selectedCompany,
  selectedCompanyData,
  opportunities,
  onClose,
}) => {
  // Get company data from useCompanyData hook first
  const {
    companyData: editableCompanyData,
    editingField,
    tempValue,
    setTempValue,
    tempExt,
    setTempExt,
    tempFirstName,
    setTempFirstName,
    tempLastName,
    setTempLastName,
    startEditing,
    saveEdit,
    handleKeyDown,
    isLoading: companyLoading,
    error: companyError,
    refetch: refetchCompanyData,
  } = useCompanyData(selectedCompany, selectedCompanyData);

  const {
    tabData,
    loadingStates,
    savingStates,
    errorStates,
    activeTab,
    filterStates,
    callForm,
    setCallForm,
    meetingForm,
    setMeetingForm,
    noteForm,
    setNoteForm,
    handleTabChange,
    refreshTabData,
    handleFilterChange,
    handleAddCall,
    handleAddMeeting,
    handleAddNote,
    isEmptyState,
    getEmptyStateMessage,
    onActivityUpdate,
    onShowToast,
  } = useCompanySidebar(selectedCompany, opportunities, editableCompanyData);

  // Fetch activity types for the dropdown
  const { data: activityTypesData, isLoading: activityTypesLoading } = useQuery(
    {
      queryKey: ["activityTypes"],
      queryFn: async () => {
        const response = await apiService.get(
          "/services/Admin/Masters/MasterData/ActivityTypes"
        );
        return response.content?.Data?.ActivityTypes || [];
      },
    }
  );

  // Fetch users for the Assigned To dropdown
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsersForDropdown(),
  });

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  // Clean HTML from text and extract answered part
  const parseNoteContent = (noteText) => {
    if (!noteText || typeof noteText !== "string")
      return {
        note: "",
        answered: "",
        emailMetadata: {},
      };

    // Enhanced HTML cleaning function - more aggressive cleaning
    const cleanHtmlText = (text) => {
      if (!text) return "";

      let cleanText = text;

      // Remove all HTML tags including incomplete ones and their attributes
      cleanText = cleanText.replace(/<[^>]*>/g, "");

      // Remove incomplete HTML tags and onclick handlers
      cleanText = cleanText.replace(/<[^>]*$/g, ""); // Remove incomplete opening tags
      cleanText = cleanText.replace(/^[^<]*>/g, ""); // Remove incomplete closing tags

      // Remove onclick and other event handlers that might be cut off
      cleanText = cleanText.replace(/\s*onclick\s*=\s*["'][^"']*["']?/gi, "");
      cleanText = cleanText.replace(/\s*on\w+\s*=\s*["'][^"']*["']?/gi, "");

      // Remove href attributes that might be cut off
      cleanText = cleanText.replace(/\s*href\s*=\s*["'][^"']*["']?/gi, "");

      // Replace common HTML entities
      cleanText = cleanText.replace(/&nbsp;/g, " ");
      cleanText = cleanText.replace(/&amp;/g, "&");
      cleanText = cleanText.replace(/&lt;/g, "<");
      cleanText = cleanText.replace(/&gt;/g, ">");
      cleanText = cleanText.replace(/&quot;/g, '"');
      cleanText = cleanText.replace(/&#39;/g, "'");
      cleanText = cleanText.replace(/&apos;/g, "'");
      cleanText = cleanText.replace(/&#8217;/g, "'");
      cleanText = cleanText.replace(/&#8220;/g, '"');
      cleanText = cleanText.replace(/&#8221;/g, '"');
      cleanText = cleanText.replace(/&#8211;/g, "-");
      cleanText = cleanText.replace(/&#8212;/g, "—");

      // Remove any remaining HTML entity patterns
      cleanText = cleanText.replace(/&#\d+;/g, "");
      cleanText = cleanText.replace(/&[a-zA-Z]+;/g, "");

      // Clean up extra whitespace and normalize
      cleanText = cleanText.replace(/\s+/g, " ");
      cleanText = cleanText.trim();

      return cleanText;
    };

    // Extract email metadata for email activities - but clean the extracted content
    const sentMatch = noteText.match(/<b>Sent<\/b>:\s*([^<]+)/);
    const toMatch = noteText.match(/<b>To:\s*<\/b>\s*([^<]+)/);
    const fromMatch = noteText.match(/<b>From:\s*<\/b>\s*([^<]+)/);
    const subjectMatch = noteText.match(/<b>Subject[^<]*<\/b>\s*([^<]+)/);

    const emailMetadata = {
      sent: cleanHtmlText(sentMatch ? sentMatch[1] : ""),
      to: cleanHtmlText(toMatch ? toMatch[1] : ""),
      from: cleanHtmlText(fromMatch ? fromMatch[1] : ""),
      subject: cleanHtmlText(subjectMatch ? subjectMatch[1] : ""),
    };

    // Extract the answered part if it exists
    const answeredMatch = noteText.match(/<b>Answered:\s*([^<]+)<\/b>/);
    const answered = cleanHtmlText(answeredMatch ? answeredMatch[1] : "");

    // First remove all the metadata sections we've extracted, then clean everything
    let noteWithoutMetadata = noteText
      .replace(/<b>Answered:[^<]*<\/b>/gi, "")
      .replace(/<b>Sent<\/b>:[^<]*(?=<|$)/gi, "")
      .replace(/<b>To:\s*<\/b>[^<]*(?=<|$)/gi, "")
      .replace(/<b>From:\s*<\/b>[^<]*(?=<|$)/gi, "")
      .replace(/<b>Subject[^<]*<\/b>[^<]*(?=<|$)/gi, "");

    // Apply aggressive HTML cleaning to the remaining content
    const cleanNote = cleanHtmlText(noteWithoutMetadata);

    return {
      note: cleanNote,
      answered,
      emailMetadata,
    };
  };

  if (companyLoading) {
    return (
      <div className="w-[420px] h-[120vh] bg-gray-50 border-l border-gray-200 flex flex-col">
        <CompanySidebarHeader
          onClose={onClose}
          loadingStates={{ company: true }}
          editableCompanyData={editableCompanyData}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading company details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (companyError) {
    return (
      <div className="w-[420px] h-[120vh] bg-gray-50 border-l border-gray-200 flex flex-col">
        <CompanySidebarHeader
          onClose={onClose}
          loadingStates={{ company: false }}
          editableCompanyData={editableCompanyData}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-3">
              Failed to load company details
            </p>
            <Button onClick={refetchCompanyData} size="sm" className="mb-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <div className="text-xs text-gray-500 mt-2">
              <p>Debug info:</p>
              <p>Company: {selectedCompany}</p>
              <p>Opportunities: {opportunities?.length || 0} items</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[420px] h-[120vh] bg-gray-50 border-l border-gray-200 flex flex-col">
      <CompanySidebarHeader
        onClose={onClose}
        loadingStates={loadingStates}
        editableCompanyData={editableCompanyData}
      />

      <CompanyDetailsCard
        editableCompanyData={editableCompanyData}
        editingField={editingField}
        tempValue={tempValue}
        setTempValue={setTempValue}
        tempExt={tempExt}
        setTempExt={setTempExt}
        tempFirstName={tempFirstName}
        setTempFirstName={setTempFirstName}
        tempLastName={tempLastName}
        setTempLastName={setTempLastName}
        startEditing={startEditing}
        saveEdit={saveEdit}
        handleKeyDown={handleKeyDown}
      />

      <ActivityTabs
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        tabData={tabData}
        loadingStates={loadingStates}
        savingStates={savingStates}
        errorStates={errorStates}
        refreshTabData={refreshTabData}
        filterStates={filterStates}
        handleFilterChange={handleFilterChange}
        callForm={callForm}
        setCallForm={setCallForm}
        handleAddCall={handleAddCall}
        meetingForm={meetingForm}
        setMeetingForm={setMeetingForm}
        handleAddMeeting={handleAddMeeting}
        noteForm={noteForm}
        setNoteForm={setNoteForm}
        handleAddNote={handleAddNote}
        formatDate={formatDate}
        parseNoteContent={parseNoteContent}
        activityTypesData={activityTypesData}
        activityTypesLoading={activityTypesLoading}
        usersData={usersData}
        usersLoading={usersLoading}
        isEmptyState={isEmptyState}
        getEmptyStateMessage={getEmptyStateMessage}
        onActivityUpdate={onActivityUpdate}
        onShowToast={onShowToast}
      />
    </div>
  );
};

export default CompanySidebar;
