const socket = io();

// toggle menu
const toggleBtn = document.getElementById("chat-toggle-btn");
const menu = document.getElementById("chat-menu");
toggleBtn.onclick = () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
};

// mở hộp chat
const chatBox = document.getElementById("chat-box");
document.getElementById("open-chatbox").onclick = () => {
    chatBox.style.display = "flex";
    menu.style.display = "none";
};

// đóng hộp chat
document.getElementById("close-chatbox").onclick = () => {
    chatBox.style.display = "none";
};

// Gửi tin nhắn
document.getElementById("send-chat").onclick = () => {
    const msg = document.getElementById("chat-input").value;
    if (!msg) return;

    socket.emit("user-send-message", {
        userId: window.USER_ID || "guest",
        message: msg
    });

    document.getElementById("chat-input").value = "";
};

// Nhận tin nhắn
socket.on("user-receive-message", (msg) => {
    const box = document.getElementById("chat-messages");
    const p = document.createElement("p");
    p.innerText = `${msg.sender}: ${msg.message}`;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
});
