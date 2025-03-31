const task = document.getElementById("task");
const taskList = document.getElementById("taskList");
const theme = document.getElementById("theme");
const totalTask = document.getElementById("totalTask");
const cmptTask = document.getElementById("cmptTask");
const favTask = document.getElementById("favTask");
const search = document.getElementById("search");
const progressBar = document.getElementById("progressBar");

document.querySelector(".allBtn").onclick = showAllTask;
document.querySelector(".favBtn").onclick = showFavTask;
document.querySelector(".cmptBtn").onclick = showCompletedTask;
document.querySelector(".unCmptBtn").onclick = showUncompletedTask;

//load task on window load
window.onload = ()=>{
    loadTask();
    setTheme();
    updateRecord();
};

// load task
function loadTask(){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task =>{
        createTask(task.text, task.complete, task.fav);
    });
}


//save task
function saveTask(){
    const tasks = [];
    document.querySelectorAll("#taskList li").forEach(li=>{
        tasks.push({
            text: li.querySelector("span").textContent,
            complete: li.classList.contains("completed"),
            fav: li.classList.contains("solid")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateRecord();
}

// add task on press enter
task.addEventListener("keypress", function(e){
    if(e.key==='Enter'){
        addTask();
    }
})

//add task
function addTask(){
    const taskText = task.value.trim();
    if(taskText===""){
        alert("Please Enter a task!");
        return;
    }
    createTask(taskText, false, false);
    task.value = "";
    saveTask();
}

//create task
function createTask(text, isCompleted, isFav){
    //task
    const li = document.createElement("li");

    const taskSpan = document.createElement("span");
    taskSpan.textContent = text;

    if(isCompleted) li.classList.add("completed");

    //action div
    const action = document.createElement("div");
    action.classList.add("action");

    //fav-btn
    const fav = document.createElement("i");
    fav.classList.add("fa-star");
    if(isFav){
        fav.classList.add("fa-solid");
        li.classList.add("solid");
    }
    else{
        fav.classList.add("fa-regular");
    }

    fav.onclick=()=>{
        fav.classList.toggle("fa-solid");
        fav.classList.toggle("fa-regular");
        li.classList.toggle("solid");
        saveTask();
    }

    // complete button
    const complete = document.createElement("button");
    complete.classList.add("cmpt");
    if(isCompleted){
        complete.textContent = "Undo";
        li.classList.add("completed");
    }
    else{
        complete.textContent = "Complete";
    }

    complete.onclick=()=>{
        li.classList.toggle("completed");
        complete.textContent = li.classList.contains("completed")?"Undo":"Complete";
        saveTask();
    }

    //edit button
    const edit = document.createElement("i");
    // edit.textContent = "Edit";
    edit.className = "fa-solid fa-pen-to-square edit";
    edit.onclick=()=>{
        const newTask = prompt("Edit your task:", taskSpan.textContent);
        if(newTask!==null && newTask.trim()!==""){
            taskSpan.textContent=newTask.trim();
            saveTask();
        }
    }

    // delete button
    const dlt = document.createElement("i");
    dlt.className="fa-solid fa-trash delete";
    dlt.onclick=()=>{
        taskList.removeChild(li);
        saveTask();
    }

    // add button in task
    action.appendChild(fav);
    action.appendChild(complete);
    action.appendChild(edit);
    action.appendChild(dlt);

    // add text and action in task
    li.appendChild(taskSpan);
    li.appendChild(action);

    // add task in task List
    // taskList.appendChild(li);
    taskList.insertAdjacentElement("afterbegin", li);
}

// delete all task form task List
function dltAll(){
    if(confirm("Are you sure! you want to delete all task")){
        taskList.innerHTML = "";
        localStorage.removeItem("tasks");
        updateRecord();
    }
}

//theme
theme.onclick=()=>{
    document.body.classList.toggle("dark");
    theme.classList.toggle("fa-sun");
    theme.classList.toggle("fa-moon");
    localStorage.setItem("darkMode", JSON.stringify(document.body.classList.contains("dark")));
};

function setTheme(){
    const isDark = JSON.parse(localStorage.getItem("darkMode"));
    if (isDark){
        document.body.classList.add("dark");
        theme.classList.add("fa-sun");
    }else{
        theme.classList.add("fa-moon");
    }
}

// record And Progress Bar
function updateRecord() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completedTasks = tasks.filter(t => t.complete).length;
    const totalTasks = tasks.length;

    if(totalTask) totalTask.textContent = totalTasks;
    if (cmptTask) cmptTask.textContent = completedTasks;
    if (favTask) favTask.textContent = tasks.filter(t => t.fav).length;

    // Update progress bar
    (totalTasks > 0) ? (completedTasks / totalTasks) * 100 : 0;
    const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    document.getElementById("progress-bar").style.width = `${progressPercentage}%`;
}

//search
search.addEventListener("input", function(){
    const searchText = search.value.toLowerCase();
    document.querySelectorAll('#taskList li').forEach((li)=>{
        const taskText = li.querySelector("span").textContent.toLowerCase();
        li.style.display=taskText.includes(searchText)?"flex":"none";
    });
});

// filter
function showAllTask() {
    document.querySelectorAll("#taskList li").forEach(li => {
        li.style.display = "flex";
    });
}

function showFavTask() {
    document.querySelectorAll("#taskList li").forEach(li => {
        if (li.classList.contains("solid")) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

function showCompletedTask() {
    document.querySelectorAll("#taskList li").forEach(li => {
        if (li.classList.contains("completed")) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

function showUncompletedTask() {
    document.querySelectorAll("#taskList li").forEach(li => {
        if (!li.classList.contains("completed")) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}

