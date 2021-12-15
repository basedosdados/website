from django.contrib import admin
from .models import Page

# Register your models here.
@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("menu_title", "title", "show_in_menu")

    class Meta:
        model = Page
