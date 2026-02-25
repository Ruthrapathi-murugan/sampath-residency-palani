/**
 * CLEAR TEST DATA
 * 
 * Run this in browser console to clear all test blocking/inventory data
 * This will allow all rooms to be bookable again
 * 
 * Steps:
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Copy and paste the code below
 * 4. Press Enter
 * 5. Refresh the page
 */

// Clear all admin test data
localStorage.removeItem('blockingData');
localStorage.removeItem('inventoryData');
localStorage.removeItem('ratesData');
localStorage.removeItem('adminToken');

console.log("✅ All admin test data cleared!");
console.log("Cleared: blockingData, inventoryData, ratesData, adminToken");
console.log("All rooms are now available for booking");
