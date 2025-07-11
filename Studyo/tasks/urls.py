from django.urls import path

from . import views

urlpatterns = [
    path('hello/', views.say_hello, name='api'),
    path('receive/', views.receive_data),
    path('login/', views.user_login),
    path('signup/', views.create_user),
]