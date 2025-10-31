from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views
from tasks import views


router = routers.DefaultRouter()
router.register(r'tasks', views.TaskViewSet)

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path("token/blacklist/", jwt_views.TokenBlacklistView.as_view(), name="token_blacklist"),
    path('signup/', views.CreateUser.as_view(), name="signup_user"),
    path('summary/', views.TaskSummary.as_view(), name="task_summary"),
    path('complete-summary/', views.CompleteTaskSummary.as_view(), name="complete_task_summary"),
    path('', include(router.urls)),
]
