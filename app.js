document.addEventListener("DOMContentLoaded", () => {
  /* -------------- getting all neccessary elements from the HTML ------------- */
  let todoInput = document.querySelector(".todo-input");
  let addTaskBtn = document.querySelector(".add-task");
  let todoTaskContainer = document.querySelector(".todo-task-container");
  let totalTasks = document.querySelector(".total-tasks");
  let clearTaskBtn = document.querySelector(".clear-task");
  let emptyTask = document.querySelector(".empty-task");
  let error = document.querySelector(".error");

  /* ---------------------- get focus when page is loaded --------------------- */
  todoInput.focus();

  /* -------------------------- variables ------------------------- */

  // array for storing tasks
  let taskArr = [];

  // for edit tasks
  let editIndex = null;

  /* ------------------ getting current time in hr:min format ----------------- */
  let time = new Date();
  let hr = time.getHours();
  let min = time.getMinutes();
  let ampm = hr >= 12 ? "PM" : "AM"; // ternary operator for getting AM / PM
  hr = hr % 12; // get 12 hours in time
  hr = hr ? hr : 12;
  // ternary condition if min less than 10 then add initial 0 before minutes
  min = min < 10 ? `0${time.getMinutes()}` : min;

  /* --------- function for checking input whether it is empty or not --------- */
  function checkInput() {
    if (todoInput.value === "") {
      e.preventDefault();
      error.innerHTML = "Enter a task!";
    } else {
      error.innerHTML = "";
      addTask();
    }
  }

  /* ---------------------- event listener of addtaskbtn ---------------------- */
  addTaskBtn.addEventListener("click", (e) => {
    // condition taskinput empty not allowed
    checkInput();
  });

  /* ------------------------ press enter to add tasks ------------------------ */
  document.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
      checkInput();
    }
  });

  /* --------------- function to save the tasks in localstorage --------------- */
  function saveTasks() {
    // condition if there is no task remains than clear the localstorage
    if (taskArr.length == 0) {
      localStorage.clear();
    } else {
      localStorage.setItem("tasks", JSON.stringify(taskArr));
    }
  }

  /* ----- getting data from the localstorage and store it into variable. ----- */
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    taskArr = JSON.parse(storedTasks);
  }

  /* ------------------------ function for adding tasks ----------------------- */
  function addTask() {
    // condition for when user update the task
    if (editIndex !== null) {
      taskArr[editIndex].task = todoInput.value; // reassigning the new value to the task property
      taskArr[editIndex].time = `${hr}:${min} ${ampm}`; // reassigning the new value to the time property
      editIndex = null; // reset the editIndex variable
      // changes of button for editing task
      addTaskBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" color="#fff"
                          fill="none">
                          <path d="M12 4V20" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                              stroke-linejoin="round" />
                          <path d="M4 12H20" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                              stroke-linejoin="round" />
                      </svg>
        `;
      addTaskBtn.style = "background-color : rgb(219, 81, 81)";
    } else {
      // create an object which contains task and time of task
      const taskObj = {
        task: todoInput.value, // task
        time: `${hr}:${min} ${ampm}`, // time
      };
      // pushing that object into taskArr
      taskArr.push(taskObj);
    }
    todoInput.value = "";
    saveTasks();
    displayTask();
    totalTaskCount();
  }

  /* --------------------- function for display the tasks --------------------- */
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
             <div class="icons">
                        <svg xmlns="http://www.w3.org/2000/svg" class="task-edit" viewBox="0 0 24 24" width="28" height="28" color="#000000" fill="none">
                          <path d="M3.89089 20.8727L3 21L3.12727 20.1091C3.32086 18.754 3.41765 18.0764 3.71832 17.4751C4.01899 16.8738 4.50296 16.3898 5.47091 15.4218L16.9827 3.91009C17.4062 3.48654 17.618 3.27476 17.8464 3.16155C18.2811 2.94615 18.7914 2.94615 19.2261 3.16155C19.4546 3.27476 19.6663 3.48654 20.0899 3.91009C20.5135 4.33365 20.7252 4.54543 20.8385 4.77389C21.0539 5.20856 21.0539 5.71889 20.8385 6.15356C20.7252 6.38201 20.5135 6.59379 20.0899 7.01735L8.57816 18.5291C7.61022 19.497 7.12625 19.981 6.52491 20.2817C5.92357 20.5823 5.246 20.6791 3.89089 20.8727Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M6 15L9 18M8.5 12.5L11.5 15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                            color="#000000" class="task-delete" fill="none">
                            <path d="M14.9994 15L9 9M9.00064 15L15 9" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                                stroke="currentColor" stroke-width="1.5" />
                        </svg>
                    </div>
            </div>
            `;
    }

    setupDeleteButtons(); // Call to setup delete button event listeners
    setupEditBtn();
  }

  /* ---------- function to get all the clear button of tasks and adding eventListener to them to delete specific tasks. --------- */
  function setupDeleteButtons() {
    // getting array of all the delete button of tasks and iterate throught them with forEach loop
    document.querySelectorAll(".task-delete").forEach((button) => {
      // adding addEventListener to the delete button which is clicked
      button.addEventListener("click", (e) => {
        // assining the index of clicked element into index variable
        const taskEle = e.target.closest(".task-list"); // e.target.closest get the parent element of the target, here target is a SVG icon, closest() find the parent of that SVG icon and it's task-item so it'll delete the task-item
        let index = taskEle.getAttribute("data-index");
        deleteTask(index);
      });
    });
  }

  /* -------------------- function to delete specific task -------------------- */
  function deleteTask(index) {
    taskArr.splice(index, 1); // remove specific index of task object
    saveTasks();
    displayTask();
    totalTaskCount();
    initial();
  }

  /* ---------------- function that count total count of tasks ---------------- */
  function totalTaskCount() {
    totalTasks.innerHTML = taskArr.length;
  }

  /* -------------------- function that clear all the tasks ------------------- */
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

  /* ---------------------- eventListener of clearTaskBtn --------------------- */
  clearTaskBtn.addEventListener("click", () => {
    clearAllTasks();
    displayTask();
    totalTaskCount();
    initial();
  });

  /* --------------- function initial is used to display empty-task design when there is no tasks in the container -----------*/
  function initial() {
    if (taskArr.length == 0) {
      emptyTask.style = "display:flex";
      todoTaskContainer.style = "justify-content:center";
    } else {
      displayTask();
      totalTaskCount();
    }
  }
  initial();

  /* --------- function to get edit icons and set eventlistner to them -------- */
  function setupEditBtn() {
    document.querySelectorAll(".task-edit").forEach((button) => {
      button.addEventListener("click", (e) => {
        // here we are getting closest parent of the edit button
        let taskEle = e.target.closest(".task-list");
        // assining the index of clicked element into index variable
        let index = taskEle.getAttribute("data-index");
        todoInput.focus();
        todoInput.value = taskArr[index].task; // getting task value into input field
        // changes of button when user update the task
        addTaskBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#fff" fill="none">
          <path d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        `;
        addTaskBtn.style = "background-color: #6ed203";
        editIndex = index; // assigning the value of index to editIndex variable
      });
    });
  }
});
