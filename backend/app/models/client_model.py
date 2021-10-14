from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

# Client model
class Client(models.Model):
    name = models.CharField(max_length=120)

    def _str_(self):
        return self.name