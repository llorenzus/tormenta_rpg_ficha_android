import re
import json

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def slugify(name):
    # remove accents
    import unicodedata
    n = unicodedata.normalize('NFD', name)
    n = ''.join(c for c in n if unicodedata.category(c) != 'Mn')
    n = re.sub(r'[^a-zA-Z0-9]+', '_', n).strip('_').lower()
    return n

# Vamos carregar os talentos existentes
with open('src/data/talentos/talentos.json', 'r', encoding='utf-8') as f:
    existing_talentos = json.load(f)
existing_names = {clean_text(t['nome']).lower(): t for t in existing_talentos}

print(f"Total existente: {len(existing_talentos)}")

