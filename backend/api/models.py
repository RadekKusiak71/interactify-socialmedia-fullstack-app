from django.db import models
from django.contrib.auth.models import User
import os


def user_directory_path(instance, filename):
    return os.path.join(instance.user.username, filename)


def user_post_directory_path(instance, filename):
    return os.path.join(instance.profile.user.username, filename)


def chat_images_directory_path(instance, filename):
    return os.path.join(instance.chat_name, filename)


def messages_images_directory_path(instance, filename):
    return os.path.join(instance.chat.chat_name, filename)


def group_directory_path(instance, filename):
    return os.path.join(instance.group_name, filename)


def chat_picture_upload_path(instance, filename):
    return f'chat_pictures/{filename}'


def attachment_upload_path(instance, filename):
    return f'chat_attachments/{filename}'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(
        upload_to=user_directory_path, null=True, blank=True)
    description = models.CharField(max_length=120, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    followers = models.ManyToManyField(
        'self', symmetrical=False, related_name='following', blank=True)
    followed_accounts = models.ManyToManyField(
        'self', symmetrical=False, related_name='followed', blank=True)
    shared_posts = models.ManyToManyField(
        'Post', related_name='shared_posts', blank=True)
    saved_posts = models.ManyToManyField(
        'Post', related_name='saved_posts', blank=True)

    def __str__(self) -> str:
        return f'Profile of {self.user.username}'

    def followers_count(self):
        return self.followers.count()

    def followed_count(self):
        return self.followed_accounts.count()

    def shared_posts_count(self):
        return self.shared_posts.count()

    def saved_posts_count(self):
        return self.saved_posts.count()


class Group(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    group_name = models.CharField(max_length=100)
    group_image = models.ImageField(
        upload_to=group_directory_path, null=True, blank=True)
    description = models.CharField(max_length=120, null=True, blank=True)
    members = models.ManyToManyField(Profile, related_name='groups')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.group_name

    def members_count(self):
        return self.members.count()


class Post(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    body = models.TextField(max_length=280)
    attachment = models.FileField(
        upload_to=user_post_directory_path, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        User, related_name="liked_posts", through='PostLike')

    def __str__(self) -> str:
        return f'Post by {self.profile.user.username} - {self.created_date}'

    def calculate_likes_count(self):
        return self.likes.count()

    def calculate_comments_count(self):
        comments = Comment.objects.filter(post=self)
        return comments.count()


class Comment(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField(max_length=280)
    created_date = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(
        User, related_name="liked_comments", through='CommentLike')

    def __str__(self) -> str:
        return f'Comment by {self.profile.user.username} - {self.created_date}'

    def calculate_likes_count(self):
        return self.likes.count()


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} likes post: {self.post.id}'


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.user.username} likes comment: {self.comment.id}'


class Chat(models.Model):
    creator = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='creator')
    members = models.ManyToManyField('Profile', related_name='members')
    created_at = models.DateTimeField(auto_now_add=True)
    chat_name = models.CharField(max_length=120, null=True, blank=True)
    chat_picture = models.ImageField(
        upload_to=chat_picture_upload_path, null=True, blank=True)

    def __str__(self) -> str:
        return self.chat_name


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.DO_NOTHING)
    body = models.TextField(null=True, blank=True)
    attachement = models.ImageField(
        upload_to=attachment_upload_path, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'chat message of {self.chat.chat_name} chat'
