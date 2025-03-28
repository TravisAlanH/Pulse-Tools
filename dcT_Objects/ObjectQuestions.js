import { Countries } from "./Data/Counties";

export const Questions = {
  User: {
    ID: {
      type: "text",
      required: true,
      placeholder: "ID",
    },
    Name: {
      type: "text",
      required: true,
      placeholder: "Name",
    },
    Email: {
      type: "email",
      required: true,
      placeholder: "Email",
    },
    Role: {
      type: "text",
      required: true,
      placeholder: "Role",
    },
    Status: {
      type: "text",
      required: true,
      placeholder: "Status",
    },
    "Last Login": {
      type: "text",
      required: true,
      placeholder: "Last Login",
    },
    "Current Login": {
      type: "text",
      required: true,
      placeholder: "Current Login",
    },
    Company: {
      type: "text",
      required: true,
      placeholder: "Company",
    },
  },
  Items: {
    "# Operation *": {
      type: "text",
      required: true,
      placeholder: "# Operation",
    },
    "Object *": {
      type: "text",
      required: true,
      placeholder: "Object",
    },
    "Name *": {
      type: "text",
      required: true,
      placeholder: "Name",
    },
    "Make *": {
      type: "text",
      required: true,
      placeholder: "Make",
    },
    "Model *": {
      type: "text",
      required: true,
      placeholder: "Model",
    },
    RUHeight: {
      type: "number",
      required: false,
      placeholder: "RUHeight",
    },
    "Part Number": {
      type: "text",
      required: false,
      placeholder: "Part Number",
    },
    "Location *": {
      type: "text",
      required: true,
      placeholder: "Location",
    },
    "Location Name": {
      type: "text",
      required: false,
      placeholder: "Location Name",
    },
    "Cabinet **": {
      type: "text",
      required: true,
      placeholder: "Cabinet",
    },
    "Asset Tag": {
      type: "QRScan",
      required: false,
      placeholder: "Asset Tag",
    },
    "U Position **": {
      type: "text",
      required: true,
      placeholder: "U Position",
    },
    "Rails Used **": {
      type: "select",
      required: true,
      placeholder: "Rails Used",
      startValue: "Front",
      options: ["Front", "Back", "Both"],
    },
    "Orientation **": {
      type: "select",
      required: true,
      placeholder: "Orientation",
      startValue: "Front Faces Cabinet Front",
      options: ["Front Faces Cabinet Front", "Front Faces Cabinet Back"],
    },
    Status: {
      type: "text",
      required: false,
      placeholder: "Status",
    },
    Notes: {
      type: "text",
      required: false,
      placeholder: "Notes",
    },
    "Installation Date": {
      type: "date",
      required: false,
      placeholder: "Installation Date",
    },
    "Serial Number": {
      type: "text",
      required: false,
      placeholder: "Serial Number",
    },
    "Front Faces": {
      type: "select",
      required: false,
      placeholder: "Front Faces",
      startValue: "West",
      options: ["East", "West", "North", "South"],
    },
    "Aisle Label": {
      type: "text",
      required: false,
      placeholder: "Aisle Label",
    },
    "Row Label **": {
      type: "text",
      required: false,
      placeholder: "Row Label",
    },
    "Position in Row **": {
      type: "text",
      required: false,
      placeholder: "Position in Row",
    },
    "Power Capacity (kW)": {
      type: "number",
      required: false,
      placeholder: "Power Capacity",
    },
    "Weight Capacity": {
      type: "number",
      required: false,
      placeholder: "Weight Capacity",
    },
    "Chassis **": {
      type: "text",
      required: true,
      placeholder: "Chassis",
    },
    "Chassis Face **": {
      type: "text",
      required: true,
      placeholder: "Chassis Face",
    },
    "Slot Position **": {
      type: "text",
      required: true,
      placeholder: "Slot Position",
    },
    "Is VM Host": {
      type: "text",
      required: false,
      placeholder: "Is VM Host",
    },
    "VM Cluster": {
      type: "text",
      required: false,
      placeholder: "VM Cluster",
    },
    "Depth Position **": {
      type: "select",
      required: true,
      placeholder: "Depth Position",
      options: ["Front", "Center", "Back"],
    },
    "Cabinet Side **": {
      type: "select",
      required: true,
      placeholder: "Cabinet Side",
      options: ["Left", "Right"],
    },
    "IP Address": {
      type: "text",
      required: false,
      placeholder: "IP Address",
    },
    "IP Address Port Name": {
      type: "text",
      required: false,
      placeholder: "IP Address Port Name",
    },
    "SNMP Write Community String": {
      type: "text",
      required: false,
      placeholder: "SNMP Write Community String",
    },
    "User Name": {
      type: "text",
      required: false,
      placeholder: "User Name",
    },
    Password: {
      type: "text",
      required: false,
      placeholder: "Password",
    },
    "dcTrack Location Code*": {
      type: "text",
      required: true,
      placeholder: "dcTrack Location Code",
    },
    "dcTrack Location Name*": {
      type: "text",
      required: true,
      placeholder: "dcTrack Location Name",
    },
    "dcTrack Location Hierarchy*": {
      type: "select",
      required: true,
      placeholder: "Data Center",
      startValue: "Data Center",
      options: ["Data Center", "Room", "Floor"],
    },
    "dcTrack Location Parent": {
      type: "text",
      required: false,
      placeholder: "dcTrack Location Parent",
    },
    "Can Contain Assets": {
      type: "select",
      required: false,
      placeholder: "Can Contain Assets",
      startValue: "True",
      options: ["True", "False"],
    },
    "Data Center Area*": {
      type: "number",
      required: true,
      placeholder: "Data Center Area",
    },
    "Country*": {
      type: "select",
      required: true,
      placeholder: "Country",
      startValue: "United States",
      options: Countries,
    },
    "Enable AC Virtual Power Chain": {
      type: "select",
      required: false,
      placeholder: "Enable AC Virtual Power Chain",
      startValue: "False",
      options: ["True", "False"],
    },
    "Enable DC Virtual Power Chain": {
      type: "select",
      required: false,
      placeholder: "Enable DC Virtual Power Chain",
      startValue: "False",
      options: ["True", "False"],
    },
    "Is Default Location": {
      type: "select",
      required: false,
      placeholder: "Is Default Location",
      startValue: "Select",
      options: ["Select", "True", "False"],
    },
    "Capacity(kW)": {
      type: "number",
      required: false,
      placeholder: "Capacity(kW)",
    },
    // NEW MODELS
    Object: {
      type: "text",
      required: true,
      placeholder: "Unique object identifier",
    },
    Make: {
      type: "text",
      required: true,
      placeholder: "Manufacturer name",
    },
    "Model Name": {
      type: "text",
      required: true,
      placeholder: "Official model name",
    },
    "Part Number": {
      type: "text",
      required: false,
      placeholder: "Original part number",
    },
    "New Part Number": {
      type: "text",
      required: false,
      placeholder: "Updated part number (if applicable)",
    },
    Description: {
      type: "text",
      required: false,
      placeholder: "Short description of item",
    },
    "Made in": {
      type: "text",
      required: false,
      placeholder: "Country of origin",
    },
    "Warranty Period": {
      type: "text",
      required: false,
      placeholder: "Warranty duration (e.g., 3 years)",
    },
    Class: {
      type: "select",
      required: false,
      options: ["Select", "Server", "Storage", "Network", "Power", "Peripheral"],
      startValue: "Select",
    },
    Subclass: {
      type: "select",
      required: false,
      options: ["Select", "Rack Server", "Blade Server", "Tower Server", "SAN", "NAS", "Switch", "Router", "UPS", "PDU", "Monitor"],
      startValue: "Select",
    },
    Mounting: {
      type: "select",
      required: false,
      options: ["Select", "Rack-mounted", "Wall-mounted", "Free-standing", "Chassis"],
      startValue: "Select",
    },
    "Form Factor": {
      type: "select",
      required: false,
      options: ["Select", "1U", "2U", "3U", "4U", "Blade", "Tower"],
      startValue: "Select",
    },
    "Rack Units": {
      type: "number",
      required: true,
      placeholder: "Number of rack units",
    },
    Height: {
      type: "text",
      required: false,
      placeholder: "Height in inches or cm",
    },
    Width: {
      type: "text",
      required: false,
      placeholder: "Width in inches or cm",
    },
    Depth: {
      type: "text",
      required: false,
      placeholder: "Depth in inches or cm",
    },
    Weight: {
      type: "text",
      required: false,
      placeholder: "Weight in lbs or kg",
    },
    Units: {
      type: "text",
      required: false,
      placeholder: "Measurement units (e.g., lbs, kg)",
    },
    "Version (read-only)": {
      type: "text",
      required: false,
      placeholder: "Software/hardware version",
    },
    "Do Not Update": {
      type: "select",
      required: false,
      options: ["Select", "Yes", "No"],
      startValue: "Select",
    },
    "My Company Standard": {
      type: "select",
      required: false,
      options: ["Select", "Yes", "No"],
      startValue: "Select",
    },
    "Front Image File Included": {
      type: "select",
      required: false,
      options: ["Select", "Yes", "No"],
      startValue: "Select",
    },
    "Back Image File Included": {
      type: "select",
      required: false,
      options: ["Select", "Yes", "No"],
      startValue: "Select",
    },
    Status: {
      type: "select",
      required: false,
      options: ["Select", "Active", "Inactive", "Obsolete"],
      startValue: "Select",
    },
    Notes: {
      type: "text",
      required: false,
      placeholder: "Additional information or comments",
    },
    DataPortsCount: {
      type: "number",
      required: false,
      placeholder: "Number of data ports",
    },
    PowerPortsCount: {
      type: "number",
      required: false,
      placeholder: "Number of power ports",
    },
    FrontSlotsCount: {
      type: "number",
      required: false,
      placeholder: "Number of front slots",
    },
    BackSlotsCount: {
      type: "number",
      required: false,
      placeholder: "Number of back slots",
    },
  },
};
