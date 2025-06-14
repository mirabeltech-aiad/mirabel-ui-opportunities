export const pickupOptions = [
  { Key: "", Description: "", Script: "''" },
  {
    Key: "ProductName",
    Description: "Product Name",
    Script: "ISNULL(gsPublications.PubName,'')",
  },
  {
    Key: "Description",
    Description: "Description",
    Script: "ISNULL(gsContracts.Description,'')",
  },
  {
    Key: "IssueName",
    Description: "Issue Name",
    Script: "ISNULL(tblMagFrequency.IssueName,'')",
  },
  {
    Key: "IssueYear",
    Description: "Issue Year",
    Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueYear),'')",
  },
  {
    Key: "IssueDate",
    Description: "Issue Date",
    Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueDate,101),'')",
  },
  {
    Key: "AdSize",
    Description: "Ad Size",
    Script: "ISNULL(gsAdSize.AdSizeName,'')",
  },
  {
    Key: "Frequency",
    Description: "Frequency",
    Script: "ISNULL(gsContracts.Frequency,'')",
  },
  {
    Key: "Color",
    Description: "Color",
    Script: "ISNULL(gsContracts.Color,'')",
  },
  {
    Key: "Position",
    Description: "Position",
    Script: "ISNULL(gsContracts.PosReq1,'')",
  },
  {
    Key: "Section",
    Description: "Section",
    Script: "ISNULL(gsPubSections.SectionName,'')",
  },
  {
    Key: "AdName",
    Description: "Ad Name",
    Script: "ISNULL(gsContracts.AdName,'')",
  },
]; 