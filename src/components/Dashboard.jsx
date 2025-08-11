import React, { useState, useRef } from "react";
import Header from "./Header";
import LineChart from "./LineChart";
import DataTable from "./DataTable";
import { FloatingToolbar, DownloadToolbar } from "./Toolbar";
import { handleDownloadExcel, downloadChartAsPNG, downloadChartsAsPDF } from "../utils/exportUtils";

function Dashboard({ user, dataEntries, onShowSettings, onShowNotes }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const lineChartRef = useRef(null);

  const handlePointClick = (index) => {
    setSelectedIndex(index);
  };

  const handleRowClick = (index) => {
    setSelectedIndex(index);
  };

  const handleNotesClick = (dateString, email) => {
    onShowNotes(dateString, email);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: 20,
        backgroundColor: "#f4f7fa",
        color: "#333",
      }}
    >
      <FloatingToolbar
        onShowSettings={onShowSettings}
        onShowNotes={handleNotesClick}
        user={user}
      />

      <Header />

      <LineChart
        ref={lineChartRef}
        dataEntries={dataEntries}
        selectedIndex={selectedIndex}
        onPointClick={handlePointClick}
      />

      <DownloadToolbar
        onDownloadExcel={() => handleDownloadExcel(dataEntries)}
        onDownloadPNG={() => downloadChartAsPNG(lineChartRef, "graphique_ligne_IDT.png")}
        onDownloadPDF={() => downloadChartsAsPDF(lineChartRef)}
      />

      <DataTable
        dataEntries={dataEntries}
        selectedIndex={selectedIndex}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default Dashboard;
