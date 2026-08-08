document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("channel-container");
    const jsonUrl = "./channels.json";

    // 캐시 방지를 위해 타임스탬프 파라미터 추가
    fetch(`${jsonUrl}?v=${new Date().getTime()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("데이터베이스 파일을 찾을 수 없습니다.");
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = "";

            if (!data || data.length === 0) {
                container.innerHTML = `<p class="col-span-full text-slate-500 text-sm text-center py-8">등록된 채널이 없습니다.</p>`;
                return;
            }

            data.forEach(channel => {
                const card = document.createElement("a");
                card.href = channel.url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.className = "group relative flex flex-col justify-between bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60";

                // 기본 fallback SVG 아이콘 (이미지가 없거나 로드 실패 시 대체)
                const defaultIconSvg = `
                    <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path>
                    </svg>
                `;

                card.innerHTML = `
                    <div>
                        <!-- 상단: 배너 형태의 이미지 영역 (플레이 버튼 제거) -->
                        <div class="thumb-box w-full h-36 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden mb-4 flex items-center justify-center p-3 group-hover:border-indigo-200 transition-colors">
                            ${
                                channel.image 
                                    ? `<img src="${channel.image}" alt="${channel.name}" class="channel-img w-full h-full object-contain group-hover:scale-105 transition-transform duration-300">`
                                    : defaultIconSvg
                            }
                        </div>

                        <!-- 카테고리 태그 -->
                        <span class="inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-md mb-2">
                            ${channel.category || 'General'}
                        </span>

                        <!-- 채널명 -->
                        <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            ${channel.name}
                        </h3>
                    </div>

                    <!-- 하단 바로가기 -->
                    <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">
                        <span>채널 바로가기</span>
                        <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </div>
                `;

                // 이미지 로드 실패 시 대체 SVG 아이콘 노출
                const imgElement = card.querySelector(".channel-img");
                if (imgElement) {
                    imgElement.addEventListener("error", function() {
                        const thumbBox = card.querySelector(".thumb-box");
                        if (thumbBox) {
                            thumbBox.innerHTML = defaultIconSvg;
                        }
                    });
                }

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = `
                <div class="col-span-full py-8 text-center bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <p class="text-rose-500 text-sm font-semibold">콘텐츠를 불러오는 중 오류가 발생했습니다.</p>
                    <p class="text-slate-400 text-xs mt-1">이유: ${error.message}</p>
                </div>
            `;
        });
});
