// 웹사이트가 로드되면 자동으로 실행되는 함수
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("channel-container");

    // 1. 백엔드 통신: JSON 데이터베이스 파일 긁어오기 (Fetch API)
    fetch("/channels.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("데이터베이스를 불러오는 데 실패했습니다.");
            }
            return response.json();
        })
        .then(data => {
            // 2. 정보 흐름 처리: 가져온 데이터를 바탕으로 HTML 네모 박스 카드 조립하기
            data.forEach(channel => {
                // 개별 카드 링크 태그(<a>) 생성
                const card = document.createElement("a");
                card.href = channel.url;
                card.target = "_blank"; // 새 탭으로 열기 규칙 적용
                card.rel = "noopener noreferrer"; // 보안 링크 설정
                
                // 네모 박스 UI 디자인 스타일 정의 (Tailwind CSS 활용)
                card.className = "block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all duration-200 transform hover:-translate-y-1";

                // 카드 내부에 들어갈 글씨 구조 조립
                card.innerHTML = `
                    <div class="flex flex-col h-full justify-between">
                        <div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 mb-3">
                                ${channel.category}
                            </span>
                            <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
                                ${channel.name}
                            </h3>
                        </div>
                        <div class="mt-4 flex items-center text-sm font-semibold text-indigo-600">
                            바로가기 
                            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                    </div>
                `;

                // 완성된 네모 박스 카드를 메인 화면에 하나씩 탑재
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = `<p class="text-red-500 text-sm">콘텐츠를 불러오는 중 오류가 발생했습니다.</p>`;
        });
});
