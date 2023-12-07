const todoInput = document.querySelector('.todo-input input'),
  filters = document.querySelectorAll('.filters span'),
  clearAll = document.querySelector('.clear-btn'),
  todoBox = document.querySelector('.todo-box'),
  addTodoBtn = document.querySelector('.add-btn');

//getting the id of the todo being edited to prevent making new todo after editing
let editId;
let isEditTodo = false;

//getting todo-items, retrieved from the localStorage
const savedTodos = JSON.parse(localStorage.getItem('todo-list'));
let todos = savedTodos ? savedTodos : [];

//=============> Show Todo List ==========
const showTodo = (filter) => {
  let todoList = '';

  //if todos exists

  todos.forEach((todo, id) => {
    //if todo status is completed, set the the isCompleted to checked(style)
    let isCompleted = todo.status === 'completed' ? 'checked' : '';

    if (filter === todo.status || filter === 'all') {
      todoList += `
        <li class="task">
          <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" 
            ${isCompleted}>
            
            <p class="${isCompleted}">
              ${todo.name}
            </p>
          </label>

          
          <div class="settings">
            <i onclick="showMenu(this)" class="ellipsis uil uil-ellipsis-h"></i>
            
            <ul class="todo-menu">
              <li onclick='editTodo(${id}, "${todo.name}")'>
                <i class="uil uil-pen"></i>
                Edit
              </li>

              <li onclick='deleteTodo(${id}, "${filter}")'>
                <i class="uil uil-trash"></i>
                Delete
              </li>
            </ul>
          </div>
        </li>
        `;
    }
  });

  //show todo in todo-box
  if (todoList === '') {
    todoBox.innerHTML = "<span>You don't have any todo here!</span>"; // properly setting the message
  } else {
    todoBox.innerHTML = todoList;
  }

  let checkTodo = todoBox.querySelectorAll('.task');

  //if there is any todo, clearAll btn will activated
  !checkTodo.length
    ? clearAll.classList.remove('active')
    : clearAll.classList.add('active');

  //checks the height of the todoBox
  todoBox.offsetHeight >= 300
    ? todoBox.classList.add('overflow')
    : todoBox.classList.remove('overflow');
};

//display all todo
showTodo('all');

//============>> Add Todo to task-box ==========
const addTodo = () => {
  let userTodo = todoInput.value.trim();

  //checks if userTodo is not an empty string
  if (userTodo) {
    //If isEditTodo isn't true, creates a new todo
    if (!isEditTodo) {
      todos = !todos ? [] : todos;

      //create new todo
      let todoInfo = { name: userTodo, status: 'pending' };

      todos.push(todoInfo);
    } else {
      //If it's being edited, update the name of the todo at the specified editId in the todos array.
      isEditTodo = false;
      todos[editId].name = userTodo;
    }

    //reset todoInput after adding or editing the todo
    todoInput.value = '';

    // save todo to the localStorage
    localStorage.setItem('todo-list', JSON.stringify(todos));

    //display the updated todo list
    showTodo('all');
  }
};

addTodoBtn.addEventListener('click', addTodo);

//if the event is triggered by a keypress
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

//=============>> Filter options ==========
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active').classList.remove('active');

    btn.classList.add('active');

    showTodo(btn.id);
  });
});

//=============>> Update Status ============
const updateStatus = (selectedTodo) => {
  // parentElement = label | lastElementChild = tag p(todo-name)
  let todoName = selectedTodo.parentElement.lastElementChild;

  if (selectedTodo.checked) {
    todoName.classList.add('checked');

    /* todos are an "array" so we need to get the "id of selected-todo"
       then update the status from "pending" to "completed" */
    todos[selectedTodo.id].status = 'completed';
  } else {
    todoName.classList.remove('checked');

    todos[selectedTodo.id].status = 'pending';
  }

  localStorage.setItem('todo-list', JSON.stringify(todos));
};

//============>> Show Menu: edit, delete ==========
const showMenu = (selectedTodo) => {
  // parentElement = li | lastElementChild = todo menu div
  let menuDiv = selectedTodo.parentElement.lastElementChild;

  menuDiv.classList.add('show');

  // removing show class from the task menu on the document click
  document.addEventListener('click', (e) => {
    //if the target element is not an <i> tag
    if (e.target.tagName !== 'I' || e.target !== selectedTodo) {
      menuDiv.classList.remove('show');
    }
  });
};

//============>> delete todo ===========
const deleteTodo = (deleteId, filter) => {
  isEditTodo = false;

  //removing one element(selected-todo) from todos at the index specified by deleteId
  todos.splice(deleteId, 1);

  localStorage.setItem('todo-list', JSON.stringify(todos));

  showTodo(filter);
};

//============>> Edit todo ===========
const editTodo = (todoId, todoName) => {
  editId = todoId;
  isEditTodo = true;

  todoInput.value = todoName;
  todoInput.focus();
  todoInput.classList.add('active');
};

//===========>> Clear all todo ===========
clearAll.addEventListener('click', () => {
  isEditTask = false;

  //removing all todo - starting from index 0 and removing todos.length number
  todos.splice(0, todos.length);

  localStorage.setItem('todo-list', JSON.stringify(todos));

  showTodo();
});
