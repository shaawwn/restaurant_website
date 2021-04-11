from django.shortcuts import render
from django.core import serializers
from .models import MenuItem

# Create your views here.

# ------------- REGISTER AND LOGIN -------------

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()

            # Create Profile associated with username
            profile = Profile()
            profile.user = user
            profile.save()

        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")



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


def order(request):
    return render(request, 'restaurant/order.html')


def employee(request):
    return render(request, 'restaurant/employee.html')


# ---------------- TESTING ----------------

def temp_animate(request):
    return render(request, 'restaurant/temp_animate.html')