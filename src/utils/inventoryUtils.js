// Utility file for managing inventory, rates, and room blocking data
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { roomItems } from "../components/data/Data";

// Keep an in-memory cache to sync components faster after an initial load if needed,
// but since we want true cloud, fetching directly is safer.

/**
 * Helper to fetch daily data from Firestore for a specific date
 */
const getDailyData = async (date) => {
  if (!db) return {}; // Fallback if firebase init failed
  try {
    const docRef = doc(db, "dailyData", date);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error fetching daily data:", error);
  }
  return {};
};

/**
 * Get available inventory for a specific room on a specific date (Async)
 */
export const getAvailableInventoryAsync = async (roomId, date) => {
  const dailyData = await getDailyData(date);
  const dayInventory = dailyData.inventory || {};

  const defaultInventory = { 1: 5, 2: 5, 3: 5, 4: 5 };

  return dayInventory[roomId] !== undefined
    ? dayInventory[roomId]
    : defaultInventory[roomId] || 0;
};

/**
 * Get rate for a specific room on a specific date (Async)
 */
export const getRateForDateAsync = async (roomId, date) => {
  const dailyData = await getDailyData(date);
  const dayRates = dailyData.rates || {};

  const item = roomItems.find(r => r.id === roomId);
  const defaultRate = item ? item.priceNumeric : 0;

  return dayRates[roomId] !== undefined
    ? dayRates[roomId]
    : defaultRate;
};

/**
 * Check if a room is blocked on a specific date (Async)
 */
export const isRoomBlockedAsync = async (roomId, date) => {
  const dailyData = await getDailyData(date);
  const dayBlocking = dailyData.blocking || {};
  return dayBlocking[roomId] || false;
};

/**
 * Get all available rooms for a specific date (Async)
 */
export const getAvailableRoomsAsync = async (date) => {
  const dailyData = await getDailyData(date);
  const dayBlocking = dailyData.blocking || {};
  const dayInventory = dailyData.inventory || {};
  const defaultInventory = { 1: 5, 2: 5, 3: 5, 4: 5 };

  const roomIds = [1, 2, 3, 4];
  return roomIds.filter((roomId) => {
    const isBlocked = dayBlocking[roomId] || false;
    const inv = dayInventory[roomId] !== undefined ? dayInventory[roomId] : (defaultInventory[roomId] || 0);
    return !isBlocked && inv > 0;
  });
};

/**
 * Update inventory after a booking (Async)
 */
export const reduceInventoryAsync = async (roomId, date, quantity = 1) => {
  const current = await getAvailableInventoryAsync(roomId, date);
  if (current >= quantity) {
    try {
      const docRef = doc(db, "dailyData", date);
      const newInv = current - quantity;

      // We use setDoc with merge: true to avoid overwriting rates/blocking when just updating inventory
      await setDoc(docRef, {
        inventory: {
          [roomId]: newInv
        }
      }, { merge: true });
      return true;
    } catch (e) {
      console.error("Failed to reduce inventory in Firestore:", e);
      return false;
    }
  }
  return false;
};

/**
 * Get room details with availability status (Async)
 */
export const getRoomWithAvailabilityAsync = async (roomId, date, dailyData = null) => {
  // If dailyData is passed in to save redundant network calls
  let dataToUse = dailyData;
  if (!dataToUse) {
    dataToUse = await getDailyData(date);
  }

  const dayInventory = dataToUse?.inventory || {};
  const dayRates = dataToUse?.rates || {};
  const dayBlocking = dataToUse?.blocking || {};

  const defaultInventory = { 1: 5, 2: 5, 3: 5, 4: 5 };
  const item = roomItems.find(r => r.id === roomId);
  const defaultRate = item ? item.priceNumeric : 0;

  const currentInventory = dayInventory[roomId] !== undefined ? dayInventory[roomId] : (defaultInventory[roomId] || 0);
  const currentRate = dayRates[roomId] !== undefined ? dayRates[roomId] : defaultRate;
  const isBlocked = dayBlocking[roomId] || false;

  const roomNames = {
    1: "Double bed A/C",
    2: "Triple Bed A/C",
    3: "Four Bed A/C",
    4: "Five Bed A/C",
  };

  const roomImages = {
    1: "/assets/img/room-1.jpg",
    2: "/assets/img/room-2.jpg",
    3: "/assets/img/room-3.jpg",
    4: "/assets/img/room-3.jpg",
  };

  const roomDescriptions = {
    1: "Comfortable room with double bed, perfect for couples",
    2: "Spacious room with triple bed, ideal for small families",
    3: "Roomy accommodation with four bed, great for groups",
    5: "Luxurious room with five bed, perfect for large families",
  };

  let canBook = true;
  let reason = "Room is available for booking";
  if (isBlocked) {
    canBook = false;
    reason = "This room is blocked for the selected date";
  } else if (currentInventory <= 0) {
    canBook = false;
    reason = "No rooms available for the selected date";
  }

  return {
    id: roomId,
    name: roomNames[roomId],
    description: roomDescriptions[roomId] || "Comfortable room with air conditioning",
    image: roomImages[roomId] || "/assets/img/room-default.jpg",
    rate: currentRate,
    availableRooms: currentInventory,
    isBlocked: isBlocked,
    canBook: canBook,
    bookingReason: reason,
  };
};

// --- SYNCHRONOUS FALLBACKS FOR LEGACY ADMIN COMPONENTS (Will be refactored next) ---
// These read from local storage just to prevent the app from instantly crashing 
// while we refactor the components one by one.

export const getAvailableInventory = (roomId, date) => {
  const inventoryData = JSON.parse(localStorage.getItem("inventoryData") || "{}");
  const dayInventory = inventoryData[date] || {};
  const defaultInventory = { 1: 5, 2: 5, 3: 5, 4: 5 };
  return dayInventory[roomId] !== undefined ? dayInventory[roomId] : defaultInventory[roomId] || 0;
};

export const getRateForDate = (roomId, date) => {
  const ratesData = JSON.parse(localStorage.getItem("ratesData") || "{}");
  const dayRates = ratesData[date] || {};
  const item = roomItems.find(r => r.id === roomId);
  const defaultRate = item ? item.priceNumeric : 0;
  return dayRates[roomId] !== undefined ? dayRates[roomId] : defaultRate;
};

export const isRoomBlocked = (roomId, date) => {
  const blockingData = JSON.parse(localStorage.getItem("blockingData") || "{}");
  return (blockingData[date] || {})[roomId] || false;
};
