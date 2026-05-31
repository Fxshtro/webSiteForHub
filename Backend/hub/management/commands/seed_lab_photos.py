from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.files import File
from hub.models import LabPhoto

SEED_DIR = Path('/app/seed/lab_photos')
EXTENSIONS = {'.png', '.svg'}

# Mapping: card PNG stem -> lab image SVG stem
CARD_TO_LAB = {
    'labFinprocess': 'labImageFINP',
    'labIT': 'labImageIT',
    'labLegal': 'labImageLEGAL',
    'labPsy': 'labImagePSY',
    'labTravel': 'labImageTRAVEL',
}


def base_stem(stored_name):
    """Return the original source stem, stripping any Django suffix.
    e.g. 'labs/labIT_reWCUdx.png' -> 'labIT'
    """
    name = stored_name.split('/')[-1]
    stem = name.rsplit('.', 1)[0]
    parts = stem.rsplit('_', 1)
    if len(parts) == 2 and len(parts[1]) == 7:
        return parts[0]
    return stem


class Command(BaseCommand):
    help = 'Seeds default lab photos into LabPhoto gallery (card_image + lab_image)'

    def handle(self, *args, **options):
        if not SEED_DIR.exists():
            self.stdout.write(f'Seed directory {SEED_DIR} not found, skipping')
            return

        # Build lookup: card stem -> existing LabPhoto
        existing_by_base = {}
        for photo in LabPhoto.objects.all():
            key = base_stem(photo.card_image.name)
            existing_by_base[key] = photo

        # Build lookup: stem -> seed file
        files_by_stem = {}
        for f in SEED_DIR.iterdir():
            if f.is_file() and f.suffix in EXTENSIONS:
                files_by_stem[f.stem] = f

        created = 0
        updated = 0
        for card_stem, lab_stem in CARD_TO_LAB.items():
            card_path = files_by_stem.get(card_stem)
            lab_path = files_by_stem.get(lab_stem)

            if not card_path:
                self.stdout.write(f'  Skipped: {card_stem} (card image not found)')
                continue

            photo = existing_by_base.get(card_stem)

            if photo:
                if not photo.lab_image and lab_path:
                    with open(lab_path, 'rb') as lf:
                        photo.lab_image.save(lab_path.name, File(lf))
                        photo.save()
                    self.stdout.write(f'  Updated: {card_path.name} — added lab_image ({lab_path.name})')
                    updated += 1
                else:
                    self.stdout.write(f'  Skipped: {card_path.name} (exists, lab_image={bool(photo.lab_image)})')
                continue

            with open(card_path, 'rb') as f:
                photo = LabPhoto()
                photo.card_image.save(card_path.name, File(f))
                if lab_path:
                    with open(lab_path, 'rb') as lf:
                        photo.lab_image.save(lab_path.name, File(lf))
                    self.stdout.write(f'  Created: {card_path.name} + {lab_path.name}')
                else:
                    self.stdout.write(f'  Created: {card_path.name} (no lab image)')
                photo.save()
                created += 1

        self.stdout.write(self.style.SUCCESS(
            f'Done — {created} created, {updated} updated, {LabPhoto.objects.count()} total in DB'
        ))
