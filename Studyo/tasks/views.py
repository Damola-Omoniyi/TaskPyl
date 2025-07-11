from django.contrib.auth import authenticate, login
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import json


def say_hello(request):
    return JsonResponse({'message':'Hello World'})

@csrf_exempt
def receive_data(request):
    if request.method == "POST":
        body = json.loads(request.body.decode('utf-8'))
        return JsonResponse({'message':f'Data gottten nicely:{body}'})
    else:
        return JsonResponse({'error':'Only POST baka'}, status=405)

@csrf_exempt
def user_login(request):
    username = request.POST.get("username", "guest")
    password = request.POST.get("password", "password")
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'success': 'User logged in'})
        # redirect

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

