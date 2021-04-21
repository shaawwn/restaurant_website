import json
import sqlite3 as sql
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.core import serializers
from .models import MenuItem, Customer, Order, OrderItem, Reservation
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, date

# Create your views here.

# ------------- REGISTER AND LOGIN -------------


def login_view(request):
    if request.method == 'POST':

        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('employee'))
        else:
            return render(request, 'restaurant/index.html', {
                'message': 'invalid username and/or password'
            })
    else:
        return render(request, 'restaurant/index.html')

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))




# ---------------- PAGE VIEWS ------------------
def index(request):
    return render(request, 'restaurant/index.html')

    
def menu(request):
    # Need to get list of menuitems
    # data=serializers.serialize('json',taken_quizzes)
    menu_items = MenuItem.objects.all()
    menu_names = []
    for item in menu_items:
        menu_names.append(item.name)
    # serialized_menu = serializers.serialize('json', menu_items)
    return render(request, 'restaurant/menu.html', {
        "menu_items": menu_items,
        "menu_names": menu_names
    })


def reservation(request):
    return render(request, 'restaurant/reservation.html')

def order(request):
    return render(request, 'restaurant/order.html')

@login_required
def employee(request):
    """The employee page for viewing orders/reservations, orders flagged 'Not finished'
    go on the left, orders flagged 'finished' go on the right"""


    unfinished_orders = []
    finished_orders = []
    # Get all the CURRENT (non-archived) orders
    orders = Order.objects.all()
    for order in orders:
        order_details ={}
        order_details['id'] = order.id
        order_details['name'] = order.customer.name
        order_details['phone'] = order.customer.phone_num
        order_details['time'] = order.order_placed
        order_details['order'] = []
        for item in order.customer_order.all():
            order_details['order'].append(item)
        if order.order_finished == False:
            unfinished_orders.append(order_details)
        elif order.order_finished == True:
            if order.archived == True:
                continue
            finished_orders.append(order_details)

    return render(request, 'restaurant/employee.html', {
        # 'orders': all_orders,
        'unfinished_orders': unfinished_orders,
        'finished_orders': finished_orders
    })

def get_reservations(request, reservation_date):
    """Get reservations for a given calendar date"""

    if request.method == 'GET': 
        reservation_date = datetime.strptime(reservation_date, '%Y-%m-%d')
        
        reservations = Reservation.objects.filter(
            reservation_date=reservation_date.date()
        )

        return JsonResponse([reservation.serialize() for reservation in reservations], safe=False)

@csrf_exempt
@login_required
def get_reservation(request, reservation_id):
    """Get a single reservation's details"""

    print("It's at least triggering", reservation_id)
    try:
        print("GOT RESERVATION")
        reservation = Reservation.objects.get(id=reservation_id)
    except Reservation.DoesNotExist:
        return JsonResponse({'error': 'Reservation not found'}, status=404)
    if request.method == 'PUT':
        print("PUT?")
        data = json.loads(request.body)
        if data.get('completed') is not None:
            reservation.completed = data['completed']
        reservation.save()
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=404)


@csrf_exempt
@login_required
def employee_reservations(request):
    # Filter reservations by date (get reservations for that date)
    return render(request, 'restaurant/employee-reservations.html')

@csrf_exempt
@login_required
def get_order(request, order_id):
    """Fetch an order by order id so that it can be modified"""
    print(request, order_id)
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found.'}, status=404)
    
    # Return order contents (serialize order)
    if request.method == 'GET':
        return JsonResponse()

    elif request.method == 'PUT':
        data = json.loads(request.body)
        if data.get('order_finished') is not None:
            order.order_finished = data['order_finished']

        elif data.get('archived') is not None:
            order.archived = data['archived']
        order.save()
        return HttpResponse(status=204)
    
    # Must be GET or PUT
    else:
        return JsonResponse({
            'error': "GET or PUT request required."
        }, status=400)




# ----------------------------------- ORDERING ITEMS ----------------------------------------

@csrf_exempt
def customer_order(request):
    """Customer's order is posted as a javascript array with JSON objects"""

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    print("PRINTING REQUEST", request, request.body)
    order = json.loads(request.body)
    print("CUSTOMER NAME:", order['name'])
    print("CUSTOMER PHONE: ", order['phone'])
    for item in order['order']['items']:
        print(item['name'], item['quantity'], item['price'])
    
    # Save customer information
    customer = Customer(
        name = order['name'],
        phone_num = order['phone']
    )
    customer.save()
    # Create the order
    customer_order = Order(
        customer = customer
    )
    customer_order.save()

    for item in order['order']['items']:
        order_item = OrderItem(
            order = customer_order,
            item = item['name'],
            quantity = item['quantity'],
            price = round((float(item['price']) * float(item['quantity'])), 2)
        )
        order_item.save()

    return JsonResponse({"message": "Order placed successfully."}, status=201)


@csrf_exempt
def customer_reservation(request):
    """Customer reservations"""
    
    if request.method != 'POST':
        return JsonResponse({"error": "POST request required"}, status=400)
    print("Making reservation....")

    reservation = json.loads(request.body)

    print("RESERVATION", reservation)
    reservation = Reservation(
        name = reservation['name'],
        party_size = reservation['party_size'],
        reservation_time = datetime.strptime(reservation['reservation_time'], '%H:%M'),
        reservation_date = datetime.strptime(reservation['reservation_date'], '%Y-%m-%d'), #changed from '%m/%d/%Y
        customer_phone = reservation['customer_phone']
    )
    reservation.save()
    return JsonResponse({"message": "Reservation placed successfully"}, status=201)

# ---------------- TESTING ----------------

def temp_animate(request):
    """This exists solely as a test page"""
    return render(request, 'restaurant/temp_animate.html')



