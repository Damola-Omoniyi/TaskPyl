import datetime
from datetime import timedelta
from django.utils import timezone
from django.test import TestCase
from .models import Task
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
"""
test veiws and apis
(models Currently models are default and do not have extra logic to warrant testing)

test the following:
    user signup-Check
    user login-Check
    task create API-Check
    task edit API-Check
    task delete API-
    task complete API- check that the api that updates a task to be completed works - Check
    task complete-summary API- Tests the API that returns the list of complete tasks
    task incomplete-summary API- Tests the API that returns the list of incomplete tasks
    task count API- Tests the API that returns the task count(total and incomplete) - Check
    task info API- Tests the API that returns task info 
"""

class UserTest(APITestCase):
    def test_user_signup(self):
        url = "/api/signup/"
        data = {"username":"John", "password":"JohnLegendDoe2003"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "John")

    def test_user_login(self):
        User.objects.create_user(username="John", password="JohnLegendDoe2003")
        url = "/api/token/"
        data = {"username":"John", "password":"JohnLegendDoe2003"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
class TaskTest(APITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(username="John", password="JohnLegendDoe2003")
        self.client.force_authenticate(user=self.user)

        self.task = Task.objects.create(
            task_name="Finish Django tests",
            task_description="Write tests for user signup and login",
            task_urgency=Task.Levels.HIGH,  
            start_date=timezone.now(),
            end_date= datetime.date(2025, 10, 2),
            task_completed=False,
            user=self.user
        )
    

    def test_task_creation(self):
        url = "/api/tasks/"
        data = {
        "task_name": "task",
        "task_description": "Write tests for user signup and login",
        "task_urgency": "H",
        "start_date": "2025-09-30",
        "end_date": "2025-10-02"}
        response = self.client.post(url, data, format="json")

        self.task = Task.objects.get(task_name = "task")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.task.task_name, "task")
        self.assertEqual(self.task.task_description, "Write tests for user signup and login")
        self.assertEqual(self.task.task_urgency, "H")
        self.assertEqual(self.task.start_date, datetime.date(2025, 9, 30))
        self.assertEqual(self.task.end_date, datetime.date(2025, 10, 2))
        self.assertEqual(self.task.task_completed, False)
    
    def test_task_edit(self):
        url = f"/api/tasks/{self.task.id}/"
        data = {
        "task_name": "Changed task",
        "task_description": "Change",
        "task_urgency": "M",
        "start_date": "2025-09-25",
        "end_date": "2025-10-01"}
        response = self.client.put(url, data, format="json")

        task = Task.objects.get(user = self.user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(task.task_name, "Changed task")
        self.assertEqual(task.task_description, "Change")
        self.assertEqual(task.task_urgency, "M")
        self.assertEqual(task.start_date, datetime.date(2025, 9, 25))
        self.assertEqual(task.end_date, datetime.date(2025, 10, 1))
        self.assertEqual(task.task_completed, False)
    
    def test_task_completion(self):
        url = f"/api/tasks/{self.task.id}/complete_task/"
        data = {}
        response = self.client.patch(url, data, format="json")
        self.task.refresh_from_db()  
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.task.task_completed, True)
    
    def test_task_progress(self):
        Task.objects.create(
            task_name="Task1",
            task_description="Task1",
            task_urgency=Task.Levels.HIGH,  
            start_date=timezone.now(),
            end_date= datetime.date(2025, 10, 2),
            task_completed=True,
            user=self.user)
        
        Task.objects.create(
            task_name="Task2",
            task_description="Task2",
            task_urgency=Task.Levels.HIGH,  
            start_date=timezone.now(),
            end_date= datetime.date(2025, 10, 2),
            task_completed=True,
            user=self.user)
        
        url = "/api/tasks/progress/"
        response = self.client.get(url, format="json")
        total = Task.objects.filter(user=self.user).count()
        completed = Task.objects.filter(user=self.user, task_completed=True).count()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"completed":completed, "total":total})

    
    def test_task_summary(self):
        url = "/api/summary/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_task_incomplete_summary(self):
        url = "/api/complete-summary/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_task_info(self):
        url = f"/api/tasks/{self.task.id}/"
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_task_delete(self):
        TASK_NAME = self.task.task_name
        url = f"/api/tasks/{self.task.id}/"
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(Task.DoesNotExist):
            Task.objects.get(task_name = TASK_NAME)


    



