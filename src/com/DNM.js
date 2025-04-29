// import React, { useEffect, useState } from 'react';
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, onValue, set } from 'firebase/database';

// import { saveAs } from 'file-saver';
// import Papa from 'papaparse';

// import "../com/dnm.css"



// // Firebase Configuration and Initialization

// const firebaseConfig = {
//     // Add your Firebase configuration here
//     apiKey: "AIzaSyBgc-qS0x3qeuQMV22GxmpJlNH5X5L3tMk",
//     authDomain: "taprw-c7977.firebaseapp.com",
//     databaseURL: "https://taprw-c7977-default-rtdb.firebaseio.com",
//     projectId: "taprw-c7977",
//     storageBucket: "taprw-c7977.firebasestorage.app",
//     messagingSenderId: "1094519464495",
//     appId: "1:1094519464495:web:644cc3c8c323cefa501cda",
//     measurementId: "G-2GVMBDE7X7"
// };


// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// console.log(database)
// const DNM = () => {
//     const [records, setRecords] = useState([]);

//     useEffect(() => {
//     const fetchData =()=>{

//         // Reference the "rapid" path in the Firebase Realtime Database
//         const dataRef = ref(database, 'datap');

//         //  Set up a listener that triggers whenever data at "rapid" changes
//         onValue(dataRef, (snapshot) => {
//             const data = snapshot.val();
//             console.log("Raw rapid data:", data); //  Log the raw snapshot

//             if (data) {
//                 const extractedData = []; // Prepare array to store processed records

//                 // Loop through each top-level entry under "rapid"
//                 Object.entries(data).forEach(([entryId, entryValue]) => {

//                     //  Loop through each device inside the entry
//                     Object.entries(entryValue).forEach(([deviceId, readingsArray]) => {

//                         //  Check if the device data is an array (of readings)
//                         if (Array.isArray(readingsArray)) {

//                             //  Loop through each reading
//                             readingsArray.forEach((reading, index) => {
//                                 const { ts, values } = reading;
//                                 const { oil_level__v, oil_temp__v } = values || {}; //  Extract values

//                                 //  Push the processed record to our state array
//                                 extractedData.push({
//                                     ts,
//                                     oil_level__v : oil_level__v !== undefined ? (oil_level__v / 10).toFixed(1) : '',
//                                     oil_temp__v : oil_temp__v !== undefined ? (oil_temp__v / 10).toFixed(1) : '',
//                                 });
//                             });
//                         }
//                     });
//                 });

//                 setRecords(extractedData); // ✅ Save all records to component state
//             } else {
//                 setRecords([]); // ⚠️ No data found, set to empty
//             }
//         },{
//             onlyOnce:true
//         });
//     };
//     fetchData()// fect one initially
//     const int = setInterval(fetchData,1000); //fetch every 10 se 
     
    
//     return()=> clearInterval(int); // add value every 10sec
// }, []);

//     // 📤 Export to CSV Function
//     const exportToCSV = () => {
//       // Prepare a new array with custom column names and formatted timestamp
//       const formattedData = records.map((rec) => {
//         const dateObj = new Date(rec.ts);
//         const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
        
//         const LittelFuse1=parseFloat(rec.oil_level__v)
//         const MCC1=parseFloat(rec.oil_temp__v)
//         const different1=(MCC1 - LittelFuse1).toFixed(1)


//         return {
         
//           "Date & Time": formattedDate,
//           "Littelfuse":LittelFuse1,
//           "MCC":MCC1,
//           "different":different1
//         };
//       });
    
//       // Convert to CSV using PapaParse
//       const csv = Papa.unparse(formattedData);
    
//       // Create and download blob
//       const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//       saveAs(blob, "Sensor_data.csv");
//     };
//     return (
//         <div className='MainCon' >
//             <h3>LittelFuse and MCC Sensor  Data</h3>

//             <button onClick={exportToCSV} style={{ marginBottom: "1rem", padding: "10px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
//         Export to CSV
//       </button>
//             {records.length === 0 ? (
//                 <p>No records found</p>
//             ) : (
//                 <table className='Mtable' >
//                 <thead >
//                   <tr>

//                     {/* <th >Entry ID</th>
//                     <th >Device ID</th> */}   
//                     <th  >Timestamp</th>
//                     <th >LittelFuse</th>
//                     <th >MCC</th>
//                     <th >different</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[...records].reverse().map((rec, index) => (
//                     <tr key={index} >
//                       {/* <td >{rec.entryId}</td>
//                       <td >{rec.deviceId}</td> */}
//                       <td >
//                         {new Date(rec.ts).toLocaleString()}
//                       </td>
//                       <td >{rec.oil_level__v}</td>
//                       <td >{rec.oil_temp__v}</td>
//                       <td >{rec.oil_level__v - rec.oil_temp__v}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
              
              

//             )
//             }

//         </div>
//     );
// };

// export default DNM












import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";

const App = ({ database }) => {
    const [data, setData] = useState([]);

    // Fetch data from the "read" path in Firebase
    useEffect(() => {
        const fetchData = () => {
            const dataRef = ref(database, "read");
            onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const formattedData = Object.entries(data).map(([entryId, entryValue]) => {
                        const { values } = entryValue || {};
                        const {
                            bottle_count,
                            counter_reset,
                            plc_status,
                            pulse,
                            stop_plc,
                        } = values || {};

                        return {
                            id: entryId,
                            bottle_count,
                            counter_reset,
                            plc_status,
                            pulse,
                            stop_plc,
                        };
                    });
                    setData(formattedData);
                }
            });
        };

        fetchData();
    }, [database]);

    // Handle dropdown change
    const handleSelectChange = (id, key, newValue) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, [key]: newValue } : item
            )
        );
    };

    // Write updated data to Firebase
    const handleWrite = async () => {
        const writeData = data.map((item) => ({
            method: "do_mb_write",
            params: {
                device_name: "plc_device",
                write_list: [
                    {
                        data: String(item.bottle_count),
                        data_type: 1,
                        request_type: 5,
                        starting_reg_addr: 542,
                    },
                    {
                        data: String(item.counter_reset),
                        data_type: 0,
                        request_type: 5,
                        starting_reg_addr: 543,
                    },
                    {
                        data: String(item.plc_status),
                        data_type: 0,
                        request_type: 5,
                        starting_reg_addr: 548,
                    },
                    {
                        data: String(item.pulse),
                        data_type: 0,
                        request_type: 5,
                        starting_reg_addr: 549,
                    },
                    {
                        data: String(item.stop_plc),
                        data_type: 0,
                        request_type: 5,
                        starting_reg_addr: 550,
                    },
                ],
            },
        }));

        try {
            const writeRef = ref(database, "wread");
            await set(writeRef, writeData);
            console.log("Data successfully written to wread.");
        } catch (error) {
            console.error("Error writing data to wread:", error);
        }
    };

    return (
        <div>
            <h2>PLC Data Viewer and Writer</h2>
            {data.map((item) => (
                <div key={item.id} className="data-item">
                    <h3>Entry {item.id}</h3>
                    <div>
                        <strong>Bottle Count:</strong>{" "}
                        <input
                            type="number"
                            value={item.bottle_count}
                            onChange={(e) =>
                                handleSelectChange(item.id, "bottle_count", e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <strong>Counter Reset:</strong>{" "}
                        <select
                            value={item.counter_reset}
                            onChange={(e) =>
                                handleSelectChange(item.id, "counter_reset", e.target.value)
                            }
                        >
                            <option value="1">On</option>
                            <option value="0">Off</option>
                        </select>
                    </div>
                    <div>
                        <strong>PLC Status:</strong>{" "}
                        <select
                            value={item.plc_status}
                            onChange={(e) =>
                                handleSelectChange(item.id, "plc_status", e.target.value)
                            }
                        >
                            <option value="1">On</option>
                            <option value="0">Off</option>
                        </select>
                    </div>
                    <div>
                        <strong>Pulse:</strong>{" "}
                        <select
                            value={item.pulse}
                            onChange={(e) =>
                                handleSelectChange(item.id, "pulse", e.target.value)
                            }
                        >
                            <option value="1">On</option>
                            <option value="0">Off</option>
                        </select>
                    </div>
                    <div>
                        <strong>Stop PLC:</strong>{" "}
                        <select
                            value={item.stop_plc}
                            onChange={(e) =>
                                handleSelectChange(item.id, "stop_plc", e.target.value)
                            }
                        >
                            <option value="1">On</option>
                            <option value="0">Off</option>
                        </select>
                    </div>
                </div>
            ))}
            <button onClick={handleWrite}>Write Data to PLC</button>
        </div>
    );
};

export default App;
