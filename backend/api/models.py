from django.db import models
from django.contrib.auth.models import User
import os


def user_directory_path(instance, filename):
    return os.path.join(instance.user.username, filename)


def user_post_directory_path(instance, filename):
    return os.path.join(instance.profile.user.username, filename)


def group_directory_path(instance, filename):
    return os.path.join(instance.group_name, filename)


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

    def __str__(self):
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

    def __str__(self):
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

    def __str__(self):
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

    def __str__(self):
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

    def __str__(self):
        return f'{self.user.username} likes comment: {self.comment.id}'
