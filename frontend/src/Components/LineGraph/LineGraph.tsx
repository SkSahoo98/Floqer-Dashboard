import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import salaryDataJson from "../../salaryData.json";
import "./LineGraph.scss"; 

interface SalaryData {
  work_year: number;
}

interface AggregatedData {
  year: number;
  totalJobs: number;
}

const aggregateDataForGraph = (data: SalaryData[]): AggregatedData[] => {
  const groupedData = data.reduce<Record<number, AggregatedData>>(
    (acc, curr) => {
      const { work_year } = curr;

      if (!acc[work_year]) {
        acc[work_year] = { year: work_year, totalJobs: 0 };
      }

      acc[work_year].totalJobs += 1;

      return acc;
    },
    {}
  );

  return Object.values(groupedData);
};

const LineGraph: React.FC = () => {
  const salaryData = salaryDataJson as SalaryData[];
  const aggregatedData = aggregateDataForGraph(salaryData);

  return (
    <div className="graph-container">
      <h1>Line Graph (2020 - 2024)</h1>
      <ResponsiveContainer width="90%" height={300} className="graph" >
        <LineChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" />
          <XAxis dataKey="year" stroke="#ffffff" /> 
          <YAxis stroke="#ffffff" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              borderRadius: "5px",
              color: "white",
            }}
          />
          <Line type="monotone" dataKey="totalJobs" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraph;
