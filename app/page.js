"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const router = useRouter();

  const handleCampaignStart = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* 비행기 애니메이션 */}
      <div className="absolute top-8 left-8 pointer-events-none">
        <div className="flying-plane">
          <Image
            src="/ap.png"
            alt="비행기"
            width={500}
            height={300}
            className="opacity-100"
          />
        </div>
      </div>

      {/* 로고 영역 */}
      <div className="mb-8 z-10">
        <div>
          <Image
            src="/ee.png"
            alt="logo 이미지"
            width={300}
            height={400}
            style={{ objectFit: "cover", width: "100%", height: "auto" }}
            priority
          />
        </div>
      </div>

      {/* 메인 타이틀 */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
          어깨 P자 청년!
          <br />
          <span className="text-[#D31F2A]">청년 힐링 여행</span>
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
      <div className="w-full max-w-sm space-y-4 z-10">
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
              <h3 className="text-xl font-bold text-gray-800">🎁 캠페인 �혁</h3>
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
                  🎯 한달에 한 번! 청년 슈퍼패스 래플!
                </h4>
                <p className="text-sm text-gray-600">
                  매달 단 하루, 특별한 래플 이벤트를 엽니다!
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

      {/* CSS 애니메이션 */}
      <style jsx>{`
        .flying-plane {
          animation: fly-to-position 3s ease-out forwards;
        }

        @keyframes fly-to-position {
          0% {
            transform: translateX(calc(100vw - 32px)) translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateX(0px) translateY(0px);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
