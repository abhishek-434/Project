from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    credits = models.IntegerField()
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    semester = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(8)])
    admission_date = models.DateField()
    courses = models.ManyToManyField(Course, related_name='students')
    
    def __str__(self):
        return f"{self.roll_number} - {self.user.get_full_name()}"

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    designation = models.CharField(max_length=50)
    qualification = models.CharField(max_length=100)
    joining_date = models.DateField()
    courses = models.ManyToManyField(Course, related_name='teachers')
    
    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.BooleanField(default=False)
    remarks = models.CharField(max_length=200, blank=True)
    
    class Meta:
        unique_together = ('student', 'course', 'date')
    
    def __str__(self):
        return f"{self.student.roll_number} - {self.course.code} - {self.date}"

class Exam(models.Model):
    EXAM_TYPE_CHOICES = (
        ('midterm', 'Mid Term'),
        ('final', 'Final'),
        ('quiz', 'Quiz'),
        ('assignment', 'Assignment'),
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    date = models.DateField()
    total_marks = models.IntegerField()
    
    def __str__(self):
        return f"{self.course.code} - {self.name}"

class ExamResult(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=2)
    remarks = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('exam', 'student')
    
    def __str__(self):
        return f"{self.student.roll_number} - {self.exam.name}"

class Fee(models.Model):
    FEE_TYPE_CHOICES = (
        ('tuition', 'Tuition Fee'),
        ('library', 'Library Fee'),
        ('lab', 'Lab Fee'),
        ('exam', 'Exam Fee'),
        ('other', 'Other'),
    )
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    fee_type = models.CharField(max_length=20, choices=FEE_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_date = models.DateField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.student.roll_number} - {self.fee_type} - {self.amount}"

class Notice(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    posted_date = models.DateTimeField(auto_now_add=True)
    target_role = models.CharField(max_length=10, choices=User.ROLE_CHOICES, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-posted_date']