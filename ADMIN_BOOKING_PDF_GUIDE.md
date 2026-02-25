# Admin Booking PDF Download Feature

## Overview
Admin users can now download individual booking details as PDF with a single click from the Bookings table.

---

## How to Use

### Step 1: Go to Admin Dashboard
- Login to admin panel
- Navigate to **Bookings** section

### Step 2: View All Bookings
The table displays all bookings with:
- Guest name
- Check-in/Check-out dates
- Room category
- Total price and nights count
- Status badge

### Step 3: Download Individual Booking PDF
Each booking row has an **"📥 PDF"** button in the Actions column.

**Click the "📥 PDF" button** to download a detailed PDF of that booking.

---

## What's Included in Individual Booking PDF

### Header
- ✅ "BOOKING CONFIRMATION" title
- ✅ Sampath Residency branding
- ✅ Booking ID

### Guest Information
- Full Name
- Email Address
- Phone Number
- Address

### Booking Details
- Check-in Date
- Check-out Date
- Room Category
- Number of Nights

### Pricing Information
- **Price per Night** (e.g., Rs. 1800)
- **Number of Nights** (e.g., 3)
- **Total Price** (highlighted in purple gradient box)
  - Formula: Price per Night × Number of Nights
  - Example: Rs. 1800 × 3 = Rs. 5400

### Special Requests
If guest added special requests, they appear in a green-bordered box.

### Hotel Contact Info
- Email: sampathresidencyatpalani@gmail.com
- Phone: 9626380310

### Footer
- Generation timestamp
- Hotel copyright notice

---

## PDF Features

✅ **Professional Design**
- Color-coded sections
- Gradient backgrounds
- Clear typography
- Print-friendly layout

✅ **Complete Information**
- All booking details on one page
- No missing information
- Guest details included
- Pricing breakdown shown

✅ **Easy Download**
- PDF downloads automatically
- Filename: `booking-{bookingId}.pdf`
- Can be shared or archived

✅ **Printable**
- Optimized for printing
- All colors print correctly
- Information stays organized

---

## Buttons in Actions Column

| Button | Action |
|--------|--------|
| ✅ Approve | Approve pending booking and send approval email |
| ❌ Reject | Reject pending booking with optional reason |
| 📥 PDF | **Download individual booking details as PDF** |
| 🗑️ Delete | Delete the booking from system |

---

## Example PDF Download

**Scenario:** Admin wants PDF of booking "bk_1707331200000"

1. Find the booking in the table
2. Click the "📥 PDF" button in that row
3. File downloads: `booking-bk_1707331200000.pdf`
4. PDF contains all details:
   - Guest: John Doe
   - Dates: Feb 10 to Feb 13, 2026
   - Room: Double bed A/C
   - Total: Rs. 5400 (3 nights × Rs. 1800/night)
   - Status: Approved
   - Contact info included

---

## Key Features

### Individual Booking PDF
- Click the "📥 PDF" button on any booking row
- Downloads detailed PDF of that single booking
- Perfect for:
  - Archiving specific bookings
  - Sharing with guests
  - Printing for records
  - Email attachments

### All Bookings PDF
- Click "Download All as PDF" button at the top
- Downloads complete report of all bookings
- Perfect for:
  - Monthly reports
  - Revenue analysis
  - Complete audit trail
  - Business records

---

## File Names

**Individual Booking:** `booking-{bookingId}.pdf`
- Example: `booking-bk_1707331200000.pdf`

**All Bookings:** `sampath-residency-bookings-{YYYY-MM-DD}.pdf`
- Example: `sampath-residency-bookings-2026-02-07.pdf`

---

## Browser Compatibility

✅ Chrome
✅ Firefox
✅ Safari
✅ Edge
✅ All modern browsers

---

## Troubleshooting

### PDF doesn't download
- Check if popup blocker is enabled
- Try a different browser
- Clear browser cache and try again

### PDF looks different on different computers
- PDFs are designed to display consistently
- Print settings may vary by printer
- Use "Print to PDF" for consistent output

### Special characters not showing
- PDFs support all Indian languages
- Characters display correctly on most readers
- Adobe Reader or Chrome PDF viewer recommended

---

## Tips

1. **Archive Bookings:** Download PDF immediately after booking confirmation
2. **Share with Guests:** Download and email PDF to guest
3. **Record Keeping:** Store PDFs in organized folder structure
4. **Bulk Download:** Use "Download All as PDF" monthly for records
5. **Print Copies:** Download then print for physical file storage

---

## Data Included in PDF

All information from booking form:
- ✅ Customer details (name, email, phone, address)
- ✅ Room category
- ✅ Check-in and check-out dates
- ✅ Number of nights (calculated)
- ✅ Price per night
- ✅ Total price (calculated: nights × price)
- ✅ Special requests
- ✅ Hotel contact information
- ✅ Booking ID and timestamp
