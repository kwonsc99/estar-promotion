"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationPage() {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 인증 확인
    const auth = localStorage.getItem("userAuth");
    if (!auth) {
      router.push("/auth");
      return;
    }
  }, [router]);

  const handleNext = () => {
    if (!agreed) {
      alert("푸쉬알림 수신에 동의해주세요.");
      return;
    }

    // 알림 권한 요청 (실제 브라우저 API)
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        const notificationData = {
          agreed: true,
          permission: permission,
          timestamp: Date.now(),
        };
        localStorage.setItem(
          "notificationConsent",
          JSON.stringify(notificationData)
        );
        router.push("/schedule");
      });
    } else {
      // 푸쉬알림을 지원하지 않는 환경
      const notificationData = {
        agreed: true,
        permission: "not-supported",
        timestamp: Date.now(),
      };
      localStorage.setItem(
        "notificationConsent",
        JSON.stringify(notificationData)
      );
      router.push("/schedule");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D31F2A] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🔔</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            푸쉬알림 설정
          </h1>
          <p className="text-gray-600">
            특가 항공료 정보를 실시간으로 받아보세요
          </p>
        </div>

        {/* 알림 설명 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📢 알림 서비스 안내
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#D31F2A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">맞춤형 특가 정보</h4>
                <p className="text-sm text-gray-600">
                  회원님의 여행 가능 일정에 맞춘 임박특가 항공료 정보
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#D31F2A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">실시간 알림</h4>
                <p className="text-sm text-gray-600">
                  새로운 특가 정보를 놓치지 않도록 즉시 알림
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-[#D31F2A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">스마트 타이밍</h4>
                <p className="text-sm text-gray-600">
                  중요한 일정을 피해 여행 가능한 시기에만 알림
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 동의 체크박스 */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#D31F2A] border-gray-300 rounded focus:ring-[#D31F2A]"
            />
            <div className="text-sm">
              <span className="text-gray-800 font-medium">
                푸쉬알림 수신에 동의합니다.
              </span>
              <p className="text-gray-600 mt-1">
                마케팅 정보 수신 및 개인정보 처리에 동의하며, 언제든지 설정에서
                해제할 수 있습니다.
              </p>
            </div>
          </label>
        </div>

        {/* 버튼 */}
        <button
          onClick={handleNext}
          disabled={!agreed}
          className="w-full py-3 px-4 bg-[#D31F2A] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          다음 단계로
        </button>

        <button
          onClick={() => router.back()}
          className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← 이전으로
        </button>
      </div>
    </div>
  );
}
