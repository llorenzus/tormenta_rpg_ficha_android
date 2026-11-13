import json
import re

with open('src/data/talentos/talentos.json', 'r', encoding='utf-8') as f:
    existing_talentos = json.load(f)
existing_ids = {t['id'] for t in existing_talentos}
existing_names = {t['nome'].lower().strip() for t in existing_talentos}

print(f"Talentos existentes: {len(existing_talentos)}")

# Analisando Panteão
with open('scratch/panteao_talentos_raw.txt', 'r', encoding='utf-8') as f:
    panteao_raw = f.read()

# Analisando Manual das Raças
with open('scratch/racas_talentos_raw.txt', 'r', encoding='utf-8') as f:
    racas_raw = f.read()

print("Panteão raw length:", len(panteao_raw))
print("Raças raw length:", len(racas_raw))

