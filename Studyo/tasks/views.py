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
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  
    
    @action(detail=False, methods=["get"])
    # TODO: RENAME THIS VIEW PLEASE
    def progress(self, request):
        tasks = self.get_queryset()
        total = tasks.count()
        completed = tasks.filter(task_completed=True).count()
        return Response({"completed":completed,
                         "total":total})

    @action(detail=True, methods=['patch'])
    def complete_task(self, request,  *args, **kwargs):
        task = self.get_object()
        serializer = TaskSerializer(task, data={"task_completed":True}, partial=True,   context={'request': request})
        serializer.is_valid(raise_exception=True)  
        serializer.save()                          
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    

class TaskSummary(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, task_completed= False)
    
class CompleteTaskSummary(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, task_completed= True)

    def delete(self, request, *args, **kwargs):
        deleted_count, _ = self.get_queryset().delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_204_NO_CONTENT)
