from django.contrib.auth import authenticate, login
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import Http404
from .models import Task
import json
from django.middleware.csrf import get_token
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .serializers import UserSignupSerializer, TaskSerializer
from rest_framework import permissions

from rest_framework.permissions import IsAuthenticated

class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]

'''class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@csrf_exempt
def task_info(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            taskname = data.get("taskname")
            if not username and not taskname:
                return JsonResponse({"error": "Username or TaskName not provided."}, status=400)

            try:
                task = Task.objects.get(user__username=username, task_name=taskname)
            except Task.DoesNotExist:
                return JsonResponse({"error": "Task not found."}, status=404)
            except Task.MultipleObjectsReturned:
                return JsonResponse({"error": "Multiple tasks found. Expected only one."}, status=400)

            task_json = {
                "name": task.task_name,
                "urgency": task.task_urgency,
                "description": task.task_description,
                "start_date": str(task.start_date),
                "end_date": str(task.end_date) if task.end_date else None,
                "completed": task.task_completed,
                "time_spent": task.time_spent
            }
            return JsonResponse(task_json)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
    return JsonResponse({"error": "Only POST requests allowed."}, status=405)



@csrf_exempt
def task_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")

            if not username:
                return JsonResponse({"error": "Username not provided."}, status=400)

            tasks = Task.objects.filter(user__username=username)
            task_json = {}
            for i, task in enumerate(tasks, start=1):
                task_json[f"task{i}"] = {
                    "name": task.task_name,
                    "urgency": task.task_urgency,
                    "start_date": str(task.start_date),
                    "end_date": str(task.end_date) if task.end_date else None,
                    "completed": task.task_completed,
                }

            task_count = tasks.count()
            completed_task_count = tasks.filter(task_completed=True).count()

            task_json["completion_status"] = f"{completed_task_count}/{task_count}"

            return JsonResponse(task_json)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

    return JsonResponse({"error": "Only POST requests allowed."}, status=405)

@csrf_exempt
def receive_data(request):
    if request.method == "POST":
        body = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'message':f'Data gottten nicely:{body}'})
    else:
        return JsonResponse({'error':'Only POST baka'}, status=405)


@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if not username or not password:
            return JsonResponse({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=409)
        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({"error": e.messages}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return JsonResponse({"success": f"User {user.username} created successfully!"}, status=201)

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt  # Keep this for now, but remove in production
def create_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            task_name = data.get("taskName")
            start_date = data.get("startDate")
            deadline = data.get("deadline")
            urgency = data.get("urgency")
            description = data.get("description")
            username = data.get("username")
            user = User.objects.get(username=username)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        try:
            task = Task.objects.create(
                task_name=task_name,
                start_date=start_date,
                end_date=deadline,
                task_urgency=urgency,
                task_description=description,
                user= user          )
            return JsonResponse({"success": "Task created"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST allowed"}, status=405)'''

