// // Event listener for login form submission
// document.querySelector(".login-btn").addEventListener("click", function(event) {
//     event.preventDefault();  // Prevent the form from submitting normally

//     // Get the input values
//     let username = document.getElementById('username atau Nim').value;
//     let password = document.getElementById('password').value;

//     // Simulate login logic (check if user is admin or regular user)
//     // For real applications, you would verify this data with a backend server.
//     if (username === 'admin' && password === 'admin123') {
//         // Redirect to Lantai 1 page if admin
//         window.location.href = "lantai1.html";
//     } else if (username && password) {
//         // Redirect to Lantai 1 page if regular user (for demo purposes, we treat all users the same)
//         window.location.href = "lantai1.html";
//     } else {
//         // Show an alert if username or password is missing
//         alert('Please enter a valid username and password.');
//     }
// });

//                                       // BAGIAN ADMINNN
// document.addEventListener("DOMContentLoaded", () => {
//     const fileInputs = document.querySelectorAll(".file-upload");

//     // Menampilkan nama file yang diunggah
//     fileInputs.forEach(input => {
//         input.addEventListener("change", (e) => {
//             const fileName = e.target.files[0].name;
//             alert("File yang diunggah: " + fileName);  // Menampilkan nama file
//         });
//     });

//     const approveButtons = document.querySelectorAll(".btn-approve");
//     const rejectButtons = document.querySelectorAll(".btn-reject");

//     // Setujui
//     approveButtons.forEach(button => {
//         button.addEventListener("click", (e) => {
//             const row = e.target.closest("tr");
//             const statusCell = row.querySelector(".status");
//             statusCell.textContent = "Diterima"; // Update status menjadi Diterima
//             statusCell.style.backgroundColor = "#28a745"; // Hijau untuk diterima
//         });
//     });

//     // Tolak
//     rejectButtons.forEach(button => {
//         button.addEventListener("click", (e) => {
//             const row = e.target.closest("tr");
//             const statusCell = row.querySelector(".status");
//             statusCell.textContent = "Ditolak"; // Update status menjadi Ditolak
//             statusCell.style.backgroundColor = "#dc3545"; // Merah untuk ditolak
//         });
//     });
// });

// PART 2
// Store valid credentials
const validCredentials = {
  users: [
    { username: "user1", password: "user123", role: "user" },
    { username: "admin", password: "admin123", role: "admin" },
  ],
};

// Login handling
document.addEventListener("DOMContentLoaded", function () {
  // Login form handling
  const loginForm = document.querySelector("form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username atau Nim").value;
      const password = document.getElementById("password").value;

      const user = validCredentials.users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        sessionStorage.setItem("userRole", user.role);
        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "lantai1.html";
        }
      } else {
        alert("Invalid credentials!");
      }
    });
  }

  // Add floor navigation buttons to each floor page
  const mainBox = document.querySelector(".main-box");
  if (mainBox) {
    const currentPage = window.location.pathname;
    let navigationHTML =
      '<div class="floor-navigation" style="text-align: center; margin: 20px 0;">';

    if (currentPage.includes("lantai1.html")) {
      navigationHTML +=
        '<button onclick="navigateToFloor(3)" style="margin: 0 10px; padding: 10px 20px;">Ke Lantai 3</button>';
    } else if (currentPage.includes("lantai3.html")) {
      navigationHTML += `
                <button onclick="navigateToFloor(1)" style="margin: 0 10px; padding: 10px 20px;">Ke Lantai 1</button>
                <button onclick="navigateToFloor(4)" style="margin: 0 10px; padding: 10px 20px;">Ke Lantai 4</button>
            `;
    } else if (currentPage.includes("lantai4.html")) {
      navigationHTML +=
        '<button onclick="navigateToFloor(3)" style="margin: 0 10px; padding: 10px 20px;">Ke Lantai 3</button>';
    }

    navigationHTML += "</div>";
    mainBox.insertAdjacentHTML("afterend", navigationHTML);
  }

  // Room items click handling
  const roomItems = document.querySelectorAll(".room-item");
  if (roomItems) {
    roomItems.forEach((room) => {
      room.addEventListener("click", function () {
        const floorNumber = window.location.pathname.includes("lantai1")
          ? "1"
          : window.location.pathname.includes("lantai3")
          ? "3"
          : "4";
        window.location.href = `statusruangan${floorNumber}.html`;
      });
    });
  }

  // Status room handling
  const rooms = document.querySelectorAll(".room");
  if (rooms) {
    rooms.forEach((room) => {
      room.addEventListener("click", function () {
        if (this.classList.contains("red")) {
          alert("Ruangan ini sedang penuh/digunakan");
        } else if (this.classList.contains("yellow")) {
          sessionStorage.setItem("selectedRoom", this.textContent.trim());
          window.location.href = "formulir.html";
        }
      });
    });
  }

  // Form submission handling
  const peminjamanForm = document.getElementById("peminjamanForm");
  if (peminjamanForm) {
    peminjamanForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        nama: document.getElementById("nama").value,
        jurusan: document.getElementById("jurusan").value,
        tanggal: document.getElementById("tanggal").value,
        waktu: document.getElementById("waktu").value,
        ruangan: sessionStorage.getItem("selectedRoom"),
        status: "Menunggu Verifikasi",
      };

      let existingRequests = JSON.parse(
        localStorage.getItem("peminjaman") || "[]"
      );
      existingRequests.push(formData);
      localStorage.setItem("peminjaman", JSON.stringify(existingRequests));

      document.getElementById("formSection").style.display = "none";
      document.getElementById("approvalSection").style.display = "block";
    });
  }

  // Admin page functionality
  if (window.location.pathname.includes("admin.html")) {
    const tableBody = document.querySelector("tbody");
    if (tableBody) {
      const requests = JSON.parse(localStorage.getItem("peminjaman") || "[]");

      tableBody.innerHTML = requests
        .map(
          (request) => `
                <tr>
                    <td>${request.nama}</td>
                    <td>${request.ruangan}</td>
                    <td>${request.tanggal}</td>
                    <td><input type="file" class="file-upload" accept=".pdf, .docx, .jpg, .jpeg, .png"></td>
                    <td>${request.waktu}</td>
                    <td class="status">${request.status}</td>
                    <td>
                        <button class="btn-approve" onclick="handleRequest('approve', '${request.nama}')">Setujui</button>
                        <button class="btn-reject" onclick="handleRequest('reject', '${request.nama}')">Tolak</button>
                        <button class="btn-delete" onclick="deleteRequest('${request.nama}')">Hapus</button>
                    </td>
                </tr>
            `
        )
        .join("");
    }
  }
});

// Floor navigation function
function navigateToFloor(floorNumber) {
  window.location.href = `lantai${floorNumber}.html`;
}

// Handle admin approval/rejection
function handleRequest(action, nama) {
  let requests = JSON.parse(localStorage.getItem("peminjaman") || "[]");
  const requestIndex = requests.findIndex((req) => req.nama === nama);

  if (requestIndex !== -1) {
    requests[requestIndex].status =
      action === "approve" ? "Disetujui" : "Ditolak";
    localStorage.setItem("peminjaman", JSON.stringify(requests));
    window.location.reload();
  }
}

// Fungsi untuk menghapus data peminjaman
function deleteRequest(nama) {
  let requests = JSON.parse(localStorage.getItem("peminjaman") || "[]");

  // Cari index data yang ingin dihapus berdasarkan nama
  const requestIndex = requests.findIndex((req) => req.nama === nama);

  if (requestIndex !== -1) {
    // Hapus data dari array
    requests.splice(requestIndex, 1);

    // Perbarui localStorage
    localStorage.setItem("peminjaman", JSON.stringify(requests));

    // Reload halaman untuk merefleksikan perubahan
    alert(`Data peminjaman atas nama "${nama}" berhasil dihapus.`);
    window.location.reload();
  } else {
    alert("Data tidak ditemukan!");
  }
}

// Fungsi logout


const formSection = document.getElementById("formSection");
const approvalSection = document.getElementById("approvalSection");

document
  .getElementById("peminjamanForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah pengiriman formulir secara default

    // Tampilkan bagian persetujuan dan sembunyikan formulir
    formSection.style.display = "none";
    approvalSection.style.display = "block";
  });

// // Login Handling
// document.addEventListener('DOMContentLoaded', function () {
//     const loginForm = document.querySelector('form');
//     if (loginForm) {
//         loginForm.addEventListener('submit', function (e) {
//             e.preventDefault();
//             const username = document.getElementById('username').value;
//             const password = document.getElementById('password').value;
//             const user = validCredentials.users.find(u => u.username === username && u.password === password);
//             if (user) {
//                 sessionStorage.setItem('userRole', user.role);
//                 window.location.href = user.role === 'admin' ? 'admin.html' : 'lantai1.html';
//             } else {
//                 alert('Invalid credentials!');
//             }
//         });
//     }
// });

// // Floor Navigation
// function navigateToFloor(floorNumber) {
//     window.location.href = `lantai${floorNumber}.html`;
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const peminjamanForm = document.getElementById('peminjamanForm');
//     if (peminjamanForm) {
//         peminjamanForm.addEventListener('submit', function (e) {
//             e.preventDefault();
//             const fileUpload = document.getElementById('fileUpload').files[0];
//             const reader = new FileReader();
//             reader.onload = function (event) {
//                 const formData = {
//                     nama: document.getElementById('nama').value,
//                     jurusan: document.getElementById('jurusan').value,
//                     tanggal: document.getElementById('tanggal').value,
//                     waktu: document.getElementById('waktu').value,
//                     ruangan: sessionStorage.getItem('selectedRoom'),
//                     file: event.target.result,
//                     status: 'Menunggu Verifikasi'
//                 };
//                 let existingRequests = JSON.parse(localStorage.getItem('peminjaman') || '[]');
//                 existingRequests.push(formData);
//                 localStorage.setItem('peminjaman', JSON.stringify(existingRequests));
//                 alert('Formulir berhasil diajukan!');
//                 window.location.href = 'lantai1.html';
//             };
//             reader.readAsDataURL(fileUpload);
//         });
//     }
// });
