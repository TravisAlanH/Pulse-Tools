import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { BlankCurrentLocation, initState } from "./Init_State";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";

export function trueLoad() {
  const { setLoading } = RoutingStore.getState();
  setLoading(true); // Set loading to true before the timeout
}

export function falseLoad() {
  const { setLoading } = RoutingStore.getState();
  setLoading(false); // Set loading to false after the timeout
}

export const UserStore = create(
  devtools((set) => ({
    data: initState.User,
    LogInUser: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          ID: data.uid,
          Name: data.displayName,
          Email: data.email,
          "Email Verified": data.emailVerified,
          Image: data.photoURL,
          "Last Login": data.metadata.lastSignInTime,
          "Account Created": data.metadata.creationTime,
        },
      }));
    },
    UnvarifiedUser: (data) => {
      console.log(data);
      set((state) => ({
        data: {
          ...state.data,
          ID: data.ID,
          Name: data.Name,
          Email: data.Email,
        },
      }));
    },
    SetAccountActive: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Status: data.Status,
          Company: data.Company,
          "Phone Number": data.PhoneNumber,
          Role: data.Role,
        },
      }));
    },
    setID: (data) => {
      set((state) => ({
        data: { ...state.data, ID: data },
      }));
    },
    setName: (data) => {
      set((state) => ({
        data: { ...state.data, Name: data },
      }));
    },
    setEmail: (data) => {
      set((state) => ({
        data: { ...state.data, Email: data },
      }));
    },
    setImage: (data) => {
      set((state) => ({
        data: { ...state.data, Image: data },
      }));
    },
    setRole: (data) => {
      set((state) => ({
        data: { ...state.data, Role: data },
      }));
    },
    setStatus: (data) => {
      set((state) => ({
        data: { ...state.data, Status: data },
      }));
    },
    setLastLogin: (data) => {
      set((state) => ({
        data: { ...state.data, "Last Login": data },
      }));
    },
    setCurrentLogin: (data) => {
      set((state) => ({
        data: { ...state.data, "Current Login": data },
      }));
    },
  }))
);

export const CurrentLocation = create(
  devtools((set) => ({
    data: initState.CurrentLocation,
    replaceCurrentLocation: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Location: data.Location,
          Active: data.Active,
          Cabinet: data.Cabinet,
          Asset: data.Asset,
          Counts: data.Counts,
          AllItems: data.AllItems,
          HoldItem: data.HoldItem,
          AllAnswers: data.AllAnswers,
          CustomQuestions: data.CustomQuestions,
          CustomNaming: data.CustomNaming,
          HoldItemTrigger: data.HoldItemTrigger,
        },
      }));
    },
    addItemToAllItems: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          AllItems: [...state.data.AllItems, data],
        },
      }));
    },
    setLocation: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Location: data,
        },
      }));
    },
    setHoldItem: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          HoldItem: data,
        },
      }));
    },
    setHoldItemTrigger: () => {
      // set to oposite of what it currently
      set((state) => ({
        data: {
          ...state.data,
          HoldItemTrigger: !state.data.HoldItemTrigger,
        },
      }));
    },
    setActive: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Active: data,
        },
      }));
    },
    setCabinet: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Cabinet: data,
        },
      }));
    },
    setHoldItemField: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          HoldItem: {
            ...state.data.HoldItem,
            [data.type]: data.value,
          },
        },
      }));
    },
    addToItems: (data) => {
      if (data.uuid === undefined) {
        data.uuid = uuidv4().replace(/[\/[\]~*.]/g, "_");
      }
      const type = data.type;
      const uuid = data.uuid;
      const value = data.value;
      set((state) => ({
        data: {
          ...state.data,
          AllItems: {
            ...state.data.AllItems,
            [uuid]: value,
          },
        },
      }));
      if (type === "Location" || type === "Cabinet") {
        set((state) => ({
          data: {
            ...state.data,
            [type]: uuid,
            Active: uuid,
          },
        }));
      } else {
        set((state) => ({
          data: {
            ...state.data,
            Active: uuid,
          },
        }));
      }
      // !!
      set((state) => ({
        data: {
          ...state.data,
          Counts: {
            ...state.data.Counts,
            [type]: state.data.Counts.hasOwnProperty(type) ? state.data.Counts[type] + 1 : 1, // Use a ternary operator for the condition
          },
        },
      }));
    },
    editItemByUUID: (data) => {
      const type = data.type;
      const uuid = data.UUID;
      const value = data.value;
      trueLoad();
      console.log(data.AllItems);
      const currentName = data.AllItems[`${uuid}`]["Name *"];
      Object.keys(data.AllItems).forEach((key) => {
        const item = data.AllItems[key];

        const matches = [];

        if (item["Cabinet *"] === currentName) matches.push("Cabinet *");
        if (item["Cabinet **"] === currentName) matches.push("Cabinet **");
        if (item["dcTrack Location Code*"] === currentName) matches.push("dcTrack Location Code*");
        if (item["Chassis **"] === currentName) matches.push("Chassis **");

        if (matches.length > 0) {
          matches.forEach((match) => {
            set((state) => ({
              data: {
                ...state.data,
                AllItems: {
                  ...state.data.AllItems,
                  [key]: {
                    ...state.data.AllItems[key],
                    [match]: value["Name *"],
                  },
                },
              },
            }));
          });
        }
      });
      console.log("currentName", currentName);
      set((state) => ({
        data: {
          ...state.data,
          AllItems: {
            ...state.data.AllItems,
            [uuid]: value,
          },
        },
      }));
      console.log("newName", value["Name *"]);
      falseLoad();
    },
    removeItemByUUID: (data) => {
      console.log(data);
      const uuid = data.UUID;
      const itemToBeRemoved = data.Item;
      const Name = itemToBeRemoved["Name *"];
      const type = itemToBeRemoved["Object *"];
      let AllItems = data.AllItems;
      delete AllItems[uuid];
      let AllChildren = Object.keys(AllItems).filter((item) => AllItems[item]["Cabinet *"] === Name || AllItems[item]["Cabinet **"] === Name || AllItems[item]["Location *"] === Name || AllItems[item]["Chassis **"] === Name);
      AllChildren.forEach((key) => {
        delete AllItems[key];
      });
      set((state) => ({
        data: {
          ...state.data,
          AllItems: AllItems,
        },
      }));
      if (type === "Location" || type === "Cabinet") {
        set((state) => ({
          data: {
            ...state.data,
            [type]: 0,
            Active: 0,
          },
        }));
        set((state) => ({
          data: {
            ...state.data,
            Counts: {
              ...state.data.Counts,
              [type]: state.data.Counts[type] - 1,
            },
          },
        }));
      }
    },
  }))
);

export const MLTStore = create(
  devtools((set) => ({
    data: initState.MLT,
    setMLT: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          rows: data,
        },
      }));
    },
    setUniqueHeaders: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          uniqueHeaders: data,
        },
      }));
    },
    setSortDirection: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          sortDirection: data,
        },
      }));
    },
    setSortType: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          sortType: data,
        },
      }));
    },
    setSearchInput: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          searchInput: {
            ...state.data.searchInput,
            [data.type]: data.value, // Dynamically updating the searchInput field
          },
        },
      }));
    },
    setFilters: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          filters: {
            ...state.data.filters,
            [data.type]: [...state.data.filters[data.type], data.value], // Dynamically updating the searchInput field
          },
        },
      }));
    },
    removeFilters: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          filters: {
            ...state.data.filters,
            [data.type]: state.data.filters[data.type].filter((item) => item !== data.value), // Dynamically updating the searchInput field
          },
        },
      }));
    },
    resetSortsFiltersSearches: () => {
      set((state) => ({
        data: {
          ...state.data,
          sortDirection: 0,
          sortType: "",
          searchInput: {
            Object: "",
            Make: "",
            Model: "",
            Height: "",
            Width: "",
            Depth: "",
            Class: "",
            Subclass: "",
            Mounting: "",
            DataPortsCount: "",
            PowerPortsCount: "",
            FrontSlotsCount: "",
            BackSlotsCount: "",
          },
          filters: {
            Object: [],
            Make: [],
            Model: [],
            Height: [],
            Width: [],
            Depth: [],
            Class: [],
            Subclass: [],
            Mounting: [],
            DataPortsCount: [],
            PowerPortsCount: [],
            FrontSlotsCount: [],
            BackSlotsCount: [],
          },
        },
      }));
    },
    setHoldMLTItem: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          holdMLTItem: data,
        },
      }));
    },
    setCheckedIndex: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          checkedIndex: data,
        },
      }));
    },
    setOpenUP: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          OpenUP: data,
        },
      }));
    },
  }))
);

export const AllLocationsStore = create(
  devtools((set) => ({
    data: initState.AllLocations,
    addCustomMLTItem: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          CustomMLTItems: [...state.data.CustomMLTItems, data],
        },
      }));
    },
    addCommonMLTItem: (newData) => {
      set((state) => {
        const existingItemIndex = state.data.CommonMLTItems.findIndex(
          (item) => item.Model === newData.Model // Check if an object with the same Model already exists
        );

        if (existingItemIndex !== -1) {
          // If the item exists, increase the "Used" key by 1
          const updatedItems = state.data.CommonMLTItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, Used: item.Used + 1 } // Increment "Used" count for the found item
              : item
          );

          // Reorder the array based on the "Used" key in descending order
          updatedItems.sort((a, b) => b.Used - a.Used);

          return {
            data: {
              ...state.data,
              CommonMLTItems: updatedItems,
            },
          };
        } else {
          // If the item does not exist and the array length is less than 100, add the new item
          if (state.data.CommonMLTItems.length < 100) {
            const newItem = { ...newData, Used: 1 }; // Add the "Used" key with value 1
            const updatedItems = [...state.data.CommonMLTItems, newItem];

            // Reorder the array based on the "Used" key in descending order
            updatedItems.sort((a, b) => b.Used - a.Used);

            const LocationsList = doc(db, "Users", auth.currentUser.uid, "LibraryData", "CommonUsed");
            setDoc(LocationsList, {
              [`CommonMLTItems`]: updatedItems,
            });
            return {
              data: {
                ...state.data,
                CommonMLTItems: updatedItems,
              },
            };
          }
          return state;
        }
      });
    },

    addLocation: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Location: [...state.data.Location, data],
        },
      }));
    },
  }))
);

export const HoldLocationStore = create(
  devtools((set) => ({
    data: initState.HoldLocation,
    setHoldLocation: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          HoldLocation: data,
        },
      }));
    },
    removeHoldLocation: () => {
      set((state) => ({
        data: {
          ...state.data,
          HoldLocation: BlankCurrentLocation,
        },
      }));
    },
  }))
);

export const RoutingStore = create(
  devtools((set) => ({
    data: initState.Routing,
    setLoading: (value) => {
      set((state) => ({
        data: {
          ...state.data,
          Loading: value,
        },
      }));
    },
    isLoading: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Loading: data,
        },
      }));
      console.log(data);
    },
    setLoginPage: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          Login: data,
        },
      }));
    },
    setLoginModal: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          LoginModal: data,
        },
      }));
    },
    setCurrentPage: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          CurrentPage: data,
        },
      }));
    },
    setAuditPage: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          AuditPage: data,
        },
      }));
    },
    setAuditModal: (data) => {
      set((state) => ({
        data: {
          ...state.data,
          AuditModal: data,
        },
      }));
    },
  }))
);
