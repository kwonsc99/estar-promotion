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
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#DBF2FC] via-white to-[#F0F8FF] opacity-60"></div>

      {/* 비행기 애니메이션 - 오른쪽 아래에서 올라와서 화면 가운데 상단에 위치 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 md:top-8 pointer-events-none z-10">
        <div className="flying-plane">
          <Image
            src="/ap.png"
            alt="비행기"
            width={300}
            height={180}
            className="opacity-90 w-32 h-auto md:w-80 md:h-auto"
          />
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8 md:px-8">
        {/* 로고 영역 */}
        <div className="mb-6 md:mb-8">
          <div>
            <Image
              src="/ee.png"
              alt="logo 이미지"
              width={200}
              height={267}
              className="w-40 h-auto md:w-60 md:h-auto"
              priority
            />
          </div>
        </div>

        {/* 메인 타이틀 */}
        <div className="text-center mb-8 md:mb-12 max-w-md md:max-w-2xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
            어깨 P자 청년!
            <br />
            <span className="text-[#4A90E2] bg-gradient-to-r from-[#4A90E2] to-[#6BB6FF] bg-clip-text text-transparent">
              청년 힐링 여행
            </span>
            <br />
            지원 캠페인
          </h1>
          <p className="text-gray-600 text-base md:text-lg lg:text-xl font-medium">
            바쁜 일상 속 깜짝 여행의 기회를
            <br />
            놓치지 마세요!
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="w-full max-w-sm md:max-w-md space-y-3 md:space-y-4">
          <button
            onClick={() => setShowBenefitsModal(true)}
            className="w-full py-4 md:py-5 px-6 md:px-8 bg-white/80 backdrop-blur-sm border-2 border-[#4A90E2] text-[#4A90E2] rounded-2xl font-semibold text-lg md:text-xl hover:bg-[#4A90E2] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            혜택 보기
          </button>

          <button
            onClick={handleCampaignStart}
            className="w-full py-4 md:py-5 px-6 md:px-8 bg-gradient-to-r from-[#4A90E2] to-[#6BB6FF] text-white rounded-2xl font-semibold text-lg md:text-xl hover:from-[#357ABD] hover:to-[#4A90E2] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            캠페인 지원하기
          </button>
        </div>

        {/* 데코레이션 요소 */}
        <div className="absolute top-1/4 right-4 md:right-8 opacity-30 pointer-events-none">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-[#DBF2FC] rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/4 left-4 md:left-8 opacity-20 pointer-events-none">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-[#4A90E2] rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* 혜택 모달 */}
      {showBenefitsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                🎁 캠페인 혜택
              </h3>
              <button
                onClick={() => setShowBenefitsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 md:p-5 bg-gradient-to-r from-[#DBF2FC] to-[#F0F8FF] rounded-xl border-l-4 border-[#4A90E2]">
                <h4 className="font-semibold text-[#4A90E2] mb-2 text-sm md:text-base">
                  ✈️ 임박특가 항공료
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  최대 70% 할인된 특가 항공료를 우선 제공
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-r from-[#DBF2FC] to-[#F0F8FF] rounded-xl border-l-4 border-[#4A90E2]">
                <h4 className="font-semibold text-[#4A90E2] mb-2 text-sm md:text-base">
                  🏨 숙박 쿠폰
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  제휴 호텔 30% 할인 쿠폰 증정
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-r from-[#DBF2FC] to-[#F0F8FF] rounded-xl border-l-4 border-[#4A90E2]">
                <h4 className="font-semibold text-[#4A90E2] mb-2 text-sm md:text-base">
                  📱 실시간 알림
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  여행 가능한 날짜에 맞춘 맞춤형 특가 정보
                </p>
              </div>

              <div className="p-4 md:p-5 bg-gradient-to-r from-[#DBF2FC] to-[#F0F8FF] rounded-xl border-l-4 border-[#4A90E2]">
                <h4 className="font-semibold text-[#4A90E2] mb-2 text-sm md:text-base">
                  🎯 한달에 한 번! 청년 슈퍼패스 래플!
                </h4>
                <p className="text-sm md:text-base text-gray-600">
                  매달 단 하루, 특별한 래플 이벤트를 엽니다!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBenefitsModal(false)}
              className="w-full mt-6 py-3 md:py-4 px-4 bg-gradient-to-r from-[#4A90E2] to-[#6BB6FF] text-white rounded-xl font-semibold text-base md:text-lg hover:from-[#357ABD] hover:to-[#4A90E2] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* CSS 애니메이션 */}
      <style jsx>{`
        .flying-plane {
          animation: fly-up-from-bottom-right 4s ease-out forwards;
        }

        @keyframes fly-up-from-bottom-right {
          0% {
            transform: translateX(calc(40vw)) translateY(calc(80vh))
              rotate(-15deg) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translateX(calc(20vw)) translateY(calc(40vh))
              rotate(-8deg) scale(0.8);
          }
          80% {
            transform: translateX(calc(5vw)) translateY(calc(10vh))
              rotate(-2deg) scale(0.95);
          }
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
            opacity: 0.9;
          }
        }

        @media (min-width: 768px) {
          @keyframes fly-up-from-bottom-right {
            0% {
              transform: translateX(calc(30vw)) translateY(calc(60vh))
                rotate(-15deg) scale(0.5);
              opacity: 0;
            }
            15% {
              opacity: 1;
            }
            50% {
              transform: translateX(calc(15vw)) translateY(calc(30vh))
                rotate(-8deg) scale(0.75);
            }
            80% {
              transform: translateX(calc(5vw)) translateY(calc(8vh))
                rotate(-2deg) scale(0.9);
            }
            100% {
              transform: translateX(0px) translateY(0px) rotate(0deg) scale(1);
              opacity: 0.9;
            }
          }
        }
      `}</style>
    </div>
  );
}
