let taskList = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");
let darkToggle = document.getElementById("darkModeToggle");

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return alert("Enter a task!");

  const task = {
    text: taskText,
    done: false
  };

  createTaskElement(task);
  saveTask(task);
  taskInput.value = "";
}

function createTaskElement(task, index = null) {
  const li = document.createElement("li");
  li.draggable = true;

  if (task.done) li.classList.add("done");

  li.innerHTML = `
    <span onclick="toggleDone(this)">${task.text}</span>
    <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
  `;

  // Drag & Drop handlers
  li.addEventListener("dragstart", dragStart);
  li.addEventListener("dragover", dragOver);
  li.addEventListener("drop", drop);

  if (index !== null) {
    taskList.insertBefore(li, taskList.children[index]);
  } else {
    taskList.appendChild(li);
  }
}

function toggleDone(span) {
  span.parentElement.classList.toggle("done");
  saveAllTasks();
}

function deleteTask(button) {
  button.parentElement.remove();
  saveAllTasks();
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveAllTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      done: li.classList.contains("done")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task));
}

// === Dark Mode ===
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

function loadTheme() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
}

// === Drag and Drop ===
let dragSrcEl = null;

function dragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

function dragOver(e) {
  e.preventDefault();
  return false;
}

function drop(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    const temp = dragSrcEl.innerHTML;
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = temp;
    saveAllTasks();
  }
  return false;
}
// === Background Animation - Floating Particles ===
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

function Particle(x, y, directionX, directionY, size, color) {
  this.x = x;
  this.y = y;
  this.directionX = directionX;
  this.directionY = directionY;
  this.size = size;
  this.color = color;
}

Particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
};

Particle.prototype.update = function() {
  if (this.x + this.size > canvas.width || this.x - this.size < 0)
    this.directionX = -this.directionX;
  if (this.y + this.size > canvas.height || this.y - this.size < 0)
    this.directionY = -this.directionY;

  this.x += this.directionX;
  this.y += this.directionY;

  this.draw();
};

function initParticles() {
  particlesArray = [];
  const num = 100;
  for (let i = 0; i < num; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (canvas.width - size * 2);
    let y = Math.random() * (canvas.height - size * 2);
    let directionX = (Math.random() - 0.5) * 0.5;
    let directionY = (Math.random() - 0.5) * 0.5;
    let color = "#ffffff";
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function animateParticles() {
  requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
}

initParticles();
animateParticles();
