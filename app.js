/*===================== Document Title ===================== */
let alertShow = false;

setInterval(() => {
  document.title = alertShow ? 'Welcome 😍' : 'Follow for more! ✌';

  //? title switch alternate between the two values
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

  filterTodo();
};

const createMyTodo = (myTodo) => {
  // Build myTodo on DOM
  let result = '';
  myTodo.forEach((todo) => {
    //! if isCompleted is true -> add completed class
    result += `  
     <li class="todo">
       <p class="todo__title ${todo.isCompleted && 'completed'}">
          ${todo.title}
       </p>

       <div class="todo__details">
         <span class="todo__createAt">
         ${new Date(todo.createAt).toLocaleDateString()}
         </span>
 
         <div class="details__button">

            <button class='todo__check' 
            data-todo-id = ${todo.id}>
               <i class="ri-check-line"></i>
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

  // add new todo to DOM
  todoList.innerHTML = result;
  // reset input todo every time
  todoInput.value = ' ';

  /*================$ REMOVE & CHECK TODO $================= */
  //? since our buttons are here -> to access them
  const removeBtn = [...document.querySelectorAll('.todo__remove')];
  removeBtn.forEach((btn) => btn.addEventListener('click', removeTodo));

  const checkBtn = [...document.querySelectorAll('.todo__check')];
  checkBtn.forEach((btn) => btn.addEventListener('click', checkTodo));
};

function removeTodo(e) {
  let todoId = Number(e.target.dataset.todoId);
  myTodo = myTodo.filter((todo) => todo.id !== todoId);
  filterTodo();
}

function checkTodo(e) {
  let todoId = Number(e.target.dataset.todoId);
  const todo = myTodo.find((todo) => todo.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  filterTodo();
}

todoForm.addEventListener('submit', addNewTodo);

/*===================$ Select Options $===================== */
const selectOption = document.querySelector('.filter-todo');
let filterValue = 'all';

const filterTodo = () => {
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
};

selectOption.addEventListener('change', (e) => {
  filterValue = e.target.value;
  filterTodo();
});
