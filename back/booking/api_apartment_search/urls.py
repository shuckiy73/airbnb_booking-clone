from django.urls import path, include
from . import views
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

router = routers.DefaultRouter()
router.register(r'countries', views.CountryViewSet, basename='countries')
# router.register(r'regions', views.RegionViewSet, basename='regions')
# router.register(r'cities', views.CitiesViewSet, basename='cities')
router.register(r'search', views.SearchMainPageViewSet, basename='search')
router.register(r'object_reviews', views.ReviewsViewSet, basename='object_reviews')
router.register(r'get_object_rating', views.AllStarsObjectRoomViewSet, basename='get_object_rating')
router.register(r'get_count_of_views', views.GetCountOfReviewViewset, basename='get_count_of_views')

# router.register(r'update_rating', views.UpdateRatingViewSet, basename='update_rating')


urlpatterns = [
    path('', include(router.urls)),
    path('booking/<id>', views.BookingViewSet.as_view(), name='booking'),
    path('get_object_images/<room_object_id>', views.ImagesViewSet.as_view(), name='get_object_images'),
    path('update_rating', views.UpdateRatingViewSet.as_view(), name="update_rating"),
    path('add_to_favorite', views.FavoriteViewSet.as_view(), name="add_to_favorite"),


    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/token/register/', views.RegistrationAPIView.as_view(), name='register'),
    path('auth/token/login/', views.LoginAPIView.as_view(), name='login'),
    path('auth/token/logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('auth/token/reset-all-token/', views.ResetTokenAPIView.as_view(), name='reset-all-token')
]
