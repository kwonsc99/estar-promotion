"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      alert("올바른 휴대폰 번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsCodeSent(true);
      setIsLoading(false);
      alert("인증번호가 발송되었습니다. (데모: 임의의 4자리 숫자 입력)");
    }, 1500);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 4) {
      alert("4자리 인증번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem(
        "userAuth",
        JSON.stringify({
          phoneNumber,
          verified: true,
          timestamp: Date.now(),
        })
      );
      router.push("/notification");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">📱</span>
          </div>
          <h1 className="text-4xl font-black text-gray-800 dark:text-white mb-4">
            본인인증
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            안전한 서비스 이용을 위해
            <br />
            <span className="text-green-600 dark:text-green-400 font-semibold">
              휴대폰으로 인증해주세요
            </span>
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8 animate-scale-in">
          {!isCodeSent ? (
            <>
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="01012345678"
                  className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-green-500 dark:focus:border-green-400 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-lg font-medium transition-all duration-300"
                  maxLength={11}
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full py-5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>발송 중...</span>
                  </span>
                ) : (
                  "📤 인증번호 받기"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 rounded-2xl">
                <p className="text-green-700 dark:text-green-300 text-center font-medium">
                  📱 {phoneNumber}로 인증번호를 발송했습니다.
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  인증번호 (4자리)
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="1234"
                  className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-green-500 dark:focus:border-green-400 outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-center text-3xl tracking-[0.5em] font-bold transition-all duration-300"
                  maxLength={4}
                />
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 4}
                className="w-full py-5 px-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1 mb-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>인증 중...</span>
                  </span>
                ) : (
                  "✅ 인증 완료"
                )}
              </button>

              <button
                onClick={() => {
                  setIsCodeSent(false);
                  setVerificationCode("");
                }}
                className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                번호 다시 입력하기
              </button>
            </>
          )}
        </div>

        {/* 안내 카드 */}
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-white/30 dark:border-gray-700/30">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">
            🔒 개인정보 보호
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <li>• 입력한 정보는 암호화되어 안전하게 보관됩니다</li>
            <li>• 마케팅 목적 외에는 사용되지 않습니다</li>
            <li>• 언제든지 탈퇴할 수 있습니다</li>
          </ul>
        </div>

        <button
          onClick={() => router.back()}
          className="w-full mt-6 py-3 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          ← 이전으로
        </button>
      </div>
    </div>
  );
}
