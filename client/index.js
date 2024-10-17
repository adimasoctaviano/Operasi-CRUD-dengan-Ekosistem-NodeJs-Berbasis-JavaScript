// Saya (Dimas) akan mengembangkan aplikasi perpustakaan untuk mengelola data buku.
// Pastikan server telah berhasil dijalankan (pnpm start:server)
let currentPage = 'home';
let currentBook = null;
let books = [];

const main = document.querySelector('main');

// Konten halaman utama daftar buku
const pageListMainContent = `<h2 class="text-2xl font-bold mb-4">Daftar Buku Perpustakaan</h2>
<table class="min-w-full border border-gray-300">
  <thead>
    <tr>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Judul</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Penulis</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Tahun Terbit</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-left">Jumlah</th>
      <th class="px-6 py-3 bg-gray-100 border-b text-center">Action</th>
    </tr>
  </thead>
  <tbody>
  </tbody>
</table>`;

// Konten halaman untuk mengedit buku
const pageEditBookMainContent = `<h2 class="text-2xl font-bold mb-4">Edit Buku</h2>
<form class="max-w-sm mx-auto" onsubmit="return handleEditForm(event)">
</form>
`;

// Konten halaman untuk menambah buku
const pageAddBookMainContent = `<h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>
<form class="max-w-sm mx-auto" onsubmit="return handleAddForm(event)">
  <div class="mb-4">
    <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
    <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
    <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
    <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="mb-4">
    <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
    <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
  </div>
  <div class="flex justify-center">
    <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="Tambah Buku" />
  </div>
</form>
`;

// Fungsi untuk menangani klik tombol edit
async function handleClickEditButton(bookId) {
    try {
        // Mengambil data buku dari server berdasarkan id
        const response = await fetch(`http://localhost:3333/books/${bookId}`);
        currentBook = await response.json();
        currentPage = 'edit';
        loadPage();
    } catch (error) {
        console.log(error);
        console.log('Terjadi kesalahan saat mengambil data buku');
    }
}

// Fungsi untuk menangani klik tombol hapus
async function handleClickDeleteButton(bookId) {
    try {
        await deleteBook(bookId);
        loadPage();
    } catch (error) {
        console.log(error);
        console.log('Terjadi kesalahan saat menghapus buku');
    }
}

// Fungsi untuk menangani form edit
async function handleEditForm(event) {
    event.preventDefault();

    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: parseInt(document.getElementById('year').value),
        quantity: parseInt(document.getElementById('quantity').value)
    };

    await editBook(book);
    currentBook = null;
    currentPage = 'home';
    loadPage();
}

// Fungsi untuk menangani form tambah
async function handleAddForm(event) {
    event.preventDefault();

    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: parseInt(document.getElementById('year').value),
        quantity: parseInt(document.getElementById('quantity').value)
    };

    await addBook(book);
    currentPage = 'home';
    loadPage();
}

// Fungsi untuk mengubah halaman ke tambah buku
function handleClickAddNav() {
    currentPage = 'add';
    loadPage();
}

// Menambahkan event listener untuk navigasi
const navLinks = document.querySelectorAll('li a');
navLinks.forEach((navLink) => {
    navLink.addEventListener('click', handleClickAddNav);
});

// Fungsi untuk menghasilkan baris tabel buku
function generateRows(books) {
    let rows = '';
    if (books.length === 0) {
        rows = `<tr>
   <td colspan="6" class="px-6 py-4 border-b text-center">Tidak ada buku yang ditemukan</td>
</tr>`;
    } else {
        books.forEach(book => {
            rows += `
            <tr class="book-item">
            <td class="px-6 py-4 border-b">${book.title}</td>
            <td class="px-6 py-4 border-b">${book.author}</td>
            <td class="px-6 py-4 border-b">${book.year}</td>
            <td class="px-6 py-4 border-b">${book.quantity}</td>
            <td class="px-6 py-4 border-b text-center">
              <button class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickEditButton(${book.id})">Edit</button>
              <button class="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onclick="handleClickDeleteButton(${book.id})">Hapus</button>  
            </td>
          </tr>`;
        });
    }
    return rows;
}

// Fungsi untuk menghasilkan input form edit
function generateEditFormInput() {
    return `<div class="mb-4">
  <label for="title" class="block text-gray-700 font-semibold mb-2">Judul Buku</label>
  <input required type="text" id="title" name="title" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.title}">
</div>
<div class="mb-4">
  <label for="author" class="block text-gray-700 font-semibold mb-2">Penulis Buku</label>
  <input required type="text" id="author" name="author" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.author}">
</div>
<div class="mb-4">
  <label for="year" class="block text-gray-700 font-semibold mb-2">Tahun Terbit</label>
  <input required type="number" id="year" name="year" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.year}">
</div>
<div class="mb-4">
  <label for="quantity" class="block text-gray-700 font-semibold mb-2">Jumlah Stok</label>
  <input required type="number" id="quantity" name="quantity" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" value="${currentBook?.quantity}">
</div>
<div class="flex justify-center">
  <input type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" value="simpan" />
</div>`;
}

// Fungsi untuk memuat halaman sesuai currentPage
async function loadPage() {
    switch (currentPage) {
        case 'home':
            await fetchBooks();
            main.innerHTML = pageListMainContent;

            const tableBody = document.querySelector('tbody');
            const rows = generateRows(books);
            tableBody.innerHTML = rows;
            break;
        case 'edit':
            main.innerHTML = pageEditBookMainContent;

            const form = document.querySelector('form');
            let formInput = await generateEditFormInput();
            form.innerHTML = formInput;
            break;
        case 'add':
            main.innerHTML = pageAddBookMainContent;
            break;
    }
}

// Fungsi untuk mengambil data buku dari server
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3333/books');
        books = await response.json();
    } catch (error) {
        console.log(error);
        console.log('Terjadi kesalahan saat mengambil data buku');
    }
}

// Fungsi untuk menambah buku
async function addBook(book) {
    try {
        await fetch("http://localhost:3333/books", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });
    } catch (error) {
        console.log(error);
        console.log('Terjadi kesalahan saat menambah buku');
    }
}

// Fungsi untuk mengedit buku
async function editBook(book) {
    try {
        await fetch(`http://localhost:3333/books/${currentBook.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(book)
        });
    } catch (error) {
        console.log(error);
        console.log('Terjadi kesalahan saat mengubah buku');
    }
}

// Fungsi untuk menghapus buku
async function deleteBook(bookId) {
    try {
        await fetch(`http://localhost:3333/books/${bookId}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.log(error);
        console.log('Terjadi kesalahan saat menghapus buku');
    }
}

// Memuat halaman saat pertama kali
loadPage();
