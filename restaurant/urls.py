from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("menu", views.menu, name="menu"),
    path("order", views.order, name="order"),
    path('reservation', views.reservation, name="reservation"),
    path("employee", views.employee, name="employee"),
    path("employee_reservations", views.employee_reservations, name="employee_reservations"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("temp_animate", views.temp_animate, name="temp_animate"),
    path("customer_order", views.customer_order, name="customer_order"),
    path("customer_reservation", views.customer_reservation, name="customer_reservation"),
    
    # API ROUTES
    path("restaurant/<int:order_id>", views.get_order, name="get_order"),
    path("reservations/<str:reservation_date>", views.get_reservations, name="get_reservations"),
    path("reservation/<int:reservation_id>", views.get_reservation, name="get_reservation")
]