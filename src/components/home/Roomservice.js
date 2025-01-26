import React from "react";
import CommonHeading from "../common/CommonHeading";

const Roomservice = () => {
    const services = [
      { id: 1, name: "24/7 Room Service", icon: "🛎️" },
      { id: 2, name: "Daily Housekeeping", icon: "🧹" },
      { id: 3, name: "Laundry Service", icon: "🧺" },
      { id: 4, name: "Free Wi-Fi", icon: "📶" },
      { id: 5, name: "Complimentary Breakfast", icon: "🥐" },
    ];
  
    return (
      <div className="p-6 bg-gray-100 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Services</h2>
        <ul className="space-y-3">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
            >
              <span className="text-2xl">{service.icon}</span>
              <span className="text-lg text-gray-700">{service.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Roomservice;