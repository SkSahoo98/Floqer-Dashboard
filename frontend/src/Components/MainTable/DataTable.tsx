import React, { useState } from "react";
import { Table } from "antd";
import salaryDataJson from "../../salaryData.json";
import "./datatable.scss";

// Type definitions for the salary data
interface SalaryData {
  work_year: number;
  salary_in_usd: number;
  job_title: string;
}

// Type for the aggregated data
interface AggregatedData {
  year: number;
  totalJobs: number;
  totalSalary: number;
  avgSalary: number;
  jobTitles: string[];
}

// Type for aggregated job titles data
interface JobTitleData {
  job_title: string;
  count: number;
}

// Helper function to group and aggregate data by year
const aggregateData = (data: SalaryData[]): AggregatedData[] => {
  const groupedData = data.reduce<Record<number, AggregatedData>>(
    (acc, curr) => {
      const { work_year, salary_in_usd, job_title } = curr;

      if (!acc[work_year]) {
        acc[work_year] = {
          year: work_year,
          totalJobs: 0,
          totalSalary: 0,
          avgSalary: 0,
          jobTitles: [],
        };
      }

      acc[work_year].totalJobs += 1;
      acc[work_year].totalSalary += salary_in_usd;
      acc[work_year].jobTitles.push(job_title);

      return acc;
    },
    {}
  );

  // Calculate average salary and return the grouped data
  return Object.values(groupedData).map((item) => ({
    ...item,
    avgSalary: Math.round(item.totalSalary / item.totalJobs),
  }));
};

// Helper function to aggregate job titles for a specific year
const aggregateJobTitles = (
  data: SalaryData[],
  year: number
): JobTitleData[] => {
  const jobTitleCounts = data
    .filter((item) => item.work_year === year)
    .reduce<Record<string, number>>((acc, curr) => {
      if (!acc[curr.job_title]) {
        acc[curr.job_title] = 0;
      }
      acc[curr.job_title] += 1;
      return acc;
    }, {});

  return Object.keys(jobTitleCounts).map((title) => ({
    job_title: title,
    count: jobTitleCounts[title],
  }));
};

const DataTable: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Explicitly cast JSON data as SalaryData[] type
  const salaryData = salaryDataJson as SalaryData[];

  // Aggregated data for the main table
  const aggregatedData = aggregateData(salaryData);

  // Aggregated job title data for the second table
  const jobTitleData = selectedYear
    ? aggregateJobTitles(salaryData, selectedYear)
    : [];

  // Table columns definition for the main table
  const mainTableColumns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a: AggregatedData, b: AggregatedData) => a.year - b.year,
    },
    {
      title: "Total Jobs",
      dataIndex: "totalJobs",
      key: "totalJobs",
      sorter: (a: AggregatedData, b: AggregatedData) =>
        a.totalJobs - b.totalJobs,
    },
    {
      title: "Average Salary (USD)",
      dataIndex: "avgSalary",
      key: "avgSalary",
      sorter: (a: AggregatedData, b: AggregatedData) =>
        a.avgSalary - b.avgSalary,
    },
  ];

  // Table columns definition for the second table (job titles)
  const jobTitleTableColumns = [
    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
    },
    {
      title: "Number of Jobs",
      dataIndex: "count",
      key: "count",
      sorter: (a: JobTitleData, b: JobTitleData) => a.count - b.count,
    },
  ];

  // Handle row click in the main table
  const onRowClick = (record: AggregatedData) => {
    setSelectedYear(record.year);
  };

  return (
    <div
      className={`table-container ${
        selectedYear ? "table-shown" : "table-hidden"
      }`}
    >
      <div className="table">
        <h1>ML Engineer Salaries (2020 - 2024)</h1>
        {/* Main Table */}
        <Table
          dataSource={aggregatedData}
          columns={mainTableColumns}
          pagination={false}
          rowKey="year"
          onRow={(record) => ({
            onClick: () => onRowClick(record), 
          })}
        />
      </div>

      {/* Conditionally render second table */}
      <div className="table">
        {selectedYear && (
          <>
            <h1>Job Titles in {selectedYear}</h1>
            <Table
              dataSource={jobTitleData}
              columns={jobTitleTableColumns}
              pagination={{ pageSize: 5 }} 
              rowKey="job_title"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;
