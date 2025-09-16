from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Task
import json
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .serializers import UserSignupSerializer, TaskSerializer, TaskSummarySerializer
from rest_framework import permissions

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action


class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Task.objects.filter(user = self.request.user)
    
    @action(detail=False, methods=["get"])
    # TODO: RENAME THIS VIEW PLEASE
    def progress(self, request):
        tasks = self.get_queryset()
        total = tasks.count()
        completed = tasks.filter(task_completed=True).count()
        return Response({"completed":completed,
                         "total":total})

class TaskSummary(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, task_completed= False)

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

    return JsonResponse({"error": "Only POST allowed"}, status=405)
