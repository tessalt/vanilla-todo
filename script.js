function Todo(title) {
  this.title = title;
  this.completed = false;
  this.id = getUuid();
}

var todos = [];
var ENTER_KEY = 13;

window.onload = function(){
  redrawUi();
  listeners();
  refreshData();
}

function listeners() {
  document.getElementById("submit").addEventListener("click", handleSubmit, false);
  document.getElementById("input").addEventListener("keypress", checkKeypress, false);
}

function checkKeypress() {
  if (event.keyCode === ENTER_KEY) {
    handleSubmit();
  }
}

function handleSubmit() {
  addTodo();
  saveTodos();
  refreshData();
}

function addTodo(){
  var input = document.getElementById("input").value;
  if (input.length > 1 ) {
    console.log(input.length);
    var todo = new Todo(input);
    todos.push(todo); 
  }
}


function saveTodos() {
  localStorage.setItem( 'todos-js', JSON.stringify( todos ) );
}

function refreshData() {
  loadTodos();
  redrawUi();
}

function loadTodos() {
  if ( !localStorage.getItem('todos-js') ) {
    localStorage.setItem( 'todos-js', JSON.stringify([]) );
  }
  todos = JSON.parse(localStorage.getItem( 'todos-js'));
}

function redrawUi() {
  var ul = document.getElementById("todos");
  var li, span, checkbox, deleteLink;
  ul.innerHTML = " ";

  for (i = 0; i < todos.length; i++) {
    thisTodo = todos[i]; 
    li = document.createElement("li");
    li.innerHTML = "<label for='todo-" + thisTodo.id + "'>" + thisTodo.title + "</label>";
    span = li.children
    li.className = "completed-" + thisTodo.completed;
    
    checkbox = document.createElement("input");
    checkbox.setAttribute("id", "todo-" + thisTodo.id);
    checkbox.type = 'checkbox';
    checkbox.classname = 'toggle';
    checkbox.setAttribute("data-t-id", thisTodo.id);

    deleteLink = document.createElement("a");
    deleteLink.textContent ="delete";
    deleteLink.setAttribute("class", "delete-link");
    deleteLink.setAttribute("data-t-id", thisTodo.id);
    deleteLink.addEventListener("click", deleteTodo, false);

    if (thisTodo.completed === true) {
      checkbox.checked=true;
    } else {
      checkbox.checked=false;
    }
    checkbox.addEventListener("change", changeCheckbox);
    
    li.insertBefore(checkbox, li.firstChild); 
    li.appendChild(deleteLink);
    ul.insertBefore(li, ul.firstChild);
  }

  input.value = " ";
}

function changeCheckbox(event) {
  var tid = event.target.getAttribute("data-t-id");
  var todo = getTodoById(tid);
  toggleComplete(todo);
  event.target.parentNode.className = "completed-" + todo.completed;
}

function deleteTodo(event) {
  var tid = event.target.getAttribute("data-t-id");
  var todo = getTodoById(tid);
  var spot = todos.indexOf(todo);
  todos.splice(spot, 1);
  saveTodos();
  refreshData();
}

function getTodoById(id) {
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      return todos[i];
    }
  }
}

function toggleComplete(todo) {
  if (todo.completed === false) {
    todo.completed = true;
  } else {
    todo.completed = false;
  }
  saveTodos();
}

function getUuid() {
  var i, random,
    uuid = '';
  for ( i = 0; i < 32; i++ ) {
    random = Math.random() * 16 | 0;
    if ( i === 8 || i === 12 || i === 16 || i === 20 ) {
      uuid += '-';
    }
    uuid += ( i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random) ).toString( 16 );
  }
  return uuid;
}