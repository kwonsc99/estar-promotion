"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
  isBefore,
  subDays,
  addDays,
  isWithinInterval,
} from "date-fns";
import { ko } from "date-fns/locale";
import {
  getCalendarEvents,
  addCalendarEvent,
  removeCalendarEvent,
} from "../../utils/storage";

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedEvents, setBlockedEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [blockDays, setBlockDays] = useState(3); // N일 설정 (기본값 3일)
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("userAuth");
    const notification = localStorage.getItem("notificationConsent");

    if (!auth || !notification) {
      router.push("/auth");
      return;
    }

    const savedEvents = getCalendarEvents();
    const importantEvents = savedEvents.filter(
      (event) => event.type === "important"
    );
    setBlockedEvents(importantEvents);
    setIsLoaded(true);
  }, [router]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // 여행 불가능한 날짜 계산 (중요한 일정 + N일 전후)
  const getBlockedDateRanges = () => {
    const ranges = [];
    blockedEvents.forEach((event) => {
      const eventDate = parseISO(event.date);
      const blockDaysBefore = event.blockDays || 3;
      const startBlocked = subDays(eventDate, blockDaysBefore);
      const endBlocked = eventDate;

      ranges.push({
        start: startBlocked,
        end: endBlocked,
        event: event,
      });
    });
    return ranges;
  };

  // 해당 날짜가 여행 불가능한 날인지 확인
  const isBlockedDate = (date) => {
    const blockedRanges = getBlockedDateRanges();
    return blockedRanges.some((range) =>
      isWithinInterval(date, { start: range.start, end: range.end })
    );
  };

  // 해당 날짜가 여행 가능한 날인지 확인
  const isAvailableDate = (date) => {
    return (
      !isBlockedDate(date) && !isBefore(date, new Date().setHours(0, 0, 0, 0))
    );
  };

  // 특정 날짜의 이벤트 정보 가져오기
  const getEventInfoForDate = (date) => {
    const blockedRanges = getBlockedDateRanges();
    const matchingRange = blockedRanges.find((range) =>
      isWithinInterval(date, { start: range.start, end: range.end })
    );

    if (matchingRange) {
      const eventDate = parseISO(matchingRange.event.date);
      const isEventDay = isSameDay(date, eventDate);
      const daysUntilEvent =
        Math.abs(eventDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

      return {
        isEventDay,
        daysUntilEvent: Math.round(daysUntilEvent),
        event: matchingRange.event,
      };
    }
    return null;
  };

  const handleDateClick = (date) => {
    if (isBefore(date, new Date().setHours(0, 0, 0, 0))) {
      return;
    }

    setSelectedDate(date);

    const eventInfo = getEventInfoForDate(date);
    if (eventInfo) {
      if (eventInfo.isEventDay) {
        // 중요한 일정 당일이면 삭제 옵션
        if (
          window.confirm(`"${eventInfo.event.title}" 일정을 삭제하시겠습니까?`)
        ) {
          handleRemoveEvent(eventInfo.event.id);
        }
      } else {
        // N일 전 기간이면 정보 표시
        alert(
          `${eventInfo.event.title} 일정 ${eventInfo.daysUntilEvent}일 전이므로 여행이 불가능합니다.`
        );
      }
    } else {
      // 여행 가능일이면 중요한 일정 추가 모달
      setShowEventModal(true);
    }
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim() || !selectedDate) return;

    const newEvent = addCalendarEvent({
      title: eventTitle,
      date: selectedDate.toISOString(),
      type: "important",
      blockDays: blockDays, // N일 설정 저장
    });

    setBlockedEvents([...blockedEvents, newEvent]);
    setEventTitle("");
    setBlockDays(3);
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const handleRemoveEvent = (eventId) => {
    removeCalendarEvent(eventId);
    setBlockedEvents(blockedEvents.filter((event) => event.id !== eventId));
  };

  const handleNext = () => {
    const allEvents = [];

    // 중요한 일정들 추가
    blockedEvents.forEach((event) => {
      allEvents.push(event);
    });

    // 향후 60일간의 여행 가능일들 저장
    for (let i = 0; i < 60; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);

      if (isAvailableDate(futureDate)) {
        allEvents.push({
          id: `available_${futureDate.toISOString()}`,
          title: "여행 가능일",
          date: futureDate.toISOString(),
          type: "available",
          autoGenerated: true,
        });
      }
    }

    localStorage.setItem("estar_calendar_events", JSON.stringify(allEvents));

    localStorage.setItem(
      "calendarConsent",
      JSON.stringify({
        agreed: true,
        timestamp: Date.now(),
        blockedEvents: blockedEvents.length,
        availableDays: allEvents.filter((e) => e.type === "available").length,
      })
    );

    router.push("/test");
  };

  // 통계 계산
  const totalDaysInMonth = calendarDays.filter((day) =>
    isSameMonth(day, currentDate)
  ).length;
  const blockedDaysInMonth = calendarDays.filter(
    (day) => isSameMonth(day, currentDate) && isBlockedDate(day)
  ).length;
  const availableDaysInMonth = calendarDays.filter(
    (day) => isSameMonth(day, currentDate) && isAvailableDate(day)
  ).length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📅</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
            스케줄 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <span className="text-green-600 dark:text-green-400 font-semibold">
              기본적으로 모든 날이 여행 가능일
            </span>
            입니다
            <br />
            중요한 일정과 여행 불가 기간을 설정해주세요!
          </p>
        </div>

        {/* 안내 카드 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-6 mb-8 animate-scale-in">
          <h3 className="font-bold text-green-800 dark:text-green-400 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            스마트 여행 알림 시스템
          </h3>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-2">
            <li>
              🟢 <strong>여행 가능일:</strong> 특가 알림 발송 (3일 전)
            </li>
            <li>
              🔴 <strong>여행 불가일:</strong> 중요 일정 + N일 전까지
            </li>
            <li>
              ⚙️ <strong>맞춤 설정:</strong> 일정별로 여행 불가 기간 조정 가능
            </li>
          </ul>
        </div>

        {/* 이번 달 통계 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-center">
            {format(currentDate, "M월", { locale: ko })} 여행 가능도
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="text-xl font-black text-gray-600 dark:text-gray-400">
                {totalDaysInMonth}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                총 일수
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="text-xl font-black text-red-600 dark:text-red-400">
                {blockedDaysInMonth}
              </div>
              <div className="text-xs text-red-500 dark:text-red-400">
                여행불가
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-xl font-black text-green-600 dark:text-green-400">
                {availableDaysInMonth}
              </div>
              <div className="text-xs text-green-500 dark:text-green-400">
                여행가능
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>여행 가능도</span>
              <span>
                {Math.round((availableDaysInMonth / totalDaysInMonth) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(availableDaysInMonth / totalDaysInMonth) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* 캘린더 카드 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8 animate-scale-in">
          {/* 캘린더 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={goToPreviousMonth}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              ←
            </button>

            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {format(currentDate, "yyyy년 M월", { locale: ko })}
            </h2>

            <button
              onClick={goToNextMonth}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              →
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isBlocked = isBlockedDate(day);
              const isAvailable = isAvailableDate(day);
              const isPast = isBefore(day, new Date().setHours(0, 0, 0, 0));
              const eventInfo = getEventInfoForDate(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                  className={`
                    aspect-square p-1 rounded-lg text-xs font-medium transition-all duration-200 relative
                    ${
                      !isSameMonth(day, currentDate)
                        ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                        : ""
                    }
                    ${
                      isPast
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                        : "hover:scale-105"
                    }
                    ${
                      isToday(day) && !isPast
                        ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800"
                        : ""
                    }
                    ${
                      eventInfo?.isEventDay
                        ? "bg-red-200 dark:bg-red-800/50 text-red-800 dark:text-red-200 border-2 border-red-400 dark:border-red-600 font-bold"
                        : ""
                    }
                    ${
                      isBlocked && !eventInfo?.isEventDay
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-600"
                        : ""
                    }
                    ${
                      isAvailable
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600 hover:bg-green-200 dark:hover:bg-green-800/40"
                        : ""
                    }
                    ${
                      !isBlocked && !isAvailable && !isPast
                        ? "text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        : ""
                    }
                  `}
                >
                  {format(day, "d")}

                  {/* 추가 정보 표시 */}
                  {eventInfo && !eventInfo.isEventDay && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      -{eventInfo.daysUntilEvent}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 범례 */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 mb-8 space-y-3">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">
            📖 캘린더 범례
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                여행 가능일 (특가 알림 발송)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-800/50 border-2 border-red-400 dark:border-red-600 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                중요한 일정 (클릭하여 삭제)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-600 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                여행 불가 기간 (N일 전)
              </span>
            </div>
          </div>
        </div>

        {/* 등록된 중요 일정 목록 */}
        {blockedEvents.length > 0 && (
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <span className="mr-2">📋</span>
              등록된 중요 일정
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {blockedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-red-800 dark:text-red-300">
                        {event.title}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {format(parseISO(event.date), "M월 d일 (E)", {
                          locale: ko,
                        })}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                        📍 {event.blockDays || 3}일 전부터 여행 불가
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveEvent(event.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors font-bold text-lg ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          className="w-full py-5 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 mb-4"
        >
          완료하고 다음으로 🚀
        </button>

        <button
          onClick={() => router.back()}
          className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          ← 이전으로
        </button>
      </div>

      {/* 중요 일정 추가 모달 - N일 설정 추가 */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-scale-in border-2 border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              중요 일정 추가
            </h3>

            <div className="mb-6">
              <p className="text-center text-gray-700 dark:text-gray-200 mb-4 font-medium text-lg">
                {selectedDate &&
                  format(selectedDate, "M월 d일 (E)", { locale: ko })}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                  일정 제목
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="예: 회사 면접, 중요한 시험"
                  className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-500 rounded-xl focus:border-red-500 dark:focus:border-red-400 outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white transition-all duration-300 text-base font-medium placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                  여행 불가 기간 설정
                </label>
                <div className="space-y-3">
                  {[1, 2, 3, 5, 7].map((days) => (
                    <label
                      key={days}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={days}
                        checked={blockDays === days}
                        onChange={(e) => setBlockDays(parseInt(e.target.value))}
                        className="w-4 h-4 text-red-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>{days}일 전</strong>부터 여행 불가
                        {days === 3 && (
                          <span className="text-blue-500 ml-2">(추천)</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 선택한 기간 동안은 여행 특가 알림이 발송되지 않습니다
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedDate(null);
                  setEventTitle("");
                  setBlockDays(3);
                }}
                className="flex-1 py-4 px-6 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-base hover:bg-gray-200 dark:hover:bg-gray-500 transition-all duration-300 border-2 border-gray-200 dark:border-gray-500"
              >
                취소
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!eventTitle.trim()}
                className="flex-1 py-4 px-6 bg-red-500 dark:bg-red-600 text-white rounded-xl font-bold text-base hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
