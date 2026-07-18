document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("channel-container");

    // 도메인 환경과 임시 주소 환경 모두에서 작동하도록 현재 도메인 기준 주소 계산
    const jsonUrl = window.location.origin + "/channels.json";

    // 캐시 방지를 위해 주소 뒤에 시간을 붙여 실시간으로 호출
    fetch(`${jsonUrl}?v=${new Date().getTime()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("데이터베이스 파일을 찾을 수 없습니다.");
            }
            return response.json();
        })
        .then(data => {
            // 기존 경고 문구 지우기
            container.innerHTML = "";

            if (!data || data.length === 0) {
                container.innerHTML = `<p class="text-gray-500 text-sm">등록된 채널이 없습니다.</p>`;
                return;
            }

            data.forEach(channel => {
                const card = document.createElement("a");
                card.href = channel.url;
                card.target = "_blank";
                card.rel = "noopener noreferrer";
                card.className = "block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all duration-200 transform hover:-translate-y-1";

                card.innerHTML = `
                    <div class="flex flex-col h-full justify-between">
                        <div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 mb-3">
                                ${channel.category || '일반'}
                            </span>
                            <h3 class="text-lg font-bold text-gray-900">
                                ${channel.name}
                            </h3>
                        </div>
                        <div class="mt-4 flex items-center text-sm font-semibold text-indigo-600">
                            바로가기 
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = `
                <div class="col-span-full py-4 text-center">
                    <p class="text-red-500 text-sm font-semibold">콘텐츠를 불러오는 중 오류가 발생했습니다.</p>
                    <p class="text-gray-400 text-xs mt-1">이유: ${error.message}</p>
                </div>
            `;
        });
});
