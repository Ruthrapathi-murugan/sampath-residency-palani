// PDF Generation Utility for Bookings
// Uses html2canvas and jspdf (install: npm install html2pdf)

/**
 * Generate PDF for a single booking
 * @param {object} booking - Booking object with all details
 * @returns {blob} PDF blob
 */
export const generateBookingPDF = (booking) => {
  const {
    customerName,
    customerEmail,
    phone,
    address,
    roomName,
    checkIn,
    checkOut,
    numberOfNights,
    pricePerNight,
    totalPrice,
    specialRequests,
    id: bookingId,
  } = booking;

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Confirmation - ${bookingId || 'Sampath Residency'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #1a3a52;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1a3a52;
          font-size: 32px;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          background: #e3f2fd;
          color: #1a3a52;
          padding: 10px 15px;
          border-left: 4px solid #007bff;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 16px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .info-item {
          padding: 10px 0;
        }
        .info-label {
          color: #666;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          color: #1a3a52;
          font-size: 16px;
          font-weight: 600;
          margin-top: 3px;
        }
        .price-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-top: 20px;
        }
        .price-label {
          font-size: 12px;
          opacity: 0.9;
          margin-bottom: 5px;
        }
        .total-price {
          font-size: 32px;
          font-weight: 700;
        }
        .price-breakdown {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,0.3);
          font-size: 14px;
        }
        .breakdown-item {
          text-align: left;
        }
        .breakdown-label {
          opacity: 0.9;
          margin-bottom: 3px;
        }
        .breakdown-value {
          font-weight: 600;
        }
        .special-requests {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          border-left: 4px solid #28a745;
        }
        .special-requests p {
          margin: 0;
          color: #333;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .contact-info {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
          text-align: center;
        }
        .contact-info p {
          margin: 5px 0;
          font-size: 13px;
        }
        .booking-id {
          background: #fff3cd;
          color: #856404;
          padding: 10px 15px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }
        td:first-child {
          font-weight: 600;
          color: #666;
          width: 40%;
        }
        td:last-child {
          color: #1a3a52;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ BOOKING CONFIRMATION</h1>
          <p>Sampath Residency, Palani</p>
        </div>

        <div class="booking-id">
          <strong>Booking ID:</strong> ${bookingId || 'N/A'}
        </div>

        <!-- Customer Information -->
        <div class="section">
          <div class="section-title">👤 Guest Information</div>
          <table>
            <tr>
              <td>Full Name</td>
              <td>${customerName || 'N/A'}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>${customerEmail || 'N/A'}</td>
            </tr>
            <tr>
              <td>Phone Number</td>
              <td>${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>${address || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <!-- Booking Details -->
        <div class="section">
          <div class="section-title">🏨 Booking Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Check-in Date</div>
              <div class="info-value">${checkIn || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Check-out Date</div>
              <div class="info-value">${checkOut || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Room Category</div>
              <div class="info-value">${roomName || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Number of Nights</div>
              <div class="info-value">${numberOfNights || 1} ${numberOfNights === 1 ? 'Night' : 'Nights'}</div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="section">
          <div class="price-box">
            <div class="price-label">TOTAL PRICE</div>
            <div class="total-price">Rs. ${totalPrice || 0}</div>
            <div class="price-breakdown">
              <div class="breakdown-item">
                <div class="breakdown-label">Price per Night</div>
                <div class="breakdown-value">Rs. ${pricePerNight || 0}</div>
              </div>
              <div class="breakdown-item">
                <div class="breakdown-label">Number of Nights</div>
                <div class="breakdown-value">${numberOfNights || 1}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Requests -->
        ${specialRequests ? `
          <div class="section">
            <div class="section-title">✎ Special Requests</div>
            <div class="special-requests">
              <p>${specialRequests}</p>
            </div>
          </div>
        ` : ''}

        <!-- Contact Information -->
        <div class="contact-info">
          <p><strong>Need Help?</strong></p>
          <p>📧 Email: sampathresidencyatpalani@gmail.com</p>
          <p>📞 Phone: 9626380310</p>
        </div>

        <div class="footer">
          <p>This is an automatically generated booking confirmation from Sampath Residency.</p>
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Thank you for choosing Sampath Residency!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Download using html2pdf approach (client-side)
  downloadPDF(htmlContent, `booking-${bookingId || 'confirmation'}.pdf`);
};

/**
 * Generate PDF for all bookings (admin)
 * @param {array} bookings - Array of booking objects
 */
export const generateAllBookingsPDF = (bookings) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>All Bookings - Sampath Residency</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #1a3a52;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1a3a52;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        thead {
          background: #1a3a52;
          color: white;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
          font-size: 13px;
        }
        tbody tr:nth-child(even) {
          background: #f9f9f9;
        }
        tbody tr:hover {
          background: #f0f0f0;
        }
        .status-approved {
          background: #d4edda;
          color: #155724;
          padding: 4px 8px;
          border-radius: 3px;
          font-weight: 600;
          font-size: 12px;
        }
        .status-pending {
          background: #fff3cd;
          color: #856404;
          padding: 4px 8px;
          border-radius: 3px;
          font-weight: 600;
          font-size: 12px;
        }
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
          padding: 4px 8px;
          border-radius: 3px;
          font-weight: 600;
          font-size: 12px;
        }
        .summary {
          background: #e3f2fd;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .summary-item {
          display: inline-block;
          margin-right: 30px;
          margin-bottom: 10px;
        }
        .summary-label {
          color: #666;
          font-size: 12px;
        }
        .summary-value {
          color: #1a3a52;
          font-weight: 700;
          font-size: 20px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 ALL BOOKINGS REPORT</h1>
          <p>Sampath Residency, Palani</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="summary-label">Total Bookings</div>
            <div class="summary-value">${bookings.length}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Approved</div>
            <div class="summary-value" style="color: #28a745;">${bookings.filter(b => b.status === 'approved').length}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Pending</div>
            <div class="summary-value" style="color: #ffc107;">${bookings.filter(b => b.status === 'pending').length}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Rejected</div>
            <div class="summary-value" style="color: #dc3545;">${bookings.filter(b => b.status === 'rejected').length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest Name</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Room</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Booked On</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map((booking) => `
              <tr>
                <td>${booking.id || 'N/A'}</td>
                <td><strong>${booking.customerName || 'N/A'}</strong></td>
                <td>${booking.checkIn || 'N/A'}</td>
                <td>${booking.checkOut || 'N/A'}</td>
                <td>${booking.numberOfNights || 1}</td>
                <td>${booking.roomName || 'N/A'}</td>
                <td>Rs.${booking.totalPrice || 0}</td>
                <td>
                  <span class="status-${booking.status || 'pending'}">
                    ${(booking.status || 'pending').toUpperCase()}
                  </span>
                </td>
                <td>${booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Report generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>© Sampath Residency - All rights reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;

  downloadPDF(htmlContent, `sampath-residency-bookings-${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Helper function to download PDF using html2pdf library
 * Note: This requires html2pdf to be installed: npm install html2pdf.js
 * As a fallback, we use a simpler method
 */
const downloadPDF = (htmlContent, filename) => {
  // Create a blob from HTML content
  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  // Try to use html2pdf if available, otherwise use a simple method
  if (window.html2pdf) {
    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    window.html2pdf().set(opt).from(element).save();
  } else {
    // Fallback: Use browser's print function
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
};

/**
 * Simple method to print HTML content
 */
export const printBooking = (booking) => {
  const {
    customerName,
    customerEmail,
    phone,
    address,
    roomName,
    checkIn,
    checkOut,
    numberOfNights,
    pricePerNight,
    totalPrice,
    specialRequests,
    bookingId,
  } = booking;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
        h1 { color: #1a3a52; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; color: #666; }
        .value { color: #1a3a52; }
        .price-box { background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .total { font-size: 24px; font-weight: bold; color: #dc3545; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <h1>✓ BOOKING CONFIRMATION</h1>
      <p><span class="label">Booking ID:</span> <span class="value">${bookingId || 'N/A'}</span></p>
      
      <div class="section">
        <h3>Guest Information</h3>
        <p><span class="label">Name:</span> <span class="value">${customerName || 'N/A'}</span></p>
        <p><span class="label">Email:</span> <span class="value">${customerEmail || 'N/A'}</span></p>
        <p><span class="label">Phone:</span> <span class="value">${phone || 'N/A'}</span></p>
        <p><span class="label">Address:</span> <span class="value">${address || 'N/A'}</span></p>
      </div>

      <div class="section">
        <h3>Booking Details</h3>
        <p><span class="label">Room:</span> <span class="value">${roomName || 'N/A'}</span></p>
        <p><span class="label">Check-in:</span> <span class="value">${checkIn || 'N/A'}</span></p>
        <p><span class="label">Check-out:</span> <span class="value">${checkOut || 'N/A'}</span></p>
        <p><span class="label">Nights:</span> <span class="value">${numberOfNights || 1}</span></p>
      </div>

      <div class="price-box">
        <p><span class="label">Price per Night:</span> <span class="value">Rs.${pricePerNight || 0}</span></p>
        <p><span class="label">Number of Nights:</span> <span class="value">${numberOfNights || 1}</span></p>
        <p class="total">Total: Rs.${totalPrice || 0}</p>
      </div>

      ${specialRequests ? `
      <div class="section">
        <h3>Special Requests</h3>
        <p>${specialRequests}</p>
      </div>
      ` : ''}

      <div class="section">
        <p>Contact: sampathresidencyatpalani@gmail.com | 9626380310</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=900,height=600');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};
