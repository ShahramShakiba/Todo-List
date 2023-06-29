/*===================== Document Title ===================== */

let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Welcome 😍' : 'Follow for more! ✌';

  //-> title switch alternatively between the two values
  alertShow = !alertShow;
}, 1000);

/*-> END <-*/

/*===================$ Create NEW TODO $=================== */

const todoInput = document.querySelector('.content'),
  todoForm = document.querySelector('.todo-form'),
  todoList = document.querySelector('.todo-list');

todoForm.addEventListener('submit', addNewTodo);

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
  filterAllTodo();
}

/*-------> END <-------*/

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

  /*---> END <----*/

  /*------------$ Get REMOVE, CHECK & EDIT TODO Btns $------------- */

  //-> since our buttons are here -> to access them

  //-> querySelectorAll : returns a NodeList, and the spread operator can be used to turn it into a regular array

  /*-> Spread OP : create a new array that contains all the elements that match the selector */

  const removeBtns = [...document.querySelectorAll('.todo__remove')];
  removeBtns.forEach((btn) => btn.addEventListener('click', removeTodo));

  const checkBtns = [...document.querySelectorAll('.todo__check')];
  checkBtns.forEach((btn) => btn.addEventListener('click', checkTodo));

  const editBtns = [...document.querySelectorAll('.todo__edit')];
  editBtns.forEach((btn) => btn.addEventListener('click', editTodo));

  const closeModalBtns = document.querySelectorAll('.close-modal');
  const backDrop = document.querySelector('.backdrop');
  const modal = document.querySelector('.modal');
  const showModalBtn = [...document.querySelectorAll('.show-modal')];

  const closeModal = () => {
    backDrop.classList.add('hidden');
    modal.classList.add('hidden');
  };

  const showModal = (e) => {
    const todoId = e.target.dataset.id;
    const input = document.querySelector('.edit-input');
    input.value = getTodoTitleById(todoId);

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

/*-> END <-*/

function getTodoTitleById(todoId) {
  const todo = getAllTodo().find((todo) => todo.id === Number(todoId));
  return todo ? todo.title : '';
}

/*----------------------- REMOVE -----------------------*/
function removeTodo(e) {
  let myTodo = getAllTodo();

  const todoId = Number(e.target.dataset.id);
  myTodo = myTodo.filter((todo) => todo.id !== todoId);

  // Saves the updated "myTodo" array to localStorage
  saveAllMyTodo(myTodo);

  /*-> to prevent that when a todo is deleted, the rest of the todos are not shown in the "uncompleted" section */
  filterAllTodo();
}

/*---------------------- CHECK -------------------------*/
function checkTodo(e) {
  const myTodo = getAllTodo();

  const todoId = Number(e.target.dataset.id);
  const todo = myTodo.find((todo) => todo.id === todoId);

  // causing it to change its status between "true" and "false".
  todo.isCompleted = !todo.isCompleted;

  saveAllMyTodo(myTodo);

  //-> to check which checkBtn is clicked -> store in completed
  filterAllTodo();
}

/*---------------------- EDIT --------------------------*/
function editTodo() {
  const todoId = Number(this.dataset.id);

  const input = document.querySelector('.edit-input');

  input.contentEditable = true;
  input.focus();

  const initialValue = input.value;

  // when the user leaves the input field -> create new todo of editing 
  input.addEventListener('blur', () => {
    input.contentEditable = false;

    const updatedValue = input.value.trim();

    if (updatedValue === initialValue) return;

    updateTodoTitle(todoId, updatedValue);
    filterAllTodo();
  });
}

function updateTodoTitle(todoId, updatedValue) {
  const myTodo = getAllTodo();

  const myNewTodo = myTodo.map((todo) => {
    if (todo.id === todoId) {
      todo.title = updatedValue;
    }
    return todo;
  });

  saveAllMyTodo(myNewTodo);
}

/*-> END <-*/

/*===================$ Filter Options $======================= */

const filterOptions = document.querySelector('.filter-todo');

let filterValue = 'all';

filterOptions.addEventListener('change', (e) => {
  // to get the option select that the user chooses
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

/*-> END <-*/

/*=========================$ localStorage $========================== */

document.addEventListener('DOMContentLoaded', () => {
  //-> get all todos from localStorage
  const allTodo = getAllTodo();

  //-> create todo
  createMyTodo(allTodo);
});

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
