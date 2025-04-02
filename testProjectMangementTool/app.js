class TodoApp {
    constructor() {
        // 从localStorage获取保存的任务，如果没有则初始化为空数组
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('taskList');

        this.init();
    }

    init() {
        // 绑定事件
        this.addButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // 初始渲染任务列表
        this.renderTasks();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false
            };
            
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
        }
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="checkbox"></div>
                <span class="task-text">${task.text}</span>
            `;
            
            taskElement.addEventListener('click', () => this.toggleTask(task.id));
            this.taskList.appendChild(taskElement);
        });
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 