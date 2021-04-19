from django.contrib import admin
from .models import MenuItem, Order, Customer, OrderItem, User, Reservation
# Register your models here.

admin.site.register(User)
admin.site.register(MenuItem)
admin.site.register(Order)
admin.site.register(Reservation)
# admin.site.register(Customer)
# admin.site.register(OrderItem)