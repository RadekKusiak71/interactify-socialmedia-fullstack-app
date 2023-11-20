from django.contrib import admin
from .models import Profile, Group, Post, Comment, PostLike, CommentLike


admin.site.register(Profile)
admin.site.register(Group)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(PostLike)
admin.site.register(CommentLike)
