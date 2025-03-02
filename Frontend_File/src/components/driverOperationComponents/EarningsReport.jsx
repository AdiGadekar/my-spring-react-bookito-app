import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import useAuthData from "../../services/useAuthData";
import { getMonthlyEarning } from "../../services/api";
import { FaWallet } from "react-icons/fa";
import { PageLoadingSpinnerAnimation } from "../common/Spinner";

function EarningsReport() {
  const [monthlyEarnings, setMonthlyEarnings] = useState(Array(12).fill(0));
  const [customLoading, setcustomLoading] = useState(true);

  const { loading, loginResult } = useAuthData();

  useEffect(() => {
    if (!loading && loginResult?.driverDTO?.driverId) {
      const fetchMonthlyEarnings = async () => {
        try {
          const earnings = await getMonthlyEarning(
            loginResult.driverDTO.driverId
          );
          setMonthlyEarnings(earnings.data.body);
          setcustomLoading(false);
        } catch (err) {
          console.error("Failed to load monthly earnings:", err);
        }
      };

      fetchMonthlyEarnings();
    }
  }, [loading, loginResult]);

  const chartOptions = {
    chart: {
      id: "monthly-earnings",
      animations: {
        enabled: true,
      },
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    title: {
      text: `Monthly Earnings for ${new Date().getFullYear()}`,
      align: "center",
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      colors: "#00509E",
      curve: "smooth",
    },
  };

  const chartSeries = [
    {
      name: "Earnings",
      data: monthlyEarnings,
    },
  ];

  return (
    <div className="min-h-screen  p-8">
      {customLoading && <PageLoadingSpinnerAnimation />}
      <div className="flex flex-row">
        <FaWallet className="mt-2 mr-1 " />
        <h1 className="text-2xl font-semibold italic mb-4">
          Driver Earnings Report
        </h1>
      </div>

      <div className="shadow-lg rounded-lg shadow-gray-500">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={400}
        />
      </div>
    </div>
  );
}

export default EarningsReport;
