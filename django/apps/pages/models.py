from django.db import models


# Create your models here.
class Page(models.Model):
    menu_title = models.CharField(
        max_length=30, blank=True, verbose_name="Título do Menu"
    )
    title = models.CharField(
        max_length=100, blank=True, verbose_name="Título da Página"
    )
    left_column_markdown = models.TextField("Texto Markdown da coluna da esquerda")
    right_column_markdown = models.TextField("Texto Markdown da coluna da direita")
    show_in_menu = models.BooleanField(default=False, verbose_name="Mostrar no menu?")

    class Meta:
        verbose_name = "Página"
        verbose_name_plural = "Páginas"
