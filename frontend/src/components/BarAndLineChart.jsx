import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Register the required Chart.js components and the Zoom plugin
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  zoomPlugin
);

const BarAndLineChart = ({ data, filterOption, isSharedDashboard }) => {
  const user = useSelector((store) => store.user);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const location = useLocation();

  const [filters, setFilters] = useState({
    age: "All",
    gender: "All",
    dateRange: ["", ""],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (filterOption) {
      console.log(filterOption);
      setFilters({
        age: filterOption?.age,
        gender: filterOption?.gender,
        dateRange: [`${filterOption.startdate}`, `${filterOption.enddate}`],
        startDate: filterOption.startdate,
        endDate: filterOption.enddate,
      });
    }
  }, [filterOption]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  // Filter and aggregate data for the bar chart
  const filteredData = data.filter((item) => {
    // console.log(data[0]);

    const ageMatch = filters.age === "All" || item.Age === filters.age;

    const genderMatch =
      filters.gender === "All" || item.Gender === filters.gender;

    // const [startDate, endDate] = filters.dateRange;
    const startDate = filters.startDate;
    const endDate = filters.endDate;

    const dateMatch =
      (!startDate || new Date(item.Day) >= new Date(startDate)) &&
      (!endDate || new Date(item.Day) <= new Date(endDate));
    // console.log(ageMatch && genderMatch && dateMatch);
    return ageMatch && genderMatch && dateMatch;
  });

  const aggregatedData = filteredData.reduce((acc, item) => {
    const features = ["A", "B", "C", "D", "E", "F"];
    features.forEach((feature) => {
      // console.log(item[feature]);
      acc[feature] = (acc[feature] || 0) + item[feature];
    });

    return acc;
  }, {});
  console.log(aggregatedData);
  // Prepare bar chart data
  const barChartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: "Total Time Spent",
        data: Object.values(aggregatedData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const copyLink = () => {
    const link = window.location.href.replace(
      "dashboard",
      `shared-dashboard/${user._id}/filters?age=${filters.age}&gender=${filters.gender}&startdate=${filters.startDate}&enddate=${filters.endDate}`
    );
    navigator.clipboard.writeText(link);
  };

  const clearFilters = () => {
    setFilters({
      age: "All",
      gender: "All",
      dateRange: ["", ""],
      startDate: "",
      endDate: "",
    });
  };

  const handleBarClick = (elements) => {
    console.log(elements);
    if (elements.length > 0) {
      const index = elements[0].index;
      const feature = barChartData.labels[index];
      setSelectedFeature(feature);
    }
  };

  const lineChartData = selectedFeature
    ? {
        labels: filteredData.map((item) => item.Day),
        datasets: [
          {
            label: `Time Trend for ${selectedFeature}`,
            data: filteredData.map((item) => item[selectedFeature]),
            fill: false,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      }
    : null;

  const zoomOptions = {
    plugins: {
      zoom: {
        zoom: {
          // drag: {
          //   enabled: true, // Drag-to-zoom for touchpad users
          // },
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true, // Pinch-to-zoom for touchscreens
          },
          mode: "x", // Zoom along the x-axis
        },
        pan: {
          enabled: true, // Allow panning
          mode: "x",
        },
      },
    },
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: [startDate, endDate],
      startDate: startDate,
      endDate: endDate,
    }));
    console.log(filters);
  };

  return (
    <div className="flex flex-col gap-5 w-full p-5">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex gap-5">
          {" "}
          {!isSharedDashboard && (
            <button
              onClick={copyLink}
              className="py-1 px-2 bg-accesntColor border-2 border-accesntColor hover:bg-white hover:text-textColor text-white font-semibold w-fit rounded-md transition-colors duration-200 "
            >
              Share Dashboard
            </button>
          )}
          <button
            onClick={clearFilters}
            className="py-1 px-2 bg-accesntColor border-2 border-accesntColor hover:bg-white hover:text-textColor text-white font-semibold w-fit rounded-md transition-colors duration-200 "
          >
            Clear Filters
          </button>{" "}
        </div>
      </div>
      <div className="flex flex-wrap gap-5 mb-5">
        <label>
          Age:
          <select name="age" onChange={handleFilterChange} value={filters.age}>
            <option value="All">All</option>
            <option value="15-25">15-25</option>
            <option value=">25">&gt;25</option>
          </select>
        </label>
        <label>
          Gender:
          <select
            name="gender"
            onChange={handleFilterChange}
            value={filters.gender}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label className="flex gap-3 flex-wrap">
          Start Data:
          <input
            type="date"
            onChange={(e) =>
              handleDateRangeChange(e.target.value, filters.endDate)
            }
            value={filters.startDate}
          />
          End Date:
          <input
            type="date"
            onChange={(e) =>
              handleDateRangeChange(filters.startDate, e.target.value)
            }
            value={filters.endDate}
          />
        </label>
      </div>

      <Bar
        data={barChartData}
        options={{
          onClick: (evt, elements) => handleBarClick(elements),
          responsive: true,
          indexAxis: "y",
          plugins: {
            legend: {
              display: true,
            },
          },
        }}
      />

      {selectedFeature && (
        <div>
          <h2>Line Chart</h2>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
              },
              ...zoomOptions,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BarAndLineChart;