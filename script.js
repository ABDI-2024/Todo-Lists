const form = document.querySelector(".todo-form");
const inputText = document.querySelector(".todo-input");
const templete = document.querySelector("template");

const list = document.querySelector(".todo-list");

let toDoList = load();

toDoList.forEach(render);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ToDoText = inputText.value;
  if (ToDoText === "") return;

  createTodoList(ToDoText);
  inputText.value = "";
});

function createTodoList(toDoText) {
  const newTodo = { text: toDoText, complete: false, id: crypto.randomUUID() };
  toDoList.push(newTodo);

  render(newTodo);
  saveLocal();
}

function render(todo) {
  const clone = templete.content.cloneNode(true);

  const itemContainer = clone.querySelector(".todo-item");
  const checkBoxElement = clone.querySelector(".todo-checkbox");
  const todoTextElement = clone.querySelector(".todo-text");

  itemContainer.dataset.id = todo.id;
  checkBoxElement.checked = todo.complete;
  todoTextElement.innerText = todo.text;
  todo.complete ? todoTextElement.classList.add("completed") : "";

  list.appendChild(itemContainer);
}

function toggleComplete(todo, e) {
  todo.complete = !todo.complete;
  todo.complete
    ? e.target.nextElementSibling.classList.add("completed")
    : e.target.nextElementSibling.classList.remove("completed");
  e.target.checked = todo.complete;
}
function deleteTodo(parent, todoId) {
  toDoList = toDoList.filter((t) => t.id !== todoId);
  parent.remove();
}

function editTodo(parent, todo) {
  const templelteEdit = document.querySelector(".edit-todo-item-templete");
  const templelteEditClone = templelteEdit.content.cloneNode(true);

  const editForm = templelteEditClone.querySelector(".edit-form");
  const editText = editForm.firstElementChild;
  editText.value = todo.text;

  const oldChildren = Array.from(parent.children);

  parent.replaceChildren(editForm);

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (editText.value === "") return;
    todo.text = editText.value;
    oldChildren[1].innerText = todo.text;

    parent.replaceChildren(...oldChildren);
    saveLocal();
  });
  editForm.addEventListener("reset", (e) => {
    e.preventDefault();

    parent.replaceChildren(...oldChildren);
  });
}

list.addEventListener("click", (e) => {
  const parent = e.target.closest(".todo-item");
  const todoId = parent.dataset.id;
  const todo = toDoList.find((t) => t.id === todoId);

  if (e.target.matches(".todo-checkbox")) {
    toggleComplete(todo, e);
  } else if (e.target.matches(".delete-btn")) {
    deleteTodo(parent, todoId);
  } else if (e.target.matches(".edit-btn")) {
    editTodo(parent, todo);
  }
  saveLocal();
});

function saveLocal() {
  localStorage.setItem("list", JSON.stringify(toDoList));
}

function load() {
  const saved = localStorage.getItem("list");
  return JSON.parse(saved) || [];
}
