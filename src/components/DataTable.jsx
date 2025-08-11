import React from "react";

function DataTable({ dataEntries, selectedIndex, onRowClick }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 10,
        textAlign: "center",
        color: "#2d2d2d",
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(127, 192, 245, 0.83)",
      }}
    >
      <thead>
        <tr
          style={{
            background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
            color: "#ffffff",
          }}
        >
          <th style={{ padding: "12px" }}>Numéro</th>
          <th style={{ padding: "12px" }}>Durée (µs)</th>
          <th style={{ padding: "12px" }}>Capacité (pF)</th>
        </tr>
      </thead>
      <tbody>
        {dataEntries.map((entry, index) => (
          <tr
            key={entry.id}
            style={{
              backgroundColor:
                selectedIndex === index ? "#ffdede" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => onRowClick(index)}
          >
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>{index}</td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>
              {entry.duree_us}
            </td>
            <td style={{ padding: "10px", border: "1px solid #ccc" }}>
              {entry.valeur_pF}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
