from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


PORTFOLIO_MODELS = ('skills', 'projects', 'experience', 'education', 'contactinfo')


def assign_existing_records(apps, schema_editor):
    User = apps.get_model(*settings.AUTH_USER_MODEL.split('.'))
    owner = User.objects.filter(is_superuser=True).order_by('id').first() or User.objects.order_by('id').first()
    if owner is None:
        if any(apps.get_model('MyWebPage', name).objects.exists() for name in PORTFOLIO_MODELS):
            raise RuntimeError('Create a Django user before migrating existing portfolio records.')
        return
    for model_name in PORTFOLIO_MODELS:
        apps.get_model('MyWebPage', model_name).objects.filter(owner__isnull=True).update(owner=owner)


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('MyWebPage', '0003_signuprequest'),
    ]

    operations = [
        *[
            migrations.AddField(
                model_name=model_name,
                name='owner',
                field=models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name=related_name,
                    to=settings.AUTH_USER_MODEL,
                ),
            )
            for model_name, related_name in (
                ('skills', 'skills'),
                ('projects', 'projects'),
                ('experience', 'experiences'),
                ('education', 'education_records'),
                ('contactinfo', 'contact_information'),
            )
        ],
        migrations.RunPython(assign_existing_records, migrations.RunPython.noop),
        *[
            migrations.AlterField(
                model_name=model_name,
                name='owner',
                field=models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name=related_name,
                    to=settings.AUTH_USER_MODEL,
                ),
            )
            for model_name, related_name in (
                ('skills', 'skills'),
                ('projects', 'projects'),
                ('experience', 'experiences'),
                ('education', 'education_records'),
                ('contactinfo', 'contact_information'),
            )
        ],
    ]
