document.addEventListener("DOMContentLoaded", () => {
  //  getting all neccessary elements from the HTML
  let todoInput = document.querySelector(".todo-input");
  let addTaskBtn = document.querySelector(".add-task");
  let todoTaskContainer = document.querySelector(".todo-task-container");
  let totalTasks = document.querySelector(".total-tasks");
  let clearTaskBtn = document.querySelector(".clear-task");
  let emptyTask = document.querySelector(".empty-task");
  let error = document.querySelector(".error");

  // create an empty array
  let taskArr = [];

  // getting current time in hr:min format
  let time = new Date();
  let hr = time.getHours();
  let min = time.getMinutes();

  // condition if min is less than 10 then add initial 0 before min
  if (min < 10) {
    min = `0${time.getMinutes()}`;
  }

  // getting data from the localstorage and store it into variable.
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    taskArr = JSON.parse(storedTasks);
  }

  // event listener of addtaskbtn
  addTaskBtn.addEventListener("click", (e) => {
    // condition taskinput empty not allowed
    if (todoInput.value === "") {
      e.preventDefault();
      error.innerHTML = "Enter a task!";
    } else {
      error.innerHTML = "";
      addTask();
    }
  });

  // function to save the tasks in localstorage
  function saveTasks() {
    // condition if there is no task remain than cleat the localstorage
    if (taskArr.length == 0) {
      localStorage.clear();
    } else {
      localStorage.setItem("tasks", JSON.stringify(taskArr));
    }
  }

  // function for adding tasks
  function addTask() {
    // create an object which contains task and time of task
    const taskObj = {
      task: todoInput.value,
      time: `${hr}:${min}`,
    };
    // pushing that object into taskArr
    taskArr.push(taskObj);
    todoInput.value = "";
    saveTasks();
    displayTask();
    totalTaskCount();
  }

  // function for display the tasks
  function displayTask() {
    emptyTask.style.display = "none";
    todoTaskContainer.style.justifyContent = "start";
    todoTaskContainer.innerHTML = "";

    // loop start from the end of the array and iterate until index of 0
    for (let i = taskArr.length - 1; i >= 0; i--) {
      const task = taskArr[i]; // getting an index of array which contains task object

      // displaying task in todoTaskContainer
      todoTaskContainer.innerHTML += `
            <div class="task-list" data-index="${i}">
              <span class="task-item">
                <span class="task">${task.task}</span>
                <span class="time">${task.time}</span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000"
                  class="task-delete" fill="none">
                  <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-width="1.5"
                      stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                      stroke="currentColor" stroke-width="1.5" />
              </svg>
            </div>
            `;
    }

    setupDeleteButtons(); // Call to setup delete button event listeners
  }

  // function to get all the clear button of tasks and adding eventListener to them to delete specific tasks.
  function setupDeleteButtons() {
    // getting array of all the delete button of tasks and iterate throught them with forEach loop
    document.querySelectorAll(".task-delete").forEach((button) => {
      // adding addEventListener to the delete button which is clicked
      button.addEventListener("click", (e) => {
        const taskElement = e.target.closest(".task-list"); // e.target.closest get the parent element of the target, here target is a SVG icon, closest() find the parent of that SVG icon and it's task-item so it'll delete the task-item
        deleteTask(taskElement);
      });
    });
    setLocalTask();
  }

  // function to delete specific task
  function deleteTask(index) {
    taskArr.splice(index, 1); // remove specific index of task object
    saveTasks();
    displayTask();
    totalTaskCount();
    initial();
  }

  // function that count total count of tasks
  function totalTaskCount() {
    totalTasks.innerHTML = taskArr.length;
  }

  // function that clear all the tasks
  function clearAllTasks() {
    // condition if there is no tasks then give an alert
    if (taskArr.length == 0) {
      alert("There is no task to clear!");
    } else {
      // if there is tasks then give the confirm box to get permission to delete all the tasks
      if (confirm("Are sure, you want to clear all the Tasks?")) {
        taskArr = []; // Clear the array
        saveTasks();
        initial();
      }
    }
  }

  // eventListener of clearTaskBtn
  clearTaskBtn.addEventListener("click", () => {
    clearAllTasks();
    displayTask();
    totalTaskCount();
  });

  // function initial is used to display empty-task design when there is no tasks in the container
  function initial() {
    if (taskArr.length == 0) {
      emptyTask.style = "display:flex";
      todoTaskContainer.style = "justify-content:center";
    } else {
      displayTask();
    }
  }
  initial();
});
