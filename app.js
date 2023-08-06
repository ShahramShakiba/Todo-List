/*================👇 Document Title 👇================= */

let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Welcome 😍' : 'Follow for more! ✌';

  alertShow = !alertShow;
}, 1000);

/*============👇 Load Content On DOM 👇==============*/

document.addEventListener('DOMContentLoaded', () => {
  //-> get all todos from localStorage
  const allTodo = getAllTodo();

  //-> create todo on DOM
  createMyTodo(allTodo);
});

/*=============👇 Create NEW TODO 👇================*/

const todoInput = document.querySelector('.content'),
  todoForm = document.querySelector('.todo-form'),
  todoList = document.querySelector('.todo-list');

todoForm.addEventListener('submit', addNewTodo);

function addNewTodo(e) {
  e.preventDefault();

  const todoContent = todoInput.value.trim();

  if (todoContent === '') {
    alert('Please enter your todo');
    return;
  }

  //-> store user data
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoContent,
    isCompleted: false,
  };

  saveTodo(newTodo);

  /*-> to avoid when we're in "completed" option and if a new todo is added, this new todo is not shown in completed */
  filterAllTodo();
}

/*=============👇 Create TODO Template 👇==============*/

const createMyTodo = (myTodo) => {
  let result = '';

  myTodo.forEach((todo) => {
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
            data-id = ${todo.id}>
               <i class="ri-check-line"></i>
            </button>

            <button class='todo__edit show-modal' 
            data-id="${todo.id}">
               <i class="ri-pencil-line"></i>
            </button>

            <button class='todo__remove' 
            data-id = ${todo.id}>
               <i class="ri-delete-bin-line"></i>
            </button>
          </div> 
          
          <div class="backdrop hidden"></div>

          <div class="modal hidden" id="modal">
            <div class="modal__header">
              <h1>Todo list</h1>
              <button class="close-modal">&times;</button>
            </div>

            <div class="modal__input">
               <textarea class="edit-input" value="${todo.title}" ></textarea>
            
            </div>
          </div>
      </div>
     </li>
   `;
  });

  //-> add new todo to DOM
  todoList.innerHTML = result;

  //-> reset input todo every time after each entering
  todoInput.value = '';

  /*==========$ Get REMOVE, CHECK & EDIT TODO Btns $==========*/

  const removeBtns = [...document.querySelectorAll('.todo__remove')];
  const checkBtns = [...document.querySelectorAll('.todo__check')];
  const editBtns = [...document.querySelectorAll('.todo__edit')];
  
  removeBtns.forEach((btn) => btn.addEventListener('click', removeTodo));

  checkBtns.forEach((btn) => btn.addEventListener('click', checkTodo));

  editBtns.forEach((btn) => btn.addEventListener('click', editTodo));

  /*=============== MODAL =================*/
  const closeModalBtns = document.querySelectorAll('.close-modal'),
    backDrop = document.querySelector('.backdrop'),
    modal = document.querySelector('.modal'),
    showModalBtn = [...document.querySelectorAll('.show-modal')];

  const closeModal = () => {
    backDrop.classList.add('hidden');
    modal.classList.add('hidden');
  };

  const showModal = (e) => {
    let myTodo = getAllTodo();

    const todoId = e.target.dataset.id;

    myTodo = myTodo.find((todo) => todo.id === parseInt(todoId));
    const todo = myTodo ? myTodo.title : '';

    const input = document.querySelector('.edit-input');
    input.value = todo;

    backDrop.classList.remove('hidden');
    modal.classList.remove('hidden');
  };

  showModalBtn.forEach((btn) => {
    btn.addEventListener('click', showModal);
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  backDrop.addEventListener('click', closeModal);
};

/*==================👇 REMOVE 👇=================*/

function removeTodo(e) {
  let myTodo = getAllTodo();

  const todoId = Number(e.target.dataset.id);

  myTodo = myTodo.filter((todo) => todo.id !== todoId);

  saveAllMyTodo(myTodo);

  /*-> to prevent that when a todo is deleted, the rest of the todos are not shown in the "uncompleted" section */
  filterAllTodo();
}

/*==================👇 CHECK 👇=================*/

function checkTodo(e) {
  const myTodo = getAllTodo();

  const todoId = Number(e.target.dataset.id);

  const todo = myTodo.find((todo) => todo.id === todoId);

  todo.isCompleted = !todo.isCompleted;

  saveAllMyTodo(myTodo);

  //-> to check which checkBtn is clicked -> store in completed
  filterAllTodo();
}

/*=================👇 EDIT 👇===================*/

function editTodo() {
  const todoId = Number(this.dataset.id);

  const input = document.querySelector('.edit-input');

  input.contentEditable = true;
  input.focus();

  const initialValue = input.value;

  //when the user leaves the input field -> create new todo of editing
  input.addEventListener('blur', () => {
    input.contentEditable = false;

    const updatedValue = input.value.trim();

    if (updatedValue === initialValue) return;

    updateTodoContent(todoId, updatedValue);
    filterAllTodo();
  });
}

function updateTodoContent(todoId, updatedValue) {
  const myTodo = getAllTodo();

  const myNewTodo = myTodo.map((todo) => {
    if (todo.id === todoId) {
      todo.title = updatedValue;
    }
    return todo;
  });

  saveAllMyTodo(myNewTodo);
}

/*================👇 Filter Options 👇===================*/

const filterOptions = document.querySelector('.filter-todo');

let filterValue = 'all';

filterOptions.addEventListener('change', (e) => {
  //to get the option select that the user chooses
  filterValue = e.target.value;

  filterAllTodo();
});

function filterAllTodo() {
  const myTodo = getAllTodo();

  switch (filterValue) {
    case 'all': {
      createMyTodo(myTodo);
      break;
    }

    case 'completed': {
      const filterMyTodo = myTodo.filter((todo) => todo.isCompleted);
      createMyTodo(filterMyTodo);
      break;
    }

    case 'uncompleted': {
      const filterMyTodo = myTodo.filter((todo) => !todo.isCompleted);
      createMyTodo(filterMyTodo);
      break;
    }

    default:
      createMyTodo(myTodo);
  }
}

/*==================👇 localStorage 👇====================*/

function saveAllMyTodo(myTodo) {
  localStorage.setItem('myTodo', JSON.stringify(myTodo));
}

function getAllTodo() {
  return JSON.parse(localStorage.getItem('myTodo')) || [];
}

function saveTodo(todo) {
  const savedTodo = getAllTodo();
  savedTodo.push(todo);

  localStorage.setItem('myTodo', JSON.stringify(savedTodo));

  return savedTodo;
}
