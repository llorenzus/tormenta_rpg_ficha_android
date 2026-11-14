import pypdf
import json
import re

reader = pypdf.PdfReader('fontes_tormenta/Tormenta RPG - Manual das Raças.pdf')

full_text = []
for p in range(80, 103):
    full_text.append(f"\n--- PÁGINA {p+1} ---\n")
    full_text.append(reader.pages[p].extract_text() or '')

with open('scratch/racas_talentos_raw.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(full_text))

print("Texto extraído para scratch/racas_talentos_raw.txt")

