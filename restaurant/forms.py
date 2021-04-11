from django import forms
from django.forms import ModelForm
from network.models import Order

class OrderForm(forms.ModelForm):
    class Meta: 
        model = Order

        fields = [

        ]

        labels = {

        }

        widgets = {
            
        }

