/*===================== Document Title ===================== */
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Welcome 😍' : 'Follow for more! ✌';

  // title switch alternate between the two values
  alertShow = !alertShow;
}, 1000);

/*===================$ Create NEW TODO $=================== */
const todoInput = document.querySelector('.content'),
  todoForm = document.querySelector('.todo-form'),
  todoList = document.querySelector('.todo-list');

let myTodo = [];

const addNewTodo = (e) => {
  // prevent the refreshing page
  e.preventDefault();

  // if the input value is empty or only contains whitespace characters
  if (!todoInput.value.trim()) return;

  // store user data
  const newTodo = {
    id: Date.now(),
    createAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };

  myTodo.push(newTodo);

  createMyTodo(myTodo);
};

const createMyTodo = (myTodo) => {
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
 
         <div class="details__button">
            <button data-todo = ${todo.id}>
               <i class="todo__check ri-check-line"></i>
            </button>
            <button data-todo = ${todo.id}>
               <i class="todo__remove ri-delete-bin-line"></i>
            </button>
         </div>
       </div>
 
     </li>
   `;
  });

  // add new todo to DOM
  todoList.innerHTML = result;

  // reset input todo every time
  todoInput.value = ' ';
};

todoForm.addEventListener('submit', addNewTodo);

/*===================$ Select Options $=================== */
const selectOption = document.querySelector('.filter-todo');

const filterTodo = (e) => {
  const filter = e.target.value;

  switch (filter) {
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
};

selectOption.addEventListener('change', filterTodo);
