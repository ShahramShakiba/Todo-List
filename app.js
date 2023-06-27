/*===================== Document Title ===================== */
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Welcome 😍' : 'Follow for more! ✌';

  //-> title switch alternatively between the two values
  alertShow = !alertShow;
}, 1000);

/*-> END <-*/

/*===================$ CALL LocalStorage $================== */
/*-> to get all todos we have in localStorage and display on DOM when DOM is reloaded  */
document.addEventListener('DOMContentLoaded', (e) => {
  //-> get all todos from localStorage
  const todos = getAllTodos();

  //-> create todo
  createMyTodo(todos);
});

function getAllTodos() {
  const savedTodo = JSON.parse(localStorage.getItem('todos')) || [];
  return savedTodo;
}

function saveTodo(todo) {
  const savedTodo = getAllTodos();
  savedTodo.push(todo);

  localStorage.setItem('todos', JSON.stringify(savedTodo));
  return savedTodo;
}

function saveAllTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/*-> END <-*/

/*===================$ Create NEW TODO $=================== */
const todoInput = document.querySelector('.content'),
  todoForm = document.querySelector('.todo-form'),
  todoList = document.querySelector('.todo-list');

function addNewTodo(e) {
  e.preventDefault();

  const todoTitle = todoInput.value.trim();
  if (todoTitle === '') {
    alert('Please enter your todo');
    return;
  }

  //-> store user data
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoTitle,
    isCompleted: false,
  };

  saveTodo(newTodo);

  /*-> to avoid that when we are in "completed" and if a new todo is added, this new todo is not shown in completed */
  filterTodos();
}

/*-------> END <-------*/

const createMyTodo = (todos) => {
  let result = '';

  todos.forEach((todo) => {
    //-> if "isCompleted" is true -> add completed class
    result += `  
    <li class="todo">
      <p class="todo__title ${todo.isCompleted && 'completed'}">
          ${todo.title}
      </p>

      <div class="todo__details">
         <span class="todo__createAt">
         ${new Date(todo.createdAt).toLocaleDateString()}
         </span>
 
         <div class="details__button">
            <button class='todo__check' 
            data-todo-id = ${todo.id}>
               <i class="ri-check-line"></i>
            </button>

            <button class='todo__edit' 
            data-todo-id="${todo.id}">
               <i class="ri-pencil-line"></i>
            </button>

            <button class='todo__remove' 
            data-todo-id = ${todo.id}>
               <i class="ri-delete-bin-line"></i>
            </button>
          </div> 
      </div>
     </li>
   `;
  });

  //-> add new todo to DOM
  todoList.innerHTML = result;

  //-> reset input todo every time
  todoInput.value = '';

  todoForm.addEventListener('submit', addNewTodo);

  /*---------------> END <----------------*/

  /*-------------$ REMOVE & CHECK TODO $-------------- */
  //-> since our buttons are here -> to access them
  const removeBtns = [...document.querySelectorAll('.todo__remove')];
  removeBtns.forEach((btn) => btn.addEventListener('click', removeTodo));

  const checkBtns = [...document.querySelectorAll('.todo__check')];
  checkBtns.forEach((btn) => btn.addEventListener('click', checkTodo));

  const editBtns = [...document.querySelectorAll('.todo__edit')];
  editBtns.forEach((btn) => btn.addEventListener('click', editTodo));
};

/*--------- REMOVE ----------*/
function removeTodo(e) {
  let todos = getAllTodos();

  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);

  // Saves the updated "todos" array to localStorage
  saveAllTodos(todos);

  /*-> to prevent that when a todo is deleted, the rest of the todos are not shown in the "uncompleted" section */
  filterTodos();
}

/*--------- CHECK ----------*/
function checkTodo(e) {
  const todos = getAllTodos();

  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;

  saveAllTodos(todos);

  //-> to check which checkBtn is clicked -> store in completed
  filterTodos();
}

/*--------- EDIT ----------*/
function editTodo(e) {
  const todos = getAllTodos();

  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);

  const input = e.target.closest('.todo').querySelector('.todo__title');
  input.contentEditable = true;
  input.focus();
  const initialValue = input.innerText;

  /* when the user leaves the input field -> create new todo of editing */
  input.addEventListener('blur', () => {
    input.contentEditable = false;
    const updatedValue = input.innerText.trim();

    if (updatedValue === initialValue) {
      return;
    }

    const newTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.title = updatedValue;
      }
      return todo;
    });

    saveAllTodos(newTodos);
    filterTodos();
  });
}

/*-> END <-*/

/*==================$ Select Options $===================== */
const selectOptions = document.querySelector('.filter-todo');
let filterValue = 'all';

const filterTodos = () => {
  const todos = getAllTodos();

  switch (filterValue) {
    case 'all': {
      createMyTodo(todos);
      break;
    }

    case 'completed': {
      const filterMyTodo = todos.filter((t) => t.isCompleted);
      createMyTodo(filterMyTodo);
      break;
    }

    case 'uncompleted': {
      const filterMyTodo = todos.filter((t) => !t.isCompleted);
      createMyTodo(filterMyTodo);
      break;
    }

    default:
      createMyTodo(todos);
  }
};

selectOptions.addEventListener('change', (e) => {
  // to get the option select that the user chooses
  filterValue = e.target.value;

  filterTodos();
});
