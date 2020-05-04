from rest_framework.permissions import BasePermission, SAFE_METHODS


class UserTypesPermission(BasePermission):

    message = 'Only Owner of object can update/view/delete meals, unless he is an admin or superuser'

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            if obj.owner.is_superuser and obj.owner != request.user:
                return False
            return True
        elif request.user.is_user_manager:
            if obj.owner.is_superuser:
                return False
            return True
        return obj.owner == request.user
