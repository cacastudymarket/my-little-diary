// Connect Wallet
document.getElementById("connectBtn").addEventListener("click", async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      document.getElementById("walletAddress").textContent = "Connected: " + walletAddress;
    } catch (error) {
      alert("Koneksi wallet dibatalkan.");
    }
  } else {
    alert("MetaMask belum terpasang.");
  }
});

// Login Wallet
document.getElementById("loginBtn").addEventListener("click", async () => {
  if (!window.ethereum) return alert("MetaMask belum tersedia.");

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const address = accounts[0];
    const message = "Login ke My Little Diary ✨";

    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });

    localStorage.setItem("loggedWallet", address);
    showDiaryApp(address);
  } catch (err) {
    alert("Login wallet dibatalkan.");
  }
});

// Logout Wallet
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedWallet");
  hideDiaryApp();
});

// Toggle Dark Mode
document.getElementById("toggleThemeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Simpan Catatan
document.getElementById("diaryForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("titleInput").value;
  const body = document.getElementById("bodyInput").value;
  const mood = document.getElementById("moodInput").value;

  const newEntry = {
    title,
    body,
    mood,
    date: new Date().toLocaleString()
  };

  let diary = JSON.parse(localStorage.getItem("web3diary")) || [];
  diary.push(newEntry);
  localStorage.setItem("web3diary", JSON.stringify(diary));

  document.getElementById("titleInput").value = "";
  document.getElementById("bodyInput").value = "";
  document.getElementById("moodInput").value = "";

  renderDiary();
});

// Tampilkan Catatan
function renderDiary() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const diary = JSON.parse(localStorage.getItem("web3diary")) || [];
  const diaryItems = document.getElementById("diaryItems");
  diaryItems.innerHTML = "";

  diary.reverse().forEach((entry, index) => {
    if (
      entry.title.toLowerCase().includes(searchQuery) ||
      entry.body.toLowerCase().includes(searchQuery) ||
      entry.mood.toLowerCase().includes(searchQuery)
    ) {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${entry.title}</strong><br>
        <p>${entry.body}</p>
        <p><strong>Mood:</strong> ${entry.mood}</p>
        <small>${entry.date}</small><br><br>
        <button class="editBtn" data-index="${diary.length - 1 - index}">🖊️ Edit</button>
        <button class="deleteBtn" data-index="${diary.length - 1 - index}">🗑️ Hapus</button>
      `;
      diaryItems.appendChild(li);
    }
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      deleteEntry(index);
    });
  });

  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      editEntry(index);
    });
  });
}

// Hapus Catatan
function deleteEntry(index) {
  let diary = JSON.parse(localStorage.getItem("web3diary")) || [];
  diary.splice(index, 1);
  localStorage.setItem("web3diary", JSON.stringify(diary));
  renderDiary();
}

// Edit Catatan
function editEntry(index) {
  let diary = JSON.parse(localStorage.getItem("web3diary")) || [];
  const entry = diary[index];

  document.getElementById("titleInput").value = entry.title;
  document.getElementById("bodyInput").value = entry.body;
  document.getElementById("moodInput").value = entry.mood;

  diary.splice(index, 1);
  localStorage.setItem("web3diary", JSON.stringify(diary));
  renderDiary();
}

// Tampilkan Diary App Setelah Login
function showDiaryApp(address) {
  document.getElementById("loginStatus").textContent = `✅ Logged in as: ${address}`;
  document.getElementById("diaryApp").style.display = "block";
  document.getElementById("loginNotice").style.display = "none";
  document.getElementById("logoutBtn").style.display = "inline-block";
  renderDiary();
}

// Sembunyikan Diary App Jika Belum Login
function hideDiaryApp() {
  document.getElementById("loginStatus").textContent = "";
  document.getElementById("diaryApp").style.display = "none";
  document.getElementById("loginNotice").style.display = "block";
  document.getElementById("logoutBtn").style.display = "none";
}

// Saat Load: Cek Login
const loggedWallet = localStorage.getItem("loggedWallet");
if (loggedWallet) {
  showDiaryApp(loggedWallet);
} else {
  hideDiaryApp();
}

// Search Filter
document.getElementById("searchInput").addEventListener("input", renderDiary);
