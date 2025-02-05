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
      type: "text",
      required: true,
      placeholder: "Depth Position",
    },
    "Cabinet Side **": {
      type: "text",
      required: true,
      placeholder: "Cabinet Side",
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
  },
};
