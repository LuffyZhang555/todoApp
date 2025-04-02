class TodoApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.tasks = {};  // 改为对象，用日期字符串作为键
        this.loadTasks();
        this.initializeElements();
        this.initializeEventListeners();
        this.renderCalendar();
    }

    initializeElements() {
        // 日历元素
        this.calendarView = document.getElementById('calendarView');
        this.taskView = document.getElementById('taskView');
        this.currentMonthElement = document.getElementById('currentMonth');
        this.calendarDays = document.getElementById('calendarDays');
        
        // 任务列表元素
        this.taskInput = document.getElementById('taskInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('taskList');
        this.selectedDateElement = document.getElementById('selectedDate');
    }

    initializeEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('backToCalendar').addEventListener('click', () => this.showCalendarView());
        this.addButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    formatDateForDisplay(date) {
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    loadTasks() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // 更新月份显示
        this.currentMonthElement.textContent = `${year}年${month + 1}月`;
        
        // 获取月份第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // 清空日历
        this.calendarDays.innerHTML = '';
        
        // 添加空白天数
        for (let i = 0; i < firstDay.getDay(); i++) {
            this.calendarDays.appendChild(document.createElement('div'));
        }
        
        // 添加日期
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // 检查是否是今天
            const currentDate = new Date();
            if (year === currentDate.getFullYear() && 
                month === currentDate.getMonth() && 
                day === currentDate.getDate()) {
                dayElement.classList.add('today');
            }
            
            // 检查是否有任务
            const dateStr = this.formatDate(new Date(year, month, day));
            if (this.tasks[dateStr] && this.tasks[dateStr].length > 0) {
                dayElement.classList.add('has-tasks');
            }
            
            dayElement.addEventListener('click', () => {
                this.selectedDate = new Date(year, month, day);
                this.showTaskView();
            });
            
            this.calendarDays.appendChild(dayElement);
        }
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    showTaskView() {
        this.calendarView.style.display = 'none';
        this.taskView.style.display = 'block';
        this.selectedDateElement.textContent = this.formatDateForDisplay(this.selectedDate);
        this.renderTasks();
    }

    showCalendarView() {
        this.taskView.style.display = 'none';
        this.calendarView.style.display = 'block';
        this.renderCalendar();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text && this.selectedDate) {
            const dateStr = this.formatDate(this.selectedDate);
            if (!this.tasks[dateStr]) {
                this.tasks[dateStr] = [];
            }
            
            this.tasks[dateStr].push({
                id: Date.now(),
                text: text,
                completed: false
            });
            
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
        }
    }

    deleteTask(dateStr, id) {
        this.tasks[dateStr] = this.tasks[dateStr].filter(task => task.id !== id);
        if (this.tasks[dateStr].length === 0) {
            delete this.tasks[dateStr];
        }
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(dateStr, id) {
        this.tasks[dateStr] = this.tasks[dateStr].map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        const dateStr = this.formatDate(this.selectedDate);
        const tasks = this.tasks[dateStr] || [];
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="checkbox"></div>
                <span class="task-text">${task.text}</span>
                <button class="delete-button">删除</button>
            `;
            
            taskElement.querySelector('.checkbox').addEventListener('click', () => 
                this.toggleTask(dateStr, task.id));
            taskElement.querySelector('.task-text').addEventListener('click', () => 
                this.toggleTask(dateStr, task.id));
            taskElement.querySelector('.delete-button').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(dateStr, task.id);
            });
            
            this.taskList.appendChild(taskElement);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
}); 