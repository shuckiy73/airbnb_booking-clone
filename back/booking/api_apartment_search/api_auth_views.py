# для JWT-токена
from django.conf import settings
from django.contrib.auth import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserSerializer
from rest_framework.views import APIView, Response
from rest_framework import permissions, status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken


# ===============
class ResetTokenAPIView(APIView):
    """
    Добавляет все refresh токены пользователя в черный список. нужен Access token
    МОЖНО ИСПОЛЬЗОВАТЬ ЧТО БЫ РАЗЛОГИНИТЬ СО ВСЕХ УСТРОЙСТВ
    """
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request) -> Response:
        try:
            tokens = OutstandingToken.objects.filter(user_id=request.user.id)
            for token in tokens:
                t, _ = BlacklistedToken.objects.get_or_create(token=token)

            return Response({'success':"Все токены пользователя отозваны!"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegistrationAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print(request.data)
        user_serializer = CustomUserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            refresh = RefreshToken.for_user(user)  # Создание Refesh и Access
            refresh.payload.update({  # Полезная информация в самом токене
                'user_id': user.id,
                'username': user.username,
            })
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),  # Отправка на клиент
            }, status=status.HTTP_201_CREATED)
        else:
            print(user_serializer.errors)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        if username is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'},
                            status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'error': 'Неверный логин или пароль! Проверьте, пожалуйста, учётные данные!'},
                            status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        refresh.payload.update({
            'user_id': user.id,
            'username': user.username
        })

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get('refresh_token')  # С клиента нужно отправить refresh token

        if not refresh_token:
            return Response({'error': 'Необходим Refresh token'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Добавить его в чёрный список
        except Exception as e:
            return Response({'error': 'Неверный Refresh token'},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response({'success': 'Выход успешен'}, status=status.HTTP_200_OK)

# @receiver(post_save, sender=settings.AUTH_USER_MODEL)
# def create_auth_token(sender, instance=None, created=False, **kwargs):
#     if created:
#         Token.objects.create(user=instance)
