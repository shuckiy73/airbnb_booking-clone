from django.db import models
from django.contrib.auth.models import User

class UserModel(User):
    company_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    birth_date = models.DateField()
    phone = models.CharField(max_length=100)  # TODO изменить тип поля если не подойдет CharField
    rating = models.FloatField(default=0.0)

    def __str__(self):
        return self.name


