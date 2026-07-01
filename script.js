const inputBox = document.getElementById("input-box");
const listme = document.getElementById("listme");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const clearAll = document.getElementById("clearAll");
const undoBtn = document.getElementById("undoBtn");

const categoryInput =
document.getElementById("categoryInput");

const priority =
document.getElementById("priority");

const dueDate =
document.getElementById("dueDate");

const searchTask =
document.getElementById("searchTask");

const sortTasks =
document.getElementById("sortTasks");

const themeSelector =
document.getElementById("themeSelector");
let rainInterval;
let deletedTask = null;
let harryInterval = null;
let paperInterval;
let bowInterval = null;
const cuteItems = [

    "🎀",
    "🌸",
    "💖",
    "✨"

];
let tasks =
JSON.parse(
    localStorage.getItem("tasks")
) || [];
let magicInterval = null;
let lightningInterval = null;
// TIMESTAMP

function getTimestamp(){

    return new Date()
    .toLocaleString();

}

// ENTER KEY SUPPORT

inputBox.addEventListener(
"keydown",
function(event){

    if(event.key === "Enter"){

        addTask();

    }

});

// ADD TASK

function addTask(){

    if(inputBox.value.trim() === ""){

        alert(
            "You must write something!"
        );

        return;
    }

    const task = {

        id: Date.now(),

        text:
        inputBox.value,

        category:
        categoryInput.value
        || "General",

        priority:
        priority.value,

        dueDate:
        dueDate.value,

        completed:false,

        timestamp:
        getTimestamp()

    };

    tasks.push(task);

    saveData();

    renderTasks();

    updateCounter();

    inputBox.value = "";
    categoryInput.value = "";
    dueDate.value = "";

}

// RENDER TASKS

function renderTasks(
    taskArray = tasks
){

    listme.innerHTML = "";
taskArray.forEach((task)=>{
   

        let li =
        document.createElement("li");

        if(task.completed){

            li.classList.add(
                "checked"
            );

        }

        li.dataset.id = task.id;
        const isOverdue =

task.dueDate &&

new Date(task.dueDate)
<
new Date()

&&

!task.completed;

        li.innerHTML = `

            <strong>
                ${task.text}
            </strong>

            <br>

            📁 ${task.category}

            |

            ${task.priority === "High"
            ? "🔴 High"
            : task.priority === "Medium"
            ? "🟡 Medium"
            : "🟢 Low"}

            |

            📅 ${task.dueDate || "No Due Date"}

            <br>
               ${isOverdue
? " <span class='overdue'>⚠ OVERDUE</span>"
: ""}
    <br>
            <small>

                Updated:
                ${task.timestamp}

            </small>

            <span>&times;</span>

        `;

        listme.appendChild(li);

    });

}

// COMPLETE / DELETE TASK

listme.addEventListener(
"click",
function(e){

    const li =
    e.target.closest("li");

    if(!li) return;

  const taskId =
Number(li.dataset.id);

const index =
tasks.findIndex(
    task =>
    task.id === taskId
);
    // COMPLETE TASK

    if(
        e.target.tagName !==
        "SPAN"
    ){

        tasks[index].completed =
        !tasks[index].completed;

        tasks[index].timestamp =
        getTimestamp();

        saveData();

        renderTasks();

        updateCounter();

    }

    // DELETE TASK

    if(
        e.target.tagName ===
        "SPAN"
    ){

        if(
            confirm(
            "Delete this task?"
            )
        ){

            deletedTask =
            tasks[index];

            tasks.splice(
                index,
                1
            );

            saveData();

            renderTasks();

            updateCounter();

        }

    }

});

// EDIT TASK

listme.addEventListener(
"dblclick",
function(e){

    const li =
    e.target.closest("li");

    if(!li) return;

    const taskId =
Number(li.dataset.id);

const index =
tasks.findIndex(
    task =>
    task.id === taskId
);

    const updatedTask =
    prompt(

        "Edit Task",

        tasks[index].text

    );

    if(

        updatedTask !== null &&

        updatedTask.trim() !== ""

    ){

        tasks[index].text =
        updatedTask;

        tasks[index].timestamp =
        getTimestamp();

        saveData();

        renderTasks();

        updateCounter();

    }

});

// TASK COUNTER + PROGRESS BAR

function updateCounter(){

    const total =
    tasks.length;

    const completed =
    tasks.filter(

        task =>
        task.completed

    ).length;

    const pending =
    total -
    completed;

    totalTasks.textContent =
    total;

    completedTasks.textContent =
    completed;

    pendingTasks.textContent =
    pending;

    let percent = 0;

    if(total > 0){

        percent =

        (completed / total)

        * 100;

    }

    progressBar.style.width =
    percent + "%";

    progressText.textContent =

    Math.round(percent)

    + "% Complete";

}

// CLEAR ALL

clearAll.addEventListener(
"click",
function(){

    if(
        confirm(
        "Delete all tasks?"
        )
    ){

        tasks = [];

        saveData();

        renderTasks();

        updateCounter();

    }

});

// UNDO DELETE

undoBtn.addEventListener(
"click",
function(){

    if(deletedTask){

        tasks.push(
            deletedTask
        );

        deletedTask = null;

        saveData();

        renderTasks();

        updateCounter();

    }

});

// SAVE TO LOCAL STORAGE

function saveData(){

    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );

}
//search task
searchTask.addEventListener(
"input",
function(){

    const searchValue =
    searchTask.value
    .toLowerCase();

    const filteredTasks =
tasks.filter(task =>

    task.text
    .toLowerCase()
    .includes(searchValue)

    ||

    task.category
    .toLowerCase()
    .includes(searchValue)

);
    renderTasks(
        filteredTasks
    );

});

// LOAD TASKS

function showTask(){

    renderTasks();

    updateCounter();

}
//sort tasks
sortTasks.addEventListener(
"change",
function(){

    const value =
    sortTasks.value;

    if(
        value === "priority"
    ){

        const order = {

            High:1,
            Medium:2,
            Low:3

        };

        tasks.sort(

            (a,b)=>

            order[a.priority]

            -

            order[b.priority]

        );

    }

    else if(
        value === "category"
    ){

        tasks.sort(

            (a,b)=>

            a.category
            .localeCompare(
                b.category
            )

        );

    }

    else if(
    value === "date"
){

    tasks.sort((a,b)=>{

        if(!a.dueDate)
            return 1;

        if(!b.dueDate)
            return -1;

        return (
            new Date(a.dueDate)
            -
            new Date(b.dueDate)
        );

    });

}



    saveData();

    renderTasks();

});
//clear animations
function clearAnimations(){

    document.querySelectorAll(".paper-piece")
    .forEach(item => item.remove());

    document.querySelectorAll(".bow")
    .forEach(item => item.remove());

    document.querySelectorAll(".rain")
    .forEach(item => item.remove());

    document.querySelectorAll(".magic-particle")
    .forEach(item => item.remove());

    document.querySelectorAll(".flying-harry")
    .forEach(item => item.remove());

    document.querySelectorAll(".sparkle")
    .forEach(item => item.remove());

}
//applytheme
//applytheme

function applyTheme(theme){

    // Remove old animations

    clearAnimations();

    // Change theme

    document.body.className = theme;

    // Stop Vintage

    if(paperInterval){

        clearInterval(paperInterval);

        paperInterval = null;

    }

    // Stop Girly

    if(bowInterval){

        clearInterval(bowInterval);

        bowInterval = null;

    }

    // Stop Rain

    if(rainInterval){

        clearInterval(rainInterval);

        rainInterval = null;

    }

    // Stop Flying Harry

    if(harryInterval){

        clearInterval(harryInterval);

        harryInterval = null;

    }

    // Stop Magic

    if(magicInterval){

        clearInterval(magicInterval);

        magicInterval = null;

    }

    // Stop Lightning

    if(lightningInterval){

        clearInterval(lightningInterval);

        lightningInterval = null;

    }

    // Torch

    const torch =
    document.querySelector(".torch");

    torch.style.display =
    theme === "harry"
    ? "block"
    : "none";

    // -----------------

    // Vintage

    if(theme === "vintage"){

        paperInterval =
        setInterval(
            createPaper,
            1200
        );

    }

    // -----------------

    // Girly

    if(theme === "girly"){

        bowInterval =
        setInterval(
            createBow,
            1100
        );

    }

    // -----------------

    // Harry Potter

    if(theme === "harry"){

        rainInterval =
        setInterval(
            createRain,
            20
        );

        harryInterval =
        setInterval(
            createHarryFly,
            15000
        );

        magicInterval =
        setInterval(
            createMagicParticle,
            400
        );

        lightningInterval =
        setInterval(
            triggerLightning,
            6000
        );

    }

}
//changing theme
themeSelector.addEventListener(
"change",
function(){

    const selectedTheme =
    themeSelector.value;

    localStorage.setItem(
        "theme",
        selectedTheme
    );

    applyTheme(
        selectedTheme
    );

});

//vintage theme
function createPaper(){
    if(
        !document.body.classList.contains(
            "vintage"
        )
    ){
        return;
    }

    const paper =
    document.createElement("div");

    paper.classList.add(
        "paper-piece"
    );

    paper.style.left =
    Math.random() * 100 + "vw";

    paper.style.width =
    Math.random() * 10 + 8 + "px";

    paper.style.height =
    paper.style.width;

    document.body.appendChild(
        paper
    );

    setTimeout(()=>{

        paper.remove();

    },12000);
}



//default theme
const savedTheme =
localStorage.getItem("theme")
|| "girly";

themeSelector.value =
savedTheme;

applyTheme(savedTheme);

//girly 
//create bow

function createBow(){

    if(
        !document.body.classList.contains(
            "girly"
        )
    ){
        return;
    }

    const bow =
    document.createElement("div");

    bow.classList.add("bow");

bow.innerHTML =

cuteItems[
Math.floor(
Math.random() *
cuteItems.length
)
];

    bow.style.left =
    Math.random()*100 + "vw";

    document.body.appendChild(bow);

    setTimeout(()=>{

        bow.remove();

    },10000);
}
function createSparkle(x,y){

    if(
        !document.body.classList.contains(
            "girly"
        )
    ){
        return;
    }

    const sparkle =
    document.createElement("div");

    sparkle.classList.add(
        "sparkle"
    );

    const sparkleItems = [

        "✨",
        "⭐",
        "💖"

    ];

    sparkle.innerHTML =

    sparkleItems[
        Math.floor(
            Math.random()
            *
            sparkleItems.length
        )
    ];

    sparkle.style.left =
    x + "px";

    sparkle.style.top =
    y + "px";

    document.body.appendChild(
        sparkle
    );

    setTimeout(()=>{

        sparkle.remove();

    },1000);
}
document.addEventListener(
"mousemove",
function(e){

    if(
        document.body.classList.contains(
            "girly"
        )
    ){

        createSparkle(
            e.clientX,
            e.clientY
        );

    }

});
let sparkleTimer = 0;

document.addEventListener(
"mousemove",
function(e){

    if(
        !document.body.classList.contains(
            "girly"
        )
    ){
        return;
    }

    const now = Date.now();

    if(
        now - sparkleTimer
        > 80
    ){

        sparkleTimer = now;

        createSparkle(
            e.clientX,
            e.clientY
        );
    }

});
//harrypotter
function createRain(){

    if(
        !document.body.classList.contains(
            "harry"
        )
    ){
        return;
    }

    const drop =
    document.createElement("div");

    drop.classList.add("rain");

    drop.style.left =
    Math.random()*100 + "vw";

    document.body.appendChild(drop);

    setTimeout(()=>{

        drop.remove();

    },1000);
}
const torch =
document.querySelector(".torch");

document.addEventListener(
"mousemove",
function(e){

    if(
        document.body.classList.contains(
            "harry"
        )
    ){

        torch.style.left =
        e.clientX - 125 + "px";

        torch.style.top =
        e.clientY - 125 + "px";
    }

});
function createMagicParticle(){

    if(
        !document.body.classList.contains(
            "harry"
        )
    ){
        return;
    }

    const particle =
    document.createElement("div");

    particle.classList.add(
        "magic-particle"
    );

    particle.innerHTML = "✨";

    particle.style.left =
    Math.random()*100 + "vw";

    document.body.appendChild(
        particle
    );

    setTimeout(()=>{

        particle.remove();

    },5000);
}
function createHarryFly(){

    if(
        !document.body.classList.contains(
            "harry"
        )
    ){
        return;
    }

    const harry =
    document.createElement("div");

    harry.classList.add(
        "flying-harry"
    );

    harry.innerHTML =

`<img
src="images/harryfy.png"
width="180">`;

    document.body.appendChild(
        harry
    );

    setTimeout(()=>{

        harry.remove();

    },12000);

}
//lightning
function triggerLightning(){

    if(
        !document.body.classList.contains(
            "harry"
        )
    ){
        return;
    }

    const lightning =
    document.querySelector(
        ".lightning"
    );

    lightning.classList.add(
        "flash"
    );

    setTimeout(()=>{

        lightning.classList.remove(
            "flash"
        );

    },400);

}

// INITIAL LOAD

showTask();
