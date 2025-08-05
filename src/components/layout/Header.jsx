import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import React from "react";

export function Header() {
  // Get MMClientVars from localStorage
  let mmClientVars = {};
  try {
    mmClientVars = JSON.parse(localStorage.getItem("MMClientVars")) || {};
  } catch (e) {
    mmClientVars = {};
  }

  // Hostname and SiteType logic
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isNewspaperManager = hostname.includes('.newspapermanager');
  const isCRM = mmClientVars.SiteType === 'CRM';

  // Logo selection
  let logoUrl = "/intranet/NewImages/Logo-MKM.svg";
  if (isNewspaperManager) {
    logoUrl = "/Intranet/NewImages/Logo-NM.svg";
  }
  if (isCRM) {
    logoUrl = "/intranet/NewImages/Logo-MKM.svg";
  }

  // Feature flags
  const showMMIntegration = (
    mmClientVars.IsMKMEnabled === 'True' ||
    mmClientVars.IsMirabelEmailServiceEnabled === true ||
    mmClientVars.IsUserHasDataPackAccess === true ||
    mmClientVars.isMirableEmailTransEnabled === true
  );

  // Helper to insert menu URL at {0} placeholder
  function insertMenuUrlAtPlaceholder(baseUrl, menuUrl) {
    if (!baseUrl || !menuUrl) return baseUrl || menuUrl;
    const urlWithQuery = menuUrl + (menuUrl.includes('?') ? '&' : '?');
    if (baseUrl.includes('{0}')) {
      return baseUrl.replace('{0}', urlWithQuery);
    }
    return baseUrl.replace(/\/$/, '') + '/' + menuUrl.replace(/^\//, '');
  }

  // MM Integration iframe src
  const mmIntegrationSrc = (showMMIntegration && mmClientVars.MarketingManagerSiteURL && mmClientVars.Token)
    ? insertMenuUrlAtPlaceholder(mmClientVars.MarketingManagerSiteURL, '/AssignData.aspx?') + '&accesstoken=' + mmClientVars.Token
    : null;

  // CRM Prospecting panel
  const showProspecting = isCRM && mmClientVars.IsUserHasDataPackAccess === true;
  const prospectingUrl = (showProspecting && mmClientVars.MarketingManagerSiteURL)
    ? insertMenuUrlAtPlaceholder(mmClientVars.MarketingManagerSiteURL, '/midashboard.aspx?')
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-14">
        {/* Logo */}
        <img src={logoUrl} alt="Logo" style={{ height: 40, marginRight: 16 }} />
        <div className="flex items-center justify-between flex-1 space-x-2 md:justify-end">
          <nav className="flex items-center">
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
      {/* MM Integration Iframe */}
      {mmIntegrationSrc && (
        <div style={{ margin: '8px 0' }}>
          <iframe src={mmIntegrationSrc} title="MM Integration" style={{ width: 0, height: 0, border: 0, display: 'none' }} />
        </div>
      )}
      {/* CRM Prospecting Panel */}
      {showProspecting && prospectingUrl && (
        <div style={{ margin: '8px 0' }}>
          <iframe src={prospectingUrl} title="Prospecting Dashboard" style={{ width: '100%', height: 400, border: '1px solid #ccc' }} />
        </div>
      )}
    </header>
  );
} 