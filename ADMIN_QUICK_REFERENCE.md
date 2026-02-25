# Admin Panel Quick Reference Card

## Access Admin Panel
**URL:** `http://localhost:3000/admin`  
**Password:** `Sampath@2024`

---

## Three Main Tabs

### 1. 📦 Inventory Management
**What:** Control how many rooms are available each day  
**How:**
1. Pick a date
2. Set available rooms (0-5) for each type
3. Click "Save Inventory"

**Example:** If you have 5 Double bed rooms but 3 are booked, set it to 2

---

### 2. 💰 Rate Management  
**What:** Set different prices for different dates  
**How:**
1. Pick a date
2. Enter price for each room type
3. Click "Save Rates"

**Example:** 
- Off-season: ₹1500
- Normal: ₹1800
- Peak season: ₹2500

---

### 3. 🔒 Room Blocking
**What:** Block rooms from being booked  
**How:**
1. Pick a date
2. Check box to block a room
3. Click "Save Changes"

**Example:** Block "Four Bed A/C" for maintenance on Jan 20

---

## Important Passwords & Info

| Item | Value |
|------|-------|
| Admin Login URL | `/admin` |
| Admin Password | `Sampath@2024` |
| Change Password File | `src/components/admin/AdminLogin.jsx` (line 11) |
| Data Storage | Browser localStorage |

---

## Room Types

```
1. Double bed A/C      (Default: ₹1800/night)
2. Triple Bed A/C      (Default: ₹2000/night)
3. Four Bed A/C        (Default: ₹2200/night)
4. Five Bed A/C        (Default: ₹2400/night)
```

---

## What Happens When...

### All Rooms Blocked?
→ Property shows as "Closed" for that date  
→ Customers cannot make any bookings

### No Inventory?
→ Room shows as unavailable  
→ Cannot be booked until inventory is added

### Custom Rate Set?
→ Customers see the new rate on that date  
→ Default rate is used if no custom rate set

### Room is Blocked?
→ Room disappears from booking options  
→ Not affected by inventory

---

## Quick Tasks

### Change Password
1. Open: `src/components/admin/AdminLogin.jsx`
2. Find: `const ADMIN_PASSWORD = "Sampath@2024";`
3. Change to: `const ADMIN_PASSWORD = "NewPassword";`
4. Restart server: `npm start`

### Set Peak Season Rates
1. Go to Rate Management
2. Select peak dates
3. Set higher prices (e.g., ₹2500)
4. Click Save

### Block Room for Cleaning
1. Go to Room Blocking
2. Select cleaning date
3. Check the room you're cleaning
4. Click Save

### Handle Overbooking
1. Go to Inventory Management
2. Select the date
3. Reduce available rooms count
4. Click Save

---

## Data Persistence

✅ All changes are saved to browser localStorage  
✅ Data persists when you close and reopen browser  
✅ Data is lost if browser cache is cleared  

**Backup Tip:** Take screenshots of your settings periodically

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login | Check password spelling (case-sensitive) |
| Changes not saving | Click the "Save" button after changes |
| Wrong date | Check calendar - make sure correct date selected |
| Password not working | Restart server after changing password file |

---

## Integration for Developers

### Check if room can be booked:
```javascript
import { canBookRoom } from "../utils/inventoryUtils";

const status = canBookRoom(roomId, date);
if (status.canBook) {
  // Show booking form
}
```

### Get available rooms for a date:
```javascript
import { getAvailableRooms } from "../utils/inventoryUtils";

const rooms = getAvailableRooms(selectedDate);
// [1, 3, 4] = only these 3 rooms available
```

### Get current rate:
```javascript
import { getRateForDate } from "../utils/inventoryUtils";

const price = getRateForDate(roomId, date);
// ₹2500
```

---

## Files to Know

| File | Purpose |
|------|---------|
| `src/pages/AdminPanel.js` | Main admin page |
| `src/components/admin/` | Admin components |
| `src/utils/inventoryUtils.js` | Helper functions |
| `src/css/admin.css` | Admin styling |
| `ADMIN_SETUP_GUIDE.md` | Complete guide |
| `IMPLEMENTATION_EXAMPLES.js` | Code examples |

---

## Before Going Live

- [ ] Change admin password
- [ ] Test all three tabs work
- [ ] Integrate with booking page
- [ ] Test blocking - all rooms blocked = property closed
- [ ] Test rates display correctly
- [ ] Test inventory restrictions
- [ ] Train staff on admin panel
- [ ] Document your pricing strategy

---

## Need Help?

📖 Read: `ADMIN_SETUP_GUIDE.md` (complete guide)  
💻 See: `IMPLEMENTATION_EXAMPLES.js` (code samples)  
🔧 Check: `src/utils/inventoryUtils.js` (all functions)  

---

**Status:** ✅ Ready to Use  
**Last Updated:** January 30, 2026
