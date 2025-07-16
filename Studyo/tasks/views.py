from django.contrib.auth import authenticate, login
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Task
import json
from django.middleware.csrf import get_token

def say_hello(request):
    return JsonResponse({'message':'Hello World'})

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
def user_login(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        csrf_token = get_token(request)
        return JsonResponse({'success': 'User logged in',
                             'csrfToken':csrf_token}, status=200)

    else:
        return JsonResponse({'error': 'There seems to be an error'}, status=401)

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

    return JsonResponse({"error": "Only POST allowed"}, status=405)

