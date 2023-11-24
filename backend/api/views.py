from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework import status
from .serializers import RegisterSerializer, GroupsSerializer, PostSerializer, CommentSerializer, ProfileSerializer
from .models import Profile, Group, Post, PostLike, Comment, CommentLike
from django.contrib.auth.models import User


class ProfileViewSet(viewsets.ViewSet):

    """

    Handles operation related to profiles.

    list: Retrievie a list of all comments

    retrieve: Retrieve a certain user depends on id provided in url

    retrieve_by_name: Retrieve a certain user depends on username provided in url

    get_shared_posts: List of shared posts for a certain user get posts by username provided in url

    get_profile_posts: List of posts that certain user created, need username provided in url

    follow: Function performing a follow or unfollow action depends on actual state of this data

    """

    def list(self, request):
        queryset = Profile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            profile = Profile.objects.get(id=pk)
            serializer = ProfileSerializer(profile, many=False)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except Profile.DoesNotExist:
            return Response({'message': 'Profile does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'message': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='username/(?P<username>[^/.]+)')
    def retrieve_by_name(self, request, username=None):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile, many=False)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except Profile.DoesNotExist:
            return Response({'message': 'Profile does not exist'}, status=status.HTTP_404_NOT_FOUND)

        except ValueError:
            return Response({'message': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='shared/(?P<username>[^/.]+)')
    def get_shared_posts(self, request, username=None):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            shared_posts = profile.shared_posts.all()
            serializer = PostSerializer(shared_posts, many=True)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response({'message': 'User dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Profile.DoesNotExist:
            return Response({'message': 'Profile dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='saved/(?P<username>[^/.]+)')
    def get_saved_posts(self, request, username=None):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            shared_posts = profile.saved_posts.all()
            serializer = PostSerializer(shared_posts, many=True)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response({'message': 'User dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Profile.DoesNotExist:
            return Response({'message': 'Profile dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='posts/(?P<username>[^/.]+)')
    def get_profile_posts(self, request, username=None):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            posts = Post.objects.filter(profile=profile)
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)

        except User.DoesNotExist:
            return Response({'message': 'User dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Profile.DoesNotExist:
            return Response({'message': 'Profile dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'], url_path='profile/(?P<username>[^/.]+)/follow')
    def follow(self, request, username=None):
        try:
            # User that clicked follow button
            user_id = request.data.get('user_id')
            user1 = User.objects.get(id=user_id)
            profile_action = Profile.objects.get(user=user1)

            # User that action is performed on
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)

            # Performing a operations to manage followers/followed accounts on both accounts
            if profile_action.followed_accounts.filter(id=profile.id).exists():
                profile_action.followed_accounts.remove(profile)
                profile.followers.remove(profile_action)
                profile.save()
                return Response({'message': 'Unfollowed'}, status=status.HTTP_200_OK)
            else:
                profile_action.followed_accounts.add(profile)
                profile.followers.add(profile_action)
                profile.save()
                return Response({'message': 'Followed'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'message': 'User dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Profile.DoesNotExist:
            return Response({'message': 'Profile dose not exists'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommentViewSet(viewsets.ViewSet):
    """

    Handles operations related to comments.

    list: Retrieve a list of all comments.

    create: Create a new comment.

    post_comments: Retrieve comments for a specific post.

    """

    def list(self, request):
        queryset = Comment.objects.all().order_by('-created_date')
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        comment = Comment.objects.get(id=pk)
        serializer = CommentSerializer(comment, many=False)
        return Response(serializer.data)

    def create(self, request, pk=None):
        try:
            user_id = request.data.get('user_id')
            post_id = request.data.get('post_id')
            body = request.data.get('body')

            if not all([user_id, post_id, body]):
                return Response({'error': 'Incomplete data provided'}, status=status.HTTP_400_BAD_REQUEST)

            profile = get_object_or_404(Profile, user=user_id)
            post = get_object_or_404(Post, id=post_id)

            comment = Comment.objects.create(
                profile=profile, post=post, body=body)
            serializer = CommentSerializer(comment)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except (Profile.DoesNotExist, Post.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='comment_reaction/(?P<comment_id>[^/.]+)')
    def comment_reaction(self, request, comment_id):
        """

        Args:
            post_id (int): The primary key of the post.

        """
        try:
            user_id = request.data.get('user_id')
            user = get_object_or_404(User, id=user_id)
            comment = get_object_or_404(Comment, id=comment_id)
            existing_like = CommentLike.objects.filter(
                user=user, comment=comment).first()

            if existing_like:
                existing_like.delete()
                return Response({'message': 'Post unliked successfully.', 'likes_count': comment.calculate_likes_count()}, status=status.HTTP_200_OK)
            else:
                CommentLike.objects.create(user=user, comment=comment)
                return Response({'message': 'Post liked successfully.', 'likes_count': comment.calculate_likes_count()}, status=status.HTTP_201_CREATED)

        except (Post.DoesNotExist, Profile.DoesNotExist) as e:
            return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='post_comments/(?P<post_id>[^/.]+)')
    def post_comments(self, request, post_id):
        """

        Args:
            post_id (int): The primary key of the post.

        """
        try:
            post = get_object_or_404(
                Post, id=post_id)
            comments = Comment.objects.filter(
                post=post).order_by('-created_date')
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        except Post.DoesNotExist:
            return Response({'message': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

# PostViewSet


class PostViewSet(viewsets.ViewSet):
    """
    Handles operations related to posts.

    list: Retrieve a list of all posts.

    retrieve: Retrieve details of a specific post.

    post_reaction: Handle reactions (likes/unlikes) on a post.

    post_share: Share/unshare a post.

    post_bookmark: Save/unsave a post.

    get_user_shared_saved_posts: Retrieve saved and shared posts for a user.
    """

    def list(self, request):
        queryset = Post.objects.all().order_by('-created_date')
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """

        Args:
            pk (int): The primary key of the post.

        """
        post = get_object_or_404(Post, id=pk)
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)

    def create(self, request, pk=None):
        try:
            user_id = request.data.get('user_id')
            body = request.data.get('body')

            if not all([user_id, body]):
                return Response({'error': 'Incomplete data provided'}, status=status.HTTP_400_BAD_REQUEST)

            profile = get_object_or_404(Profile, user=user_id)
            attachment = request.data.get('attachment')
            if attachment:
                post = Post.objects.create(
                    profile=profile, body=body, attachment=attachment)
                serializer = PostSerializer(post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                post = Post.objects.create(
                    profile=profile, body=body)
                serializer = PostSerializer(post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except (Profile.DoesNotExist, Post.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='post_reaction/(?P<post_id>[^/.]+)')
    def post_reaction(self, request, post_id):
        """

        Args:
            post_id (int): The primary key of the post.

        """
        try:
            user_id = request.data.get('user_id')
            user = get_object_or_404(User, id=user_id)
            post = get_object_or_404(Post, id=post_id)
            existing_like = PostLike.objects.filter(
                user=user, post=post).first()

            if existing_like:
                existing_like.delete()
                return Response({'message': 'Post unliked successfully.', 'likes_count': post.calculate_likes_count()}, status=status.HTTP_200_OK)
            else:
                PostLike.objects.create(user=user, post=post)
                return Response({'message': 'Post liked successfully.', 'likes_count': post.calculate_likes_count()}, status=status.HTTP_201_CREATED)

        except (Post.DoesNotExist, Profile.DoesNotExist) as e:
            return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='post_share/(?P<post_id>[^/.]+)')
    def post_share(self, request, post_id):
        """

        Args:
            post_id (int): The primary key of the post.

        """
        try:
            user_id = request.data.get('user_id')
            user = get_object_or_404(User, id=user_id)
            post = get_object_or_404(Post, id=post_id)
            profile = get_object_or_404(Profile, user=user)
            post_in_shared_posts = profile.shared_posts.filter(
                id=post.id).exists()

            if post_in_shared_posts:
                profile.shared_posts.remove(post)
                return Response({"message": "Post successfully unshared", 'saved_posts': profile.shared_posts.values('id')}, status=status.HTTP_200_OK)

            profile.shared_posts.add(post)
            return Response({"message": "Post successfully shared", 'saved_posts': profile.shared_posts.values('id')}, status=status.HTTP_200_OK)

        except (Post.DoesNotExist, Profile.DoesNotExist) as e:
            return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Handle other unexpected errors
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='post_bookmark/(?P<post_id>[^/.]+)')
    def post_bookmark(self, request, post_id):
        """
            Args:
                post_id (int): The primary key of the post.

        """
        try:
            user_id = request.data.get('user_id')
            user = get_object_or_404(User, id=user_id)
            post = get_object_or_404(Post, id=post_id)
            profile = get_object_or_404(Profile, user=user)
            post_in_saved_posts = profile.saved_posts.filter(
                id=post.id).exists()

            if post_in_saved_posts:
                profile.saved_posts.remove(post)
                return Response({"message": "Post successfully unsaved"}, status=status.HTTP_200_OK)

            profile.saved_posts.add(post)
            return Response({"message": "Post successfully saved"}, status=status.HTTP_200_OK)

        except (Post.DoesNotExist, Profile.DoesNotExist) as e:
            return Response({'message': str(e)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'], url_path='profile_posts')
    def get_user_shared_saved_posts(self, request):
        try:
            user_id = request.data.get('user_id')
            user = get_object_or_404(User, id=user_id)
            profile = get_object_or_404(Profile, user=user)
            return Response({'saved_posts': profile.saved_posts.all().values('id'), 'shared_posts': profile.shared_posts.all().values('id')})

        except Profile.DoesNotExist:
            return Response({'message': 'Profile not found for the user.'}, status=status.HTTP_404_NOT_FOUND)

# GroupViewSet


class GroupViewSet(viewsets.ViewSet):
    """
    Handles operations related to groups.

    list: Retrieve a list of all groups.
    """

    def list(self, request):
        queryset = Group.objects.all()
        serializer = GroupsSerializer(queryset, many=True)
        return Response(serializer.data)

# RegisterViewSet


class RegisterViewSet(viewsets.ViewSet):
    """
    Handles user registration.

    post: Register a new user.

    Args:
        request (Request): The HTTP request object.

    Returns:
        Response: The response with a success message or an error message.
    """

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# SearchViewSet


class SearchViewSet(viewsets.ViewSet):
    """
    Handles user search.

    post: Perform a search based on the provided search term.

    Function returning a based on input from frontend every records that containts a input

    Returns:
        Response: The response with the search results or an error message.
    """

    def post(self, request):
        term = request.data.get('search_input')

        if not term:
            return Response({"message": "Search term not provided."}, status=status.HTTP_400_BAD_REQUEST)

        profiles = Profile.objects.filter(user__username__contains=term)
        groups = Group.objects.filter(group_name__contains=term)

        search_data = [{
            "username": profile.user.username,
            "profile_id": profile.id,
            "profile_image": profile.profile_image.url if profile.profile_image else None,
            "profile": True,
        } for profile in profiles]

        for group in groups:
            search_data.append(
                {
                    "group_name": group.group_name,
                    "group_id": group.id,
                    "group_image": group.group_image.url if group.group_image else None,
                    "group": True,
                }
            )
        response_data = {'search_data': search_data}

        return Response(response_data, status=status.HTTP_200_OK)
