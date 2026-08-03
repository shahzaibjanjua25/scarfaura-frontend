import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminStatsChart = ({ stats = {} }) => {
  // Safely initialize monthly earnings and users arrays
  const monthlyEarnings = new Array(12).fill(0);
  const monthlyUsers = new Array(12).fill(0);

  // Populate monthly earnings if available
  stats.monthlyEarnings?.forEach((entry) => {
    if (entry?.month >= 1 && entry?.month <= 12) {
      monthlyEarnings[entry.month - 1] = entry.earnings;
    }
  });

  // Populate monthly new users if available
  stats.monthlyUsers?.forEach((entry) => {
    if (entry?.month >= 1 && entry?.month <= 12) {
      monthlyUsers[entry.month - 1] = entry.count;
    }
  });

  const pieData = {
    labels: ['Total Orders', 'Total Products', 'Total Reviews', 'Total Users'],
    datasets: [
      {
        label: 'Admin Stats',
        data: [
          stats.totalOrders || 0,
          stats.totalProducts || 0,
          stats.totalReviews || 0,
          stats.totalUsers || 0,
          stats.totalProducts||0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      // {
      //   label: 'Monthly Earnings ($)',
      //   data: monthlyEarnings,
      //   fill: false,
      //   backgroundColor: '#36A2EB',
      //   borderColor: '#36A2EB',
      //   tension: 0.1,
      //   yAxisID: 'y',
      // },
      // {
      //   label: 'Monthly New Users',
      //   data: monthlyUsers,
      //   fill: false,
      //   backgroundColor: '#FF6384',
      //   borderColor: '#FF6384',
      //   tension: 0.1,
      //   yAxisID: 'y1',
      // },
    ],
  };
// console.log(ordersData)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Earnings ($)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'New Users',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-xl font-semibold mb-4">Admin Stats Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="max-h-96 w-full">
          <Pie data={pieData} options={options} />
        </div>

        {/* Line Chart with dual axes */}
        <div className="max-h-96 md:h-96 w-full">
          {/* <Line data={lineData} options={options} /> */}
        </div>
      </div>

      <div className="relative pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-6/12 px-4 mx-auto text-center">
              <div className="text-sm text-blueGray-500 font-semibold py-1">
                {/* Stats Chart by Shah Zaib */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsChart;
