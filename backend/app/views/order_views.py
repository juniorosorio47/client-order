from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from requests.exceptions import HTTPError
from ..serializers import OrderSerializer, ProductSerializer
from ..models import Order, Product, Client, OrderProduct
from django.contrib.auth import get_user_model
from django.db.models import Sum
import time as sleep


'''
Object structure of an order to be created:
order = {
    "client": 1,
    "products": [
			{"id": 1, "quantity":2, "sell_price": 230},
			{"id": 2, "quantity":1, "sell_price": 100}
    ]
}

Note: The user is got from the request object
'''

# Get all orders and create new orders
@api_view(['GET', 'POST'])
def orders_list(request):

    if request.method == 'GET':

        data = Order.objects.all().order_by('-id')
        response = []

        for order in data:
            items = OrderProduct.objects.filter(order=order).aggregate(Sum('quantity'))

            order_list_item = {
                'id':order.id,
                'user': order.user.username,
                'client': order.client.name,
                'total': order.total,
                'products_count': order.products.count(),
                'items': items['quantity__sum'],
            }

            response.append(order_list_item)

        return Response(response, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        order_request = request.data
        client = order_request['client']
        user = request.user
        has_inventory = check_products_inventory_and_multiple(order_request['products'])

        order_items = {
            'items':[],
            'total':0,
        }

        if has_inventory['status']:

            print("Everything ok")

            order_data = {
                'client':client,
                'user':user.id,
            }
            
            order_serializer = OrderSerializer(data=order_data)

            if order_serializer.is_valid():
                print(order_serializer)
                print('ok')

                final_order = order_serializer.save()

                for item in order_request['products']:
                    product = get_object_or_404(Product, pk=item['id'])

                    quantity = item['quantity']
                    sell_price = item['sell_price']
                    price = product.price
                    print(order_items['total'])
                    print('quantity',quantity)
                    print('sell',sell_price)
                    print(quantity*sell_price)

                    # sleep(10)

                    order_items['total'] = order_items['total'] + int(quantity)*float(sell_price)
                    
                    # Decrease product inventory
                    product.decrease_inventory(quantity= item['quantity'])

                    product.save()

                    product_data = {
                        'id': product.id,
                        'name':product.name,
                        'price':price,
                        'sell_price':sell_price,
                        'quantity':quantity,
                        'total_price': quantity*sell_price
                    }

                    order_items['items'].append(product_data)

                    final_order.products.add(product, through_defaults={'quantity': int(quantity), 'price':sell_price})
                    
                final_order.total = order_items['total']

                final_order.save()

                response = {
                    'user': final_order.user.id,
                    'client': final_order.client.id,
                    'order':final_order.id,
                    'products': order_items['items'],
                }
                
                return Response(response, status=status.HTTP_201_CREATED)

        else:
            print(has_inventory['errors'])
            print("One or more products does not have enough inventory")

            return Response(data=has_inventory['errors'],status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)
       


@api_view(['GET', 'DELETE'])
def order_detail(request, pk):
    
    order = get_object_or_404(Order, pk=pk)
    

    if request.method == 'GET':
        products = []

        for item in order.products.all():
            orderProduct = OrderProduct.objects.get(order=order, product=item)
            quantity = orderProduct.quantity
            
            sell_price = orderProduct.price
            print(sell_price)


            product_data = {
                'id': item.id,
                'name':item.name,
                'price':item.price,
                'sell_price':sell_price,
                'quantity':quantity,
                'total_price': quantity*sell_price
            }

            products.append(product_data)

        response = {
            'user': order.user.username,
            'client_id': order.client.id,
            'client': order.client.name,
            'order':order.id,
            'products': products,
        }

        return Response(response)

    elif request.method == 'DELETE':

        for item in order.products.all():
            quantity = OrderProduct.objects.get(order=order, product=item).quantity
            product = get_object_or_404(Product, pk=item.id)


            product.increase_inventory(quantity=quantity)
            product.save()


            order.products.remove(product)

        order.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


# Validates if all products has enough inventory
# If does not have enough inventory will add an error for each item (without inventory) to the errors array. Then return the array if it is not empty
def check_products_inventory_and_multiple(products_list):
    errors = []

    for item in products_list:
        try:
            product = get_object_or_404(Product, pk=item['id'])

            # Checks if the product has inventory
            if product.has_inventory(quantity=item['quantity']):
                print(f'Product with id={product.id} have enough inventory')
            
            else:
                errors.append(f'Product with id={product.id} have only {product.inventory} items in inventory')

            # Checks if the quantity follow the multiple rule
            if product.check_multiple(quantity=item['quantity']):

                print(f'The quantity is multiple of {product.multiple}')

            elif(product.multiple==None):
                pass
            
            else:
                errors.append(f'The Product with id={product.id} quantity can only be multiple of {product.multiple}')
            

        except Product.DoesNotExist:
            errors.append(f'Product with id {item.id} not found.')

    if errors:
        return {'status':False, 'errors':errors}
    else:
        return {'status':True, 'errors': None}
