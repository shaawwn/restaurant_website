from django.db import models
from django.contrib.auth.models import AbstractUser

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

"""
Suggested order attributes
created_on = when the order is placed
price = total order price

Items as manytomany, related_name="order"
    Because each order can have multiple menu items
    And each menu item can be in multiple orders

When you create an order, you can instantiate the order, with some criteria (ex, price)
You can then order.item.add('item here') to add an item to the order.
    This adds the item to the M2M relationship for the order
"""
class Order(models.Model):
    """Allow customers to make an order online"""
    order_placed = models.DateTimeField(auto_now_add=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    item = models.ManyToManyField(MenuItem, blank=True, related_name="order")

    def __str__(self):
        return f"{self.customer.name}'s order placed on {self.order_placed.strftime('%b %d %I %M: %p')}"
    """This will create an order instance, for customer name
        can user Order.customer to add new items to customers order
        new_order = Order.customer.item_set.create(MenuItem, other details)
    When you need the order, can filter orders by customer name

    When customers place order, prompt for name and phone number, then confirm order and place, should then be
    able to check the order from employee page.
    """
    # Not many to many, many to one, many items to one customer
    # Ex. Ben orders 2 teba, 1 oko, 4 beers
    # Ben <-- Teba(2), Oko(1), Beer(4), many items to one ben
    # Order example: order = {'teba': 4, 'chirimen': 1', 'beer': 4}

    pass
"""
Menu needs to have name of item, short description, price, and some information
for where to load the menu image.
"""