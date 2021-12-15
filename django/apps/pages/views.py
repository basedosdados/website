from rest_framework import mixins, viewsets
from .serializers import PageSerializer
from .models import Page

# Create your views here.
class PageViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    serializer_class = PageSerializer
    queryset = Page.objects.all()
    permission_classes = []
