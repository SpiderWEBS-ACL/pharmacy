import React, { useState, useEffect } from 'react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to the current month
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Fetch all sales data from the server initially
    const fetchAllSales = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/sales');
        const data = await response.json();

        if (data.success) {
          setSales(data.orders);
        } else {
          console.error('Error fetching all sales data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching all sales data:', error.message);
      }
    };

    fetchAllSales();
  }, []); // Run once on component mount

  // Function to filter sales based on selected month, medicine, and date
  const filteredSales = sales.filter((sale) => {
    const saleMonth = new Date(sale.Date).getMonth() + 1;
    const isMonthMatch = selectedMonth ? saleMonth === selectedMonth : true;
    const isMedicineMatch = selectedMedicine ? sale.Medicines.some((med) => med.medicine === selectedMedicine) : true;
    const isDateMatch = selectedDate ? new Date(sale.Date).toLocaleDateString() === selectedDate : true;

    return isMonthMatch && isMedicineMatch && isDateMatch;
  });

  // Function to calculate total sales for the selected month
  const calculateTotalSales = () => {
    return filteredSales.reduce((total, sale) => total + sale.TotalPrice, 0);
  };

  return (
    <div>
      <h2>Sales</h2>
      <div>
        <label>Select Month:</label>
        <select onChange={(e) => setSelectedMonth(parseInt(e.target.value))} value={selectedMonth}>
          {/* Add options for each month */}
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {new Date(2021, index, 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Filter by Medicine:</label>
        <input type="text" value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)} />
      </div>
      <div>
        <label>Filter by Date:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>
      <p>Total Sales: ${calculateTotalSales()}</p>
      <ul>
        {filteredSales.map((sale) => (
          <li key={sale._id}>
            <p>Sale ID: {sale._id}</p>
            <p>Total Price: ${sale.TotalPrice}</p>
            <p>Delivery Address: {sale.DeliveryAddress}</p>
            <p>Status: {sale.Status}</p>
            <p>Payment Method: {sale.PaymentMethod}</p>
            <p>Date: {new Date(sale.Date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sales;
