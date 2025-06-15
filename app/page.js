"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const router = useRouter();

  const handleCampaignStart = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* 로고 영역 */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-[#D31F2A] rounded-full flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">ESTAR</span>
        </div>
      </div>

      {/* 메인 타이틀 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          어깨 P자 청년!
          <br />
          <span className="text-[#D31F2A]">힐링 즉흥 여행</span>
          <br />
          지원 캠페인
        </h1>
        <p className="text-gray-600 text-lg">
          바쁜 일상 속 깜짝 여행의 기회를
          <br />
          놓치지 마세요!
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => setShowBenefitsModal(true)}
          className="w-full py-4 px-6 bg-white border-2 border-[#D31F2A] text-[#D31F2A] rounded-xl font-semibold text-lg hover:bg-[#D31F2A] hover:text-white transition-all duration-300 shadow-lg"
        >
          혜택 보기
        </button>

        <button
          onClick={handleCampaignStart}
          className="w-full py-4 px-6 bg-[#D31F2A] text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg"
        >
          캠페인 지원하기
        </button>
      </div>

      {/* 혜택 모달 */}
      {showBenefitsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                🎁 캠페인 혜택
              </h3>
              <button
                onClick={() => setShowBenefitsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-[#D31F2A]">
                <h4 className="font-semibold text-[#D31F2A] mb-2">
                  ✈️ 임박특가 항공료
                </h4>
                <p className="text-sm text-gray-600">
                  최대 70% 할인된 특가 항공료를 우선 제공
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-[#D31F2A]">
                <h4 className="font-semibold text-[#D31F2A] mb-2">
                  🏨 숙박 쿠폰
                </h4>
                <p className="text-sm text-gray-600">
                  제휴 호텔 30% 할인 쿠폰 증정
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-[#D31F2A]">
                <h4 className="font-semibold text-[#D31F2A] mb-2">
                  📱 실시간 알림
                </h4>
                <p className="text-sm text-gray-600">
                  여행 가능한 날짜에 맞춘 맞춤형 특가 정보
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-[#D31F2A]">
                <h4 className="font-semibold text-[#D31F2A] mb-2">
                  🎯 우선 예약권
                </h4>
                <p className="text-sm text-gray-600">
                  인기 노선 우선 예약 기회 제공
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBenefitsModal(false)}
              className="w-full mt-6 py-3 px-4 bg-[#D31F2A] text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
