const apisChatBot = {
  getMessage: async (text: string, sessionId: string) => {
    // Kiểm tra và tạo sessionId mới nếu chưa có
    let currentSessionId = sessionStorage.getItem("chatSessionId");
    if (!currentSessionId) {
      // Tạo sessionId mới nếu chưa có
      currentSessionId = sessionId;
      sessionStorage.setItem("chatSessionId", currentSessionId);
    }

    const response = await fetch(
      `${process.env.URL_SERVER_API}/ai?text=${text}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": currentSessionId, // Sử dụng sessionId đã lưu
        },
      }
    );

    return response.json();
  },

  // Thêm hàm để lấy sessionId từ sessionStorage
  getSessionId: () => {
    return sessionStorage.getItem("chatSessionId");
  },

  // Thêm hàm để xóa session
  clearSession: () => {
    sessionStorage.removeItem("chatSessionId");
  },
};

export default apisChatBot;
