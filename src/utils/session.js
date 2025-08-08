// utils/session.js

export const Session = {
  _getVars() {
    try {
      const raw = localStorage.getItem("MMClientVars");
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error("Invalid MMClientVars JSON:", err);
      return {};
    }
  },

  _setVars(vars) {
    localStorage.setItem("MMClientVars", JSON.stringify(vars));
  },

  clear() {
    localStorage.removeItem("MMClientVars");
  },

  get UserID() {
    return this._getVars().UserID || null;
  },
  set UserID(value) {
    const vars = this._getVars();
    vars.UserID = value;
    this._setVars(vars);
  },

  get Email() {
    return this._getVars().Email || null;
  },
  set Email(value) {
    const vars = this._getVars();
    vars.Email = value;
    this._setVars(vars);
  },

  get Token() {
    return this._getVars().Token || null;
  },
  set Token(value) {
    const vars = this._getVars();
    vars.Token = value;
    this._setVars(vars);
  },

  get AccessTokenTimeOut() {
    return this._getVars().AccessTokenTimeOut || null;
  },
  set AccessTokenTimeOut(value) {
    const vars = this._getVars();
    vars.AccessTokenTimeOut = value;
    this._setVars(vars);
  },

  get ClientID() {
    return this._getVars().ClientID || null;
  },
  set ClientID(value) {
    const vars = this._getVars();
    vars.ClientID = value;
    this._setVars(vars);
  },

  get CompanyName() {
    return this._getVars().CompanyName || null;
  },
  set CompanyName(value) {
    const vars = this._getVars();
    vars.CompanyName = value;
    this._setVars(vars);
  },

  get Domain() {
    return this._getVars().Domain || null;
  },
  set Domain(value) {
    const vars = this._getVars();
    vars.Domain = value;
    this._setVars(vars);
  },

  get Host() {
    return this._getVars().Host || null;
  },
  set Host(value) {
    const vars = this._getVars();
    vars.Host = value;
    this._setVars(vars);
  },

  get PackageTypeID() {
    return this._getVars().PackageTypeID || null;
  },
  set PackageTypeID(value) {
    const vars = this._getVars();
    vars.PackageTypeID = value;
    this._setVars(vars);
  },

  get ProductType() {
    return this._getVars().ProductType || null;
  },
  set ProductType(value) {
    const vars = this._getVars();
    vars.ProductType = value;
    this._setVars(vars);
  },

  get IsMKMEnabled() {
    return this._getVars().IsMKMEnabled || null;
  },
  set IsMKMEnabled(value) {
    const vars = this._getVars();
    vars.IsMKMEnabled = value;
    this._setVars(vars);
  },

  get CultureUI() {
    return this._getVars().CultureUI || null;
  },
  set CultureUI(value) {
    const vars = this._getVars();
    vars.CultureUI = value;
    this._setVars(vars);
  },

  get SiteType() {
    return this._getVars().SiteType || null;
  },
  set SiteType(value) {
    const vars = this._getVars();
    vars.SiteType = value;
    this._setVars(vars);
  },

  get TimeAdd() {
    return this._getVars().TimeAdd || null;
  },
  set TimeAdd(value) {
    const vars = this._getVars();
    vars.TimeAdd = value;
    this._setVars(vars);
  },

  get IsUserHasMKMAccess() {
    return this._getVars().IsUserHasMKMAccess || null;
  },
  set IsUserHasMKMAccess(value) {
    const vars = this._getVars();
    vars.IsUserHasMKMAccess = value;
    this._setVars(vars);
  },

  get IsSiteDataPackEnabled() {
    return this._getVars().IsSiteDataPackEnabled || null;
  },
  set IsSiteDataPackEnabled(value) {
    const vars = this._getVars();
    vars.IsSiteDataPackEnabled = value;
    this._setVars(vars);
  },

  get IsUserHasDataPackAccess() {
    return this._getVars().IsUserHasDataPackAccess || null;
  },
  set IsUserHasDataPackAccess(value) {
    const vars = this._getVars();
    vars.IsUserHasDataPackAccess = value;
    this._setVars(vars);
  },

  get IsMirabelEmailServiceEnabled() {
    return this._getVars().IsMirabelEmailServiceEnabled || null;
  },
  set IsMirabelEmailServiceEnabled(value) {
    const vars = this._getVars();
    vars.IsMirabelEmailServiceEnabled = value;
    this._setVars(vars);
  },

  get IsRepNotificationEnabled() {
    return this._getVars().IsRepNotificationEnabled || null;
  },
  set IsRepNotificationEnabled(value) {
    const vars = this._getVars();
    vars.IsRepNotificationEnabled = value;
    this._setVars(vars);
  },

  get ChangePassword() {
    return this._getVars().ChangePassword || null;
  },
  set ChangePassword(value) {
    const vars = this._getVars();
    vars.ChangePassword = value;
    this._setVars(vars);
  },

  get IsAuthenticated() {
    return this._getVars().IsAuthenticated || null;
  },
  set IsAuthenticated(value) {
    const vars = this._getVars();
    vars.IsAuthenticated = value;
    this._setVars(vars);
  },

  get UserName() {
    return this._getVars().UserName || null;
  },
  set UserName(value) {
    const vars = this._getVars();
    vars.UserName = value;
    this._setVars(vars);
  },

  get EmployeeID() {
    return this._getVars().EmployeeID || null;
  },
  set EmployeeID(value) {
    const vars = this._getVars();
    vars.EmployeeID = value;
    this._setVars(vars);
  },

  get FirstName() {
    return this._getVars().FirstName || null;
  },
  set FirstName(value) {
    const vars = this._getVars();
    vars.FirstName = value;
    this._setVars(vars);
  },

  get LastName() {
    return this._getVars().LastName || null;
  },
  set LastName(value) {
    const vars = this._getVars();
    vars.LastName = value;
    this._setVars(vars);
  },

  get FullName() {
    return this._getVars().FullName || null;
  },
  set FullName(value) {
    const vars = this._getVars();
    vars.FullName = value;
    this._setVars(vars);
  },

  get DisplayName() {
    return this._getVars().DisplayName || null;
  },
  set DisplayName(value) {
    const vars = this._getVars();
    vars.DisplayName = value;
    this._setVars(vars);
  },

  get IsAdmin() {
    return this._getVars().IsAdmin || null;
  },
  set IsAdmin(value) {
    const vars = this._getVars();
    vars.IsAdmin = value;
    this._setVars(vars);
  },

  get IsSA() {
    return this._getVars().IsSA || null;
  },
  set IsSA(value) {
    const vars = this._getVars();
    vars.IsSA = value;
    this._setVars(vars);
  },

  get UserNameID() {
    return this._getVars().UserNameID || null;
  },
  set UserNameID(value) {
    const vars = this._getVars();
    vars.UserNameID = value;
    this._setVars(vars);
  },

  get PASubProductTypeId() {
    return this._getVars().PASubProductTypeId || null;
  },
  set PASubProductTypeId(value) {
    const vars = this._getVars();
    vars.PASubProductTypeId = value;
    this._setVars(vars);
  },

  get PASubProductTypeName() {
    return this._getVars().PASubProductTypeName || null;
  },
  set PASubProductTypeName(value) {
    const vars = this._getVars();
    vars.PASubProductTypeName = value;
    this._setVars(vars);
  },

  get BSASubProductTypeId() {
    return this._getVars().BSASubProductTypeId || null;
  },
  set BSASubProductTypeId(value) {
    const vars = this._getVars();
    vars.BSASubProductTypeId = value;
    this._setVars(vars);
  },

  get BSASubProductTypeName() {
    return this._getVars().BSASubProductTypeName || null;
  },
  set BSASubProductTypeName(value) {
    const vars = this._getVars();
    vars.BSASubProductTypeName = value;
    this._setVars(vars);
  },

  get CanSendCRMEmail() {
    return this._getVars().CanSendCRMEmail || null;
  },
  set CanSendCRMEmail(value) {
    const vars = this._getVars();
    vars.CanSendCRMEmail = value;
    this._setVars(vars);
  },

  get SalesRepName() {
    return this._getVars().SalesRepName || null;
  },
  set SalesRepName(value) {
    const vars = this._getVars();
    vars.SalesRepName = value;
    this._setVars(vars);
  },

  get PageList() {
    return this._getVars().PageList || null;
  },
  set PageList(value) {
    const vars = this._getVars();
    vars.PageList = value;
    this._setVars(vars);
  },

  get DepartmentID() {
    return this._getVars().DepartmentID || null;
  },
  set DepartmentID(value) {
    const vars = this._getVars();
    vars.DepartmentID = value;
    this._setVars(vars);
  },

  get ContentVersion() {
    return this._getVars().ContentVersion || null;
  },
  set ContentVersion(value) {
    const vars = this._getVars();
    vars.ContentVersion = value;
    this._setVars(vars);
  },

  get ExternalAuth() {
    return this._getVars().ExternalAuth || null;
  },
  set ExternalAuth(value) {
    const vars = this._getVars();
    vars.ExternalAuth = value;
    this._setVars(vars);
  }
};
