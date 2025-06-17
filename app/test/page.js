"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  parseISO,
  differenceInDays,
  isWithinInterval,
  subDays as sub,
  addDays as add,
} from "date-fns";
import { ko } from "date-fns/locale";
import {
  getCalendarEvents,
  getCurrentDate,
  setCurrentDate,
} from "../../utils/storage";

export default function TestPage() {
  const [simulatedDate, setSimulatedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pushPermission, setPushPermission] = useState("default");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 인증 및 이전 단계 완료 확인
    const auth = localStorage.getItem("userAuth");
    const notification = localStorage.getItem("notificationConsent");
    const calendar = localStorage.getItem("calendarConsent");

    if (!auth || !notification || !calendar) {
      router.push("/auth");
      return;
    }

    // 데이터 로드
    const savedEvents = getCalendarEvents();
    const currentDate = getCurrentDate();

    setEvents(savedEvents);
    setSimulatedDate(currentDate);

    // 문자 알림 권한 확인
    if ("Notification" in window) {
      setPushPermission(Notification.permission);
    }

    setIsLoaded(true);
  }, [router]);

  // 특가 항공료 데이터
  const flightDeals = [
    {
      destination: "제주도",
      price: "29,000원",
      discount: "70%",
      originalPrice: "96,000원",
      airline: "이스타항공",
    },
    {
      destination: "부산",
      price: "19,000원",
      discount: "65%",
      originalPrice: "55,000원",
      airline: "이스타항공",
    },
    {
      destination: "대구",
      price: "25,000원",
      discount: "60%",
      originalPrice: "62,000원",
      airline: "이스타항공",
    },
    {
      destination: "광주",
      price: "22,000원",
      discount: "68%",
      originalPrice: "69,000원",
      airline: "이스타항공",
    },
    {
      destination: "울산",
      price: "31,000원",
      discount: "55%",
      originalPrice: "69,000원",
      airline: "이스타항공",
    },
    {
      destination: "청주",
      price: "18,000원",
      discount: "72%",
      originalPrice: "64,000원",
      airline: "이스타항공",
    },
    {
      destination: "여수",
      price: "35,000원",
      discount: "58%",
      originalPrice: "83,000원",
      airline: "이스타항공",
    },
  ];

  // 여행 불가능한 날짜 범위 계산
  const getBlockedDateRanges = () => {
    const ranges = [];
    const importantEvents = events.filter(
      (event) => event.type === "important"
    );

    importantEvents.forEach((event) => {
      const eventDate = parseISO(event.date);
      const blockDaysBefore = event.blockDays || 3;
      const startBlocked = sub(eventDate, blockDaysBefore);
      const endBlocked = eventDate;

      ranges.push({
        start: startBlocked,
        end: endBlocked,
        event: event,
      });
    });
    return ranges;
  };

  // 해당 날짜가 여행 가능한 날인지 확인
  const isAvailableForTravel = (date) => {
    const blockedRanges = getBlockedDateRanges();
    const isBlocked = blockedRanges.some((range) =>
      isWithinInterval(date, { start: range.start, end: range.end })
    );

    const hasAvailableEvent = events.some(
      (event) =>
        event.type === "available" && isSameDay(parseISO(event.date), date)
    );

    return !isBlocked && hasAvailableEvent;
  };

  // 실제 문자 알림 발송
  const sendPushNotification = async (title, body, data = {}) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: body,
        icon: "/icon-192.png",
        badge: "/badge-72.png",
        tag: "estar-travel-deal",
        requireInteraction: true,
        data: data,
      });

      notification.onclick = function (event) {
        event.preventDefault();
        window.focus();
        notification.close();
      };

      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    }
    return null;
  };

  // 날짜별 알림 체크 (하루에 한 번)
  const checkForNotifications = async (date) => {
    const newNotifications = [];

    // 1. 여행 가능일 3일 전 특가 알림
    const availableEvents = events.filter(
      (event) => event.type === "available"
    );

    for (const event of availableEvents) {
      const eventDate = parseISO(event.date);
      const daysDiff = differenceInDays(eventDate, date);

      if (daysDiff === 3) {
        const randomDeal =
          flightDeals[Math.floor(Math.random() * flightDeals.length)];
        const notification = {
          id: Date.now() + Math.random(),
          type: "deal",
          title: "🔥 이스타항공 임박특가!",
          message: `${format(eventDate, "M월 d일", { locale: ko })} ${
            randomDeal.destination
          } 항공료 ${randomDeal.price} (${randomDeal.discount} 할인)`,
          deal: randomDeal,
          targetDate: event.date,
          timestamp: date.toISOString(),
          isPushed: false,
        };
        newNotifications.push(notification);

        try {
          await sendPushNotification(notification.title, notification.message, {
            deal: randomDeal,
            targetDate: event.date,
            type: "travel-deal",
          });
          notification.isPushed = true;
          console.log(`🔔 특가 알림 발송: ${notification.message}`);
        } catch (error) {
          console.error("문자 알림 발송 실패:", error);
        }
      }
    }

    // 2. 중요한 일정 종료 축하 + 여행 제안 알림
    const importantEvents = events.filter(
      (event) => event.type === "important"
    );

    for (const event of importantEvents) {
      const eventDate = parseISO(event.date);
      const daysDiff = differenceInDays(date, eventDate); // 일정 종료 후 계산

      // 중요한 일정 당일에 축하 알림
      if (daysDiff === 0) {
        const randomDeal =
          flightDeals[Math.floor(Math.random() * flightDeals.length)];
        const notification = {
          id: Date.now() + Math.random(),
          type: "celebration",
          title: `🎉 ${event.title} 종료를 축하드려요!`,
          message: `머리도 식힐 겸 ${randomDeal.destination}로 여행을 떠나보는 건 어때요? 청년 지원 항공권이 준비되어 있어요.`,
          deal: randomDeal,
          eventTitle: event.title,
          timestamp: date.toISOString(),
          isPushed: false,
        };
        newNotifications.push(notification);

        try {
          await sendPushNotification(notification.title, notification.message, {
            deal: randomDeal,
            eventTitle: event.title,
            type: "celebration",
          });
          notification.isPushed = true;
          console.log(`🎉 축하 알림 발송: ${notification.message}`);
        } catch (error) {
          console.error("문자 알림 발송 실패:", error);
        }
      }

      // 중요한 일정 1일 후에도 추가 여행 제안
      if (daysDiff === 1) {
        const randomDeal =
          flightDeals[Math.floor(Math.random() * flightDeals.length)];
        const notification = {
          id: Date.now() + Math.random(),
          type: "followup",
          title: "✈️ 이제 자유롭게 여행하세요!",
          message: `${event.title}도 끝났으니, ${randomDeal.destination} 특가로 힐링 여행 어떠세요? ${randomDeal.price}에 다녀올 수 있어요!`,
          deal: randomDeal,
          eventTitle: event.title,
          timestamp: date.toISOString(),
          isPushed: false,
        };
        newNotifications.push(notification);

        try {
          await sendPushNotification(notification.title, notification.message, {
            deal: randomDeal,
            eventTitle: event.title,
            type: "followup",
          });
          notification.isPushed = true;
          console.log(`✈️ 후속 알림 발송: ${notification.message}`);
        } catch (error) {
          console.error("문자 알림 발송 실패:", error);
        }
      }
    }

    return newNotifications;
  };

  // 날짜 변경 시 알림 체크
  const handleDateChange = async (newDate) => {
    setSimulatedDate(newDate);
    setCurrentDate(newDate);

    const newNotifications = await checkForNotifications(newDate);
    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev]);
    }
  };

  // 문자 알림 권한 요청
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === "granted") {
        await sendPushNotification(
          "🎉 이스타항공 알림 설정 완료!",
          "이제 맞춤형 여행 특가 정보를 받아보실 수 있습니다.",
          { type: "setup-complete" }
        );
      }
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const goHome = () => {
    router.push("/");
  };

  // 통계 계산
  const availableEvents = events.filter((e) => e.type === "available").length;
  const importantEvents = events.filter((e) => e.type === "important").length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-purple-900 dark:to-red-900 px-6 py-8">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🧪</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
            스마트 알림 테스트
          </h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            날짜를 변경하면서
            <br />
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              맞춤형 알림을 확인해보세요
            </span>
          </p>
        </div>

        {/* 문자 알림 권한 상태 */}
        <div
          className={`mb-8 p-6 rounded-2xl border-2 ${
            pushPermission === "granted"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
              : pushPermission === "denied"
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
          }`}
        >
          <h3
            className={`font-bold mb-3 ${
              pushPermission === "granted"
                ? "text-green-800 dark:text-green-400"
                : pushPermission === "denied"
                ? "text-red-800 dark:text-red-400"
                : "text-yellow-800 dark:text-yellow-400"
            }`}
          >
            📱 문자 알림 상태
          </h3>

          {pushPermission === "granted" && (
            <p className="text-green-700 dark:text-green-300 text-sm">
              ✅ 문자 알림이 활성화되었습니다. 실제 알림을 받을 수 있습니다.
            </p>
          )}

          {pushPermission === "denied" && (
            <div>
              <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                ❌ 문자 알림이 차단되었습니다. 브라우저 설정에서 허용해주세요.
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Chrome: 주소창 왼쪽 🔒 아이콘 → 알림 허용
              </p>
            </div>
          )}

          {pushPermission === "default" && (
            <div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-4">
                ⚠️ 문자 알림 권한이 필요합니다. 실제 알림을 받으려면
                허용해주세요.
              </p>
              <button
                onClick={requestNotificationPermission}
                className="w-full py-3 px-4 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
              >
                문자 알림 허용하기
              </button>
            </div>
          )}
        </div>

        {/* 현재 시뮬레이션 날짜 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8 animate-scale-in">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center">
            현재 시뮬레이션 날짜
          </h2>

          <div className="text-center mb-6">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-2">
              {format(simulatedDate, "M월 d일 (E)", { locale: ko })}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(simulatedDate, "yyyy년")}
            </div>
          </div>

          {/* 날짜 조정 버튼 */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleDateChange(subDays(simulatedDate, 1))}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              ←
            </button>

            <button
              onClick={() => handleDateChange(new Date())}
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-semibold hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
            >
              오늘로
            </button>

            <button
              onClick={() => handleDateChange(addDays(simulatedDate, 1))}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              →
            </button>
          </div>

          {/* 빠른 이동 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDateChange(addDays(new Date(), 7))}
              className="py-2 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors text-sm"
            >
              +7일 후
            </button>
            <button
              onClick={() => handleDateChange(addDays(new Date(), 14))}
              className="py-2 px-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors text-sm"
            >
              +14일 후
            </button>
          </div>
        </div>

        {/* 등록된 일정 요약 */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">
            📊 등록된 일정
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-2xl font-black text-green-600 dark:text-green-400">
                {availableEvents}
              </div>
              <div className="text-xs text-green-500 dark:text-green-400">
                여행 가능일
              </div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="text-2xl font-black text-red-600 dark:text-red-400">
                {importantEvents}
              </div>
              <div className="text-xs text-red-500 dark:text-red-400">
                중요한 일정
              </div>
            </div>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white">
              🔔 수신한 알림
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                모두 삭제
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p className="font-medium">아직 받은 알림이 없습니다.</p>
              <p className="text-sm mt-1">
                날짜를 변경하여 알림을 확인해보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-5 rounded-xl border-l-4 animate-fade-in-up shadow-sm ${
                    notification.type === "deal"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500"
                      : notification.type === "celebration"
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-500"
                      : "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-800 dark:text-white">
                        {notification.title}
                      </h4>
                      {notification.isPushed && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-semibold">
                          문자 발송됨
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(parseISO(notification.timestamp), "M/d HH:mm")}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {notification.message}
                  </p>

                  {notification.deal && (
                    <div
                      className={`rounded-lg p-4 border ${
                        notification.type === "deal"
                          ? "bg-white/70 dark:bg-gray-700/50 border-green-200 dark:border-green-800"
                          : notification.type === "celebration"
                          ? "bg-white/70 dark:bg-gray-700/50 border-yellow-200 dark:border-yellow-800"
                          : "bg-white/70 dark:bg-gray-700/50 border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-gray-800 dark:text-white flex items-center">
                            ✈️ {notification.deal.destination}
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {notification.deal.airline}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-through mt-1">
                            정가: {notification.deal.originalPrice}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-black text-green-600 dark:text-green-400">
                            {notification.deal.price}
                          </div>
                          <div className="text-sm text-red-500 dark:text-red-400 font-bold">
                            {notification.deal.discount} 할인
                          </div>
                        </div>
                      </div>

                      {notification.targetDate && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            📅 여행일:{" "}
                            {format(
                              parseISO(notification.targetDate),
                              "M월 d일 (E)",
                              { locale: ko }
                            )}
                          </p>
                        </div>
                      )}

                      {notification.eventTitle && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            🎯 관련 일정: {notification.eventTitle}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="space-y-4">
          <button
            onClick={goHome}
            className="w-full py-5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            🎉 테스트 완료! 홈으로
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            ← 이전으로
          </button>
        </div>

        {/* 도움말 */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-3">
            🧠 스마트 알림 종류
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <li>
              🔥 <strong>여행 특가 알림:</strong> 여행 가능일 3일 전 임박특가
              정보
            </li>
            <li>
              🎉 <strong>축하 알림:</strong> 중요한 일정 종료 당일 축하 + 여행
              제안
            </li>
            <li>
              ✈️ <strong>후속 알림:</strong> 중요한 일정 종료 1일 후 추가 여행
              제안
            </li>
            <li>
              📱 <strong>실시간 문자:</strong> 브라우저 네이티브 알림으로 즉시
              발송
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
