// Constructor
function Book(name, author, type) {
  this.name = name;
  this.author = author;
  this.type = type;
}

// Display Constructor
function Display() {}

// Add methods to display prototype
Display.prototype.add = function (book) {
  let tableBody = document.getElementById("tableBody");
  let uiString = `<tr>
                        <td>${book.name}</td>
                        <td>${book.author}</td>
                        <td>${book.type}</td>
                        <td><button class="btn btn-danger btn-sm delete">Delete</button></td>
                    </tr>`;
  tableBody.innerHTML += uiString;
};

// Implement the clear function
Display.prototype.clear = function () {
  let libraryForm = document.getElementById("libraryForm");
  libraryForm.reset();
};

// Implement the validate function
Display.prototype.validate = function (book) {
  if (book.name.length < 2 || book.author.length < 2) {
    return false;
  } else {
    return true;
  }
};

Display.prototype.show = function (type, displayMessage) {
  let message = document.getElementById("message");
  message.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                            <strong>Message:</strong> ${displayMessage}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
  setTimeout(function () {
    message.innerHTML = "";
  }, 2000);
};

// Add submit event listener to libraryForm
let libraryForm = document.getElementById("libraryForm");
libraryForm.addEventListener("submit", libraryFormSubmit);

function libraryFormSubmit(e) {
  e.preventDefault();
  let name = document.getElementById("bookName").value.trim();
  let author = document.getElementById("author").value.trim();
  let type;
  let fiction = document.getElementById("fiction");
  let programming = document.getElementById("programming");
  let cooking = document.getElementById("cooking");

  if (fiction.checked) {
    type = fiction.value;
  } else if (programming.checked) {
    type = programming.value;
  } else if (cooking.checked) {
    type = cooking.value;
  }

  let book = new Book(name, author, type);
  let display = new Display();

  if (display.validate(book)) {
    display.add(book);
    display.clear();
    display.show("success", "Your book has been successfully added");

    // Store book data to localStorage
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  } else {
    // Show error to the user
    display.show("danger", "Please fill in all the fields correctly");
  }
}

// Event delegation for delete button
// Event delegation for delete button
document.getElementById("tableBody").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    let row = e.target.parentElement.parentElement;
    let bookName = row.cells[0].textContent.trim();
    let bookAuthor = row.cells[1].textContent.trim();
    let bookType = row.cells[2].textContent.trim();

    row.remove();

    // Remove book from localStorage
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(
      (book) =>
        !(
          book.name === bookName &&
          book.author === bookAuthor &&
          book.type === bookType
        )
    );
    localStorage.setItem("books", JSON.stringify(books));

    // Show message
    let display = new Display();
    display.show("success", "Book deleted successfully");
  }
});

// Function to load books from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  let books = JSON.parse(localStorage.getItem("books"));
  let display = new Display();
  books.forEach((book) => display.add(book));
});
