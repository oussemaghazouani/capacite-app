import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Chart from "chart.js/auto";

const LineChart = forwardRef(({ dataEntries, selectedIndex, onPointClick }, ref) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const blinkInterval = useRef(null);

  // Expose the canvas ref to parent components
  useImperativeHandle(ref, () => chartRef.current);

  // Chart creation and update
  useEffect(() => {
    if (!chartRef.current) return;

    const durations = dataEntries.map((d) => d.duree_us);
    const capacities = dataEntries.map((d) => d.valeur_pF);

    if (!chartInstance.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: durations,
          datasets: [
            {
              label: "Capacité (pF)",
              data: capacities,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointHoverRadius: 6,
              borderColor: "#ffa500",
              backgroundColor: "rgba(255, 165, 0, 0.1)",
              pointBackgroundColor: capacities.map(() => "#ffa500"),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: "#000" } } },
          scales: {
            x: {
              title: { display: true, text: "Durée (µs)", color: "#000" },
              ticks: { color: "#000" },
            },
            y: {
              title: { display: true, text: "Capacité (pF)", color: "#000" },
              ticks: { color: "#000" },
            },
          },
          onClick: (evt, elements) => {
            if (elements.length > 0 && onPointClick) {
              onPointClick(elements[0].index);
            }
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
        },
      });
    } else {
      chartInstance.current.data.labels = durations;
      chartInstance.current.data.datasets[0].data = capacities;
      chartInstance.current.data.datasets[0].pointBackgroundColor = capacities.map(
        (_, i) => (selectedIndex === i ? "rgba(255, 0, 0, 0.8)" : "#ffa500")
      );
      chartInstance.current.data.datasets[0].pointRadius = capacities.map(
        (_, i) => (selectedIndex === i ? 8 : 4)
      );
      chartInstance.current.update();
    }
  }, [dataEntries, selectedIndex, onPointClick]);

  // Blinking effect for selected point
  useEffect(() => {
    if (blinkInterval.current) clearInterval(blinkInterval.current);
    if (selectedIndex === null) return;

    let visible = true;
    blinkInterval.current = setInterval(() => {
      if (!chartInstance.current) return;
      const capacities = dataEntries.map((d) => d.valeur_pF);
      const lineColors = capacities.map(() => "rgba(214, 137, 21, 0.8)");
      const lineRadii = capacities.map(() => 4);

      if (visible) {
        lineColors[selectedIndex] = "rgba(255, 0, 0, 0.8)";
        lineRadii[selectedIndex] = 8;
      }

      chartInstance.current.data.datasets[0].pointBackgroundColor = lineColors;
      chartInstance.current.data.datasets[0].pointRadius = lineRadii;

      chartInstance.current.update();
      visible = !visible;
    }, 500);

    return () => clearInterval(blinkInterval.current);
  }, [selectedIndex, dataEntries]);

  return (
    <div
      style={{
        marginBottom: 40,
        backgroundColor: "rgba(255,255,255,0.3)",
        padding: 20,
        borderRadius: 16,
        boxShadow: "0 4px 10px rgba(127, 192, 245, 0.83)",
      }}
    >
      <h2
        style={{
          background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "700",
        }}
      >
        Graphique Capacité en fonction du temps (Ligne)
      </h2>
      <canvas ref={chartRef} style={{ maxWidth: "100%", height: 350 }} />
    </div>
  );
});

export default LineChart;
