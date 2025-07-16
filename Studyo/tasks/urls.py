from django.urls import path

from . import views

urlpatterns = [
    path('hello/', views.say_hello, name='api'),
    path('receive/', views.receive_data),
    path('login/', views.user_login),
    path('signup/', views.create_user),
    path('create-task/', views.create_task),
    path('dashboard/', views.task_data)
]