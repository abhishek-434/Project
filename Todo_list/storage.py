from models import Task

class Storage: 
    def __init__(self, filename = "tasks.txt"):
        self.filename = filename
    
    def load_tasks(self):
        tasks=[]
        next_id = 1
        try:
            with open(self.filename,'r') as f:
                for line in f:
                    task = Task.from_string(line)
                    if task:
                        tasks.append(task)
                        if task.id >= next_id+1:
                            next_id = task.id+1
        except FileNotFoundError:
            pass
        
        return tasks ,next_id
    
    def save_tasks(self,tasks):
        with open(self.filename,'w') as f:
            for task in tasks:
                f.write(task.to_string()+'\n')
                    