from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.

class Task(models.Model):
    URGENCY_CHOICES = [
        ('Low', 'low'),
        ('Medium', 'medium'),
        ('High', 'high'),
    ]

    task_name = models.CharField(max_length=50)
    task_description = models.TextField(blank= True)
    task_urgency = models.CharField(
        max_length=10,
        choices=URGENCY_CHOICES,
        default='Medium',
    )
    start_date =  models.DateField(default=timezone.now)
    end_date = models.DateField(blank=True, null=True)
    task_completed = models.BooleanField(default=False)
    time_spent = models.DurationField(default=timedelta())
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.task_name