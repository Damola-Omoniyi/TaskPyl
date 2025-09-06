from django.urls import path, include
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt import views as jwt_views
from tasks import views

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path("token/blacklist/", jwt_views.TokenBlacklistView.as_view(), name="token_blacklist"),
    path('signup/', views.CreateUser.as_view(), name="signup_user"),
]

'''router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'tasks', views.TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('task/<int:pk>/', views.TaskDetail.as_view()),
]
urlpatterns =  format_suffix_patterns(urlpatterns)

urlpatterns = [
    path('receive/', views.receive_data),
    path('login/', views.user_login),
    path('signup/', views.create_user),
    path('create-task/', views.create_task),
    path('dashboard/', views.task_data),
    path('task', views.task_info)
]'''