from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu", views.menu, name="menu"),
    path("order", views.order, name="order"),
    path('reservation', views.reservation, name="reservation"),
    path("employee", views.employee, name="employee"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("temp_animate", views.temp_animate, name="temp_animate"),
    path("customer_order", views.customer_order, name="customer_order"),
    
    # API ROUTES
    path("restaurant/<int:order_id>", views.get_order, name="get_order")
]