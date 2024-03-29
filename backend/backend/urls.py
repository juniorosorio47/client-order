"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views
from rest_framework_jwt.views import obtain_jwt_token 

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token-auth/', obtain_jwt_token),
    path('api/current_user/', views.current_user),

    path('api/users/', views.UserList.as_view()),

    path('api/clients/', views.clients_list),
    path('api/clients/<int:pk>', views.client_detail),

    path('api/products/', views.products_list),
    path('api/products/<int:pk>', views.product_detail),

    path('api/orders/', views.orders_list),
    path('api/orders/<int:pk>', views.order_detail),
]
