from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Profile, Group, Post, Comment


class ProfileSerializer(serializers.ModelSerializer):

    followers_count = serializers.IntegerField()
    followed_count = serializers.IntegerField()
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Profile
        fields = '__all__'


class GroupsSerializer(serializers.ModelSerializer):
    members_counter = serializers.IntegerField(source='members_count')
    creator_name = serializers.CharField(source='profile.user.username')

    class Meta:
        model = Group
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='calculate_likes_count')
    username = serializers.CharField(source='profile.user.username')
    profile_picture = serializers.URLField(source='profile.profile_image')

    class Meta:
        model = Comment
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.IntegerField(source='calculate_likes_count')
    comments_count = serializers.IntegerField(
        source='calculate_comments_count')
    creator_name = serializers.CharField(source='profile.user.username')
    profile_image = serializers.URLField(source='profile.profile_image')

    class Meta:
        model = Post
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[
                                   UniqueValidator(User.objects.all())])
    password = serializers.CharField(
        required=True, validators=[validate_password])
    password2 = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password',
                  'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        Profile.objects.create(user=user)

        user.set_password(validated_data['password'])
        user.save()

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        profile = Profile.objects.select_related('user').get(user=user)

        token['name'] = user.username
        token['profile_id'] = profile.id
        token['profile_img'] = str(
            profile.profile_image.url) if profile.profile_image else None
        return token

    @staticmethod
    def get_profile_id(user):
        profile = Profile.objects.get(user=user)
        return profile.id

    @staticmethod
    def get_profile_picture(user):
        profile = Profile.objects.get(user=user)
        if profile.profile_image:
            return str(profile.profile_image.url)
        return None
