# Admin Panel Visual Overview

## Login Screen
```
┌─────────────────────────────────────┐
│                                     │
│     Sampath Residency Admin        │
│                                     │
│  ┌──────────────────────────────┐  │
│  │   Password:  ••••••••••     │  │
│  │                              │  │
│  │   [  Login  ]               │  │
│  └──────────────────────────────┘  │
│                                     │
│  Protected Admin Area              │
│                                     │
└─────────────────────────────────────┘
```

**Default Password:** `Sampath@2024`

---

## Admin Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  Sampath Residency Admin  |  Management Panel  [Logout] │
├──────────────────────────────────────────────────────────┤
│  [Inventory]  [Rate]  [Blocking]                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Active Tab Content Here                                 │
│  (Changes based on selected tab)                         │
│                                                           │
│  [Save Button]                                           │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Tab 1: Inventory Management

### Interface
```
┌─────────────────────────────────────────────────────────┐
│ Inventory Management                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Select Date: [2026-01-30]                             │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Room Type        │ Total │ Available │ Qty    │   │
│ ├─────────────────────────────────────────────────┤   │
│ │ Double bed A/C   │  5    │    [5]    │ 5/5   │   │
│ │ Triple Bed A/C   │  5    │    [3]    │ 3/5   │   │
│ │ Four Bed A/C     │  5    │    [2]    │ 2/5   │   │
│ │ Five Bed A/C     │  5    │    [0]    │ 0/5   │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ ✓ Success: Inventory updated!                          │
│                                                         │
│ [Save Inventory]                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Tab 2: Rate Management

### Interface
```
┌─────────────────────────────────────────────────────────┐
│ Rate Management                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Select Date: [2026-01-30]                             │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │ Room Type        │ Default  │ Current │ Status │   │
│ ├─────────────────────────────────────────────────┤   │
│ │ Double bed A/C   │ ₹1800   │ [2500] │        │   │
│ │ Triple Bed A/C   │ ₹2000   │ [2000] │        │   │
│ │ Four Bed A/C     │ ₹2200   │ [2200] │        │   │
│ │ Five Bed A/C     │ ₹2400   │ [2400] │        │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ [Save Rates]                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Tab 3: Room Blocking

### Interface
```
┌──────────────────────────────────────────────────────────┐
│ Room Blocking Management                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ ⚠️  All rooms are blocked!                              │
│     No bookings can be made for this date.              │
│                                                          │
│ Select Date: [2026-01-30]                              │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ Double bed A/C      │  │ Triple Bed A/C      │      │
│  │   [✓] Blocked       │  │   [✓] Blocked       │      │
│  │ Not available       │  │ Not available       │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │ Four Bed A/C        │  │ Five Bed A/C        │      │
│  │   [✓] Blocked       │  │   [✓] Blocked       │      │
│  │ Not available       │  │ Not available       │      │
│  └─────────────────────┘  └─────────────────────┘      │
│                                                          │
│ [Save Changes]                                           │
│                                                          │
│ How Room Blocking Works:                               │
│ • Check box to block room for selected date           │
│ • Blocked rooms won't appear in booking options       │
│ • When all 4 rooms blocked, property is closed        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
ADMIN PANEL (Password Protected)
    ↓
┌─────────────────────────────────┐
│  Admin Makes Changes:           │
│  - Set Inventory                │
│  - Set Rates                    │
│  - Block/Unblock Rooms          │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Browser LocalStorage           │
│  - inventoryData                │
│  - ratesData                    │
│  - blockingData                 │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Booking Page Checks:           │
│  - Is room blocked?             │
│  - Is there inventory?          │
│  - What's the rate today?       │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Customer Sees:                 │
│  - Available Rooms              │
│  - Current Prices               │
│  - "Booked" or "Closed" msg     │
└─────────────────────────────────┘
```

---

## Feature Interactions

### Scenario 1: Normal Availability
```
Inventory: 3 rooms available ✓
Blocked: NO ✓
Rate: ₹1800 ✓
Result: → Customer can book at ₹1800
```

### Scenario 2: Fully Booked
```
Inventory: 0 rooms available ✗
Blocked: NO
Rate: ₹1800
Result: → "No rooms available"
```

### Scenario 3: Room Maintenance
```
Inventory: 5 rooms available ✓
Blocked: YES ✗
Rate: ₹1800
Result: → "This room is blocked"
```

### Scenario 4: Property Closed
```
Inventory: 5 rooms available ✓
Blocked: ALL 4 ROOMS YES ✗
Rate: ₹1800
Result: → "Property is closed" / "All rooms unavailable"
```

### Scenario 5: Peak Season
```
Inventory: 2 rooms available ✓
Blocked: NO ✓
Rate: ₹2800 (custom)
Result: → Customer can book 2 rooms at ₹2800
```

---

## File Organization

```
┌─ src/
│  ├─ pages/
│  │  ├─ AdminPanel.js ...................... Router for admin
│  │  └─ index.js (updated) ................ Export AdminPanel
│  │
│  ├─ components/
│  │  ├─ admin/
│  │  │  ├─ AdminLogin.jsx ................ Login form
│  │  │  ├─ AdminDashboard.jsx ............ Main dashboard
│  │  │  ├─ InventoryManager.jsx ......... Inventory tab
│  │  │  ├─ RateManager.jsx .............. Rate tab
│  │  │  └─ RoomBlockingManager.jsx ...... Blocking tab
│  │  └─ common/
│  │     └─ Header.jsx (to add /admin link)
│  │
│  ├─ utils/
│  │  └─ inventoryUtils.js ............... Helper functions
│  │
│  ├─ css/
│  │  └─ admin.css ....................... Admin styling
│  │
│  └─ App.js (updated) ................... Added /admin route
│
└─ Documentation/
   ├─ ADMIN_SETUP_GUIDE.md ............. Complete guide
   ├─ ADMIN_QUICK_REFERENCE.md ......... Quick reference
   ├─ ADMIN_IMPLEMENTATION_SUMMARY.md .. Summary
   └─ IMPLEMENTATION_EXAMPLES.js ....... Code examples
```

---

## Utility Functions Reference

```javascript
// Check if booking is possible
canBookRoom(roomId, date)
Returns: { canBook: boolean, reason: string }

// Get available rooms for a date
getAvailableRooms(date)
Returns: [1, 3, 4] // Array of room IDs

// Get rate for today
getRateForDate(roomId, date)
Returns: 1800 // Integer

// Check if blocked
isRoomBlocked(roomId, date)
Returns: true/false

// Get available count
getAvailableInventory(roomId, date)
Returns: 3 // Integer

// Check all blocked
areAllRoomsBlocked(date)
Returns: true/false

// Get complete room info
getRoomWithAvailability(roomId, date)
Returns: {
  id: 1,
  name: "Double bed A/C",
  rate: 1800,
  availableRooms: 3,
  isBlocked: false,
  canBook: true,
  bookingReason: "Room is available for booking"
}

// Reduce inventory after booking
reduceInventory(roomId, date, quantity)
Returns: true/false
```

---

## Color Scheme

| Color | Use |
|-------|-----|
| Purple (#667eea) | Primary - Buttons, active tabs, headers |
| Dark (#333) | Text, titles |
| Green (#28a745) | Success messages |
| Red (#dc3545) | Blocked rooms, errors |
| Gray (#999) | Secondary text, disabled |
| Light Gray (#f5f7fa) | Background |
| White | Cards, content areas |

---

## User Journey

```
Visitor Website
    ↓
Click "Book Room"
    ↓
Select Date & Room
    ↓
System Checks:
  ├─ Is room blocked?
  ├─ How many available?
  ├─ What's the rate?
    ↓
Show Room (or "Unavailable")
    ↓
Complete Booking / Close Property
```

---

## Admin Control Flow

```
Admin Logs In → Dashboard
                ↓
                ├→ Inventory Management
                │   ├─ Select Date
                │   ├─ Set Available Count
                │   └─ Save
                │
                ├→ Rate Management
                │   ├─ Select Date
                │   ├─ Set Price
                │   └─ Save
                │
                └→ Room Blocking
                    ├─ Select Date
                    ├─ Check/Uncheck Blocks
                    └─ Save
                ↓
            Data Saved to Browser
                ↓
            Booking Page Uses Data
```

---

## Status Indicators

### Room Card States
```
✓ AVAILABLE          ✗ BLOCKED           ✗ NO INVENTORY
Green badge          Red badge           Gray badge
Can be booked        Cannot be booked    Cannot be booked
```

### Success Messages
```
✓ Inventory updated successfully!
✓ Rates updated successfully!
✓ Room blocking updated successfully!
```

### Alert Messages
```
⚠️ All rooms are blocked!
   No bookings can be made for this date.
```

---

**Status:** ✅ Complete and Ready  
**Date:** January 30, 2026  
**Version:** 1.0
