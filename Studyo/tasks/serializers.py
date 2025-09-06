from django.contrib.auth.models import User
from .models import Task
from rest_framework import serializers


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    tasks =  serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['url', 'username', 'password', 'tasks']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Task
        fields = ['url','user', 'task_name', 'task_description', 'task_urgency', 
                  'start_date', 'end_date', 'task_completed', 'time_spent']
