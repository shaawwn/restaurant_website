from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu", views.menu, name="menu"),
    path("order", views.order, name="order"),
    path("employee", views.employee, name="employee"),
    path("temp_animate", views.temp_animate, name="temp_animate")
    
    # API ROUTES
]