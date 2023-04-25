const books = []; /* variabel berisi array yang akan menampung object */
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "save-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchSubmit = document.getElementById("searchSubmit");

  searchSubmit.addEventListener("click", function (event) {
    event.preventDefault();
    searchBookList();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  // Menginisialisasi setiap variabel
  const inputBookTitleField = document.getElementById("inputBookTitle").value;
  const inpuBookAuthorField = document.getElementById("inputBookAuthor").value;
  const inputBookYearField = document.getElementById("inputBookYear").value;
  const checkBook = document.getElementById("inputBookIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    inputBookTitleField,
    inpuBookAuthorField,
    inputBookYearField,
    checkBook,
    false
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Kode tersebut akan mengembalikan nilai dari ekspresi "+new Date()", yang akan menghasilkan nilai timestamp dalam milisecond saat fungsi tersebut dipanggil. Tanda plus (+) di depan ekspresi tersebut bertujuan untuk mengkonversi nilai timestamp menjadi tipe data number.
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(books);
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const checkBook = document.getElementById("inputBookIsComplete").checked;

  //clearing list item
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.append(bookElement);
    } else if (checkBook.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  //inisialisasi variabel untuk menampilkan elemen h2 dan paraf
  const bookTitle = document.createElement("h2");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  //membuat parent pembungkus yang membungkus elemen-elemen diatas
  const container = document.createElement("article");
  container.classList.add("book-item");
  container.append(bookTitle, bookAuthor, bookYear);
  container.setAttribute("id", "book-${bookObject.id}");

  //perkondisian
  if (bookObject.isComplete) {
    //membuat child berisi button dengan kelasnya
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });
    const ButtonWrap = document.createElement("div");
    ButtonWrap.append(undoButton, trashButton);
    container.append(ButtonWrap);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });
    const ButtonWrap = document.createElement("div");
    ButtonWrap.append(checkButton, trashButton);
    container.append(ButtonWrap);
  }
  return container;
}

function addTaskToCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;
  window.alert("Books Has Been Deleted!");
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function searchBookList() {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchBookItems = document.querySelectorAll(".book-item > h2 ");

  if (searchBookTitle != "") {
    for (const data of searchBookItems) {
      if (data.innerText.toLowerCase().includes(searchBookTitle)) {
        data.parentElement.style.display = "block";
      } else {
        data.parentElement.style.display = "none";
      }
    }
    window.alert("Books has been Found!");
  } else {
    window.alert("Books not found!");
  }
}
