/*===================== Document Title ===================== */
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Welcome 😍' : 'Follow for more! ✌';

  alertShow = !alertShow;
}, 1000);

/*======================== NEW TODO ======================== */
const todoInput = document.querySelector('.content'),
  todoForm = document.querySelector('.todo-form'),
  todoList = document.querySelector('.todo-list');

let myTodo = [];

const addNewTodo = (e) => {
  e.preventDefault();

  // if user only  enter a space
  if (!todoInput.value.trim()) return;

  // store user data
  const newTodo = {
    id: Date.now(),
    createAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };

  myTodo.push(newTodo);

  // Build myTodo on DOM
  let result = '';
  myTodo.forEach((todo) => {
    result += `  
    <li class="todo">
      <p class="todo__title">${todo.title}</p>

      <div class="todo__details">
        <span class="todo__createAt">
        ${new Date(todo.createAt).toLocaleDateString()}
        </span>

        <button data-todo = ${todo.id}>
        <i class="todo__check ri-check-line"></i>
        </button>
        <button data-todo = ${todo.id}>
        <i class="todo__remove ri-delete-bin-line"></i>
        </button>
      </div>

    </li>
  `;
  });

  // add new todo to DOM
  todoList.innerHTML = result;

  // reset input todo every time
  todoInput.value = '';
};

todoForm.addEventListener('submit', addNewTodo);
