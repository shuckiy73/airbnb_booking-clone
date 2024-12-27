from rest_framework import serializers
from . import models


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CountryModel
        fields = ('name',)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RegionModel
        # fields = '__all__'
        fields = ('name',)


class CitySerializer(serializers.ModelSerializer):
    country = serializers.CharField(source='country.name')
    # country = CountrySerializer(read_only=True,)
    region = serializers.CharField(source='region.name')

    class Meta:
        model = models.CityModel
        fields = ('name', 'country', 'region')
        # fields = ('name', 'country_id', 'region_id')
        # exclude = ['region_id', 'country_id']


class StreetTyoeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StreetTypeModel
        fields = "__all__"

class AddressSerializer(serializers.ModelSerializer):
    street_type = serializers.CharField(source='street_type.street_type')
    class Meta:
        model = models.AddressModel
        fields = ('street_name', 'building_number', 'corps', 'location', 'street_type', 'has_elevator')


class BuildingTypeSerializer(serializers.ModelSerializer):
    building_type_group = serializers.CharField(source='building_type_group.building_group_type')

    class Meta:
        model = models.BuildingTypeModel
        fields = ('building_type_name', 'building_type_group')
        read_only_fields = ('building_type_name', 'building_type_group')


class GeneralInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GeneralInformationModel
        fields = '__all__'


class ImagesSerializer(serializers.ModelSerializer):
    # lookup_field = 'room_object_id'
    class Meta:
        model = models.ImagesModel
        fields = '__all__'


class UpdateRatingObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ObjectRoomModel
        fields = (
            "id",
            "rating",
        )


class PlasingRulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PlacingRulesModel
        fields = '__all__'


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        # fields = "__all__"
        fields = ("username", "id")



class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RatingModel
        fields = '__all__'


class ReviewsSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer()
    user = CustomUserSerializer()
    review_updated = serializers.DateTimeField(format="%d-%m-%Y %H:%M")
    review_created = serializers.DateTimeField(format="%d-%m-%Y %H:%M")
    class Meta:
        model = models.ReviewsModel
        fields = '__all__'




class ObjectRoomSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    building_info = BuildingTypeSerializer(read_only=True)
    general_info = GeneralInformationSerializer(read_only=True)
    # images_path = ImagesSerializer(read_only=True, many=True)
    placing_rules = PlasingRulesSerializer(read_only=True)
    address = AddressSerializer(read_only=True)
    update_datetime = serializers.DateTimeField(format="%d-%m-%Y %H:%M")
    class Meta:
        model = models.ObjectRoomModel

        exclude = (
            "create_datetime",
        )


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ReservationModel
        fields = '__all__'


class AllStarsObjectRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RatingModel
        fields = '__all__'


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FavoritesModel
        fields = '__all__'