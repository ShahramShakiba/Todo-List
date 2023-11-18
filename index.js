const todoInput = document.querySelector('.task-input input'),
  filters = document.querySelectorAll('.filters span'),
  clearAll = document.querySelector('.clear-btn'),
  taskBox = document.querySelector('.task-box'),
  addTodoBtn = document.querySelector('.add-btn');

let editId;
isEditTodo = false;

todos = JSON.parse(localStorage.getItem('todo-list'));

//===========>> Filter options functionality
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active').classList.remove('active');

    btn.classList.add('active');

    showTodo(btn.id);
  });
});

//============> Show Todo List
const showTodo = (filter) => {
  let todoList = '';

  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status === 'completed' ? 'checked' : '';

      if (filter === todo.status || filter === 'all') {
        todoList += `
        <li class="task">
          <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
            
            <p class="${completed}">
              ${todo.name}
            </p>
          </label>

          <div class="settings">
            <i onclick="showMenu(this)" class="ellipsis uil uil-ellipsis-h"></i>
            
            <ul class="task-menu">
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
  }

  taskBox.innerHTML = todoList || `<span>You don't have any todo here!</span>`;

  let checkTask = taskBox.querySelectorAll('.task');

  !checkTask.length
    ? clearAll.classList.remove('active')
    : clearAll.classList.add('active');

  taskBox.offsetHeight >= 300
    ? taskBox.classList.add('overflow')
    : taskBox.classList.remove('overflow');
};

showTodo('all');

//==============>> Add Todo to task-box
const addTodo = () => {
  let userTodo = todoInput.value.trim();

  if (userTodo) {
    if (!isEditTodo) {
      todos = !todos ? [] : todos;

      let todoInfo = { name: userTodo, status: 'pending' };

      todos.push(todoInfo);
    } else {
      isEditTodo = false;
      todos[editId].name = userTodo;
    }

    todoInput.value = '';
    localStorage.setItem('todo-list', JSON.stringify(todos));

    showTodo(document.querySelector('span.active').id);
  }
};

addTodoBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTodo();
  }
});

//============>> Show Menu: edit, delete
const showMenu = (selectedTask) => {
  let menuDiv = selectedTask.parentElement.lastElementChild;

  menuDiv.classList.add('show');

  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'I' || e.target !== selectedTask) {
      menuDiv.classList.remove('show');
    }
  });
};

//============>> Update Status
const updateStatus = (selectedTask) => {
  let taskName = selectedTask.parentElement.lastElementChild;

  if (selectedTask.checked) {
    taskName.classList.add('checked');
    todos[selectedTask.id].status = 'completed';
  } else {
    taskName.classList.remove('checked');
    todos[selectedTask.id].status = 'pending';
  }

  localStorage.setItem('todo-list', JSON.stringify(todos));
};

//===========>> Edit todo
const editTodo = (todoId, textName) => {
  editId = todoId;
  isEditTodo = true;

  todoInput.focus();
  todoInput.value = textName;
  todoInput.classList.add('active');
};

//===========>> delete todo
const deleteTask = (deleteId, filter) => {
  isEditTodo = false;

  todos.splice(deleteId, 1);

  localStorage.setItem('todo-list', JSON.stringify(todos));

  showTodo(filter);
};

//===========>> Clear all todo
clearAll.addEventListener('click', () => {
  isEditTask = false;

  todos.splice(0, todos.length);

  localStorage.setItem('todo-list', JSON.stringify(todos));

  showTodo();
});
