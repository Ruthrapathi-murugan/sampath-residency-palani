# Admin Panel Setup Guide - Sampath Residency

## Overview
The admin panel has been integrated into your Sampath Residency website with the following features:
- **Password-Protected Access** - Only authorized admin can login
- **Inventory Management** - Manage room availability by date
- **Rate Management** - Set dynamic pricing for rooms by date
- **Room Blocking** - Block specific rooms on specific dates
- **Auto-Blocking** - When all rooms are blocked, the property is closed

---

## How to Access Admin Panel

### Step 1: Navigate to Admin Panel
Go to: `http://localhost:3000/admin` (or your deployed URL + `/admin`)

### Step 2: Login with Password
**Default Admin Password:** `Sampath@2024`

> **Important:** Change this password immediately for security! See "Changing the Admin Password" section below.

---

## Features Explained

### 1. **Inventory Management**
Manage how many rooms are available for each room type on specific dates.

**How to Use:**
- Select a date using the date picker
- For each room type, enter the number of available rooms (0-5)
- Click "Save Inventory"

**Example:**
- If you set "Double bed A/C" to 3 rooms available on 15th Jan, only 3 customers can book this room type on that date
- When all inventory is sold, set to 0 to block new bookings

---

### 2. **Rate Management**
Set dynamic pricing for different dates and seasons.

**How to Use:**
- Select a date
- For each room type, enter a custom rate in rupees
- Default rates are shown for reference
- Click "Save Rates"

**Example:**
- Default rate for "Double bed A/C" = ₹1800
- For peak season (festival dates), you can set it to ₹2500
- For off-season, you can set it to ₹1500

---

### 3. **Room Blocking**
Temporarily block rooms from being booked without changing rates or inventory.

**How to Use:**
- Select a date
- Check the checkbox for any room you want to block
- Click "Save Changes"

**Scenarios:**
- Room under maintenance → Block the room
- All rooms blocked for a date → Property is closed that day
- Blocked rooms won't appear in booking options

---

## Data Storage

All admin data is stored in **browser's localStorage**:
- `inventoryData` - Room availability by date
- `ratesData` - Room rates by date
- `blockingData` - Room blocking status by date
- `adminToken` - Session token for login

> **Note:** Data persists across browser sessions but will be lost if user clears browser data/cache.

---

## How It Works in Booking System

Once you implement inventory checks in your booking page, the system will:

1. **Check if room is blocked** → Cannot book if blocked
2. **Check available inventory** → Cannot book if no rooms available
3. **Apply dynamic rate** → Show custom rate if set for that date
4. **Check all rooms blocked** → Show "Property Closed" message

---

## Integration Guide

### For Your Booking Page

Add these imports to your booking page:

```javascript
import {
  getAvailableInventory,
  getRateForDate,
  isRoomBlocked,
  areAllRoomsBlocked,
  getAvailableRooms,
  canBookRoom,
} from "../utils/inventoryUtils";
```

### Example: Check if room can be booked

```javascript
// In your booking component
const selectedDate = "2024-01-15";
const roomId = 1; // Double bed A/C

const bookingStatus = canBookRoom(roomId, selectedDate);

if (bookingStatus.canBook) {
  // Show booking form
  const rate = getRateForDate(roomId, selectedDate);
  console.log(`Rate for this room: ₹${rate}`);
} else {
  // Show error message
  console.log(bookingStatus.reason);
}
```

### Example: Get only available rooms for a date

```javascript
const selectedDate = "2024-01-15";
const availableRoomIds = getAvailableRooms(selectedDate);
// availableRoomIds = [1, 3, 4] (only rooms 1, 3, 4 are available)
```

---

## Changing the Admin Password

### Method 1: Direct Edit (For Development)
1. Open `src/components/admin/AdminLogin.jsx`
2. Find line with `const ADMIN_PASSWORD = "Sampath@2024";`
3. Change to your desired password
4. Rebuild and redeploy

### Method 2: Environment Variable (Recommended)
1. Create `.env` file in your project root:
```
REACT_APP_ADMIN_PASSWORD=YourNewPassword123
```

2. Update `AdminLogin.jsx`:
```javascript
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "Sampath@2024";
```

---

## Important Notes

### Security Considerations
- ⚠️ **Password is stored in frontend code** - Not ideal for production
- 🔐 For production, implement backend authentication
- 🔒 Use HTTPS to encrypt password transmission
- 💾 Don't commit `.env` file with real password to Git

### Data Backup
- Regularly export your admin data before clearing browser cache
- Keep backups of important inventory/rate configurations

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses localStorage - works offline until changes are synced

---

## Future Enhancements

Consider implementing:
1. **Backend API** - Store data on server instead of localStorage
2. **Database Integration** - Persistent data storage
3. **Analytics Dashboard** - View booking trends and revenue
4. **Email Notifications** - Get alerts for blocks/changes
5. **User Management** - Multiple admin accounts
6. **Audit Trail** - Track all admin actions
7. **Bulk Operations** - Block/Update multiple dates at once
8. **API Integration** - Connect with payment gateways

---

## Troubleshooting

### Can't login to admin panel
- Check password spelling (case-sensitive)
- Clear browser cache and try again
- Check console (F12) for any error messages

### Changes not saving
- Check browser localStorage is enabled
- Ensure localStorage quota not exceeded
- Try a different browser

### Rooms not blocked/available
- Make sure you clicked "Save" buttons
- Check if you're looking at the correct date
- Refresh page to load latest data

---

## File Structure

```
src/
├── pages/
│   └── AdminPanel.js               # Main admin page
├── components/admin/
│   ├── AdminLogin.jsx              # Login form
│   ├── AdminDashboard.jsx          # Main dashboard
│   ├── InventoryManager.jsx        # Inventory tab
│   ├── RateManager.jsx             # Rate management tab
│   └── RoomBlockingManager.jsx     # Room blocking tab
├── utils/
│   └── inventoryUtils.js           # Utility functions
└── css/
    └── admin.css                   # Admin styles
```

---

## Support

For issues or questions:
1. Check this guide first
2. Review the code comments
3. Check browser console for errors (F12)
4. Contact development team

---

**Last Updated:** January 2026
