import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from 'firebase/database';

import { saveAs } from 'file-saver';
import Papa from 'papaparse';

import "../com/dnm.css"



// Firebase Configuration and Initialization

const firebaseConfig = {
    // Add your Firebase configuration here
    apiKey: "AIzaSyBgc-qS0x3qeuQMV22GxmpJlNH5X5L3tMk",
    authDomain: "taprw-c7977.firebaseapp.com",
    databaseURL: "https://taprw-c7977-default-rtdb.firebaseio.com",
    projectId: "taprw-c7977",
    storageBucket: "taprw-c7977.firebasestorage.app",
    messagingSenderId: "1094519464495",
    appId: "1:1094519464495:web:644cc3c8c323cefa501cda",
    measurementId: "G-2GVMBDE7X7"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log(database)

export const Iot = () => {
    const [records, setRecords] = useState([]);

    const [writeList, setWriteList] = useState([
        {
            data: "1",
            data_type: 0,
            request_type: 5,
            starting_reg_addr: 542,
        },
        {
            data: "1",
            data_type: 0,
            request_type: 5,
            starting_reg_addr: 543,
        },
        {
            data: "1",
            data_type: 0,
            request_type: 5,
            starting_reg_addr: 548,
        },
    ]);



    //read useeffect
    useEffect(() => {
        const fetchData = () => {
            // Reference the "read" path in the Firebase Realtime Database
            const dataRef = ref(database, 'read');

            // Set up a listener that triggers whenever data changes
            onValue(dataRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Raw data:", data); // Log raw data for debugging

                if (data) {
                    const extractedData = []; // Array to store processed records

                    // Loop through each top-level entry
                    Object.entries(data).forEach(([entryId, entryValue]) => {
                        const { ts, values } = entryValue;

                        // Extract required fields
                        if (values) {
                            const {
                                bottle_count,
                                counter_reset,
                                plc_status,
                                pulse,
                                stop_plc,
                            } = values;

                            extractedData.push({
                                ts,
                                bottle_count,
                                counter_reset,
                                plc_status,
                                pulse,
                                stop_plc,
                            });
                        }
                    });

                    setRecords(extractedData); // Save processed data to state
                } else {
                    setRecords([]); // No data found, set state to empty
                }
            });
        };

        fetchData(); // Initial fetch
    }, []);



    //write
    // Handle updates to the data field for each object
    const handleDataChange = (index, newValue) => {
        setWriteList((prevList) =>
            prevList.map((item, i) =>
                i === index ? { ...item, data: newValue } : item
            )
        );
    };

    // Prepare the structure for writing
    const prepareWriteData = () => {
        return {
            method: "do_mb_write",
            params: {
                device_name: "plc_device",
                write_list: writeList,
            },
        };
    };

    // Write data to Firebase
    const handleWrite = async () => {
        const writeData = prepareWriteData();
        const writeRef = ref(database, "write");
        try {
            await set(writeRef, writeData);
            console.log("Data successfully written to wread:", writeData);
        } catch (error) {
            console.error("Error writing data to wread:", error);
        }
    };


    const fieldNames = ["Counter Reset", "Pulse", "stop_plc"];

    // 📤 Export to CSV Function
    // const exportToCSV = () => {
    //   // Prepare a new array with custom column names and formatted timestamp
    //   const formattedData = records.map((rec) => {
    //     const dateObj = new Date(rec.ts);
    //     const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;

    //     const LittelFuse1=parseFloat(rec.oil_level__v)
    //     const MCC1=parseFloat(rec.oil_temp__v)
    //     const different1=(MCC1 - LittelFuse1).toFixed(1)


    //     return {

    //       "Date & Time": formattedDate,
    //       "Littelfuse":LittelFuse1,
    //       "MCC":MCC1,
    //       "different":different1
    //     };
    //   });

    //   // Convert to CSV using PapaParse
    //   const csv = Papa.unparse(formattedData);

    //   // Create and download blob
    //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    //   saveAs(blob, "Sensor_data.csv");
    // };
    return (
        <div className='MainCon' >
            <h3>Bottle_counter</h3>

            {/* <button onClick={exportToCSV} style={{ marginBottom: "1rem", padding: "10px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Export to CSV
      </button> */}

            {/* write part */}

            <div>
                <div className="writ1">
                    {writeList.map((item, index) => (
                        <div key={index} className="write-item">
                            <div>
                                <strong>{fieldNames[index] || `Control ${index + 1}`}:</strong>{" "}
                                <select
                                    value={item.data}
                                    onChange={(e) => handleDataChange(index, e.target.value)}
                                >
                                    <option value="1">On</option>
                                    <option value="0">Off</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    <button
                    onClick={handleWrite}
                    style={{
                        padding: "20px 20px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        marginTop: "20px",
                        marginBottom:"10px",
                        borderRadius:"10px"
                    }}
                >
                    Write Data to PLC
                </button>
                </div>
                
            </div>






            {records.length === 0 ? (
                <p>No records found</p>
            ) : (
                <table className='Mtable'>
                    <thead>
                        <tr>
                            {/* <th>Timestamp</th> */}
                            <th>Bottle Count</th>
                            {/* <th>Counter Reset</th> */}
                            <th>PLC Status</th>
                            {/* <th>Pulse</th>
                            <th>Stop PLC</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {[...records].reverse().slice(0,1).map((record, index) => (
                            <tr key={index}>
                                {/* {new Date(record.ts).toLocaleString()} */}
                                <td>{record.bottle_count}</td>
                                {/* <td>{record.counter_reset === 1 ? "Yes" : "No"}</td> */}
                                <td>{record.plc_status === 1 ? "ON" : "OFF"}</td>
                                {/* <td>{record.pulse === 1 ? "Yes" : "No"}</td>
                                <td>{record.stop_plc === 1 ? "Yes" : "No"}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>



            )
            }

        </div>
    )
}
