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

            <button class='todo__edit' 
            data-id="${todo.id}">
               <i class="ri-pencil-line"></i>
            </button>

            <button class='todo__remove' 
            data-id = ${todo.id}>
               <i class="ri-delete-bin-line"></i>
            </button>
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
};

/*-> END <-*/

/*--------------------- REMOVE ---------------------*/
function removeTodo(e) {
  let myTodo = getAllTodo();

  const todoId = Number(e.target.dataset.id);
  myTodo = myTodo.filter((todo) => todo.id !== todoId);

  // Saves the updated "myTodo" array to localStorage
  saveAllMyTodo(myTodo);

  /*-> to prevent that when a todo is deleted, the rest of the todos are not shown in the "uncompleted" section */
  filterAllTodo();
}

/*-------------------- CHECK ----------------------*/
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

/*----------------- EDIT ----------------------*/
function editTodo(e) {
  const myTodo = getAllTodo();

  const todoId = Number(e.target.dataset.id);

  // finds the closest parent el of the el that triggered the event with a class of "todo" and from that el, it finds the first descendant el with a class of "todo__title"
  const input = e.target.closest('.todo').querySelector('.todo__title');

  input.contentEditable = true;

  // select and ready to accept user input.
  input.focus();
  const initialValue = input.innerText;

  /* when the user leaves the input field -> create new todo of editing */
  input.addEventListener('blur', () => {
    input.contentEditable = false;

    const updatedValue = input.innerText.trim();

    if (updatedValue === initialValue) return;

    const myNewTodo = myTodo.map((todo) => {
      if (todo.id === todoId) {
        todo.title = updatedValue;
      }
      return todo;
    });

    saveAllMyTodo(myNewTodo);
    filterAllTodo();
  });
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
