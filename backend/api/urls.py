from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterViewSet, SearchViewSet, GroupViewSet, PostViewSet, CommentViewSet, ProfileViewSet

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'profiles', ProfileViewSet, basename='profile')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',
         RegisterViewSet.as_view({'post': 'post'}), name='register'),
    path('search/',
         SearchViewSet.as_view({'post': 'post'}), name='searching'),
]

urlpatterns += router.urls
