from django.contrib import admin
from django.urls import path
from My_app.views import *

urlpatterns = [
    path('', digit, name="digit"),
]