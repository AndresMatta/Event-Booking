import React from "react";
import { Bar as BarChart } from "react-chartjs";

const BOOKINGS_BUCKETS = {
  Cheap: { min: 0, max: 50 },
  Normal: { min: 51, max: 100 },
  Expensive: { min: 101, max: 100000 }
};
const BookingsChart = ({ bookings }) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];

  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = bookings.reduce((prev, current) => {
      return current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
        ? prev + 1
        : prev;
    }, 0);

    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
  }

  chartData.datasets.push({
    fillColor: "rgba(220, 220, 220, 0.5)",
    strokeColor: "rgba(220, 220, 220, 0.8)",
    highlightFill: "rgba(220, 220, 220, 0.75)",
    highlightStroke: "rgba(220, 220, 220, 1)",
    data: values
  });

  return (
    <div className="chart-control">
      <BarChart data={chartData} />
    </div>
  );
};

export default BookingsChart;
