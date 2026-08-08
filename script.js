document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("channel-container");
    const jsonUrl = "./channels.json";

    // 캐시 방지를 위해 주소 뒤에 시간을 붙여 실시간으로 호출
    fetch(`${jsonUrl}?v=${new Date().getTime()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("데이터베이스 파일을 찾을 수 없습니다.");
            }
            return response.json();
        })
        .then(data => {
            // 기존 내용 비우기
            container.innerHTML = "";

            if (!data || data.length === 0) {
                container.innerHTML = `<p class="col-span-full text-slate-400 text-sm text-center py-8">등록된 채널이 없습니다.</p>`;
                return;
            }

            data.forEach(channel => {
                const card = document.createElement("a");
                card.href = channel.url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.className = "group relative flex flex-col justify-between bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10";

                // 기본 팟캐스트 아이콘 (이미지가 없거나 로드 실패 시 대체)
                const defaultIcon = `<svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path></svg>`;

                // 이미지 HTML 생성 (channel.image 여부에 따라 분기)
                const imageContent = channel.image 
                    ? `<img src="${channel.image}" alt="${channel.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.parentElement.innerHTML=\`${defaultIcon}\`;">`
                    : defaultIcon;

                card.innerHTML = `
                    <div>
                        <!-- 상단: 썸네일/이미지 영역 & 재생 버튼 -->
                        <div class="flex items-start justify-between gap-4 mb-4">
                            <div class="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700/80 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:border-indigo-500/40 transition-colors">
                                ${imageContent}
                            </div>
                            <div class="w-8 h-8 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white flex items-center justify-center transition-all">
                                <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z"></path>
                                </svg>
                            </div>
                        </div>

                        <!-- 카테고리 태그 -->
                        <span class="inline-block text-[11px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md mb-2">
                            ${channel.category || 'General'}
                        </span>

                        <!-- 채널명 -->
                        <h3 class="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            ${channel.name}
                        </h3>
                    </div>

                    <!-- 하단: 바로가기 영역 -->
                    <div class="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>채널 바로가기</span>
                        <svg class="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = `
                <div class="col-span-full py-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                    <p class="text-rose-400 text-sm font-semibold">콘텐츠를 불러오는 중 오류가 발생했습니다.</p>
                    <p class="text-slate-500 text-xs mt-1">이유: ${error.message}</p>
                </div>
            `;
        });
});
