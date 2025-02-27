import React from 'react'
import { CurrentLocation } from '../../../../Store/Store';
import { ObjectListing } from '../../../../dcT_Objects/ObjectsArrays';
import { UniqueOrder } from '../../../../dcT_Objects/ObjectsArrays';
import * as XLSX from "xlsx";


export default function Export() {
const AllItems = CurrentLocation((state) => state.data.AllItems);

let AllObjectsSorted = {}
Object.keys(AllItems).map((item) => {
    AllObjectsSorted[AllItems[item]["Object *"]] = []
})
Object.keys(AllItems).map((item) => {
    let objectItem = AllItems[item]
    AllObjectsSorted[AllItems[item]["Object *"]] = [...AllObjectsSorted[AllItems[item]["Object *"]], objectItem]
})
console.log("All Items",AllItems)
console.log(AllObjectsSorted)

  return (
    <div className='flex flex-col'><div>{preview(AllObjectsSorted)}</div><div>{exportData()}</div></div>
  )
}

function preview(data) {
    console.log(data)
    return (
        <div className="space-y-8">
            <table id="ExportTable" className="min-w-full border border-gray-300">
          {Object.entries(data).map(([category, items]) => {
            // Determine the unique keys that exist in the current category
            const availableKeys = UniqueOrder.filter((key) =>
              items.some((item) => key in item)
            );
    
            return (
                <>
            <div key={category} className='mt-4'>
                {/* <h2 className="font-bold mb-4">{category}</h2>
                <div className="overflow-x-auto"> */}
                    <thead key={category}>
                      <tr className="bg-gray-200">
                        {availableKeys.map((key) => {
                            if (key === "RUHeight") return null
                            return(
                          <th key={key} className="border p-2 text-left text-xs text-nowrap">
                            {key}
                          </th>)
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, rowIndex) => (
                        <tr key={rowIndex} className="border">
                          {availableKeys.map((key) => {
                                                        if (key === "RUHeight") return null

                            return (<td key={key} className="border p-2 text-sm text-nowrap">
                              {item[key] || ""}
                            </td>)
          })}
                        </tr>
                      ))}
                    </tbody>
                 </div>
                </>
                //   </div>
            );
        })}
        </table>
        </div>
      );
  }

  function exportData() {
    const handleExport = () => {
      // Find the table element by ID
      const table = document.getElementById("ExportTable");
  
      if (!table) {
        alert("Table not found!");
        return;
      }
  
      // Convert table to a worksheet
      const worksheet = XLSX.utils.table_to_sheet(table);
  
      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ExportedData");
  
      // Trigger download
      XLSX.writeFile(workbook, "exported_data.xlsx");
    };
  
    return (
      <div className='mt-4'>
        <button className="ButtonMain " onClick={handleExport}>
          EXPORT
        </button>
      </div>
    );
  }
