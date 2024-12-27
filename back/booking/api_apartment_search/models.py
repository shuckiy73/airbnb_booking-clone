import time
from datetime import datetime, timedelta

import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import User

from rest_framework.views import APIView, status, Response
from rest_framework import permissions


# Create your models here.

class CountryModel(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Страна")
    geographic_coordinates = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = '"api_countries"'
        verbose_name_plural = 'Страны'
        verbose_name = 'Страну'

    def __str__(self):
        return self.name


class RegionModel(models.Model):
    name = models.CharField(max_length=100)
    geographic_coordinates = models.CharField(max_length=100, null=True, blank=True)
    country = models.ForeignKey(CountryModel, on_delete=models.DO_NOTHING, related_name='regions')

    class Meta:
        db_table = '"api_regions"'
        verbose_name_plural = 'Регионы'
        verbose_name = 'Регион'

    def __str__(self):
        return f"{self.name} - {self.country}"


class CityModel(models.Model):
    name = models.CharField(max_length=100)
    geographic_coordinates = models.CharField(max_length=100, null=True, blank=True)
    region = models.ForeignKey(RegionModel, on_delete=models.DO_NOTHING, related_name='cities')
    country = models.ForeignKey(CountryModel, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = '"api_cities"'
        verbose_name_plural = 'Города'
        verbose_name = 'Город'

    def __str__(self):
        return f"{self.name} - {self.country}"


class StreetTypeModel(models.Model):
    """
    бульвар
    переулок
    проспект
    улица
    шоссе
    другое:   # TODO пока что сделано без другого, все в одном
        аллея
        дорога
        дорожка
        жилмассив
        киломерт
        линия
        набережная
        площадь
        проезд
        просека
        просёлок
        проулок
        спуск
        трасса
        тупик

    """
    street_type = models.CharField(max_length=100)

    class Meta:
        db_table = '"api_streettypes"'
        verbose_name_plural = 'Типы улиц'
        verbose_name = 'Тип улицы'

    def __str__(self):
        return self.street_type




class AddressModel(models.Model):
    street_name = models.CharField(max_length=100)
    building_number = models.IntegerField(blank=True, null=True)
    corps = models.IntegerField(blank=True, null=True)
    location = models.CharField(
        max_length=100, blank=True, null=True)  # TODO почитать про задание координат в джанго, что бы можно было использовать с картами
    street_type = models.ForeignKey(StreetTypeModel, on_delete=models.DO_NOTHING)
    has_elevator = models.BooleanField(default=False)

    class Meta:
        db_table = '"api_addresses"'
        verbose_name_plural = "Адреса зданий"
        verbose_name = "Адрес здания"


    def __str__(self):

        corps = f"к. {self.corps}" if self.corps else ''
        return f"{self.street_type} {self.street_name} {self.building_number} {corps}"

class BuildingGroupTypeModel(models.Model):
    """
    Номера, спальные места - в отеле, гостевом доме или хостеле - desc Гостям будет предоставлен номер в отеле, гостевом доме или спальное место в хостеле
    Квартиры, апартаменты - целиком - desc Гости снимут квартиру целиком. Вместе со всеми удобствами и кухней
    Дома, коттеджи - целиком - desc Гости снимут дом целиком. Вместе с пристройками
    Отдельные комнаты - целиком - desc Гости снимут отдельную комнату со спальным местом
    """
    building_group_type = models.CharField(max_length=100, unique=True)
    comment = models.TextField(null=True, blank=True)
    description = models.TextField()

    class Meta:
        db_table = '"api_buildinggrouptypes"'
        verbose_name_plural = 'Группы строений'
        verbose_name = 'Группа строения'

    def __str__(self):
        return self.building_group_type


class BuildingTypeModel(models.Model):
    """
    Номера, спальные места -
        Отель
        Апарт-отель
        Капсюльный отель
        Санаторий
        Гостиница
        Мини-гостиница
        Хостел
        База отдыха
        Апартамент
        Гостевой дом
        Отель эконом-класса
        Пансионат
        Глэмпинг
    Квартиры, апартаменты
        Квартира
        Апартамент
        Студия
    Дома, коттеджи
        Коттедж
        Часть дома с отдельным входом
        Таунхаус
        Шале
        Особняк
        Дом
        Эллинг
        Целый этаж в доме
        Бунгало
        Яхта
        Вилла
        Деревенский дом
        Гестхаус
        Дом на колёсах
        Дача
    Отдельные комнаты
        Комната в квартире
        Комната в частном доме
        Комната в коттедже
    """
    building_type_name = models.CharField(max_length=100)
    building_type_group = models.ForeignKey(BuildingGroupTypeModel, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = '"api_buildingtype"'
        verbose_name_plural = 'Тип строений'
        verbose_name = 'Тип строения'

    def __str__(self):
        return f"{self.building_type_name} - {self.building_type_group}"


# # ===============================================================

class GeneralInformationModel(models.Model):
    WITHOUT_KITCHEN = 'без кухни'
    SEPARATE_KITCHEN = 'отдельная кухня'
    KITCHEN_LIVING_ROOM = 'кухня-гостинная'
    KITCHEN_AREA = 'кухонная зона'

    KITCHEN_CHOICES = (
        (WITHOUT_KITCHEN, 'без кухни'),
        (SEPARATE_KITCHEN, 'отдельная кухня'),
        (KITCHEN_LIVING_ROOM, 'кухня-гостинная'),
        (KITCHEN_AREA, 'кухонная зона'),
    )

    WITHOUT_REPAIR = 'без ремонта'
    REDECORATING = 'косметический ремонт'
    EURO_RENOVATION = 'евро ремонт'
    DESIGNER = 'дизайнерский'

    REPAIR_CHOICES = (
        (WITHOUT_REPAIR, 'без ремонта'),
        (REDECORATING, 'косметический ремонт'),
        (EURO_RENOVATION, 'евро ремонт'),
        (DESIGNER, 'дизайнерский'),
    )
    # payment_method = models.CharField(
    #     'payment method',
    #     choices=PAYMENT_METHOD_CHOICES,
    #     default=CASH
    # )

    room_square = models.FloatField(null=True, blank=True)
    floor = models.PositiveIntegerField(null=True, blank=True)
    floor_in_the_house = models.PositiveIntegerField(null=True, blank=True)
    rooms_count = models.PositiveIntegerField(null=True, blank=True)
    guests_count = models.PositiveIntegerField(null=True, blank=True)
    count_sleeping_places = models.PositiveIntegerField(null=True, blank=True)


    kitchen = models.CharField(
        'kitchen',
        choices=KITCHEN_CHOICES,
        default=WITHOUT_KITCHEN,
    )  # без кухни; отдельная кухня; кухня-гостинная; кухонная зона
    room_repair = models.CharField(
        'room repair',
        choices=REPAIR_CHOICES,
        default=WITHOUT_REPAIR,
    )  # без ремонта; косметический ремонт; евро ремонт; дизайнерский

    class Meta:
        db_table = '"api_general_info"'
        verbose_name_plural = 'Общая информация'
        verbose_name = 'Общая информация'

    def __str__(self):
        return f"{self.room_square}м2 | {self.floor}/{self.floor_in_the_house} | ком {self.rooms_count} | {self.room_repair}"


class BedTypesModel(models.Model):
    """
    односпальная кровать
    двуспальная кровать
    двуспальная диван-кровать
    двуспальная широкая (king-size)
    особо широкая двуспальная (super-king-size)
    двухъярусная кровать
    диван кровать
    """
    bed_type = models.CharField(max_length=100, unique=True)

    # count = models.PositiveIntegerField()  # TODO переместить в промежуточную таблицу

    class Meta:
        db_table = '"api_bedtypes"'
        verbose_name_plural = 'Типы спальных мест'
        verbose_name = 'Тип спального места'

    def __str__(self):
        return self.bed_type



# TODO возможно нужна промежуточная модель многие ко многим между BedTypesModel и SleepingPlacesModel
# class SleepingPlacesModel(models.Model):
#     count_sleeping_places = models.PositiveIntegerField()
#     maximum_guests = models.PositiveIntegerField()
#     bed_types = models.ForeignKey(BedTypesModel, on_delete=models.DO_NOTHING)
#
#
class BathroomAmenitiesModel(models.Model):
    """
        биде
        ванна
        гигиенический душ
        дополнительная ванная
        дополнительный туалет
        душ
        общая ванная комната
        общий туалет
        полотенца
        сауна
        тапочки
        туалетные принадлежности
        фен
        халат
        общий душ/душевая
    """
    bathroom_amenities_name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = '"api_bathroomamenities"'
        verbose_name_plural = 'Типы ванной комнаты'
        verbose_name = 'Тип ванной комнаты'

    def __str__(self):
        return self.bathroom_amenities_name


## TODO возможно нужна промежуточная модель многие ко многим между BathroomAmenitiesModel и BathroomModel
# class BathroomModel(models.Model):
#     bathroom_with_wc = models.PositiveIntegerField()
#     bathroom_without_wc = models.PositiveIntegerField()
#     separate_wc = models.PositiveIntegerField()
#     amenities = models.ForeignKey(BathroomAmenitiesModel, on_delete=models.DO_NOTHING)
#
#
class CategoriesAmenitiesModel(models.Model):
    """
    Удобства
        Популярные услуги и удобства, на которые чаще всего обращают внимание гости при поиске жилья. После публикации можно добавить другие
    Вид из окон
        Укажите, что можно увидеть из окон вашего объекта. В разделе «Фото» загрузите фотографии всех видов, которые вы отметили
    Кухонное оборудование
    Оснащение
    Для отдыха в помещении
    Оснащение двора
    Инфраструктура и досуг рядом
    Для детей
    """
    categories_amenities_title = models.CharField(max_length=100, unique=True)
    categories_amenities_description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = '"api_categoriesamenities"'
        verbose_name_plural = 'Категории удобств'
        verbose_name = 'Категория удобства'

    def __str__(self):
        return self.categories_amenities_title


#
# # class ParkingAmenitiesModel(models.Model):  # TODO в последствии добавить такой вариант удобства как пароковка
# #     type = models.CharField(max_length=100)
# #
#
class AmenitiesModel(models.Model):  # Amenities - удобства
    """

    """
    amenities_name = models.CharField(max_length=100, unique=True)
    amenities_description = models.CharField(max_length=100, null=True, blank=True)
    amenities_category = models.ForeignKey(CategoriesAmenitiesModel, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = '"api_amenities"'
        verbose_name_plural = 'Удобство'
        verbose_name = 'Удобство'

    def __str__(self):
        return self.amenities_name


# class ImageUrlsModel(models.Model):
#     # image_path_url = models.ImageField(upload_to='images/')
#     image_path_url = models.CharField(max_length=100, unique=True)
#
#     # object_room = models.ForeignKey('ObjectRoomModel', on_delete=models.DO_NOTHING)
#
#     class Meta:
#         db_table = '"api_imageurls"'
#         verbose_name_plural = 'Изображения'
#         verbose_name = 'Изображение'
#
#     def __str__(self):
#         return self.image_path_url
#
#
# class ImageConnectorModel(models.Model):
#     image_urls = models.ForeignKey(ImageUrlsModel, on_delete=models.DO_NOTHING)
#     object_room = models.ForeignKey('ObjectRoomModel', on_delete=models.DO_NOTHING)
#
#     class Meta:
#         db_table = '"api_imageconnectors"'
#
#
# #
#
class PlacingRulesModel(models.Model):
    # TODO всем полям ниже нужны значения по умолчанию в select
    with_children = models.BooleanField(default=False, verbose_name="С детьми любого возраста")
    # age = models.PositiveIntegerField(default=0)  #TODO если указывать возраст, то нужно добавлять возможность указывать возраст  для нескольких детей
    with_animals = models.BooleanField(default=False)
    smoking_is_allowed = models.BooleanField(default=False)
    parties_are_allowed = models.BooleanField(default=False)
    accounting_documents = models.BooleanField(default=False)

    class Meta:
        db_table = '"api_placingrules"'
        verbose_name_plural = 'Правила размещения'
        verbose_name = 'Правило размещения'


#
# class ArrivalsDepartueModel(models.Model):
#     arrival_time = models.TimeField()
#     departure_time = models.TimeField()
#
#
# class PricesModel(models.Model):
#     currency_for_calculations = models.CharField()
#     min_rental_period = models.CharField()  # TODO если не получится с датой, то использовать integerField
#     price_per_day = models.FloatField()
#     how_many_guests = models.PositiveIntegerField()
#
#
# class SalesModel(models.Model):
#     type_sales = models.CharField()
#     value = models.FloatField()
#     from_days = models.CharField()  # TODO добавить виджет select
#
#

class ObjectRoomModel(models.Model):
    CREDIT_CARD = 'Картой'
    CASH = 'Наличными'
    WIRE_TRANSFER = 'Перевод'

    PAYMENT_METHOD_CHOICES = [
        (CREDIT_CARD, 'Картой'),
        (CASH, 'Наличными'),
        (WIRE_TRANSFER, 'Перевод'),
    ]

    title = models.CharField(max_length=100, verbose_name="Название объекта")
    #     # TODO рассмотреть возможность сделать зависимость параметров от типа строения
    #     # TODO СУПЕРХОЗЯИН ГОСТИ РЕКОМЕНДУЮТ 9.9 (12 отзывов) - добавить рейтинг, отзывы. Отобразить количество отзывов
    building_description = models.TextField(verbose_name="Описание объекта")
    prepayment = models.FloatField(default=0.0, verbose_name="Предоплата")  # persent default 20%   default_currency = BYN
    payment_day = models.FloatField(default=0.0, verbose_name="Оплата за сутки")
    payment_method = models.CharField(
        'payment method',
        choices=PAYMENT_METHOD_CHOICES,
        default=CASH,
        # verbose_name="Метод оплаты"
    )
    address = models.ForeignKey(AddressModel, on_delete=models.DO_NOTHING, null=True, blank=True, verbose_name="Адрес")
    arrival_time = models.TimeField(default=datetime.now().strftime('%H:%M'), verbose_name="Заезд")
    departure_time = models.TimeField(default=(datetime.now() + timedelta(hours=1)).strftime('%H:%M'), verbose_name="Отъезд")
    minimum_length_of_stay = models.PositiveIntegerField(default=1, verbose_name="Минимальное количество дней заселения")  # минимальный срок проживания
    placing_rules = models.ForeignKey(PlacingRulesModel, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Правила размещения")
    # price = models.FloatField(default=0.0)
    #     sales = models.ForeignKey(SalesModel, on_delete=models.DO_NOTHING)
    #
    general_info = models.ForeignKey(GeneralInformationModel, on_delete=models.CASCADE, null=True, blank=True, verbose_name="Общая информация")
    building_info = models.ForeignKey(BuildingTypeModel, on_delete=models.DO_NOTHING, verbose_name="Информация о строении")
    city = models.ForeignKey(CityModel, on_delete=models.DO_NOTHING, verbose_name="Город")
    create_datetime = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    update_datetime = models.DateTimeField(auto_now=True, null=True, blank=True, verbose_name="Дата обновления")
    is_published = models.BooleanField(default=False, verbose_name="Опубликовано ?")
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True, blank=True, verbose_name="Собственник")


    class Meta:
        db_table = '"api_objectrooms"'
        verbose_name_plural = 'Объекты'
        verbose_name = 'Объект'

    def __str__(self):
        return self.title


class FavoritesModel(models.Model):
    room_object = models.ForeignKey(ObjectRoomModel,  on_delete=models.DO_NOTHING, verbose_name="Объект")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Пользователь")
    create_datetime = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        db_table = '"api_favorites"'
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'
        unique_together = (('room_object', 'user'),)


class ReservationModel(models.Model):
    tenant = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='reserved_user', verbose_name='Жилец')
    room = models.ForeignKey(ObjectRoomModel, on_delete=models.DO_NOTHING, related_name='room', verbose_name='комната')
    start_date = models.DateField('Заселение',)
    end_date = models.DateField('Выселение')
    is_confirmed = models.BooleanField(default=False)
    # days_of_reservation = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = '"api_reservation"'
        verbose_name = 'бронь'
        verbose_name_plural = 'брони'
        unique_together = (('room', 'start_date', 'end_date'),)

    def __str__(self):
        return f'Пользователь {self.tenant}. Бронь с {self.start_date} по {self.end_date}'


class RatingModel(models.Model):
    cleanliness = models.PositiveSmallIntegerField(default=0, validators=(MinValueValidator(0.0), MaxValueValidator(10.0)), verbose_name="Чистота")
    conformity_to_photos = models.PositiveSmallIntegerField(default=0, validators=(MinValueValidator(0.0), MaxValueValidator(10.0)), verbose_name="Соответствие фото")
    timeliness_of_check_in = models.PositiveSmallIntegerField(default=0, validators=(MinValueValidator(0.0), MaxValueValidator(10.0)), verbose_name="Своевременность заселения")
    price_quality = models.PositiveSmallIntegerField(default=0, validators=(MinValueValidator(0.0), MaxValueValidator(10.0)), verbose_name="Цена-качество")
    location = models.PositiveSmallIntegerField(default=0, validators=(MinValueValidator(0.0), MaxValueValidator(10.0)), verbose_name="Расположение")
    quality_of_service = models.PositiveSmallIntegerField(default=0, validators=(MinValueValidator(0.0), MaxValueValidator(10.0)), verbose_name="Качество обслуживания")
    object_room = models.ForeignKey(ObjectRoomModel, on_delete=models.DO_NOTHING, null=True, blank=True, verbose_name="Объект")

    class Meta:
        db_table = '"api_ratings"'
        verbose_name = "Оценка"
        verbose_name_plural = "Оценки"

    def __str__(self):
        return f"{(self.cleanliness + self.conformity_to_photos + self.timeliness_of_check_in + self.price_quality + self.location + self.quality_of_service)/6}"

class ReviewsModel(models.Model):
    review_text = models.TextField( null=True, blank=True, verbose_name="Отзыв")
    review_created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    review_updated = models.DateTimeField(auto_now_add=True, verbose_name="Дата редактирования")
    likes = models.PositiveIntegerField(default=0, verbose_name="Нравится")  # positive_sides
    dislikes = models.PositiveIntegerField(default=0, verbose_name="Не нравится")  # negative_sides
    room_object = models.ForeignKey(ObjectRoomModel, on_delete=models.DO_NOTHING, verbose_name="Объект")
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Пользователь")
    ratings = models.ForeignKey(RatingModel, on_delete=models.CASCADE, verbose_name="Оценки")


    class Meta:
        db_table = '"api_reviews"'
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        unique_together = (( 'room_object', 'user'),)

#
class ImagesModel(models.Model):
    image_path = models.CharField(verbose_name="Путь до изображения", max_length=2000 )
    room_object = models.ForeignKey(ObjectRoomModel, on_delete=models.DO_NOTHING, verbose_name="Объект")


    class Meta:
        db_table = '"api_images"'
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"
        # ordering = ('image_path',)
        # unique_together = ('image_path',)
        unique_together = (('room_object','image_path'),)

    def __str__(self):
        return f"Название файла: {self.image_path.split('/')[-1]}"