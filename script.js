
function updateTaskList() {
  const filter = document.getElementById('filter').value;
  const tasks = document.querySelectorAll('#task-list li');
  tasks.forEach(task => {
    const isCompleted = task.classList.contains('completed-task');
    const isActive = task.classList.contains('active-task');
    switch (filter) {
      case 'all':
        task.style.display = '';
        break;
      case 'active':
        task.style.display = isActive ? '' : 'none';
        break;
      case 'completed':
        task.style.display = isCompleted ? '' : 'none';
        break;
    }
  });
}


function changeStatus(task, status) {
  task.classList.remove('active-task', 'completed-task');
  task.classList.add(`${status}-task`);

  const statusLabel = task.querySelector('span');
  statusLabel.textContent = status.charAt(0).toUpperCase() + status.slice(1);
}


function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#task-list li').forEach(task => {
    tasks.push({
      text: task.childNodes[1].textContent, // Adjusted to get text after status label
      status: task.className.split(' ').find(cls => cls.includes('-task'))
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(({ text, status }) => addTask(text, status));
}


function addTask(text, status = 'active') {
  const taskList = document.getElementById('task-list');
  const newTask = document.createElement('li');
  newTask.classList.add('task-item', `${status}-task`);

  const statusLabel = document.createElement('span');
  statusLabel.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  statusLabel.style.marginRight = '10px';

  const taskText = document.createTextNode(text);

  const completeBtn = document.createElement('button');
  completeBtn.textContent = 'Complete';
  completeBtn.classList.add('complete-btn');
  completeBtn.addEventListener('click', function() {
    changeStatus(newTask, 'completed');
    saveTasks();
    updateTaskList();
  });

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'X';
  removeBtn.classList.add('remove-btn');
  removeBtn.addEventListener('click', function() {
    if (newTask.classList.contains('completed-task')) {
      newTask.remove();
      saveTasks();
    }
  });

  newTask.appendChild(statusLabel);
  newTask.appendChild(taskText);
  newTask.appendChild(completeBtn);
  newTask.appendChild(removeBtn);
  taskList.appendChild(newTask);
  saveTasks();
}


document.getElementById('add-task-btn').addEventListener('click', function() {
  const taskInput = document.getElementById('task-input');
  if (taskInput.value.trim() !== "") {
    addTask(taskInput.value, 'active');
    taskInput.value = '';
    updateTaskList();
  }
});


document.getElementById('filter').addEventListener('change', updateTaskList);


window.addEventListener('load', loadTasks);
