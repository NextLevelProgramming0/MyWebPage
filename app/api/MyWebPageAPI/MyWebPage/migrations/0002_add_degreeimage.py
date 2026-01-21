# Generated manually to add degreeImage field
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('MyWebPage', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='education',
            name='degreeImage',
            field=models.ImageField(upload_to='Photos/', blank=True, null=True),
        ),
    ]
