import re
import json

with open('scratch/racas_talentos_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove números de página e quebras de página
lines = text.split('\n')
clean_lines = []
for l in lines:
    l_str = l.strip()
    if not l_str:
        continue
    if re.match(r'^\d+$', l_str):
        continue
    if l_str.startswith('--- PÁGINA'):
        continue
    if l_str in ['Capítulo 2', 'Talentos', 'Talentos Raciais', 'Talentos Ambientais', 'Talentos Moreau', 'Talentos da Tormenta']:
        continue
    clean_lines.append(l_str)

print(f"Linhas limpas: {len(clean_lines)}")
with open('scratch/racas_clean_lines.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(clean_lines))

