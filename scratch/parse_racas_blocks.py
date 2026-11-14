import re
import json
import unicodedata

def slugify(name):
    n = unicodedata.normalize('NFD', name)
    n = ''.join(c for c in n if unicodedata.category(c) != 'Mn')
    n = re.sub(r'[^a-zA-Z0-9]+', '_', n).strip('_').lower()
    return n

def clean_text(t):
    if not t:
        return ''
    t = re.sub(r'[\r\n]+', ' ', t)
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

# Parser do Manual das Raças
with open('scratch/racas_talentos_raw.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove quebras de cabeçalho / rodapé do tipo "Capítulo 2", "Talentos", "--- PÁGINA X ---", números de página
text = re.sub(r'---\s*PÁGINA\s*\d+\s*---', '', text)
text = re.sub(r'\n\s*Capítulo\s*2\s*\n', '\n', text)
text = re.sub(r'\n\s*Talentos\s*\n', '\n', text)
text = re.sub(r'\n\s*\d+\s*\n', '\n', text)

# Padrão: Nome em linha própria, seguido opcionalmente de flavor, seguido de Pré-requisito ou Benefício
# Vamos fazer uma varredura linha a linha
lines = [l.strip() for l in text.split('\n')]

print(f"Total de linhas no Manual das Raças: {len(lines)}")

