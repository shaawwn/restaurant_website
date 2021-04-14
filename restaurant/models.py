from django.db import models
from django.contrib.auth.models import AbstractUser


'''
Query example for order:
SELECT restaurant_order.id, restaurant_orderitem.item, restaurant_orderitem.quantity, restaurant_orderitem.price, restaurant_customer.name 
FROM restaurant_customer 
JOIN restaurant_order ON restaurant_customer.id=restaurant_order.customer_id 
JOIN restaurant_orderitem ON restaurant_orderitem.order_id=restaurant_order.id 
WHERE name="Shawn";

This will return a table with the order id, items, quantity and price of item as well as customer name (add phone number with restaurant_customer.phone_num)
'''
# Create your models here.
class User(AbstractUser):
    pass


class MenuItem(models.Model):
    """Menu items including name, price, brief description, and link to image"""
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True)
    # Image is wonky gonna have to test it out
    # Also if app goes live it probably will link to an image hosting service
    # Not hosting image itself, so may need to change to url in future
    image = models.ImageField(upload_to="static")

    def __str__(self):
        return self.name


class Customer(models.Model):
    """May change User to Customer, for now Customer seperate"""
    # Customer has name, phone, email (phone and email null is ok, name required)
    
    name = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=10)

    def __str__(self):
        return self.name

class Reservation(models.Model):
    """Allow guests to make a reservation, selecting date and time, as well as how many
    people
    """
    pass



class Order(models.Model):
    """Allow customers to make an order online"""
    order_placed = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    # order_finished = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.customer.name}'s order placed on {self.order_placed.strftime('%b %d %I %M: %p')}"
"""This will create an order instance, for customer name
    can user Order.customer to add new items to customers order
    new_order = Order.customer.item_set.create(MenuItem, other details)
When you need the order, can filter orders by customer name

When customers place order, prompt for name and phone number, then confirm order and place, should then be
able to check the order from employee page.
"""


class OrderItem(models.Model):
    """An order item is a JSON object sent to the server inside an order array"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="customer_order")
    item = models.CharField(max_length=50)
    quantity = models.IntegerField(default = 0)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Item: {self.item} #: {self.quantity} ${(self.quantity * self.price)}"
    
