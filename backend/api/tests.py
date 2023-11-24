from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile, Group, Post, Comment, PostLike, CommentLike, Chat, Message


class TestModels(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='test_user')
        self.profile = Profile.objects.create(user=self.user)
        self.group = Group.objects.create(
            profile=self.profile, group_name='Test Group')
        self.post = Post.objects.create(
            profile=self.profile, body='Test post body')
        self.comment = Comment.objects.create(
            profile=self.profile, post=self.post, body='Test comment body')
        # New setup for Chat and Message models
        self.chat = Chat.objects.create(
            creator=self.profile, chat_name='Test Chat')
        self.message = Message.objects.create(
            chat=self.chat, profile=self.profile, body='Test Message Body')

    def test_profile_creation(self):
        self.assertEqual(self.profile.user.username, 'test_user')
        self.assertEqual(str(self.profile), 'Profile of test_user')

    def test_group_creation(self):
        self.assertEqual(self.group.profile.user.username, 'test_user')
        self.assertEqual(str(self.group), 'Test Group')

    def test_post_creation(self):
        self.assertEqual(self.post.profile.user.username, 'test_user')
        self.assertEqual(
            str(self.post), f'Post by test_user - {self.post.created_date}')

    def test_comment_creation(self):
        self.assertEqual(self.comment.profile.user.username, 'test_user')
        self.assertEqual(str(self.comment),
                         f'Comment by test_user - {self.comment.created_date}')

    def test_post_likes(self):
        like = PostLike.objects.create(post=self.post, user=self.user)
        self.assertEqual(like.post, self.post)
        self.assertEqual(like.user, self.user)
        self.assertEqual(str(like), f'test_user likes post: {self.post.id}')

    def test_comment_likes(self):
        like = CommentLike.objects.create(comment=self.comment, user=self.user)
        self.assertEqual(like.comment, self.comment)
        self.assertEqual(like.user, self.user)
        self.assertEqual(str(like), f'{like.user.username} likes comment: {like.comment.id}')

    def test_profile_counts(self):
        # Adding a follower to the profile
        self.profile.followers.add(self.profile)
        self.assertEqual(self.profile.followers_count(), 1)
        # Testing followed count initially
        self.assertEqual(self.profile.followed_count(), 0)
        # Adding a followed account to the profile
        self.profile.followed_accounts.add(self.profile)
        self.assertEqual(self.profile.followed_count(), 1)
        # Testing shared posts count initially
        self.assertEqual(self.profile.shared_posts_count(), 0)
        # Adding a shared post to the profile
        self.profile.shared_posts.add(self.post)
        self.assertEqual(self.profile.shared_posts_count(), 1)
        # Testing saved posts count initially
        self.assertEqual(self.profile.saved_posts_count(), 0)
        # Adding a saved post to the profile
        self.profile.saved_posts.add(self.post)
        self.assertEqual(self.profile.saved_posts_count(), 1)

    def test_post_counts(self):
        self.assertEqual(self.post.calculate_likes_count(),
                         0)  # Testing likes count initially
        like = PostLike.objects.create(
            post=self.post, user=self.user)  # Liking the post
        self.assertEqual(self.post.calculate_likes_count(), 1)
        self.assertEqual(self.post.calculate_comments_count(),
                         1)  # Testing comments count initially
        # Verifying the comment count
        self.assertEqual(Comment.objects.filter(post=self.post).count(), 1)

    def test_comment_counts(self):
        self.assertEqual(self.comment.calculate_likes_count(),
                         0)  # Testing likes count initially
        like = CommentLike.objects.create(
            comment=self.comment, user=self.user)  # Liking the comment
        self.assertEqual(self.comment.calculate_likes_count(), 1)

    def test_chat_creation(self):
        self.assertEqual(self.chat.creator, self.profile)
        self.assertEqual(self.chat.members.count(), 0)
        self.assertEqual(self.chat.chat_name, 'Test Chat')
        self.assertEqual(str(self.chat), 'Test Chat')

    def test_message_creation(self):
        self.assertEqual(self.message.chat, self.chat)
        self.assertEqual(self.message.profile, self.profile)
        self.assertEqual(self.message.body, 'Test Message Body')
        self.assertEqual(str(self.message), f'chat message of {self.chat.chat_name} chat')
