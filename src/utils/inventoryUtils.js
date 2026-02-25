// Utility file for managing inventory, rates, and room blocking data

/**
 * Get available inventory for a specific room on a specific date
 * @param {number} roomId - Room ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number} Available rooms count
 */
export const getAvailableInventory = (roomId, date) => {
  const inventoryData = JSON.parse(
    localStorage.getItem("inventoryData") || "{}"
  );
  const dayInventory = inventoryData[date] || {};
  
  // Default inventory if not set
  const defaultInventory = {
    1: 5,
    2: 5,
    3: 5,
    4: 5,
  };

  return dayInventory[roomId] !== undefined
    ? dayInventory[roomId]
    : defaultInventory[roomId] || 0;
};

/**
 * Get rate for a specific room on a specific date
 * @param {number} roomId - Room ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {number} Room rate in rupees
 */
export const getRateForDate = (roomId, date) => {
  const ratesData = JSON.parse(localStorage.getItem("ratesData") || "{}");
  const dayRates = ratesData[date] || {};

  // Default rates if not set
  const defaultRates = {
    1: 1800,
    2: 2000,
    3: 2200,
    4: 2400,
  };

  return dayRates[roomId] !== undefined
    ? dayRates[roomId]
    : defaultRates[roomId] || 0;
};

/**
 * Check if a room is blocked on a specific date
 * @param {number} roomId - Room ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {boolean} True if blocked, false if available
 */
export const isRoomBlocked = (roomId, date) => {
  const blockingData = JSON.parse(
    localStorage.getItem("blockingData") || "{}"
  );
  const dayBlocking = blockingData[date] || {};

  return dayBlocking[roomId] || false;
};

/**
 * Check if all rooms are blocked on a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {boolean} True if all rooms are blocked
 */
export const areAllRoomsBlocked = (date) => {
  const roomIds = [1, 2, 3, 4];
  return roomIds.every((roomId) => isRoomBlocked(roomId, date));
};

/**
 * Get all available rooms for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {array} Array of available room IDs
 */
export const getAvailableRooms = (date) => {
  const roomIds = [1, 2, 3, 4];
  return roomIds.filter((roomId) => {
    const isBlocked = isRoomBlocked(roomId, date);
    const hasInventory = getAvailableInventory(roomId, date) > 0;
    return !isBlocked && hasInventory;
  });
};

/**
 * Check if a specific room can be booked on a specific date
 * @param {number} roomId - Room ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {object} Object with canBook boolean and reason string
 */
export const canBookRoom = (roomId, date) => {
  if (isRoomBlocked(roomId, date)) {
    return {
      canBook: false,
      reason: "This room is blocked for the selected date",
    };
  }

  if (getAvailableInventory(roomId, date) <= 0) {
    return {
      canBook: false,
      reason: "No rooms available for the selected date",
    };
  }

  return {
    canBook: true,
    reason: "Room is available for booking",
  };
};

/**
 * Update inventory after a booking
 * @param {number} roomId - Room ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} quantity - Number of rooms to reduce inventory by
 */
export const reduceInventory = (roomId, date, quantity = 1) => {
  const current = getAvailableInventory(roomId, date);
  if (current >= quantity) {
    const inventoryData = JSON.parse(
      localStorage.getItem("inventoryData") || "{}"
    );
    inventoryData[date] = inventoryData[date] || {};
    inventoryData[date][roomId] = current - quantity;
    localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
    return true;
  }
  return false;
};

/**
 * Get room details with availability status
 * @param {number} roomId - Room ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {object} Room details with availability info
 */
export const getRoomWithAvailability = (roomId, date) => {
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

  return {
    id: roomId,
    name: roomNames[roomId],
    description: roomDescriptions[roomId] || "Comfortable room with air conditioning",
    image: roomImages[roomId] || "/assets/img/room-default.jpg",
    rate: getRateForDate(roomId, date),
    availableRooms: getAvailableInventory(roomId, date),
    isBlocked: isRoomBlocked(roomId, date),
    canBook: canBookRoom(roomId, date).canBook,
    bookingReason: canBookRoom(roomId, date).reason,
  };
};
