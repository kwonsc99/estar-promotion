// utils/storage.js
export const STORAGE_KEYS = {
  CALENDAR_EVENTS: "estar_calendar_events",
  USER_AUTH: "userAuth",
  NOTIFICATION_CONSENT: "notificationConsent",
  CURRENT_DATE: "estar_current_date",
};

// 캘린더 이벤트 관련
export const saveCalendarEvents = (events) => {
  localStorage.setItem(STORAGE_KEYS.CALENDAR_EVENTS, JSON.stringify(events));
};

export const getCalendarEvents = () => {
  try {
    const events = localStorage.getItem(STORAGE_KEYS.CALENDAR_EVENTS);
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error("Error parsing calendar events:", error);
    return [];
  }
};

export const addCalendarEvent = (event) => {
  const events = getCalendarEvents();
  const newEvent = {
    id: Date.now() + Math.random(),
    ...event,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  saveCalendarEvents(events);
  return newEvent;
};

export const removeCalendarEvent = (eventId) => {
  const events = getCalendarEvents();
  const filteredEvents = events.filter((event) => event.id !== eventId);
  saveCalendarEvents(filteredEvents);
};

// 현재 날짜 관리 (테스트용)
export const setCurrentDate = (date) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_DATE, date.toISOString());
};

export const getCurrentDate = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_DATE);
    return saved ? new Date(saved) : new Date();
  } catch (error) {
    return new Date();
  }
};

// 알림 관련
export const sendNotification = (title, message) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "/icon-192.png", // 아이콘이 있다면
      badge: "/badge-72.png",
    });
  }

  // 브라우저 알림이 안될 경우 콘솔 로그
  console.log(`🔔 알림: ${title} - ${message}`);

  // 추가로 화면에 토스트 알림도 표시할 수 있음
  return { title, message, timestamp: new Date().toISOString() };
};
