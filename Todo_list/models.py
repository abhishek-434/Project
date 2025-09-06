from enum import Enum
from datetime import datetime

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4
    
class Task:
    def __init__(self,id, description, priority=Priority.MEDIUM, due_data=None):
        self.id = id
        self.description = description
        self.priority = priority
        self.created_at = datetime.now()
        self.due_data = due_data
        self.completed_at = None
    
    def mark_completed(self):
        self.completed=True
        self.completed_at=datetime.now()
    
    def to_string(self):
        due_data_str = self.due_data.strftime("%Y-%m-%d") if self.due_data else "None"
        completed_at_str=self.due_data.strftime("%Y-%m-%d") if self.completed_at else "None"
        return f"{self.id} | {self.description} | {self.priority.value} | {self.completed} | {self.created_at.strftime('%Y-%m-%d  %H:%M:%S') | {due_data_str} | {completed_at_str}}"
    
    @classmethod
    def from_string(cls, task_str):
        parts = task_str.strip().split('|')
        if len(parts)!=7:
            return None
        
        try:
            task_id = int(parts[0])
            description = parts[1]
            priority = Priority(int(parts[2]))
            comleted = parts[3] =='True'            
            created_at = datetime.strptime(parts[4],"%Y-%m-%d  %H:%M:%S")
            due_date = None
            if parts[5] != 'None':
                due_date = datetime.strptime(parts[5],"%Y-%m-%d")
            compled_at = None
            if parts[6] != 'None':
                compled_at = datetime.strptime(parts[6],"%Y-%m-%d  %H:%M:%S")
            task= cls(task_id,description,priority,due_date)
            return task
        except (ValueError,IndexError):
            return None
        
    def __str__(self):
        status = "✓" if self.completed else " "
        due_info = f"| Due: {self.due_data.strftime("%Y-%m-%d")}" if self.due_data else " "
        return f"{self.id:3d}.[{status}] {self.description} ({self.priority.name}) {due_info}"
        # .
    
class ToDoList:
    def __init__(self):
        self.tasks = []
        self.next_id = 1
    
    def add_task(self,task):
        self.tasks.append(task)
        # .
        if task.id >= self.next_id:
            self.next_id = task.id+1
    
    def get_task(self,task_id):
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None
    
    def mark_completed(self, task_id):
        task = self.get_task(task_id)
        if task:
            # .
            task.mark_completed()
            return True
        return False
    
    def delete_task(self, task_id):
        task = self.get_task(task_id)
        if task:
            self.tasks.remove(task)
            return True
        return False
    
    def view_tasks(self, show_completed = True, priority_filter=None):
        filtered_tasks=[]
        for task in self.tasks:
            # .
            if not show_completed and task.completed:
                continue
            if priority_filter and task.priority != priority_filter:
                continue
            filtered_tasks.append(task)
        return filtered_tasks
    
    
    def get_status(self):
        total = len(self.tasks)
        if total ==0:
            return 0,0,0
        completed = sum(1 for task in self.tasks if task.completed)
        pending = total-completed
        
        return total, completed, pending
    
    def get_overdue_task(self):
        today= datetime.now().date()
        overdue = []
        for task in  self.tasks:
            # .
            if not task.completed and task.due_date and task.due_data.date() < today:
                overdue.append(task)
        return overdue
        