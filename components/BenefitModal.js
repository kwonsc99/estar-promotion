"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";

export default function BenefitModal({ benefits, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-3 mb-6"></div>

          {/* Header */}
          <div className="px-6 pb-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  캠페인 혜택
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  청년 전용 특별 혜택을 확인하세요
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Benefits List */}
          <div className="px-6 py-6 overflow-y-auto">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="floating-card p-5 relative overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${benefit.color} opacity-5 rounded-full -mr-10 -mt-10`}
                  ></div>

                  <div className="flex items-start space-x-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white`}
                    >
                      {benefit.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Benefits */}
            <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-3"></span>
                추가 혜택
              </h4>
              <div className="space-y-3">
                {[
                  "개인 맞춤 여행 큐레이션",
                  "24시간 실시간 특가 알림",
                  "여행 버디 매칭 서비스",
                  "포인트 적립 및 캐시백",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl">
              <h4 className="font-bold text-slate-800 mb-4">📋 참여 조건</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="text-slate-700">만 19-35세 청년층 대상</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="text-slate-700">
                    본인인증 및 캘린더 연동 필수
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="text-slate-700">푸쉬 알림 동의 필요</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="px-6 py-6 border-t border-slate-100 bg-white">
            <button
              onClick={onClose}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>확인했어요</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
