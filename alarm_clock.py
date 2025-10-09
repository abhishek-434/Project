import datetime
import time
import winsound  

alarm_time = input("Enter alarm time (HH:MM): ")
print(f"Alarm set for {alarm_time}...")

while True:
    current_time = datetime.datetime.now().strftime("%H:%M")
    if current_time == alarm_time:
        print("⏰ Wake up! Time to get up!")
        for i in range(5):  
            winsound.Beep(2500, 1000)
        break
    time.sleep(1)
