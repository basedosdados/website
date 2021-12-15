from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()

router.register(
    r"pages",
    views.PageViewSet,
    basename="pages",
)

urlpatterns = [*router.urls]
