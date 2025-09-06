from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

class Task(models.Model):
    class Levels(models.TextChoices):
        LOW = 'L', 'Low'
        MEDIUM = 'M', 'Medium'
        HIGH = 'H', 'High'

    task_urgency = models.CharField(
        max_length=10,
        choices=Levels.choices,
        default=Levels.MEDIUM,
    )
    task_name = models.CharField(max_length=50)
    task_description = models.TextField(blank= True)
   
    start_date =  models.DateField(default=timezone.now)
    end_date = models.DateField(blank=True, null=True)
    task_completed = models.BooleanField(default=False)
    time_spent = models.DurationField(default=timedelta())
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.task_name