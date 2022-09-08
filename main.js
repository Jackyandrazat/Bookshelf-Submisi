const books = [];
const RENDER_BOOK_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      
      addBook();
    });
  });

  function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAutor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generateId();
    const bookObject = generatebookObject(generatedID, textTitle, textAutor,textYear,isComplete);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }
   
  function generatebookObject(id, tasktitle, taskAutor, taskYear,isComplete) {
    return {
      id,
      tasktitle,
      taskAutor,
      taskYear,
      isComplete
    }
  }

  document.addEventListener(RENDER_BOOK_EVENT, function () {
    const uncompleteBookList = document.getElementById("incompleteBookshelfList");
    uncompleteBookList.innerHTML = "";
    const listComplete = document.getElementById("completeBookshelfList");
    listComplete.innerHTML = "";
    
    for (bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isComplete) {
        listComplete.append(bookElement);
      } else {
        uncompleteBookList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {
    const textJudul = document.createElement('h2');
    textJudul.innerText = bookObject.tasktitle;
   
    const textPenulis = document.createElement('p');
    textPenulis.innerText = "Penulis : " + bookObject.taskAutor;

    const textTahun = document.createElement('p');
    textTahun.innerText = "Tahun : " + bookObject.taskYear;

    const buttonInputContainer = document.createElement("div");
    buttonInputContainer.classList.add("action");
 
    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textJudul, textPenulis, textTahun);
    container.append(buttonInputContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {
      const notCompleteButton = document.createElement("button");
      notCompleteButton.classList.add("green");
      notCompleteButton.innerText = "Belum selesai dibaca";
      notCompleteButton.addEventListener("click", function () {
        removeBookFromComplete(bookObject.id);
      });
   
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("red");
      deleteButton.innerText = "Hapus buku";
      deleteButton.addEventListener("click", function () {
        const ok = confirm("Yakin hapus dari daftar selesai dibaca?");
        if (ok) {
          deleteBookFromComplete(bookObject.id);
        } else {
          window.location = "index.html";
        }
      });
   
      buttonInputContainer.append(notCompleteButton, deleteButton);
    } else {
      const completeButton = document.createElement("button");
      completeButton.classList.add("green");
      completeButton.innerText = "Selesai dibaca";
      completeButton.addEventListener("click", function () {
        addBookToComplete(bookObject.id);
      });
      const eraseButton = document.createElement("button");
    eraseButton.classList.add("red");
    eraseButton.innerText = "Hapus buku";
    eraseButton.addEventListener("click", function () {
      const yes = confirm("Yakin hapus dari daftar Belum selesai dibaca?");
      if (yes) {
        deleteBookFromComplete(bookObject.id);
      } else {
        window.location = "index.html";
      }
    });
 
    buttonInputContainer.append(completeButton, eraseButton);
  }
   
    return container;
  }

  document.getElementById('searchBook').addEventListener('submit', function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item > h2');
    for (let book of bookList) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.parentElement.style.display = "block";
      } else {
        book.parentElement.parentElement.style.display = "none";
      }
    }
  });

  function addBookToComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
    saveData();
  }
  
  function deleteBookFromComplete(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
  
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
    saveData();
  }
  
  function removeBookFromComplete(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
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
      document.dispatchEvent(new Event(SAVED_BOOK_EVENT));
    }
  }

  const SAVED_BOOK_EVENT = 'saved-book';
  const STORAGE_KEY = 'Book_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_BOOK_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const shelfBook of data) {
      books.push(shelfBook);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_BOOK_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});